---
title: "Shared UX Patterns"
description: "Cross-cutting patterns referenced by all skill files: button loading labels, error jargon translation, address display, stuck transaction thresholds, and EIP-5792 capability detection."
---

# Shared UX Patterns

These patterns apply across all skill files. Only non-obvious, Ethereum-specific patterns are included here. Standard UX practices (skeleton loading, empty states, accessibility, responsive design) are assumed knowledge.

---

## Loading Labels

Disable buttons and replace labels with context text during async operations:
- "Checking permissions..." (allowance check in progress)
- "Estimating fee..." (gas estimation in progress)
- "Waiting for signature..." (wallet popup is open)
- "Confirming..." (transaction submitted, waiting for block inclusion)

NEVER show a submit/confirm button with no fee estimate displayed. The button should remain disabled until the fee is known.
NEVER show "$0.00" or "0" while calculating derived values (fiat conversion, swap output, gas estimates). Show "Estimating..." instead.

---

## Post-Action Confirmation

After every signature or transaction submission, show a confirmation state. NEVER move immediately to the next step or show nothing.

### For on-chain transactions:
```
Transaction submitted. Waiting for confirmation...
Estimated wait: ~[X] seconds
[Transaction hash as truncated link to block explorer] [Copy button]
```

### For off-chain signatures:
```
Signed successfully. [Next step description or completion message]
```

### After transaction confirmation:
Show the actual fee paid alongside the estimate: "Fee: $0.08 (estimated $0.12)." This builds trust.

### Rules:
- NEVER show a "success" state for a submitted-but-unconfirmed transaction. "Submitted" and "confirmed" are different states. Show "Processing..." until the transaction is included in a block.
- NEVER auto-redirect the user away from a confirmation screen. Let them stay until they choose to navigate away.
- NEVER describe a signature as "free" without qualification. Off-chain signatures are gasless but they DO authorize actions. Say "No network fee" instead of "Free."

---

## Error Message Formatting

Use three-tier progressive disclosure for all errors:

1. **First layer (always visible):** Plain-language summary. No jargon.
2. **Second layer (expandable):** More context and suggested action.
3. **Third layer (copy-able):** Full technical error, transaction hash, and raw message for support.

### Error Jargon Translation Table

Apply this translation to every RPC or contract error before displaying to users:

| Technical error | User-facing message |
|---|---|
| Execution reverted | Transaction failed. |
| Insufficient output amount | Price changed too much. Try increasing your price tolerance. |
| Nonce too low | This transaction was already processed. Refresh and try again. |
| Insufficient funds for gas | You don't have enough [native token] to cover the network fee. |
| User rejected transaction / User rejected | You cancelled the transaction. |
| Out of gas | The transaction ran out of processing power. Try again. |
| Contract execution error | Something went wrong with this operation. |
| Transfer from failed | The token transfer was rejected. Check your balance and permissions. |
| Overflow / Underflow | The amount is outside the allowed range. Try a smaller value. |

### Rules:
- NEVER show raw Solidity error strings to end users in the primary display.
- NEVER show gas cost in scientific notation or with more than 6 decimal places. Format for readability: "$0.12" or "0.00004 ETH", never "4.2e-5 ETH".
- NEVER show "Fee: $0.00" for sponsored transactions without the "(sponsored)" label.

---

## Address Display Standards

- **Truncation:** `0x1234...5678` (first 6 + last 4 after 0x) for non-critical contexts. Show full address on send confirmations and approval targets.
- **ENS:** Show ENS name as primary, truncated address as secondary: `vitalik.eth (0xd8dA...6045)`. Use `useEnsName` (wagmi) or `getEnsName` (viem). Also resolve avatar.
- **Interactive:** Every displayed address must be copyable (click/tap) with "Copied!" feedback, and linked to the relevant block explorer.

---

## Stuck Transaction Handling

When a transaction has been pending longer than expected:

| Time pending | Action |
|---|---|
| > 2 minutes | Show explanation: "Your transaction is still processing. This is taking longer than usual, which can happen during high network activity." |
| > 5 minutes | Show options: "Still waiting. You can: **Speed up** (resubmit with higher fee, ~$X.XX) or **Cancel** (submit a zero-value transaction with the same nonce, ~$X.XX)." |

### Rules:
- NEVER let a pending transaction spinner run indefinitely without context.
- Show estimated additional cost for speed-up before the user confirms.
- If the user refreshes during a pending transaction, detect and restore the pending state. Show where they left off.

---

## EIP-5792 Capability Detection

This is the canonical explanation. Other skill files reference this section instead of re-explaining.

EIP-5792 defines `wallet_sendCalls` (batch multiple calls in one user confirmation) and `wallet_getCapabilities` (discover what the wallet supports).

### Detection pattern:
```
1. Call wallet_getCapabilities (or useCapabilities from wagmi).
2. Response is keyed by chainId. Check the current chain's capabilities.
3. Look for specific capabilities:
   - atomic: wallet can execute multiple calls atomically
   - paymasterService: wallet supports ERC-7677 paymaster sponsorship
   - auxiliaryFunds: wallet can source funds from other chains
4. If wallet_getCapabilities is not available or throws, the wallet does not support EIP-5792.
```

### Usage:
```
// With wagmi
const { data: capabilities } = useCapabilities()
const currentChainCaps = capabilities?.[chainId]

// Check specific capability
const supportsBatching = currentChainCaps?.atomic?.status === "supported"
const supportsPaymaster = currentChainCaps?.paymasterService?.status === "supported"
```

### Decision tree:
```
Check atomic.status on the current chain:
  "supported" -> Wallet can batch now. Use wallet_sendCalls with multiple calls.
  "ready"     -> Wallet can upgrade via EIP-7702 to gain batching. Prompt upgrade, then batch.
  undefined   -> No batching support. Fall back to sequential transactions.
```

### Fallback:
If EIP-5792 is not supported, degrade gracefully:
- `atomic.status` is `"supported"`: use `wallet_sendCalls` with multiple calls
- `atomic.status` is `"ready"`: wallet can upgrade via EIP-7702 to gain batching. Prompt the user to upgrade, then use `wallet_sendCalls`
- No `atomic` capability: use sequential transactions (approve, then action)
- No `paymasterService`: user pays gas in native token
- NEVER block functionality because EIP-5792 is unavailable. Always implement a non-5792 path.

---

## Irreversibility Framing

Before every value-transferring transaction, include a clear but non-alarming note: "This action cannot be undone once confirmed." Do NOT use red warning colors for this. Use muted text below the confirm button.

For approvals (which CAN be revoked): "You can remove this permission later from your approvals page."
