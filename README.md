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

## Controls

| Key | Action |
|---|---|
| `1`–`8` | Select a control |
| `S` | Sell mode (50% refund) |
| `P` | Pause |
| `H` | Open the playbook |
| `Esc` | Cancel selection |

Click a card, then a tile to place. Click RAM tokens to collect them. A red-flagged
control has been compromised — click it to remediate.

## Deploying

Static site, zero configuration. On Vercel, import the repository and accept the
defaults — `index.html` is served from the root.
