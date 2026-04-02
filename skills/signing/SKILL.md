---
name: signing
description: "Transaction signing UX patterns for Ethereum dApps: EIP-712 typed structured data, human-readable transaction summaries, transaction simulation/preview, multi-step signing progress, EIP-7702 batch signing, and Sign-In with Ethereum (SIWE/EIP-4361). Use this skill whenever building or reviewing ANY signature request, transaction confirmation UI, signing flow, SIWE implementation, transaction preview, or multi-step transaction progress — even if the user just mentions 'signing', 'signature', 'confirm transaction', 'SIWE', 'sign in with ethereum', or 'transaction preview'."
---

# Transaction Signing

**Scope:** Signature requests (EIP-712 typed data, personal_sign, SIWE), transaction simulation, multi-step progress, and batch signing.
**Does NOT cover:** Token approval logic (see [approvals](../approvals/SKILL.md)), gas estimation and fee display (see [gas](../gas/SKILL.md)).
**Cross-references:** [approvals](../approvals/SKILL.md) (Permit2 signatures), [shared](../../SKILL.md) (loading labels, post-action confirmation, error formatting), [stuck transactions](../shared/references/stuck-transactions.md) (pending transaction UX), [irreversibility](../shared/references/irreversibility.md) (framing for value-transfer confirmations).

## ALWAYS

- ALWAYS use EIP-712 typed structured data for off-chain signatures. Never ask users to sign raw hex or unstructured strings.
- ALWAYS show a human-readable summary of what the transaction will do before the wallet popup appears.
- ALWAYS display multi-step progress when a flow requires more than one signature or transaction.
- ALWAYS show estimated outcome (token amounts in/out) alongside the transaction summary.
- ALWAYS set a reasonable deadline/expiry on signed messages (minutes to hours, not years).
- ALWAYS show a confirmation state after each signature or transaction is submitted (see [shared](../../SKILL.md) Post-Action Confirmation).
- ALWAYS provide ERC-7730 metadata for EIP-712 signatures when possible, so hardware wallets can display clear signing information instead of raw hex data.

## NEVER

- NEVER present raw calldata or hex bytes as the transaction description.
- NEVER ask for a signature without explaining what it authorizes in plain language.
- NEVER auto-submit a transaction without user-initiated confirmation.
- NEVER leave the user in an unknown state between steps. If a multi-step flow is interrupted, show exactly where they stopped and how to resume.
- NEVER request `eth_sign`. This method signs raw bytes without a safety prefix, making it possible for a malicious message to be a valid transaction hash. Use `personal_sign` (adds the EIP-191 `\x19Ethereum Signed Message:\n` prefix) for plaintext messages and `eth_signTypedData_v4` for structured data.
- NEVER show a signing request without an obvious "Reject" / "Cancel" button in the dapp UI itself. Users should not have to find the reject button inside the wallet popup.
- NEVER describe a signature as "free" without qualification. Off-chain signatures are gasless but they DO authorize actions. Say "No network fee" instead of "Free."

## Patterns

### 1. EIP-712 Typed Structured Data

**When:** Any off-chain signature: permits, gasless approvals, order placement, governance votes, meta-transactions.

**How:**
Use `useSignTypedData` (wagmi) or `signTypedData` (viem) with `domain`, `types`, `primaryType`, and `message`. Verify on-chain with `ecrecover` for EOAs or EIP-1271 `isValidSignature(hash, signature)` for smart contract wallets.

**Fallback:** If the wallet does not support `eth_signTypedData_v4`, fall back to `personal_sign` with a clearly formatted plaintext version of the message. Note: virtually all modern wallets support `eth_signTypedData_v4`, so this fallback is rare in 2026.

**Error state:**
- User rejected: "Signature cancelled. No action was taken."
- Unsupported method: "Your wallet doesn't support structured signing. Falling back to a simpler format."
- Invalid signature on-chain: "Signature verification failed. Please try signing again. If this persists, your wallet may not be compatible with this signing method."

---

### 2. Human-Readable Transaction Summary

**When:** Before every `sendTransaction` or `writeContract` call. This is not optional.

**How:**
1. Before triggering the wallet popup, display an in-app summary panel:
   - **Action verb:** "Swap", "Deposit", "Stake", "Send", "Approve", "Claim"
   - **Amounts:** Token amounts with symbols and fiat equivalents
   - **Counterparty:** Contract name or recipient address (ENS if available)
   - **Estimated outcome:** "You will receive approximately 1,420 USDC"
   - **Fees:** Estimated gas cost in fiat
2. Decode your own contract's calldata using the ABI to extract parameters. You know your own contract's functions.
3. For multi-token operations, show a clear "You send / You receive" breakdown.
4. If more than 15 seconds have passed since the estimate was computed, refresh it before showing the wallet popup. If the new estimate differs from the original by more than 1%, update the display and highlight the change: "Estimate updated: was ~1,420 USDC, now ~1,412 USDC."

**Summary template:**
```
[ACTION VERB]
You send: [AMOUNT] [TOKEN] (~$XX.XX)
You receive: ~[AMOUNT] [TOKEN] (~$XX.XX)
Fee: ~$X.XX
To: [CONTRACT_NAME] ([0x...abcd])
```

**Fallback:** If you cannot decode the transaction (e.g., interacting with an unknown external contract), show: "Contract interaction at [address]. Review details in your wallet before confirming."

**Error state:** N/A (this is a display pattern).

---

### 3. Transaction Simulation / Preview

**When:** Before any transaction that moves value. Especially important for swaps, approvals, and contract interactions.

**How:**
Use `simulateContract` (viem) or `useSimulateContract` (wagmi) to dry-run the transaction. If simulation shows a revert, block submission and show the revert reason. For balance change preview: compare token balances before and after via `eth_call` with state overrides. Display: "If confirmed, your balance changes: -1 ETH, +1,420 USDC."

**Fallback:** If simulation fails (some contract patterns are not simulatable):
- For transactions under $100 equivalent: "We couldn't verify this transaction will succeed. You can proceed, but there's a chance it may fail and you'll still pay the network fee (~$X.XX)."
- For transactions over $100 equivalent: "We couldn't verify this transaction will succeed. We recommend trying again in a moment. If you proceed, there is a risk of failure with a ~$X.XX network fee." Show "Try again" as primary button and "Proceed anyway" as secondary/muted.

**Error state:**
- Simulation shows revert: "This transaction would fail: [revert reason]. Check your inputs and try again." Do NOT let the user submit a transaction that is known to revert.
- Simulation timeout: "Could not simulate the transaction. You can still proceed, but the outcome is unverified."

---

### 4. Multi-Step Signing Progress

**When:** Any flow that requires more than one transaction or signature (e.g., approve then swap, or approve-permit-swap).

**How:**
1. Before starting, calculate total steps and display a progress indicator: "Step 1 of 3".
2. For each step, show:
   - Step number and total
   - What this step does: "Approving USDC spending"
   - Status: pending / waiting for signature / confirming / confirmed / failed
3. If the wallet prompt has been pending for more than 30 seconds, show a helper: "Waiting for your wallet. If you don't see a popup, check your wallet app or browser extension." On mobile: "Open [wallet name] to confirm." Include a "Cancel" button that resets the current step to pending.
4. After each step completes, show a brief confirmation (see [shared](../../SKILL.md) Post-Action Confirmation), then auto-advance to the next. The user should not need to click "Next" between wallet prompts.
4. If a step fails, stop and show recovery options:
   - "Retry this step"
   - "Cancel" (and explain what has already been committed)
5. Persist progress state so that if the user refreshes, they see where they left off and can resume.

**State management pattern:**
```
steps = [
  { id: 'approve', label: 'Approve USDC', status: 'pending', txHash: null },
  { id: 'deposit', label: 'Deposit to vault', status: 'pending', txHash: null },
]
currentStep = 0
```

**Fallback:** If the flow can be batched via EIP-5792, do so (see approvals skill). The progress UI then shows a single step: "Approve and deposit in one transaction."

**Error state:**
- Step failed: "Step [N] failed: [reason]. Steps 1-[N-1] have already been completed. You can retry step [N] or cancel."
- User left mid-flow: On return, show: "You have an incomplete transaction. Step [N-1] of [total] completed. Resume or start over?"

---

### 5. Batch Signing with EIP-7702

**When:** Wallet supports EIP-7702 (smart account delegation for EOAs). Multiple approvals or actions can be delegated into a single signature.

**How:**
1. Check if the connected wallet supports EIP-7702 via `wallet_getCapabilities`. Check `atomic.status` for delegation or batching capability.
2. If supported, compose the batch of calls as an array of `{ to, data, value }` objects.
3. Submit via `wallet_sendCalls` with the batch.
4. Show a single combined summary: "Approve and swap USDC for ETH in one step."
5. Track the batch status with `wallet_getCallsStatus`.

**Decision tree:**
```
Check atomic.status on the current chain:
  "supported" -> Batch all related calls into one sendCalls
  "ready"     -> Wallet can upgrade via EIP-7702 to gain batching. Prompt upgrade, then batch.
  undefined   -> Fall back to multi-step flow (Pattern 4)
```

**Fallback:** If `atomic.status` is not `"supported"` or `"ready"`, decompose into individual transactions and use Pattern 4 (multi-step progress).

**Error state:**
- Batch rejected: "Transaction cancelled. No actions were taken."
- Batch reverted: "The bundled transaction failed: [reason]. No token transfers occurred." (Atomic batches are all-or-nothing.)

---

### 6. Personal Sign and Sign-In with Ethereum (EIP-4361)

**When:** Authenticating a user (SIWE), accepting terms of service, or simple plaintext message signing. Use `personal_sign` via `useSignMessage` (wagmi).

**How:**
**Key rules (beyond standard SIWE tutorials):**
- Display the message in your app UI BEFORE the wallet popup: "Sign in to [app name] to verify your identity. No transaction will be sent."
- Always include nonce from your server and issued-at timestamp to prevent replay.
- Verify server-side by recovering the signer address, not client-side.

**Error state:**
- User rejected: "Sign-in cancelled. You can try again anytime."
- Nonce expired: "This sign-in request has expired. Please try again."

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Frontend UX rules (pending states, button flows)**: [ethskills.com/frontend-ux/SKILL.md](https://ethskills.com/frontend-ux/SKILL.md)
- **Smart contract security (signature verification)**: [ethskills.com/security/SKILL.md](https://ethskills.com/security/SKILL.md)
