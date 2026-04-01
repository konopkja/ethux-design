# Stuck Transaction Handling

When a transaction has been pending longer than expected:

| Time pending | Action |
|---|---|
| > 2 minutes | Show explanation: "Your transaction is still processing. This is taking longer than usual, which can happen during high network activity." |
| > 5 minutes | Show options: "Still waiting. You can: **Speed up** (resubmit with higher fee, ~$X.XX) or **Cancel** (submit a zero-value transaction with the same nonce, ~$X.XX)." |

## Rules:
- NEVER let a pending transaction spinner run indefinitely without context.
- Show estimated additional cost for speed-up before the user confirms.
- If the user refreshes during a pending transaction, detect and restore the pending state. Show where they left off.
