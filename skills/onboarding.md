---
title: "Onboarding"
description: "Progressive backup disclosure, jargon-free UI, simple/advanced modes, crypto-specific i18n, and progressive disclosure."
standards: ["BIP-39"]
patterns: 5
---

# Onboarding

**Scope:** First-run user experience: wallet creation, recovery phrase backup, jargon-free UI, simple/advanced modes, crypto-specific i18n, and progressive disclosure.
**Does NOT cover:** Wallet connection for users with existing wallets (see [wallets.md](./wallets.md)), gas/fee handling (see [gas.md](./gas.md)), transaction signing flows (see [signing.md](./signing.md)).
**Cross-references:** [wallets.md](./wallets.md) (embedded wallet patterns), [_shared.md](./_shared.md) (error formatting, loading labels).

## ALWAYS

- ALWAYS let users perform their first action before introducing wallet concepts. Value first, education second.
- ALWAYS write UI text at a 6th-grade reading level. No jargon, no abbreviations without explanation.
- ALWAYS provide keyboard navigation and screen reader support for every interactive element.
- ALWAYS show one concept per screen. Do not combine wallet backup, network selection, and token info on a single page.
- ALWAYS test with users who have never used crypto. Internal team testing is not sufficient.

## NEVER

- NEVER show a 12-word seed phrase as the first step of onboarding. Users do not understand its importance yet.
- NEVER use the words "gas", "nonce", "wei", "gwei", "hash", "hex", "signing", or "seed phrase" in default UI mode without a plain-language equivalent.
- NEVER require users to understand blockchain concepts to complete basic tasks.
- NEVER auto-play tutorials or show multi-step onboarding wizards before the user has tried anything.
- NEVER gate core functionality behind wallet setup completion. Let users browse, simulate, and learn before committing.
- NEVER pre-select "unlimited" or "maximum" options for approvals, slippage, or fees. Always default to the safest/most conservative option.
- NEVER use urgency language in onboarding: "Limited time," "Act now," "Don't miss out." Crypto is already anxiety-inducing.
- NEVER make the "Learn more" or "I need help" path feel like a detour. It should be a first-class experience, not a tooltip buried in a corner.
- NEVER gate the simple mode behind an "Are you sure?" confirmation. Switching modes should be instant and judgment-free.
- NEVER show a "success" state for a submitted-but-unconfirmed transaction. Show "Processing..." until the transaction is included in a block (see [_shared.md](./_shared.md) Post-Action Confirmation).
- NEVER auto-redirect the user away from a confirmation screen. Let them stay until they choose to navigate away.

## Patterns

### 1. Delayed Recovery Phrase Backup

**When:** User creates a new wallet (embedded or standalone) within your app.

**How:**
1. Create the wallet using your wallet SDK. Store the key material in a secure enclave, passkey-protected storage, or encrypted backend. NEVER store keys in localStorage, cookies, or any client-readable storage (see [wallets.md](./wallets.md) NEVER rules).
2. Do NOT show the recovery phrase during creation. Let the user skip straight to using the app.
3. Track the wallet's total value. Set a threshold (e.g., $10 USD equivalent) for triggering the backup prompt.
4. When the threshold is met, show a non-blocking notification:
   - "Your account holds [amount]. Set up a backup so you never lose access."
   - Provide a "Back up now" button and a "Remind me later" option.
5. The backup flow:
   - Show the recovery phrase one word at a time or in groups of 4.
   - Require verification: ask the user to select words 3, 7, and 11 from a shuffled list.
   - Confirm: "Your backup is complete. You can recover this wallet anywhere."
6. Also offer alternative backup methods if your architecture supports them:
   - Cloud backup (encrypted keystore to iCloud/Google Drive)
   - Social recovery (guardian addresses)
   - Passkey-based recovery

**Fallback:** If the user never reaches the threshold, remind them periodically (weekly, non-blocking) with diminishing frequency. After 3 dismissals, stop reminding and rely on a settings-page backup option.

**Error state:**
- Verification failed: "Let's try that again. Take another look at your backup words. If you're having trouble, you can view the phrase again." Include a "Show phrase again" button. After 3 failed attempts: "Having trouble? Your phrase is still safe. You can try this verification again anytime from Settings. Your wallet continues to work normally."
- User loses phrase before backing up: If you store an encrypted backup, offer account recovery through your backend. If not, the funds are at risk. This is why alternative backup methods matter.

---

### 2. Jargon Replacement

**When:** Writing any user-facing text in the application.

**How:**
1. Maintain a terminology map and apply it globally through your i18n/string system:

| Crypto term | Plain language |
|---|---|
| Transaction | Payment / Transfer |
| Sign / Signing | Confirm / Approve |
| Gas fee | Network fee |
| Wallet address | Account / Your address |
| Seed phrase / Mnemonic | Recovery phrase / Backup words |
| Block confirmation | Processing |
| Nonce | (omit entirely in simple mode) |
| Smart contract | App / Service |
| Token | Asset / Coin |
| Approve (ERC-20) | Give permission |
| Revoke | Remove permission |
| Slippage | Price change tolerance |
| Liquidity | Available funds |

2. Apply this in code by abstracting all user-facing strings through a string constants file or i18n framework. Never hardcode crypto jargon in component JSX/HTML.
3. In advanced mode, show the technical term in parentheses: "Network fee (gas)".
4. Error messages MUST also go through jargon replacement. See [_shared.md](./_shared.md) Error Jargon Translation Table for the full mapping. Common examples: "Execution reverted" becomes "Transaction failed", "User rejected transaction" becomes "You cancelled the transaction."

**Fallback:** If a term has no good plain equivalent, provide a tooltip: hover/tap shows a one-sentence explanation.

**Error state:** N/A (this is a content pattern).

---

### 3. Simple / Advanced Mode Toggle

**When:** App has features that serve both beginners and power users.

**How:**
1. Default to simple mode for all new users. Persist the preference in local storage.
2. Simple mode hides:
   - Nonce editing
   - Gas price/limit manual input
   - Hex data fields
   - Raw transaction details
   - Advanced slippage settings (use a safe default like 0.5%)
   - Contract addresses (show names instead)
3. Advanced mode reveals:
   - Full transaction details with calldata
   - Custom gas settings (base fee, priority fee, gas limit)
   - Nonce override field
   - Token contract addresses
   - Block explorer links for every transaction
   - Network RPC configuration
4. Place the toggle in Settings, not on every screen. The mode should be global.
5. On first toggle to advanced, show a brief note: "Advanced mode shows technical details. You can switch back anytime."

**Implementation pattern:**
```
// Context provider wrapping the app
const UIModeContext = createContext('simple')

// In components:
const mode = useContext(UIModeContext)
{mode === 'advanced' && <NonceField />}
{mode === 'advanced' && <GasCustomizer />}
```

**Fallback:** If the user is in simple mode and encounters an error that requires advanced info (e.g., a nonce issue), temporarily surface the relevant advanced field with an explanation: "This transaction needs a manual adjustment. [explanation]."

**Error state:** N/A (this is a UI mode pattern).

---

### 4. Crypto-Specific Internationalization

**When:** Handling multilingual content in crypto contexts where standard i18n knowledge is insufficient.

**How:**
1. For BIP-39 seed phrases: the BIP-39 standard includes wordlists in English, Japanese, Korean, Spanish, Chinese (Simplified and Traditional), French, Italian, and Czech. Display the recovery phrase in the user's language if a wordlist is available.
2. Use ICU MessageFormat for pluralization. NEVER use ternary logic for plurals (`count === 1 ? "token" : "tokens"`). This breaks for languages with complex plural rules (Arabic has 6 plural forms, Polish and Russian have 3+).
3. Token amounts, gas fees, and fiat conversions must be formatted per locale using `Intl.NumberFormat`. Do not hardcode comma/period separators.
4. Support at minimum: English, Spanish, Chinese (Simplified), Arabic, Portuguese. These cover the largest crypto user populations.

**Error state:** N/A (design pattern).

---

### 5. Progressive Disclosure

**When:** Designing any screen with more than 3 pieces of information or actions.

**How:**
1. **First layer (always visible):** The one thing the user came to do. On a swap page: token pair, amount input, swap button.
2. **Second layer (expandable):** Settings and details. Slippage tolerance, route info, fee breakdown. Hidden behind a "Details" toggle or accordion.
3. **Third layer (on demand):** Technical and advanced data. Transaction calldata, contract addresses, nonce. Only in advanced mode (Pattern 3) or via a "Technical details" link.
4. Apply the same principle to errors:
   - First layer: "Transaction failed."
   - Second layer (expandable): "The swap could not complete because the price moved beyond your tolerance."
   - Third layer (copy-able): Full error message and transaction hash for support.
5. For onboarding screens: show one concept per step. Use a stepper/progress bar. Allow skipping non-essential steps.
6. On any primary action screen, include a contextual help link: "How does this work?" that expands a 2-3 sentence explanation inline (not a new page). Collapse by default. Track whether the user has read it and suppress the trigger after 5 uses of the feature.

**Implementation principle:** Default state should always be the simplest. Complexity is opt-in.

**Fallback:** If progressive disclosure hides a critical action or error, surface it. Safety-critical information (warnings, loss-of-funds risks) must always be on the first layer.

**Error state:** N/A (design pattern).

---

## Implementation Resources

This skill covers UX patterns -- what the user should see and experience. For implementation-level guidance:

- **Wallet creation and key management**: [ethskills.com/wallets/SKILL.md](https://ethskills.com/wallets/SKILL.md)
- **Smart contract security for embedded wallets**: [ethskills.com/security/SKILL.md](https://ethskills.com/security/SKILL.md)
