---
title: "Token Approvals"
description: "Exact-amount approvals, Permit2 gasless signatures, EIP-5792 batched calls, and approval management UI."
standards: ["EIP-2612", "EIP-5792", "Permit2"]
patterns: 5
---

# Token Approvals

**Scope:** ERC-20 token approval flows (approve, Permit2, EIP-5792 batching), approval display, and revocation.
**Does NOT cover:** Native token transfers (no approval needed), NFT approvals (ERC-721/1155 setApprovalForAll), or contract-level access control.
**Cross-references:** [signing.md](./signing.md) (EIP-712 for Permit2 signatures), [gas.md](./gas.md) (fee display for approval transactions), [_shared.md](./_shared.md) (loading states, post-action confirmation, error formatting).

## ALWAYS

- ALWAYS default to exact-amount approvals. The approval amount should equal the transaction amount, not `MAX_UINT256`.
- ALWAYS check existing allowance before requesting a new approval. If the current allowance covers the amount, skip the approval step entirely.
- ALWAYS display the spender contract address, resolved name (if available), token symbol, and approval amount in plain language before the user confirms.
- ALWAYS provide a way for users to revoke approvals from within your app.
- ALWAYS handle the case where a token requires setting allowance to 0 before setting a new non-zero value (e.g., USDT).

## NEVER

- NEVER request `MAX_UINT256` (unlimited) approval by default. If you offer it as an option, label it clearly as "Unlimited" with a risk disclaimer.
- NEVER hide the approval step. Even when batching, show the user what permissions they are granting.
- NEVER assume Permit2 or EIP-5792 is available. Always implement a standard `approve()` fallback.
- NEVER silently fail if an approval transaction reverts. Surface the error with a specific message (see [_shared.md](./_shared.md) Error Message Formatting).
- NEVER show an approval confirmation dialog that looks identical to the action confirmation dialog. Users must be able to tell at a glance whether they are approving permission or executing the action. Use distinct visual treatment (different header, icon, or color weight).
- NEVER auto-revoke approvals without user initiation. Even if an approval is "old," the user may have a reason for it.

## Patterns

### 1. Exact-Amount Approval

**When:** User needs to grant spending permission for a specific action (swap, deposit, stake).

**How:**
1. While checking current allowance, show the action button in a disabled/loading state with text "Checking permissions..." Do not show the approval step and then remove it. Determine the flow before showing UI. (See [_shared.md](./_shared.md) Loading Labels.)
2. Read current allowance: `useReadContract` with the token's `allowance(owner, spender)` function.
3. If allowance >= required amount, skip to the action transaction.
4. If allowance < required, call `useWriteContract` with `approve(spender, exactAmount)`.
5. For tokens that require zero-first reset (USDT pattern): check if current allowance is non-zero and the token is on a known list. If so, send `approve(spender, 0)` first, wait for confirmation, then send `approve(spender, exactAmount)`.
6. After approval confirms, re-simulate the action transaction before submitting it. If conditions have changed (e.g., swap output dropped below minimum), show: "Prices have changed since you approved. New estimate: [amount]. Continue?" This prevents the frustrating experience of paying gas for an approval and then having the action revert.
7. After the action transaction is submitted, show a post-action confirmation (see [_shared.md](./_shared.md) Post-Action Confirmation).

**Fallback:** This is the baseline. No fallback needed.

**Error state:**
- Approval rejected by user: "Approval cancelled. The [action] requires permission to spend your [TOKEN]."
- Approval reverted: "Approval failed. The token contract rejected the request. This can happen with tokens that require resetting approval to zero first."

---

### 2. Permit2 Gasless Approval

**When:** Your contract integrates with Permit2 (Canonical Permit2 at `0x000000000022D473030F116dDEE9F6B43aC78BA3`). User has already granted a one-time unlimited approval to the Permit2 contract.

Permit2 has two distinct paradigms. Choose based on your use case:
- **AllowanceTransfer:** For recurring permissions with sub-limits (e.g., a DEX that the user trades on repeatedly).
- **SignatureTransfer:** For one-time transfers (e.g., a single swap or deposit).

**How (common first step):**
1. Check if user has approved the Permit2 contract for this token: `allowance(owner, PERMIT2_ADDRESS)`.
2. If not approved, request a one-time approval to Permit2. This is an acceptable trade-off because Permit2 enforces its own sub-limits per spender, so the unlimited approval to the Permit2 contract itself does not grant any individual dapp unlimited access.

**Sub-pattern A: AllowanceTransfer (recurring permissions)**
3. Build a `PermitSingle` struct with exact amount, expiration timestamp, and your contract as spender.
4. Request an EIP-712 signature using `useSignTypedData` with the Permit2 domain and PermitSingle types (see [signing.md](./signing.md) Pattern 1 for EIP-712 details).
5. Submit the signature to your contract. Your contract calls `permit2.permit(owner, permitSingle, signature)` to set the sub-approval, then calls `permit2.transferFrom(from, to, amount, token)` to pull the tokens.

**AllowanceTransfer typed data structure:**
```
domain: { name: "Permit2", chainId, verifyingContract: PERMIT2_ADDRESS }
types: {
  PermitSingle: [
    { name: "details", type: "PermitDetails" },
    { name: "spender", type: "address" },
    { name: "sigDeadline", type: "uint256" }
  ],
  PermitDetails: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" }
  ]
}
```

**Sub-pattern B: SignatureTransfer (one-time transfers)**
3. Build a `PermitTransferFrom` struct with token, amount, nonce, and deadline. Build a `SignatureTransferDetails` struct with recipient and amount.
4. Request an EIP-712 signature using `useSignTypedData`.
5. Submit to your contract, which calls `permit2.permitTransferFrom(permit, transferDetails, owner, signature)`.

**SignatureTransfer typed data structure:**
```
domain: { name: "Permit2", chainId, verifyingContract: PERMIT2_ADDRESS }
types: {
  PermitTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ]
}
```

**Phishing risk note:** Permit2 signatures (and EIP-2612 permit signatures) are a common phishing vector. Malicious sites can trick users into signing a permit that grants the attacker spending rights. ALWAYS display the spender address prominently in the signing UI, and ALWAYS resolve the spender to a known contract name when possible. If the spender is unknown, show a Caution-level warning (see [safety.md](./safety.md) Pattern 1).

**Fallback:** If the user has not approved Permit2 and does not want to, fall back to Pattern 1 (exact-amount direct approval).

**Error state:**
- Signature rejected: "Signature cancelled. You can still proceed with a standard approval transaction instead."
- Permit expired: "This permit has expired. Please sign a new one."
- Nonce already used: "This permit was already used. Please try again."

---

### 3. Batched Approve + Action (EIP-5792)

**When:** Wallet supports `wallet_sendCalls` (EIP-5792). You want to combine approval and action into a single user confirmation.

**How:**
1. Check wallet capability: use `useCapabilities` (wagmi) or call `wallet_getCapabilities` via the provider. Check `atomic.status` on the current chain.
2. If supported, build a calls array:
   - Call 1: `approve(spender, exactAmount)` on the token contract.
   - Call 2: Your action call (swap, deposit, etc.) on your contract.
3. Submit via `useSendCalls` (wagmi) or `wallet_sendCalls` on the provider. Pass both calls in the `calls` array.
4. Track the batch status with `useCallsStatus` or `wallet_getCallsStatus` using the returned batch ID.

**Decision tree:**
```
Check atomic.status on the current chain (via wallet_getCapabilities):
  "supported" -> Use wallet_sendCalls with [approve, action]
  "ready"     -> Wallet can upgrade via EIP-7702 to gain batching. Prompt upgrade, then batch.
  undefined   -> Does token support EIP-2612 permit?
    YES -> Use Permit2 (Pattern 2) or native permit + action
    NO  -> Sequential: approve tx, wait, action tx (Pattern 1)
```

**Fallback:** If `wallet_getCapabilities` is not available or `atomic.status` is not `"supported"` or `"ready"`, fall back to Pattern 2 (Permit2) or Pattern 1 (sequential approval).

**Error state:**
- Batch rejected: "Transaction cancelled."
- Partial failure (if non-atomic): "The approval succeeded but the [action] failed. Your approval is still active. You can retry the [action] without re-approving."
- Capability check failed: Silently fall back to sequential flow. Do not show an error for this.

---

### 4. Human-Readable Approval Display

**When:** Every time an approval is requested, regardless of method.

**How:**
1. Resolve the spender address: check if it matches a known contract in your app. Display the contract name (e.g., "Uniswap Router") alongside the address.
2. Format the approval amount in token terms with the token symbol: "Allow spending of 1,500 USDC".
3. For unlimited approvals (if offered): display "Unlimited USDC" with a warning: "This contract can spend all your USDC until you revoke."
4. Show the token icon if available.
5. For Permit2: show the expiration time in human terms: "This permission expires in 30 days."

**Display template:**
```
Approve [CONTRACT_NAME] to spend [AMOUNT] [TOKEN]
Address: [0x...abcd]
Network fee for this step: ~$X.XX
[If unlimited: ⚠ This allows unlimited spending until revoked]
[If Permit2: Expires: [DATE]]
```

Below the approval display, include a one-sentence explainer in muted text: "This gives [CONTRACT_NAME] permission to move [TOKEN] from your wallet for this transaction." For first-time approvers, expand this: "Unlike a bank transfer, you need to give explicit permission before any app can move your tokens. You can remove this permission at any time."

**Fallback:** If contract name cannot be resolved, show the full address with a note: "Unverified contract."

**Error state:** N/A (this is a display pattern, not a transaction).

---

### 5. In-App Approval Management

**When:** User wants to view or revoke existing approvals.

**How:**
1. Query approval events for the user's address. Use `getLogs` or an indexer to find `Approval` events from ERC-20 tokens where `owner` matches the connected address.
2. For each approval found, read current allowance: `allowance(owner, spender)`.
3. Display active approvals (allowance > 0) in a list:
   - Token name and symbol
   - Spender address and resolved name
   - Current allowance amount (or "Unlimited")
   - Date of last approval (from event block timestamp)
4. Provide a "Revoke" button for each entry. Before revoking, show a confirmation: "Remove permission for [CONTRACT_NAME] to spend your [TOKEN]? If you have active orders or positions using this permission, they may stop working. You'll need to re-approve if you want to use this app again." Buttons: "Remove permission" / "Cancel".
5. On confirm, call `approve(spender, 0)` via `useWriteContract`. Show post-action confirmation (see [_shared.md](./_shared.md) Post-Action Confirmation).
6. For Permit2 approvals, call `permit2.lockdown()` or `permit2.approve(token, spender, 0, 0)` to revoke.

**Fallback:** If event indexing is slow or unavailable, allow users to manually input a token address to check approvals against known spenders in your app.

**Error state:**
- Revocation failed: "Failed to revoke approval for [TOKEN]. The transaction was rejected."
- No approvals found: "No active approvals found for this wallet." (Note: this may be incomplete if event indexing is limited.)

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Contract addresses and ABIs for Permit2, DEX routers**: [ethskills.com/addresses/SKILL.md](https://ethskills.com/addresses/SKILL.md)
- **Token standards (ERC-20, permit interface)**: [ethskills.com/standards/SKILL.md](https://ethskills.com/standards/SKILL.md)
