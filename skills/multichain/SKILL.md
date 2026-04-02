---
name: multichain
description: "Multi-chain UX patterns for Ethereum dApps: unified cross-chain balances, automatic network switching, chain-aware address validation (ERC-7930), intent-based cross-chain transfers (ERC-7683), and consistent smart account addresses via CREATE2. Use this skill whenever building or reviewing ANY multi-chain feature, cross-chain transfer, bridge UI, network switching flow, or aggregated balance view — even if the user just mentions 'multi-chain', 'cross-chain', 'bridge', 'network switch', or 'L2'."
---

# Multi-Chain

**Scope:** Multi-chain UX: aggregated balances, network switching, chain-aware address validation, cross-chain transfers (ERC-7683), and consistent smart account addresses.
**Does NOT cover:** Single-chain transaction signing (see [signing](../signing/SKILL.md)), gas estimation per chain (see [gas](../gas/SKILL.md)), wallet connection (see [wallets](../wallets/SKILL.md)).
**Cross-references:** [safety](../safety/SKILL.md) (address validation, ENS resolution), [shared](../../SKILL.md) (loading labels, address display standards, error formatting).

## ALWAYS

- ALWAYS show the user's total balance across all supported chains as the default view.
- ALWAYS label which chain each asset is on. Aggregation does not mean hiding chain information.
- ALWAYS handle network switching automatically when the user initiates a chain-specific action.
- ALWAYS validate that addresses are correct for the target chain before sending.
- ALWAYS show the source chain and destination chain clearly during cross-chain operations.

## NEVER

- NEVER require the user to manually switch networks in their wallet via settings. Handle it in-app.
- NEVER display a single-chain balance as if it were the total. Users lose trust when "hidden" balances appear after switching.
- NEVER send transactions to a chain the user did not intend. Always confirm the target chain.
- NEVER assume an address on one chain is valid/reachable on another chain without verification.
- NEVER show a cross-chain transfer as instant if it requires finality time. Show realistic timing.
- NEVER show a cross-chain transfer as a single "Send" button without clearly labeling it as a bridge/transfer. Users must understand their tokens are moving between networks.
- NEVER show estimated bridge times as exact ("3 minutes"). Always use ranges or "approximately" language.
- NEVER hide the chain indicator. The user must always be able to see which chain they are currently connected to, in the persistent UI (header/nav), not just in a modal.

## Patterns

### 1. Unified Cross-Chain Balances

**When:** App loads or wallet connects. User should see all their assets across supported chains.

**How:**
1. Show shimmer placeholders per chain. Populate each chain's balance individually as it resolves. Do not wait for all chains before showing any data.
2. Fetch native balances in parallel with `getBalance` per chain. For ERC-20 balances, use `multicall` to batch `balanceOf` calls. When the wallet supports `wallet_getAssets` (EIP-7811), prefer that as primary and use multicall as fallback.
3. Aggregate results into a unified view:
   - Group by token (e.g., "USDC: $1,200 total" with breakdown by chain on expand)
   - Sort by total USD value descending
   - Show chain icons next to each sub-balance

**Multicall pattern for token balances:**
```
const results = await publicClient.multicall({
  contracts: tokenAddresses.map(token => ({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress]
  }))
})
```

**Fallback:** If a chain's RPC is unreachable, show balances for available chains with a note: "[Chain name] balance unavailable. Retrying..." Do not block the entire view because one chain is slow.

**Error state:**
- All RPCs fail: "Unable to load balances. Check your internet connection."
- Partial failure: Show available balances with a "[N] chains unavailable" indicator that the user can expand.

---

### 2. Automatic Network Switching

**When:** User clicks an action that targets a different chain than currently connected (e.g., clicking "Stake on Arbitrum" while connected to mainnet).

**How:**
1. Before submitting, check current chain. If mismatched, call `useSwitchChain` (wagmi) or `wallet_switchEthereumChain`.
2. If the chain is not yet added to the wallet:
   - Catch the `4902` error code ("Unrecognized chain ID").
   - Call `wallet_addEthereumChain` with the chain parameters (name, RPC URLs, block explorer, native currency).
   - After adding, retry the switch.
3. Once the switch confirms, proceed with the transaction.
4. Show a brief inline notification: "Switched to [chain name]" rather than a modal.

**ERC-7828 chain-specific addressing:**
If supported, use chain-specific address format in your UI so users see which chain an action targets:
```
Format: address@chainShortName
Example: 0xd8dA...6045@base
```
This makes chain context visible in the address itself.

**Fallback:** If the wallet does not support programmatic switching (rare in modern wallets), show: "Please switch to [chain name] in your wallet settings to continue."

**Error state:**
- User rejected switch: "Network switch cancelled. Switch to [chain name] to complete this action."
- Chain add failed: "Could not add [chain name] to your wallet. You may need to add it manually."

---

### 3. Chain-Specific Address Validation (ERC-7930)

**When:** User enters or selects a recipient address for a transfer, especially cross-chain.

**How:**
1. Parse the input address. Check if it includes chain context (ERC-7930 format or `@chain` suffix).
2. Validate the base address format:
   - Ethereum-style: 42-character hex starting with `0x`. Apply ERC-55 mixed-case checksum validation.
   - If checksum fails: "This address has an invalid checksum. Please verify you copied it correctly."
3. If this is a cross-chain send, verify the address type on the destination chain:
   - Call `getCode` on the destination chain to check if the address is a contract or EOA.
   - If contract: verify it exists on the target chain (bytecode is not empty).
   - If EOA: it is valid on any EVM chain (same private key controls it everywhere).
4. For smart contract wallets: verify the wallet is deployed on the target chain. If not, warn: "This smart wallet is not deployed on [chain]. Funds sent here may be inaccessible."

**Decision tree:**
```
Is the recipient a contract (getCode returns non-empty)?
  YES -> Is it deployed on the TARGET chain?
    YES -> Proceed
    NO  -> WARN: "This contract does not exist on [target chain]. Funds may be lost."
  NO (EOA) -> Proceed (EOAs work on all EVM chains)
```

**Fallback:** If `getCode` call fails, show a caution note: "Could not verify this address on [chain]. Double-check before sending."

**Error state:**
- Invalid address format: "This doesn't look like a valid address. Check for typos."
- Checksum mismatch: "Address checksum is invalid. Make sure you copied the full address correctly."

---

### 4. Intent-Based Cross-Chain Transfers (ERC-7683)

**When:** User wants to move assets from Chain A to Chain B without manually bridging.

**How:**
1. User specifies: source token, amount, destination chain, and (optionally) destination token.
2. Build a `CrossChainOrder` struct per ERC-7683:
   - `originSettler`: your app's settler contract on the source chain
   - `originChainId`: source chain
   - `destinationChainId`: target chain
   - `fillDeadline`: timestamp by which the order must be filled
   - `orderData`: encoded transfer details (tokens, amounts, recipient)
3. User signs the order (EIP-712 typed data) on the source chain.
4. Submit the signed order to your settler contract via `initiate()`.
5. A solver/filler picks up the order, executes on the destination chain, and proves fill on the source chain.
6. Show progress:
   - "Order submitted. Waiting for a solver..." (typically seconds)
   - "Transfer in progress. [source chain] -> [dest chain]"
   - "Complete. [amount] [token] received on [dest chain]."
7. Display estimated completion times for common routes:
   - L2 to L2 (same settlement layer): "Usually under 2 minutes"
   - L1 to L2: "Usually under 5 minutes"
   - L2 to L1 (standard withdrawal): "Takes approximately 7 days for standard withdrawal. Use a fast bridge for approximately 15 minutes."
   - Show a progress indicator: "Estimated: ~[X] minutes remaining"
8. Show post-action confirmation after the transfer completes (see [shared](../../SKILL.md) Post-Action Confirmation).

**Fallback:** If no solver fills the order before the deadline:
- The user's funds are returned (the order expires).
- Show: "Transfer was not completed within the time limit. Your funds have not left your wallet. You can try again or use a different route."

If ERC-7683 infrastructure is not available, fall back to a manual bridge recommendation with clear instructions.

**Error state:**
- Order creation failed: "Could not create the transfer order. [reason]"
- Solver timeout: "No solver picked up your transfer. This can happen during low activity. Your funds are safe. Try again or increase the transfer amount."
- Fill verification failed: "Transfer completed on [dest chain] but verification is pending. Your funds should arrive shortly."

---

### 5. Consistent Smart Account Addresses via CREATE2

**When:** Your app deploys smart accounts for users and needs the same address on every chain.

**How:**
1. Use `CREATE2` for smart account deployment. CREATE2 computes the address deterministically from: deployer address, salt, and init code hash.
2. Use a salt derived from the user's identifier (e.g., their EOA address) so the same input always produces the same account address on every chain.
3. Your factory contract must be at the same address on all supported chains (achieved via CREATE2 deployment, which is a backend/deployment concern outside this skill's scope).
4. Pre-compute the smart account address using `getContractAddress` (viem) with `opcode: 'CREATE2'`.
5. Show the user this address even before deploying on any chain: "Your account: 0x...1234 (same on all networks)." Display according to [shared](../../SKILL.md) Address Display Standards.
6. Deploy lazily on the user's first transaction per chain. While deploying, show: "Setting up your account on [chain name]..." Do not require the user to manually trigger deployment.

**Fallback:** If the factory is not yet deployed on a particular chain, deploy it first (or show "This network is not yet supported. Your address will be the same once we add support.").

**Error state:**
- Address mismatch after deployment: This indicates a bug (init code or salt differ). Do not proceed. Log the error and show: "Account deployment error. Please contact support." This should never happen in production.
- Factory not deployed on chain: "Your smart account is not yet available on [chain]. It will be set up automatically on your first transaction there."

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Verified contract addresses across chains**: [ethskills.com/addresses/SKILL.md](https://ethskills.com/addresses/SKILL.md)
- **L2 landscape and bridging infrastructure**: [ethskills.com/layer2s/SKILL.md](https://ethskills.com/layer2s/SKILL.md)
- **Cross-chain standards (ERC-7683)**: [ethskills.com/standards/SKILL.md](https://ethskills.com/standards/SKILL.md)
