# Attack Surface

A browser-based tower-defense game that teaches **defense in depth**. Eight security
controls, eight attack vectors, fifteen waves — and a built-in playbook explaining why
placement and layering matter more than raw firepower.

Your attack surface is not what you own — it is every path an attacker can take to
reach it. This game makes you defend five of them at once, nine layers deep.

## Play

Open `index.html` in any modern browser, or visit the deployed site. No build step,
no dependencies — a single static HTML file.

## Concept

Each lane on the board is an **attack path**; each column is a **layer of control**.
A threat only reaches your assets if it defeats every layer in sequence, so the
question is never "which control is best" — it is *what happens to the lane when the
control in front of it fails*.

Controls map to the five NIST CSF functions:

| Function | Control |
|---|---|
| Identify | Compute Node |
| Protect  | Firewall · Patch Management · MFA Gateway |
| Detect   | IDS Sensor · SIEM |
| Respond  | Honeypot |
| Recover  | Snapshot |

Threats map to real attack vectors: commodity malware, volumetric DDoS, phishing,
zero-day exploits, self-propagating worms, ransomware, cryptojacking, and a full
APT kill chain.

Each threat triggers a one-time intel briefing on first contact, and the in-game
playbook (`H`) documents every control, threat, and placement rule.

## On phones

The board is a 5-lane x 9-column grid. Below 560px the layout **transposes**: lanes
run up the screen instead of across, giving a 366x662 portrait board that fits a
phone at near-full size rather than being scaled down to ~35px cells. Game logic is
untouched -- only the projection changes, and the board re-projects live if you
rotate mid-game. Hotkey labels hide themselves on touch devices.

## Training and build order

First-time players get a short briefing and the option of a **training range**: a
sandbox (2000 RAM, no cooldowns, no waves) that walks through placing a Node,
collecting RAM, adding a Firewall, putting an IDS behind it, remediating a phished
Node, countering phishing with MFA, and selling a control, then ends on the build
order. Replay it any time from **HOW TO PLAY**.

During a real run, the **build-order bar** above the cards names the control due
before the next wave (IDS before DDoS at wave 2, MFA before PHSH at wave 3, and so on)
and ticks it off once it is placed.

## Leaderboard

Players pick a **callsign** (2–16 letters, digits, `_` or `-`). At game over the score
(`waves survived × 1000 + kills`, kills capped at 999) is posted to `/api/scores`,
a Vercel function that keeps each callsign's best score in Upstash Redis.

To turn on the global board, add **Upstash for Redis** from the Vercel Marketplace and
connect it to this project (it sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`), then
redeploy. Without storage the endpoint returns 503 and the game falls back to a board
saved on the player's own device.

## Controls

| Key | Action |
|---|---|
| `1`–`8` | Select a control |
| `S` | Sell mode: tap controls to sell them (50% refund) |
| `P` | Pause |
| `H` | Open the playbook |
| `Esc` | Cancel selection |

Click a card, then a tile to place. Click a placed control (with no card selected) to
open its bar and **SELL** it. Click RAM tokens to collect them. A red-flagged
control has been compromised — click it to remediate.

## Deploying

Static site, zero configuration. On Vercel, import the repository and accept the
defaults — `index.html` is served from the root.
