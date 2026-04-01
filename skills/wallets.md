---
title: "Wallet Connection"
description: "EIP-6963 multi-wallet discovery, mobile deep linking, session persistence, embedded wallets, and WalletConnect fallback."
standards: ["EIP-6963", "EIP-7702", "WalletConnect v2"]
patterns: 5
---

# Wallet Connection

**Scope:** Wallet discovery (EIP-6963), connection flows, mobile deep linking, session persistence, embedded/smart wallets, and WalletConnect fallback.
**Does NOT cover:** Transaction signing (see [signing.md](./signing.md)), gas handling (see [gas.md](./gas.md)), multi-chain network switching (see [multichain.md](./multichain.md)).
**Cross-references:** [onboarding.md](./onboarding.md) (new user flows), [safety.md](./safety.md) (ENS resolution, address display), [_shared.md](./_shared.md) (loading states, address display standards, error formatting).

## ALWAYS

- ALWAYS use EIP-6963 for wallet discovery. It is the modern standard and avoids provider conflicts.
- ALWAYS show all detected wallets, not just a hardcoded list.
- ALWAYS persist the last connected wallet and auto-reconnect on return visits.
- ALWAYS show connection state clearly: connected (with address), connecting (with spinner), disconnected.
- ALWAYS provide a disconnect option in the UI.
- ALWAYS resolve ENS names for the connected account. Display the ENS name as primary (e.g., "vitalik.eth") with the truncated address as secondary (e.g., "0xd8dA...6045"). Use `useEnsName` (wagmi) or `getEnsName` (viem). Also resolve the ENS avatar if available. See [safety.md](./safety.md) Pattern 2 for full ENS resolution details and [_shared.md](./_shared.md) Address Display Standards.

## NEVER

- NEVER show "Install MetaMask" as the default when no wallet is detected. Instead, show all options including WalletConnect and embedded wallets.
- NEVER assume `window.ethereum` is a specific wallet. Multiple wallets can inject into this namespace.
- NEVER force a page reload after wallet connection or disconnection.
- NEVER store private keys, seed phrases, or signing capabilities in localStorage, cookies, or any client-side storage (embedded wallet keys must use secure enclaves or encrypted backend storage).
- NEVER keep a stale connection. If the wallet is disconnected externally, detect it and update UI immediately.
- NEVER auto-connect to the first wallet detected. Always let the user choose, even if only one wallet is available.
- NEVER show wallet addresses without truncation in primary UI. Use format: "0xd8dA...6045" (first 6 + last 4 characters). See [_shared.md](./_shared.md) Address Display Standards.
- NEVER clear the user's application state (favorites, settings, preferences) on wallet disconnect. Only clear wallet-specific data (balances, transaction history, connection info).

## Patterns

### 1. EIP-6963 Multi-Wallet Discovery

**When:** Displaying the wallet connection modal. This replaces the old `window.ethereum` detection pattern.

**How:**
1. EIP-6963 uses a browser event-based discovery system. Wallets announce themselves via `eip6963:announceProvider` events. With wagmi v2+, use `injected()` connector and `useConnectors` to get discovered wallets with their names and icons.
2. Display all discovered wallets sorted by: recently used first, then alphabetically. Each entry gets a click handler calling `useConnect` with the specific connector.

**Without wagmi (manual implementation):**
```
// Listen for wallet announcements
window.addEventListener('eip6963:announceProvider', (event) => {
  const { info, provider } = event.detail
  // info: { uuid, name, icon, rdns }
  addWalletToList(info, provider)
})

// Request announcements from all installed wallets
window.dispatchEvent(new Event('eip6963:requestProvider'))
```

**Connection loading state:**
The "connecting" state must show: the wallet name and icon, a spinner or pulsing animation, the text "Connecting to [wallet name]...", and a "Cancel" button. If connecting takes more than 5 seconds: "Taking longer than expected. Make sure [wallet name] is unlocked." If connecting takes more than 15 seconds: "Connection timed out. Try again or choose a different wallet." with a "Try again" button. (See [_shared.md](./_shared.md) Loading Labels.)

**Fallback:** If no EIP-6963 wallets are detected (older wallets), check `window.ethereum` as legacy fallback. Show it as "Browser Wallet" if the wallet name cannot be determined. Additionally, always show WalletConnect as an option (Pattern 5).

**Error state:**
- No wallets detected: Show embedded wallet option (Pattern 4) and WalletConnect (Pattern 5). Add a "What is a wallet?" link for new users.
- Connection rejected: "Connection cancelled. Tap to try again."

---

### 2. Mobile Deep Linking

**When:** User taps "Connect" from a mobile browser (not inside a wallet's in-app browser).

**How:**
1. Detect mobile environment: check `navigator.userAgent` or use a library like `ua-parser-js`.
2. For each wallet in your connection list, define its deep link scheme:
   - Universal links (preferred): `https://wallet-app.com/wc?uri=[encoded_wc_uri]`
   - Custom scheme: `walletapp://wc?uri=[encoded_wc_uri]`
3. When user taps a wallet on mobile:
   - Generate a WalletConnect pairing URI.
   - Redirect to the wallet's deep link with the pairing URI encoded as a parameter.
   - The wallet app opens, shows the connection request, and user approves.
   - Control returns to the browser with the session established.
4. For wallets that support universal links, prefer those over custom schemes (they have better fallback behavior if the app is not installed).

**Implementation flow:**
```
On mobile:
  1. User taps wallet icon
  2. Generate WC pairing URI
  3. window.location.href = `${walletDeepLink}?uri=${encodeURIComponent(wcUri)}`
  4. Wallet opens, user approves
  5. Callback via WalletConnect relay
```

**Fallback:** If deep linking fails (app not installed), the OS will show an error or redirect to a store page. Detect this with a timeout: if the page is still visible after 2 seconds, the deep link did not work. Show: "Could not open [wallet name]. Make sure it's installed, or try WalletConnect QR code instead."

**Error state:**
- Deep link timeout: Show QR code as alternative.
- User returns without connecting: Keep the connect modal open with a "Try again" option.

---

### 3. Session Persistence and Auto-Reconnect

**When:** User returns to the dapp after previously connecting.

**How:**
1. Wagmi handles session persistence automatically. If building without wagmi: persist the connector ID (not the account address) in localStorage and attempt silent reconnection on page load.
2. Listen for account and chain changes:
   - `accountsChanged`: immediately update the displayed address and ENS name in the header, clear all cached balance data and re-fetch, clear any pending transaction state (unsigned transactions from the old account are invalid), and show a brief notification: "Switched to [truncated address or ENS name]." If the user was mid-flow (e.g., halfway through a multi-step transaction), warn: "Your account changed. The current operation has been cancelled because it was started with a different account."
   - `chainChanged`: update chain indicator, re-fetch chain-specific data.
   - `disconnect`: clear session, show disconnected state.
5. When the user returns to a tab that has been inactive for more than 5 minutes: re-check wallet connection state, refresh balances, refresh gas estimates, and invalidate any pending transaction simulations. Do this silently if everything is fine.

**Disconnect UX:**
When the user clicks "Disconnect": if they have no pending operations, disconnect immediately and show "Wallet disconnected." If they have pending transactions or are mid-flow, show: "You have a pending transaction. Disconnecting will cancel it. Disconnect anyway?" Buttons: "Disconnect" / "Stay connected".

**Fallback:** If auto-reconnect fails silently, show the disconnected state without an error. The user simply taps "Connect" again.

**Error state:**
- Stale session: Clear stored data and show connect button. No error message needed.
- Wallet locked: "Your wallet is locked. Please unlock it to reconnect."

---

### 4. Embedded / Smart Wallets for New Users

**When:** A new user visits your dapp and has no wallet installed. This is the zero-friction onboarding path.

**How:**
1. For consumer-facing dapps targeting new users: offer "Continue with email" or "Continue with Google" as the top option in the connect modal, above external wallet options. For crypto-native dapps where users are expected to have wallets, prioritize the wallet list instead.
2. Under the hood, create an embedded smart wallet:
   - Generate a key pair. Store the private key in a secure enclave, passkey, or encrypted backend.
   - Deploy a smart account contract on the user's first transaction (not at signup). Use CREATE2 for deterministic addressing (see multichain skill).
   - The account is an EIP-4337 smart account or EIP-7702 delegated EOA.
3. The user interacts with your app as if they have a normal wallet, but with no install, no extension, no seed phrase.
4. Provide an upgrade path:
   - "Export wallet" option in settings that reveals the private key or recovery phrase.
   - "Connect external wallet" option to link an existing wallet as a guardian or new owner.
   - Social recovery setup for users who want security without managing keys.
5. Use paymasters (gas skill) to sponsor gas for embedded wallet users. They should not need to acquire ETH.

**Decision tree:**
```
Does the user have a wallet?
  YES (EIP-6963 detected) -> Show wallet list (Pattern 1)
  NO -> Show "Continue with email/social" as primary option
        -> Show "I have a wallet" as secondary option
        -> Show "What is a wallet?" educational link
```

**Fallback:** If embedded wallet creation fails (backend issue), fall back to WalletConnect + wallet download links.

**Error state:**
- Account creation failed: "We couldn't set up your account. Please try again or connect an existing wallet."
- Key storage failed: Do not proceed. Show: "Secure storage is not available on this device. Please try a different browser or connect an external wallet."

---

### 5. WalletConnect v2 Fallback

**When:** User's wallet is not detected via EIP-6963, or user is on a different device than their wallet.

**How:**
1. Include `walletConnect({ projectId })` as a connector in your wagmi config alongside `injected()`.
2. When selected, display a QR code that the user scans with their mobile wallet.
3. On mobile: instead of QR, use deep linking (Pattern 2) to open the wallet app directly.
4. Show connection status: "Waiting for wallet connection..." with a timeout.
5. After connection, the session persists across page reloads via WalletConnect's relay.

**Fallback:** If WalletConnect relay is unreachable (rare), show: "Connection service unavailable. Please try connecting directly or refreshing the page."

**Error state:**
- QR expired (5 min timeout): "This code has expired." Auto-generate a new one.
- Pairing failed: "Could not connect. Make sure your wallet supports WalletConnect and try again."
- Session dropped: Detect via heartbeat. Show: "Wallet disconnected." with reconnect button.

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **RPC providers and chain configuration**: [ethskills.com/tools/SKILL.md](https://ethskills.com/tools/SKILL.md)
- **Wallet and account abstraction details**: [ethskills.com/wallets/SKILL.md](https://ethskills.com/wallets/SKILL.md)
- **L2 chain selection**: [ethskills.com/layer2s/SKILL.md](https://ethskills.com/layer2s/SKILL.md)
