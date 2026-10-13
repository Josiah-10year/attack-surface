// Global leaderboard for Attack Surface.
//
// Storage is Upstash Redis over its REST API (Vercel Marketplace → Upstash for Redis).
// Connecting the database to the project sets KV_REST_API_URL / KV_REST_API_TOKEN
// (or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Until then this endpoint
// answers 503 and the game keeps a per-device board in localStorage instead.
//
// GET  /api/scores                       → { scores: [{ name, score }] }  (top 10)
// POST /api/scores { name, waves, kills } → { score, scores }
//
// Score = waves survived × 1000 + kills (capped at 999), so waves always dominate.
// Each callsign keeps only its best score.

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'attacksurface:leaderboard';
const NAME_RE = /^[A-Za-z0-9_-]{2,16}$/;
const TOTAL_WAVES = 15;

async function redis(commands) {
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const out = await r.json();
  const failed = out.find((x) => x.error);
  if (failed) throw new Error(failed.error);
  return out.map((x) => x.result);
}

async function top() {
  const [flat] = await redis([['ZREVRANGE', KEY, '0', '9', 'WITHSCORES']]);
  const scores = [];
  for (let i = 0; i < flat.length; i += 2) scores.push({ name: flat[i], score: Number(flat[i + 1]) });
  return scores;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({ error: 'leaderboard storage not configured' });
  }
  try {
    if (req.method === 'GET') return res.status(200).json({ scores: await top() });

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }
      const name = String((body && body.name) || '').trim();
      const waves = Number(body && body.waves);
      const kills = Number(body && body.kills);
      if (!NAME_RE.test(name) || !Number.isInteger(waves) || waves < 0 || waves > TOTAL_WAVES
          || !Number.isInteger(kills) || kills < 0) {
        return res.status(400).json({ error: 'invalid score' });
      }
      const score = waves * 1000 + Math.min(kills, 999);
      // GT: only ever raise a callsign's score, never lower it
      await redis([['ZADD', KEY, 'GT', String(score), name]]);
      return res.status(200).json({ score, scores: await top() });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    return res.status(502).json({ error: 'leaderboard storage error' });
  }
};
