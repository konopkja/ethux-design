---
name: safety
description: "Safety and security UX patterns for Ethereum dApps: risk-differentiated warnings (info/caution/danger tiers), ENS name resolution, ERC-55 address checksum validation, spam token filtering, and safe max-send calculations. Use this skill whenever building or reviewing ANY address input, warning system, risk indicator, token filtering, ENS display, send-max feature, or phishing protection — even if the user just mentions 'safety', 'security', 'warnings', 'address validation', 'ENS', 'spam tokens', or 'send max'."
---

# Safety & Security

**Scope:** Address validation (ERC-55 checksum), ENS resolution, risk-differentiated warnings, spam token filtering, and safe max-send calculations.
**Does NOT cover:** Token approval security (see [approvals](../approvals/SKILL.md)), transaction signing verification (see [signing](../signing/SKILL.md)), multi-chain address validation (see [multichain](../multichain/SKILL.md)).
**Cross-references:** [wallets](../wallets/SKILL.md) (ENS display in wallet header), [shared](../../SKILL.md) (address display standards, error formatting, loading labels).

## ALWAYS

- ALWAYS validate addresses with ERC-55 checksum before any transfer.
- ALWAYS show ENS names alongside hex addresses when available.
- ALWAYS differentiate warning severity. Not all risks are equal, and your UI should reflect that.
- ALWAYS filter token lists to exclude unverified tokens by default.
- ALWAYS subtract maximum possible gas from native token balance when computing "send max."

## NEVER

- NEVER show the same red warning style for both "high gas" and "sending to a known phishing address." Graduated severity prevents warning fatigue.
- NEVER display raw hex addresses as the sole identifier when an ENS name is available.
- NEVER auto-interact with airdropped tokens (no auto-approvals, no auto-swaps on unknown tokens).
- NEVER truncate addresses in critical contexts (sending confirmation, approval target). Show the full address.
- NEVER let a "send max" transaction fail because gas was not deducted from the amount.

## Patterns

### 1. Risk-Differentiated Warnings

**When:** Any time you need to warn the user about a potential issue. This replaces the pattern of showing identical red banners for everything.

**How:**
1. Define three warning tiers with distinct visual treatments:

   **Info (low risk):**
   - Appearance: Subtle, neutral color (gray or blue). No icon or an info icon.
   - Use for: First-time actions, educational notes, non-critical suggestions.
   - Example: "This is your first swap on this network."
   - User action: No action required. Dismissible.

   **Caution (medium risk):**
   - Appearance: Yellow/amber. Warning icon.
   - Use for: Unusual amounts, high slippage, unverified contracts, high gas.
   - Example: "The fee for this transaction is unusually high ($12.50)."
   - User action: Acknowledge or adjust. Can proceed.

   **Danger (high risk):**
   - Appearance: Red. Alert icon. May include a confirmation checkbox.
   - Use for: Sending to a new address with large amount, unlimited approvals, interaction with unverified contracts worth significant value.
   - Example: "You are approving unlimited spending of USDC. This contract is not verified."
   - User action: Must explicitly confirm. Consider requiring a checkbox: "I understand the risk."

2. Scoring criteria for risk level:
   - New recipient + large amount (>$1000): Caution
   - Unverified contract interaction: Caution
   - Unlimited approval: Danger
   - Sending entire balance: Caution
   - Contract matches known bad-actor list: Danger
   - Value inconsistency (e.g., paying $100 for a $0.01 token): Danger

3. Stack warnings if multiple apply. The highest severity determines the overall treatment.

**Decision tree:**
```
Is the target a known bad-actor address?
  YES -> Danger
  NO  -> Is it an unverified contract + value > $1000?
    YES -> Danger
    NO  -> Is the target a new recipient OR fee > 10% of value OR unlimited approval?
      New recipient + large amount -> Caution
      High fee ratio -> Caution (see gas skill Pattern 5)
      Unlimited approval -> Danger
      Sending entire balance -> Caution
      None of the above -> Info or no warning
```

Note: The $1000 threshold for "Caution" on new recipients may need to be configurable per-app rather than hardcoded.

**Fallback:** If you cannot determine the risk level (e.g., cannot verify the contract), default to Caution with: "We could not verify this contract. Proceed with care."

**Error state:** N/A (display pattern).

---

### 2. ENS Name Resolution

**When:** Displaying any Ethereum address in the UI, or when a user enters a `.eth` name as a recipient.

**How:**
Use `useEnsAddress`/`useEnsName`/`useEnsAvatar` (wagmi) or the viem equivalents for forward, reverse, and avatar resolution. Accept both hex addresses and ENS names in inputs. Show "Resolving..." during lookup.

**Key rules (not covered by standard ENS tutorials):**
- Name resolves to zero address: treat as invalid. "This ENS name is not configured with an address."
- Resolution timeout: "ENS lookup is taking longer than expected. You can enter the hex address directly."
- Always validate the resolved address with ERC-55 checksum (Pattern 3) after resolution.

---

### 3. ERC-55 Address Checksum Validation

**When:** Any time an address is entered by the user or pasted from clipboard. Use `getAddress` from viem.

**How:**

**Decision tree:**
```
Is the address all lowercase or all uppercase (no mixed case)?
  YES -> Accept (no checksum applied), convert to checksummed internally
  NO (mixed case) -> Does it match ERC-55 checksum?
    YES -> Accept
    NO  -> WARN: "This address has an invalid checksum. It may contain a typo or have been tampered with."
```

**Fallback:** N/A. Always validate.

**Error state:**
- Invalid checksum: "This address has an invalid checksum. Please verify you copied the correct address." Show a "Use anyway" option for advanced users.
- Invalid format: "This is not a valid Ethereum address."

---

### 4. Spam Token Filtering

**When:** Displaying token balances, transaction history, or airdropped assets.

**How:**
1. Maintain a curated token allowlist for each supported chain. Sources:
   - Your own curated list of verified tokens.
   - On-chain token lists (e.g., Uniswap default token list format).
   - Tokens the user has manually interacted with (sent, swapped, approved).
2. Default view shows only allowlisted tokens. Unknown tokens go to a "Hidden" or "Unverified" tab.
3. Classification signals for spam detection:
   - Token has no liquidity on any DEX (check on-chain pair reserves if feasible).
   - Token name mimics a known token (e.g., "USDC.e" vs the real bridged USDC).
   - Token was received via an unsolicited transfer from an unknown address.
   - Token contract is unverified on block explorers (no source code published). Check via `getCode` to confirm it exists, but verification status requires an indexer.
4. For detected spam:
   - Do not show in main balance view.
   - Do not include in portfolio total.
   - If the user navigates to the hidden tab, show a warning: "These tokens were received unsolicited and may be spam. Interacting with them could be risky."
5. Let users manually move tokens between main and hidden lists.

**Decision tree:**
```
Is the token on the curated allowlist?
  YES -> Show in main view
  NO  -> Has the user manually interacted with it (sent, swapped, approved)?
    YES -> Show in main view
    NO  -> Does it have liquidity on any DEX? (check if feasible, skip if not)
      YES -> Show as "Unverified" with badge
      NO or unknown -> Does the name mimic a known token?
        YES -> Classify as spam, hide
        NO  -> Classify as "Unverified", show in hidden tab
```

**Empty state:** If the hidden/unverified tab has no tokens: "No hidden tokens. Unverified or suspicious tokens will appear here." 
**Fallback:** If you cannot determine whether a token is spam (no liquidity data available), classify it as "Unverified" and show it with a label, but do not count it in the total balance.

**Error state:**
- Token data unavailable: Show the token with an "Unverified" badge. Do not hide it entirely if the user previously interacted with it.

---

### 5. Safe "Send Max" Calculation

**When:** User clicks "Max" or "Send all" for a native token transfer (ETH, MATIC, etc.).

**How:**
1. Get the user's native balance: `getBalance`.
2. Estimate gas for the specific transaction (a simple transfer: 21,000 gas for EOA-to-EOA, but smart contract wallets or contract recipients use more).
   - Call `estimateGas` with the actual transaction parameters (to, value, data).
3. Get current fee data: `estimateFeesPerGas` for EIP-1559 chains. Use `maxFeePerGas` (not `gasPrice`) as the upper bound.
4. Calculate max gas cost: `gasEstimate * maxFeePerGas`.
5. Add a safety buffer (e.g., 10% above the estimate) to account for gas price movement between estimation and inclusion.
6. Calculate send amount: `balance - maxGasCost - safetyBuffer`.
7. If the result is negative or near zero, show: "Your balance is too low to cover the network fee."
8. Display to the user: "Max: [amount] [TOKEN] (keeping ~$X.XX for the network fee)." NEVER allow a user to submit a transaction that would leave them with exactly 0 balance, as gas price increases between estimation and mining can cause failure.
9. After the send transaction completes, show post-action confirmation (see [shared](../../SKILL.md) Post-Action Confirmation).

**Calculation:**
```
maxGasCost = estimatedGas * maxFeePerGas
buffer = maxGasCost * 0.10
sendAmount = balance - maxGasCost - buffer

if (sendAmount <= 0) {
  show "Insufficient balance for fees"
}
```

**For L2 networks:** Include the L1 data fee in the gas cost calculation (see gas skill, Pattern 4). The total cost is `l2ExecutionCost + l1DataFee`.

**Fallback:** If gas estimation fails, use a conservative default (e.g., 21,000 gas * 2x current gas price) and warn: "Fee estimate may not be exact."

**Error state:**
- Balance minus gas is negative: "You don't have enough [TOKEN] to cover the network fee. You need at least [fee amount] [TOKEN]."
- Transaction fails anyway (gas price spiked between estimate and send): "Transaction failed due to insufficient gas. The network fee increased. Please try again."

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Smart contract security patterns**: [ethskills.com/security/SKILL.md](https://ethskills.com/security/SKILL.md)
- **On-chain data indexing for address analysis**: [ethskills.com/indexing/SKILL.md](https://ethskills.com/indexing/SKILL.md)
- **Verified contract addresses**: [ethskills.com/addresses/SKILL.md](https://ethskills.com/addresses/SKILL.md)
