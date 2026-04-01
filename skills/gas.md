---
title: "Gas & Fees"
description: "Gas sponsorship via paymasters, fiat fee display, ERC-20 gas payment, fee breakdowns, and high-gas warnings."
standards: ["ERC-7677", "EIP-7702", "EIP-1559"]
patterns: 5
---

# Gas & Fees

**Scope:** Gas estimation, fiat fee display, paymaster sponsorship, ERC-20 gas payment, L1/L2 fee breakdowns, and high-gas warnings.
**Does NOT cover:** Transaction signing flows (see [signing.md](./signing.md)), token approval logic (see [approvals.md](./approvals.md)).
**Cross-references:** [_shared.md](./_shared.md) (loading states, post-action confirmation, error formatting, stuck transaction handling).

## ALWAYS

- ALWAYS show fees in the user's local fiat currency as the primary display. Show the native token amount as secondary.
- ALWAYS check if the user has sufficient native token balance for gas before allowing transaction submission.
- ALWAYS estimate gas before sending. Use the estimate to show cost and to detect transactions that would fail.
- ALWAYS account for gas when computing "max send" amounts for native tokens.
- ALWAYS show L1 data fees separately on L2 networks. Users on L2s see two components: execution fee and L1 data fee.
- ALWAYS show the actual fee paid after transaction confirmation, not just the estimate. If the actual fee is lower than the estimate, show: "Fee: $0.08 (estimated $0.12)." This builds trust.
- ALWAYS re-estimate gas immediately before transaction submission (not just at page load or input change). If the new estimate is more than 20% higher than what was displayed, update the display and pause submission: "Network fees have increased. Updated fee: $X.XX (was $Y.YY). Continue?"

## NEVER

- NEVER let a user submit a transaction they cannot afford (gas-wise) without offering an alternative (sponsorship, ERC-20 payment).
- NEVER display gas in gwei to end users. Gwei is meaningless to most people.
- NEVER hide fee information. Even sponsored (zero-cost) transactions should show "Fee: $0.00 (sponsored)".
- NEVER hardcode gas prices or gas limits. Always estimate dynamically.
- NEVER assume the user has ETH. On L2s especially, users may onboard directly with stablecoins.
- NEVER show gas cost in scientific notation or with more than 6 decimal places. Format for readability: "$0.12" or "0.00004 ETH", never "4.2e-5 ETH" (see [_shared.md](./_shared.md) Error Message Formatting).
- NEVER show "Fee: $0.00" for sponsored transactions without the "(sponsored)" label.

## Patterns

### 1. Empty Wallet Detection + Paymaster Sponsorship

**When:** User connects a wallet with zero native token balance, or has tokens but not enough for gas.

**How:**
1. On wallet connection, check native balance: `getBalance` (viem) or `useBalance` (wagmi). While checking, show a loading state on the fee area (see [_shared.md](./_shared.md) Loading Labels).
2. If balance is zero or below a threshold (e.g., < estimated gas for a typical transaction):
   - Check if your app has a paymaster configured.
   - If yes, use ERC-7677 paymaster flow with `wallet_sendCalls` (see [_shared.md](./_shared.md) EIP-5792 Capability Detection).
3. To use a paymaster with `wallet_sendCalls`:
   - Include a `capabilities` object with `paymasterService` containing your paymaster URL.
   - The wallet calls your paymaster endpoint to get sponsorship data.
   - The user sees "Fee: $0.00 (sponsored)".
4. Your paymaster server validates the operation and returns sponsorship data. Server-side implementation (out of scope for this UX skill) must include: per-address rate limits, total budget caps, and contract/method whitelists. When sponsorship is denied, the wallet falls back to the user paying gas (see Fallback below).

**Decision tree:**
```
Does user have enough native token for gas?
  YES -> Standard flow (Pattern 2)
  NO  -> Does app have a paymaster?
    YES -> Does wallet support wallet_sendCalls? (see _shared.md EIP-5792)
      YES -> Use ERC-7677 paymaster
      NO  -> Show "need [native token]" message + onramp link
    NO  -> Show "need [native token]" message + onramp link
```

**Paymaster capability in sendCalls:**
```
{
  calls: [{ to, data, value }],
  capabilities: {
    paymasterService: {
      url: "https://your-app.com/api/paymaster"
    }
  }
}
```

**Fallback:** If the wallet does not support `wallet_sendCalls` or paymasters:
- Show a clear message: "You need [X] ETH for transaction fees."
- Offer a fiat onramp link or suggest bridging from another chain.
- Do NOT block the entire UI. Let users explore the app and show the gas requirement only at transaction time.

**Error state:**
- Paymaster rejects sponsorship: "Gas sponsorship is not available for this transaction. You need approximately [amount] ETH for fees."
- Paymaster is down: Fall back silently to standard gas flow. If user has no gas, show the fallback message above.

---

### 2. Fiat Fee Display

**When:** Every time a fee or cost is shown to the user.

**How:**
1. Show "Estimating fee..." placeholder while loading. NEVER show "$0.00" or empty space. NEVER show a "Submit" button with no fee displayed.
2. Estimate gas with `estimateGas`/`estimateFeesPerGas` (viem). Convert to fiat using a Chainlink price feed (`latestRoundData()`) or cached price.
3. Format: "$0.12" as primary, "0.00004 ETH" as secondary/tooltip.

**Fallback:** If price feed is unavailable, show the native token amount only: "Fee: ~0.00004 ETH" with a note "(USD estimate unavailable)".

**Error state:** N/A (display pattern). If gas estimation fails, show "Fee estimate unavailable" rather than $0 or nothing.

---

### 3. ERC-20 Gas Payment

**When:** User has ERC-20 tokens (e.g., USDC) but no native token for gas. Wallet supports EIP-7702 or paymaster that accepts ERC-20 payment.

**How:**
1. Check wallet capabilities via `wallet_getCapabilities` for ERC-20 gas payment support.
2. If the wallet natively supports paying gas in ERC-20 (some smart account wallets do), pass the fee token preference in the transaction.
3. Alternative approach with a paymaster:
   - Your paymaster sponsors the gas.
   - Your contract pulls the equivalent ERC-20 amount from the user as a fee within the same transaction.
   - Use Permit2 or EIP-2612 permit to authorize the fee pull without a separate approval.
4. Display to the user: "Fee: 0.12 USDC" instead of an ETH amount.

**Decision tree:**
```
Does wallet support ERC-20 gas payment natively?
  YES -> Set fee token in transaction parameters
  NO  -> Does your app have a paymaster?
    YES -> Sponsor gas, collect ERC-20 fee in-transaction
    NO  -> User must acquire native token for gas (show onramp)
```

**Fallback:** If neither native ERC-20 gas payment nor paymaster is available, show: "This transaction requires [native token] for fees. You currently have 0 [native token]." Suggest bridging or buying.

**Error state:**
- Insufficient ERC-20 balance for fee: "You need at least [amount] [TOKEN] to cover the fee for this transaction."
- Fee token not supported: Fall back to native token fee display.

---

### 4. Fee Breakdown (L1 + L2)

**When:** User is on an L2 network (Optimism, Base, Arbitrum, etc.) or when a power user requests fee details.

**How:**
1. Estimate the L2 execution gas: standard `estimateGas`.
2. For L1 data fee (Optimism/Base stack):
   - Call the GasPriceOracle precompile at `0x420000000000000000000000000000000000000F`.
   - Use `getL1Fee(bytes)` passing the serialized transaction to get the L1 data cost.
   - After Fjord upgrade: use `getL1FeeUpperBound(unsignedTxSize)` for a simpler estimate.
3. For Arbitrum: L1 data fee is included in the gas estimate from `estimateGas`. Use `ArbGasInfo` precompile at `0x000000000000000000000000000000000000006C` for breakdown.
4. Display:
   ```
   Network fee: $0.12
     L2 execution: $0.002
     L1 data: $0.118
   ```

**Fallback:** If the L1 fee oracle is not available or the chain does not have a separate L1 fee, show a single "Network fee" line without breakdown.

**Error state:**
- Oracle call fails: Show total estimated fee without breakdown. Add "(breakdown unavailable)" note.

---

### 5. High Gas Warning

**When:** Estimated gas cost exceeds a reasonable threshold relative to the transaction value.

**How:**
1. After estimating gas (Pattern 2), compare fee to transaction value:
   - If fee > 10% of transaction value: show a warning.
   - If fee > 50% of transaction value: show a strong warning.
   - If fee > transaction value: show a blocking warning (require explicit confirmation).
2. Also warn on absolute spikes: compare current gas price to a 1-hour rolling average. If current price is >2x the average, warn about network congestion.
3. Warning display:
   - Mild: "Network fees are higher than usual. Fee: $4.20"
   - Strong: "Warning: The fee ($12.50) is more than half the transaction value ($20.00)."
   - Blocking: "The fee ($45.00) exceeds the transaction value ($30.00). Are you sure you want to proceed?"

**Getting baseline gas price:**
Use `getFeeHistory` (viem) to get recent block fee data:
```
const feeHistory = await publicClient.getFeeHistory({
  blockCount: 10,
  rewardPercentiles: [25, 50, 75]
})
```
Compare current `maxFeePerGas` against the median of recent blocks.

**Fallback:** If fee history is unavailable, skip the congestion comparison. Still apply the fee-to-value ratio check.

**Error state:** N/A (this is a warning display). The user can always choose to proceed.

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Current gas pricing data and L2 cost comparison**: [ethskills.com/gas/SKILL.md](https://ethskills.com/gas/SKILL.md)
- **Account abstraction and paymaster setup**: [ethskills.com/wallets/SKILL.md](https://ethskills.com/wallets/SKILL.md)
- **Scaffold-ETH orchestration for paymasters**: [ethskills.com/orchestration/SKILL.md](https://ethskills.com/orchestration/SKILL.md)
