---
name: ethux-design
description: "Ethereum dApp UX patterns and implementation guidance. Routes to domain-specific skills for token approvals, transaction signing, gas/fees, multi-chain, onboarding, wallet connection, safety, and shared cross-cutting patterns. Use this skill whenever building, reviewing, or designing ANY Ethereum dApp UI — it will point you to the right detailed skill for your task."
---

# EthUX Design

UX patterns and implementation guidance for Ethereum dApps, sourced from 32,000+ community reports of real user pain points.

**Base URL:** `https://ethux.design`
**Local path:** `skills/` (relative to this file)

All skill paths below are given relative to this file's location. If fetching from the web, prepend `https://ethux.design/`. If reading locally, use the path as-is.

---

## Skills

| Skill | Path | Use when building... |
|-------|------|---------------------|
| **Token Approvals** | [`skills/approvals/SKILL.md`](skills/approvals/SKILL.md) | ERC-20 approve flows, Permit2 gasless signatures, EIP-5792 batched approve+action, approval display, revocation UI |
| **Transaction Signing** | [`skills/signing/SKILL.md`](skills/signing/SKILL.md) | EIP-712 typed data, human-readable tx summaries, simulation/preview, multi-step progress, SIWE (EIP-4361) |
| **Gas & Fees** | [`skills/gas/SKILL.md`](skills/gas/SKILL.md) | Fee display in fiat, paymaster sponsorship (ERC-7677), ERC-20 gas payment, L1/L2 fee breakdowns, high-gas warnings |
| **Multi-Chain** | [`skills/multichain/SKILL.md`](skills/multichain/SKILL.md) | Cross-chain balances, automatic network switching, chain-aware address validation, ERC-7683 intents, CREATE2 addresses |
| **Onboarding** | [`skills/onboarding/SKILL.md`](skills/onboarding/SKILL.md) | First-run experience, delayed recovery backup, jargon replacement, simple/advanced modes, i18n |
| **Wallet Connection** | [`skills/wallets/SKILL.md`](skills/wallets/SKILL.md) | EIP-6963 discovery, mobile deep linking, session persistence, embedded/smart wallets, WalletConnect v2 |
| **Safety & Security** | [`skills/safety/SKILL.md`](skills/safety/SKILL.md) | Risk-tiered warnings, ENS resolution, ERC-55 checksum validation, spam token filtering, safe send-max |
---

## Routing Guide

**Start here.** Match your task to a skill, then read that skill's SKILL.md for patterns, code, and decision trees.

### By user action
- User connects wallet → **Wallet Connection**
- User sees balances across chains → **Multi-Chain**
- User approves token spending → **Token Approvals**
- User signs or sends a transaction → **Transaction Signing**
- User sees fees or gas costs → **Gas & Fees**
- User encounters a warning or enters an address → **Safety & Security**
- User is new, first-run flow, or needs accessible UI → **Onboarding**

### By EIP/standard
| Standard | Skill |
|----------|-------|
| EIP-5792 (`wallet_sendCalls`) | Approvals, Gas |
| EIP-6963 (wallet discovery) | Wallets |
| EIP-712 (typed data signing) | Signing |
| EIP-4361 / SIWE | Signing |
| EIP-7702 (batch/delegation) | Signing, Wallets |
| ERC-7677 (paymaster) | Gas |
| ERC-7683 (cross-chain intents) | Multi-Chain |
| ERC-7930 (chain-specific addresses) | Multi-Chain |
| Permit2 / EIP-2612 | Approvals |
| ENS (EIP-137) | Safety |
| ERC-55 (checksum) | Safety |
| BIP-39 | Onboarding |

### Shared reference files (load only when needed)
These live under [`skills/shared/references/`](skills/shared/references/) and are pointed to by the skills that need them:

| Reference | Path | Needed for |
|-----------|------|-----------|
| EIP-5792 Capability Detection | [`skills/shared/references/eip5792.md`](skills/shared/references/eip5792.md) | Any `wallet_sendCalls` or batching flow |
| Stuck Transactions | [`skills/shared/references/stuck-transactions.md`](skills/shared/references/stuck-transactions.md) | Pending transaction status UI |
| Irreversibility Framing | [`skills/shared/references/irreversibility.md`](skills/shared/references/irreversibility.md) | Value-transfer or approval confirmation screens |

---

## Shared UX Patterns

These patterns apply across all skill files. Only non-obvious, Ethereum-specific patterns are included here. Standard UX practices (skeleton loading, empty states, accessibility, responsive design) are assumed knowledge.

### Loading Labels

Disable buttons and replace labels with context text during async operations:
- "Checking permissions..." (allowance lookup)
- "Estimating fee..." (gas estimation in progress)
- "Waiting for signature..." (wallet popup is open)
- "Confirming..." (transaction submitted, waiting for block inclusion)

NEVER show "$0.00" or "0" while calculating derived values (fiat conversion, swap output, gas estimates). Show "Estimating..." instead.

---

### Post-Action Confirmation

After every signature or transaction submission, show a confirmation state. NEVER move immediately to the next step or show nothing.

#### For on-chain transactions:
```
Transaction submitted. Waiting for confirmation...
Estimated wait: ~[X] seconds
[Transaction hash as truncated link to block explorer] [Copy button]
```

#### For off-chain signatures:
```
Signed successfully. [Next step description or completion message]
```

#### After transaction confirmation:
Show the actual fee paid alongside the estimate: "Fee: $0.08 (estimated $0.12)." This builds trust.

#### Rules:
- NEVER show a "success" state for a submitted-but-unconfirmed transaction. "Submitted" and "confirmed" are different states. Show "Processing..." until the transaction is included in a block.
- NEVER auto-redirect the user away from a confirmation screen. Let them stay until they choose to navigate away.
- NEVER describe a signature as "free" without qualification. Off-chain signatures are gasless but they DO authorize actions. Say "No network fee" instead of "Free."

---

### Error Message Formatting

Use three-tier progressive disclosure for all errors:

1. **First layer (always visible):** Plain-language summary. No jargon.
2. **Second layer (expandable):** More context and suggested action.
3. **Third layer (copy-able):** Full technical error, transaction hash, and raw message for support.

#### Error Jargon Translation Table

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

#### Rules:
- NEVER show raw Solidity error strings to end users in the primary display.
- NEVER show gas cost in scientific notation or with more than 6 decimal places. Format for readability: "$0.12" or "0.00004 ETH", never "4.2e-5 ETH".
- NEVER show "Fee: $0.00" for sponsored transactions without the "(sponsored)" label.

---

### Address Display Standards

- **Truncation:** `0x1234...5678` (first 6 + last 4 after 0x) for non-critical contexts. Show full address on send confirmations and approval targets.
- **ENS:** Show ENS name as primary, truncated address as secondary: `vitalik.eth (0xd8dA...6045)`. Use `useEnsName` (wagmi) or `getEnsName` (viem). Also resolve avatar.
- **Interactive:** Every displayed address must be copyable (click/tap) with "Copied!" feedback, and linked to the relevant block explorer.
