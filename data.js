// ===========================================
// EthUX Data Layer
// Pure content data, no logic.
// ===========================================

// ===========================================
// PROBLEM TAXONOMY
// ===========================================
const DATA = {
  categories: [
    { id:'getting-started', title:'User Onboarding', icon:'rocket', img:'images/onboard.png', color:'var(--cat-1)', hook:'Make the first 5 minutes effortless.', desc:'The moment someone decides to try Ethereum, a clock starts. Within five minutes, they will either complete their first action or leave permanently. These are the walls between curiosity and that first transaction.', problems:[
      { title:'The Gas Hurdle', severity:'critical', status:'in-progress', desc:'Users must buy and transfer ETH to their wallet before they can do almost anything. This multi-step onramp process creates a massive barrier for newcomers who just want to try their first transaction. Sponsoring initial transactions through paymasters is the most promising path forward.', solutions:[{name:'Paymasters (ERC-4337)',status:'Live',adoption:'3/10 wallets'},{name:'MetaMask Gas Station',status:'Live',adoption:'1/10 wallets'},{name:'EIP-7702 Delegation',status:'Live',adoption:'3/10 wallets'},{name:'SmolRefuel',status:'Live',adoption:'External tool'}], eips:['ERC-4337','EIP-7702','ERC-3009'], checklist:'gas' },
      { title:'English-Only Recovery Phrases', severity:'high', status:'unsolved', desc:'BIP-39 specifies wordlists for several languages, but virtually no wallet supports them. Over 75% of cryptocurrency users are non-native English speakers.', solutions:[{name:'BIP-39 multilingual wordlists',status:'Standard exists',adoption:'0/10 wallets'}], eips:['BIP-39'], checklist:'onboarding' },
      { title:'Forced Backup Friction', severity:'medium', status:'in-progress', desc:'New users are forced to back up their recovery phrase before even exploring the wallet. At this stage they have no funds and no motivation to safeguard keys.', solutions:[{name:'Smart accounts (skip phrase)',status:'In Progress',adoption:'3/10 wallets'},{name:'Delayed backup prompts',status:'Live',adoption:'4/10 wallets'}], eips:['ERC-4337','EIP-7702'], checklist:'onboarding' },
      { title:'Geographic Onramp Restrictions', severity:'high', status:'unsolved', desc:'Fiat onramps inside wallets rely on third-party providers that don\'t support many countries. Users in regions like Ethiopia face KYC rejection.', solutions:[{name:'P2P onramps',status:'Live',adoption:'Limited'},{name:'Local exchange partnerships',status:'Ongoing',adoption:'Regional'}], eips:[], checklist:'onboarding' },
      { title:'Inconsistent Recovery Phrase Terminology', severity:'info', status:'unsolved', desc:'"Seed phrase," "mnemonic," "secret key," "recovery phrase," and "secret recovery phrase" all refer to the same concept. This inconsistency confuses newcomers and undermines trust in the entire key management experience.', solutions:[{name:'Industry terminology standard',status:'None',adoption:'No standard exists'}], eips:[], checklist:'onboarding' }
    ]},
    { id:'transaction-clarity', title:'Transaction Clarity', icon:'eye', img:'images/transaction.png', color:'var(--cat-2)', hook:'Help users understand every transaction.', desc:'Every wallet transaction is a trust decision. Users are asked to approve things they can\'t read, in formats that obscure risk. These are the gaps between what the user sees and what actually happens. While the protocol requires no trust, every interface still does.', problems:[
      { title:'Blind Signing', severity:'critical', status:'in-progress', desc:'Users are prompted to approve transactions without a clear, human-readable summary. This is the leading enabler of phishing attacks.', solutions:[{name:'Transaction simulation',status:'Live',adoption:'5/10 wallets'},{name:'ERC-7730 clear signing',status:'Ongoing',adoption:'2/10 wallets'},{name:'EIP-712 typed data',status:'Live',adoption:'7/10 wallets'}], eips:['EIP-712','ERC-7730'], checklist:'signing' },
      { title:'Signing Fatigue', severity:'high', status:'in-progress', desc:'Users are constantly prompted with pop-ups asking them to "sign." The volume leads to rubber-stamping, creating massive security risks.', solutions:[{name:'EIP-5792 batched calls',status:'Final',adoption:'2/10 wallets'},{name:'Session keys',status:'Research',adoption:'Experimental'}], eips:['EIP-5792'], checklist:'signing' },
      { title:'Missing Signing Context', severity:'medium', status:'unsolved', desc:'When a user needs to sign multiple messages in a row, the wallet shows no context about how many signatures are needed.', solutions:[{name:'Multi-step signing UI',status:'None',adoption:'No standard exists'}], eips:[], checklist:'signing' },
      { title:'Redundant Token Approvals', severity:'high', status:'in-progress', desc:'Before users can swap or interact with most dapps, they must first "approve" the token in a separate transaction.', solutions:[{name:'EIP-5792 batched calls',status:'Final',adoption:'2/10 wallets'},{name:'Permit2',status:'Live',adoption:'6/10 dapps'},{name:'EIP-2612 permit',status:'Live',adoption:'4/10 dapps'}], eips:['EIP-5792','EIP-2612'], checklist:'approvals' },
      { title:'Token Approval Management', severity:'high', status:'in-progress', desc:'Users can\'t easily find, review, or revoke existing token approvals from within their wallet.', solutions:[{name:'Revoke.cash',status:'Live',adoption:'External tool'},{name:'In-wallet revocation',status:'In Progress',adoption:'2/10 wallets'}], eips:[], checklist:'approvals' },
      { title:'Blanket Warnings', severity:'medium', status:'unsolved', desc:'Wallets apply identical red warnings to all unlimited token approvals regardless of context.', solutions:[{name:'Contextual risk assessment',status:'Research',adoption:'No standard'},{name:'Reputation-based warnings',status:'In Progress',adoption:'Blockaid/Blowfish in ~4 wallets'}], eips:[], checklist:'safety' }
    ]},
    { id:'cross-chain', title:'Cross-chain Flow', icon:'chain', img:'images/crosschain.png', color:'var(--cat-3)', hook:'Make moving between chains invisible.', desc:'Ethereum now spans dozens of networks. Users see fragmented balances, manual chain switching, and bridges that feel like sending money into a void. The protocol solved scaling. The UX hasn\'t caught up.', problems:[
      { title:'Fragmented Asset View', severity:'critical', status:'in-progress', desc:'Users must manually switch networks to see their full balances. Portfolio tracking across chains requires cognitive overhead.', solutions:[{name:'Unified balance display',status:'Live',adoption:'6/10 wallets'},{name:'EIP-7811 unified balances',status:'Draft',adoption:'Draft EIP, no implementations'},{name:'Chain abstraction',status:'In Progress',adoption:'Testnet'}], eips:['EIP-7811'], checklist:'multichain' },
      { title:'Manual Network Switching', severity:'high', status:'in-progress', desc:'When a wallet is connected to chain A and the user wants chain B, they must manually switch.', solutions:[{name:'ERC-7828 chain-specific addresses',status:'Draft',adoption:'Draft, no wallet adoption'},{name:'Auto-switching dapps',status:'In Progress',adoption:'3/10 dapps'}], eips:['ERC-7828','EIP-3326'], checklist:'multichain' },
      { title:'Different L2 Addresses', severity:'high', status:'unsolved', desc:'Smart contract accounts are deployed per chain, risking different addresses on different L2s.', solutions:[{name:'CREATE2 deterministic addresses',status:'Live',adoption:'Limited'},{name:'Keystore rollups',status:'Research',adoption:'Conceptual'}], eips:['EIP-7701','EIP-8141'], checklist:'multichain' },
      { title:'Bridging Pain', severity:'critical', status:'in-progress', desc:'Bridging between chains is expensive for small amounts, slow, and anxiety-inducing.', solutions:[{name:'ERC-7683 cross-chain intents',status:'In Progress',adoption:'$22B+ via Across'},{name:'Native bridges',status:'Live',adoption:'Per-chain'}], eips:['ERC-7683'], checklist:'multichain' },
      { title:'Asset Fragmentation', severity:'high', status:'in-progress', desc:'Tokens scattered across chains create artificial friction.', solutions:[{name:'Intent-based protocols',status:'In Progress',adoption:'Growing'},{name:'Interop layer (EIL)',status:'In Progress',adoption:'Testnet live'}], eips:[], checklist:'multichain' }
    ]},
    { id:'safety', title:'Safety & Security', icon:'shield', img:'images/safety.png', color:'var(--cat-4)', hook:'Build trust through transparency and user control.', desc:'One bad experience, one lost transaction, and a user is gone for good. Solutions should empower user agency with transparent, controllable defenses rather than opaque restrictions users never opted into.', problems:[
      { title:'Prevalence of Scams', severity:'critical', status:'in-progress', desc:'Sophisticated phishing attacks and address poisoning cause thousands of victims monthly.', solutions:[{name:'Transaction simulation',status:'Live',adoption:'5/10 wallets'},{name:'Address poisoning detection',status:'In Progress',adoption:'3/10 wallets'},{name:'Wallet warnings',status:'Live',adoption:'7/10 wallets'}], eips:['ERC-7730'], checklist:'safety' },
      { title:'Sending to Wrong Address', severity:'critical', status:'in-progress', desc:'Addresses are cryptic hexadecimal strings with no human-readable identification.', solutions:[{name:'ENS support',status:'Live',adoption:'6/10 wallets'},{name:'Address book features',status:'Live',adoption:'5/10 wallets'},{name:'Transaction preview',status:'Live',adoption:'5/10 wallets'}], eips:['ENS (EIP-137)'], checklist:'safety' },
      { title:'Spam & Junk Tokens', severity:'medium', status:'in-progress', desc:'Users are airdropped random junk tokens and NFTs. Interacting with malicious tokens can trigger approval phishing.', solutions:[{name:'Token list curation',status:'Live',adoption:'7/10 wallets'},{name:'Spam filtering',status:'In Progress',adoption:'4/10 wallets'}], eips:[], checklist:'safety' }
    ]},
    { id:'mobile', title:'Mobile & Connectivity', icon:'phone', img:'images/mobile.png', color:'var(--cat-5)', hook:'Bring wallet connection up to mobile standards.', desc:'More than half of web traffic is mobile. Yet connecting a wallet from a phone browser remains one of the most broken flows in the ecosystem.', problems:[
      { title:'Connection Failures', severity:'high', status:'in-progress', desc:'When using multiple wallet extensions, it\'s a struggle to select the right one.', solutions:[{name:'EIP-6963 multi-wallet discovery',status:'Live',adoption:'8/10+ wallets'},{name:'WalletConnect v2',status:'Live',adoption:'Nearly universal'}], eips:['EIP-6963'], checklist:'wallets' },
      { title:'Mobile Connection Dance', severity:'critical', status:'unsolved', desc:'On mobile, dapp links open in the default browser instead of the in-wallet browser. Multi-step dance to connect.', solutions:[{name:'Deep linking standards',status:'In Progress',adoption:'3/10 wallets'},{name:'In-wallet browsers',status:'Live',adoption:'Limited'}], eips:[], checklist:'wallets' },
      { title:'Mobile Apps Don\'t Respond', severity:'high', status:'unsolved', desc:'Mobile wallets often simply don\'t respond to signals from connected dapps.', solutions:[{name:'Improved mobile SDKs',status:'Ongoing',adoption:'No standard'}], eips:[], checklist:'wallets' },
      { title:'Wallet Lock-in', severity:'medium', status:'unsolved', desc:'Choosing the wrong wallet can lock users into a single ecosystem.', solutions:[{name:'Portable account standards',status:'Research',adoption:'Conceptual'},{name:'Better wallet comparison',status:'In Progress',adoption:'ethereum.org'}], eips:['EIP-7702'], checklist:'wallets' }
    ]},
    { id:'language', title:'Accessibility', icon:'globe', img:'images/accessibility.png', color:'var(--cat-6)', hook:'Open the door for 75% of non-English speakers.', desc:'Over 75% of cryptocurrency users are non-native English speakers. Most dapps are English-only, jargon-heavy, and fail basic accessibility standards. This is the largest unaddressed audience in the ecosystem.', problems:[
      { title:'Inscrutable Jargon', severity:'critical', status:'unsolved', desc:'The entire space is filled with unexplained technical terms: staking, smart contract, liquidity pool, private key, gas.', solutions:[{name:'Industry glossary standard',status:'None',adoption:'No standard'},{name:'UX writing guidelines',status:'None',adoption:'No standard'}], eips:[], checklist:'onboarding' },
      { title:'Conflicting Mental Models', severity:'high', status:'unsolved', desc:'Users come with different backgrounds. DeFi protocols expect users to understand both tradfi and web3 concepts.', solutions:[{name:'Progressive disclosure patterns',status:'Research',adoption:'Limited'},{name:'Contextual education',status:'In Progress',adoption:'2/10 dapps'}], eips:[], checklist:'onboarding' },
      { title:'Poor Localization', severity:'medium', status:'unsolved', desc:'Most dapps remain English-only.', solutions:[{name:'i18n frameworks',status:'Live',adoption:'Not adopted in web3'},{name:'Community translations',status:'In Progress',adoption:'Limited'}], eips:[], checklist:'onboarding' },
      { title:'No Accessibility Features', severity:'high', status:'unsolved', desc:'An estimated 85% of protocols fail to meet WCAG accessibility standards. Screen readers and keyboard navigation are afterthoughts across the ecosystem.', solutions:[{name:'WCAG compliance',status:'Live in web2',adoption:'Not in web3'},{name:'Accessibility audits',status:'Research',adoption:'Rare'}], eips:[], checklist:'onboarding' },
      { title:'No Trustworthy Help Channels', severity:'high', status:'unsolved', desc:'Telegram and Discord are filled with scammers. Hard to tell real support from phishing.', solutions:[{name:'Official help centers',status:'In Progress',adoption:'3/10 projects'},{name:'Verified support channels',status:'Research',adoption:'Conceptual'}], eips:[], checklist:null }
    ]},
    { id:'protocol', title:'Protocol Design', icon:'gear', img:'images/protocol.png', color:'var(--cat-7)', hook:'Unlock better UX at the protocol layer.', desc:'Some UX problems can\'t be solved at the wallet layer. They originate in protocol design decisions that ripple outward as confusion, friction, and risk for end users.', problems:[
      { title:'No Default Native Account Abstraction', severity:'high', status:'research', desc:'On Ethereum, EOAs remain the default account type. Users must manage private keys, pay gas in ETH, and approve every action individually. Starknet launched with native AA where every account is a smart contract by default. EIP-7702 bridges EOAs toward smart account behavior but adoption is low, with MetaMask, Ambire, and Trust Wallet shipping end-user support. EIP-7701 (full native AA) has been superseded by EIP-8141 (Frame Transactions), now in active draft.', solutions:[{name:'EIP-8141 native AA (Frame Txs)',status:'Draft',adoption:'Active draft'},{name:'EIP-7702 as bridge',status:'Live',adoption:'MetaMask, Ambire, Trust Wallet'},{name:'ERC-4337 (off-protocol AA)',status:'Live',adoption:'54M+ accounts, 1B+ UserOps'}], eips:['EIP-8141','EIP-7702','ERC-4337'], checklist:null },
      { title:'No Shared Design Infrastructure', severity:'medium', status:'unsolved', desc:'There is no common component library or interaction pattern library for Ethereum dapps. Every team reinvents wallet connection, transaction confirmation, error states, and gas estimation UI from scratch. Fork culture spreads existing patterns but also creates brand fragmentation where users face similar-looking interfaces with no way to assess trustworthiness. Uniswap published an open-source V4 design kit, but ecosystem-wide shared infrastructure does not exist.', solutions:[{name:'Uniswap V4 open design kit',status:'Live',adoption:'Single project'},{name:'Ecosystem design system',status:'None',adoption:'No coordinated effort'}], eips:[], checklist:null },
      { title:'On-chain Activity Is Public by Default', severity:'high', status:'research', desc:'Every transaction on Ethereum and major L2s is permanently public and indexed by analytics providers. Users often do not realize their complete financial activity (salary, purchases, DeFi positions) is visible to anyone who knows their address. Opt-in privacy exists but requires active effort: Railgun ($4.5B+ shielded volume) and Privacy Pools (live since March 2025, ~1,500 users) serve different needs. Stealth addresses (ERC-5564) are an app-layer standard, not a protocol feature.', solutions:[{name:'Railgun (shielded balances)',status:'Live',adoption:'$4.5B+ cumulative volume'},{name:'Privacy Pools (0xbow)',status:'Live',adoption:'~1,500 users, ~$6M volume'},{name:'Stealth addresses (ERC-5564)',status:'Live',adoption:'77k addresses via Umbra, few wallets'},{name:'Aztec L2 (private execution)',status:'In Progress',adoption:'Consensus live, user txs not yet'}], eips:['ERC-5564'], checklist:null }
    ]},
    { id:'daily-ops', title:'Daily Operations', icon:'grid', img:'images/dailyop.png', color:'var(--cat-8)', hook:'Polish the flows people use every day.', desc:'The tasks people do every day: sending tokens, checking balances, managing gas. These should be the most polished flows in the ecosystem. They are often the most frustrating.', problems:[
      { title:'Unpredictable Gas Fees', severity:'high', status:'in-progress', desc:'Gas fees fluctuate wildly, leading to "bill shock" and abandoned transactions.', solutions:[{name:'EIP-1559 fee market',status:'Live',adoption:'Universal'},{name:'EIP-4844 L2 costs',status:'Live',adoption:'All major L2s'},{name:'Fee estimation UI',status:'In Progress',adoption:'5/10 wallets'}], eips:['EIP-1559','EIP-4844'], checklist:'gas' },
      { title:'Fiat-Based Values Missing', severity:'medium', status:'in-progress', desc:'Users think in USD/EUR but wallets force token amounts.', solutions:[{name:'Fiat denomination toggle',status:'Live',adoption:'5/10 wallets'},{name:'Price oracle display',status:'Live',adoption:'7/10 wallets'}], eips:[], checklist:'gas' },
      { title:'No Portfolio & Tax Tracking', severity:'medium', status:'unsolved', desc:'No fully reliable way to track transactions for tax purposes.', solutions:[{name:'Third-party tools (Koinly, CoinTracker)',status:'Live',adoption:'External'},{name:'Wallet-native tracking',status:'Research',adoption:'Conceptual'}], eips:[], checklist:null },
      { title:'Transaction Cancellation Pain', severity:'medium', status:'in-progress', desc:'Cancelling a pending transaction costs gas and isn\'t guaranteed.', solutions:[{name:'Speed-up/cancel UI',status:'Live',adoption:'6/10 wallets'},{name:'Intent-based cancellation',status:'Research',adoption:'Conceptual'}], eips:[], checklist:'signing' },
      { title:'NFTs Don\'t Load', severity:'medium', status:'in-progress', desc:'Wallets often scan only mainnet for NFTs, or require manual import.', solutions:[{name:'Multi-chain NFT indexing',status:'In Progress',adoption:'4/10 wallets'},{name:'NFT metadata standards',status:'Live',adoption:'Widespread'}], eips:['ERC-721','ERC-1155'], checklist:null },
      { title:'Token List Friction', severity:'medium', status:'in-progress', desc:'No universal token registry. Users\' desired tokens may not appear.', solutions:[{name:'Token list standards',status:'Live',adoption:'Partial'},{name:'Community-curated lists',status:'Live',adoption:'Growing'}], eips:[], checklist:'safety' }
    ]}
  ],
  checklists: [
    { id:'approvals', title:'Token Approvals', desc:'Permit2, EIP-5792 batched calls, EIP-2612 permits, exact-amount approvals, and approval UI communication.', available:true, patterns:5, standards:['EIP-5792','Permit2','EIP-2612'], items:[
      { text:'Use exact-amount approvals instead of unlimited (MAX_UINT256)', eip:'EIP-2612', priority:'critical', benefit:'Limits exposure if a contract is exploited. Users only risk the amount they intended to spend, not their entire token balance.' },
      { text:'Implement Permit2 for gasless, single-signature token approvals', eip:'Permit2', priority:'high', benefit:'Removes the separate approval transaction, cutting steps in half. Users sign once instead of paying gas twice.' },
      { text:'Batch approve + action in a single transaction using wallet_sendCalls', eip:'EIP-5792', priority:'high', benefit:'Turns a two-click flow into one click. Users complete swaps and deposits without waiting between transactions.' },
      { text:'Show the spender contract name, approval amount, and token in plain language', eip:null, priority:'high', benefit:'Users understand what they are authorizing. Reduces blind approvals and builds trust in the interface.' },
      { text:'Provide in-app approval management with one-tap revocation', eip:null, priority:'medium', benefit:'Gives users control over outstanding permissions without needing third-party tools like Revoke.cash.' }
    ]},
    { id:'signing', title:'Transaction Signing', desc:'Blind signing prevention, EIP-712 typed data, transaction simulation, multi-step progress, and signing fatigue.', available:true, patterns:5, standards:['EIP-712','EIP-191','EIP-7702'], items:[
      { text:'Use EIP-712 typed structured data for all signature requests', eip:'EIP-712', priority:'critical', benefit:'Wallets can display structured fields instead of raw hex. Users see what they are signing in human terms.' },
      { text:'Show a human-readable transaction summary before every signature', eip:'ERC-7730', priority:'critical', benefit:'Eliminates blind signing, the #1 vector for wallet drains. Users can verify intent before committing.' },
      { text:'Run transaction simulation to preview token balance changes', eip:null, priority:'high', benefit:'Users see "You will receive 1,420 USDC" before confirming. Catches errors and scams before funds move.' },
      { text:'Display multi-step signing progress (e.g. "Step 2 of 3")', eip:null, priority:'medium', benefit:'Reduces anxiety during complex flows. Users know how many signatures remain and won\'t abandon mid-process.' },
      { text:'Batch related approvals into a single signing session where possible', eip:'EIP-7702', priority:'medium', benefit:'Reduces signature fatigue in multi-step flows. Users confirm once instead of signing three separate prompts for approve-permit-swap.' }
    ]},
    { id:'gas', title:'Gas & Fees', desc:'Gas sponsorship via paymasters, fee display in fiat, paying gas with stablecoins, and empty-wallet detection.', available:true, patterns:5, standards:['ERC-7677','EIP-7702','ERC-3009'], items:[
      { text:'Detect empty wallets and offer gas sponsorship via paymasters', eip:'ERC-7677', priority:'critical', benefit:'New users can transact immediately without buying ETH first. Removes the biggest onboarding drop-off point.' },
      { text:'Display all fees in the user\'s local fiat currency', eip:null, priority:'high', benefit:'Users understand costs in familiar terms. "$0.12" means something, "0.00004 ETH" does not.' },
      { text:'Allow paying gas with stablecoins or any ERC-20 token', eip:'EIP-7702', priority:'high', benefit:'Users spend the token they already hold. No need to maintain an ETH balance just for fees.' },
      { text:'Show fee breakdown: base fee, priority fee, L1 data fee (on L2s)', eip:'EIP-1559', priority:'medium', benefit:'Power users can optimize timing and priority. Transparency builds trust when fees spike unexpectedly.' },
      { text:'Warn before transactions with unusually high gas costs', eip:null, priority:'medium', benefit:'Prevents accidental overpayment during network congestion. Users avoid $50 fees on $10 transactions.' }
    ]},
    { id:'multichain', title:'Multi-Chain', desc:'Cross-chain balance aggregation, automatic network switching, bridging UX, and smart account address consistency.', available:true, patterns:5, standards:['ERC-7683','ERC-7930','ERC-7828'], items:[
      { text:'Display unified balances across all connected chains', eip:'EIP-7811', priority:'critical', benefit:'Users see their true net worth in one view. No more switching networks to find hidden funds.' },
      { text:'Auto-switch networks when user interacts with a different chain', eip:'ERC-7828', priority:'high', benefit:'Removes the manual "switch network" step. Users interact with dapps without thinking about which chain they are on.' },
      { text:'Use chain-specific address format to prevent wrong-chain sends', eip:'ERC-7930', priority:'high', benefit:'Catches cross-chain transfer mistakes before funds are sent to unreachable addresses.' },
      { text:'Abstract bridging into single-click cross-chain transfers via intents', eip:'ERC-7683', priority:'high', benefit:'Users move assets between chains as easily as sending to a friend. No bridge UI, no waiting, no anxiety.' },
      { text:'Ensure consistent smart account addresses across L2s with CREATE2', eip:null, priority:'medium', benefit:'Users have one address everywhere. Funds sent to any L2 arrive at the same account.' }
    ]},
    { id:'onboarding', title:'Onboarding', desc:'Progressive backup disclosure, jargon replacement, simple/advanced modes, accessibility, and localization.', available:true, patterns:6, standards:['BIP-39','WCAG 2.2 AA'], items:[
      { text:'Delay recovery phrase backup until user has funds worth protecting', eip:null, priority:'critical', benefit:'New users start using the app in seconds. Backup prompt arrives when they have a reason to care about it.' },
      { text:'Replace all jargon with plain-language equivalents throughout the UI', eip:null, priority:'critical', benefit:'Non-crypto users can understand every screen. "Confirm payment" beats "Sign transaction" for mainstream adoption.' },
      { text:'Offer simple/advanced mode toggle for different user experience levels', eip:null, priority:'high', benefit:'Beginners get a clean interface. Power users access nonce editing, gas tuning, and hex data when they need it.' },
      { text:'Meet WCAG 2.2 AA accessibility standards for all interactive elements', eip:'WCAG 2.2', priority:'high', benefit:'Screen readers, keyboard navigation, and color contrast work for all users. Expands your addressable audience significantly.' },
      { text:'Support at minimum 5 languages with proper i18n framework', eip:'BIP-39', priority:'medium', benefit:'Reaches non-English speakers who make up 75% of internet users. Seed phrases already support multiple languages via BIP-39.' },
      { text:'Use progressive disclosure: reveal complexity only when the user needs it', eip:null, priority:'high', benefit:'Keeps first screens simple and inviting. Advanced options appear contextually instead of overwhelming upfront.' }
    ]},
    { id:'wallets', title:'Wallet Connection', desc:'EIP-6963 multi-wallet discovery, mobile deep linking, session persistence, and embedded wallets.', available:true, patterns:5, standards:['EIP-6963','EIP-7702','WalletConnect v2'], items:[
      { text:'Implement EIP-6963 for multi-wallet discovery (no more "Install MetaMask")', eip:'EIP-6963', priority:'critical', benefit:'All installed wallets appear automatically. Users choose their preferred wallet instead of being locked into one.' },
      { text:'Support deep linking for seamless mobile wallet connections', eip:null, priority:'high', benefit:'Tapping "Connect" on mobile opens the wallet app directly. No copy-pasting URLs or manual browser switching.' },
      { text:'Remember the last connected wallet and auto-reconnect on return visits', eip:null, priority:'high', benefit:'Returning users skip the connect flow entirely. Removes a friction point that makes dapps feel stateless compared to traditional apps.' },
      { text:'Support embedded/smart wallets as default for new users', eip:'EIP-7702', priority:'medium', benefit:'Users start with zero setup. The wallet is built into the app, upgradeable to a standalone wallet later.' },
      { text:'Use WalletConnect v2 as fallback connection method', eip:'WalletConnect v2', priority:'medium', benefit:'Covers edge cases where direct injection fails. Users on unusual browsers or wallets can still connect.' }
    ]},
    { id:'safety', title:'Safety & Security', desc:'Risk-differentiated warnings, address verification, ENS support, spam token filtering, and max-send gas accounting.', available:true, patterns:5, standards:['ERC-55','ENS','ERC-7730'], items:[
      { text:'Use risk-differentiated warnings, not blanket red alerts for every approval', eip:'ERC-7730', priority:'critical', benefit:'Users pay attention to real threats. Warning fatigue from constant red alerts causes people to ignore genuine danger.' },
      { text:'Show ENS names alongside hex addresses for known contacts', eip:'ENS', priority:'high', benefit:'Users verify recipients by readable name ("vitalik.eth") instead of comparing 42-character hex strings.' },
      { text:'Verify addresses with ERC-55 mixed-case checksum before sending', eip:'ERC-55', priority:'high', benefit:'Catches typos and clipboard hijacking before funds leave. A single wrong character is detected automatically.' },
      { text:'Filter and quarantine spam tokens and suspicious airdrops automatically', eip:null, priority:'high', benefit:'Users see only legitimate assets. Malicious airdrop tokens with phishing URLs never appear in the main balance view.' },
      { text:'Account for maximum gas when displaying "send max" amounts', eip:null, priority:'medium', benefit:'Prevents failed "send all" transactions. Users never accidentally underfund gas when moving their entire balance.' }
    ]}
  ]
};


// ===========================================
// CRITICAL ISSUE DETAILS
// ===========================================
const CRITICAL_DETAILS = {
  'The Gas Hurdle': {
    story: '<span class="persona">Maria</span> downloads a wallet to buy her first NFT. She creates an account, finds the artwork she wants, taps "Buy." But the transaction fails. She needs ETH for gas. To get ETH, she needs to sign up for an exchange, verify her ID, wait days for approval, then figure out how to transfer to her wallet. She closes the app. She never comes back.',
    opportunity: '<div class="lead">Eliminating the gas hurdle captures first-time users at their highest-intent moment.</div><ul><li>Significant onramp volume lost to abandonment at the ETH acquisition step</li><li>Paymasters and gas sponsorship convert this drop-off into a revenue opportunity</li><li>First wallets to solve this own the onboarding funnel</li></ul>',
    risk: '<div class="lead">The first transaction is the make-or-break moment for every new user.</div><ul><li>40% of users who complete wallet setup drop off at the gas acquisition step</li><li>Each additional onboarding step drops conversion by 20-30%</li><li>Competing chains with simpler onboarding capture users Ethereum loses here</li><li>Users who fail their first transaction rarely return</li></ul>'
  },
  'Blind Signing': {
    story: '<span class="persona">Alex</span> connects to what looks like a popular DeFi protocol. A pop-up asks him to "sign a message" showing a wall of hexadecimal data. He has signed dozens of these before. He clicks approve. Minutes later, his entire wallet is drained. The signature authorized a token transfer he could not read.',
    opportunity: '<div class="lead">Human-readable signing screens differentiate wallets on trust.</div><ul><li>Transaction simulation improves user trust 1.9x</li><li>Clear signing could prevent wallet drainer losses ($84M in 2025, down from $494M in 2024)</li><li>Removes hesitation users feel before every signature, increasing dapp engagement</li><li>Trust-first wallets command premium loyalty and retention</li></ul>',
    risk: '<div class="lead">Blind signing is the #1 attack vector for wallet drains.</div><ul><li>Each high-profile theft generates media coverage eroding public trust</li><li>Regulatory scrutiny increases with every major exploit</li><li>Users who cannot read what they sign are defenseless</li></ul>'
  },
  'Fragmented Asset View': {
    story: '<span class="persona">Priya</span> checks her wallet and sees $200. She knows she has more. She switches to Arbitrum manually: $1,400. Then Base: $800. Her real portfolio is $2,400, but no single screen shows this. She opens a third-party tracker, pastes her address, and waits. She does this every morning.',
    opportunity: '<div class="lead">Unified cross-chain balances eliminate the need for external portfolio trackers.</div><ul><li>Retains user attention within the wallet instead of third-party tools</li><li>Creates natural upsell paths for swaps and bridging</li><li>A basic expectation as users spread across 10+ chains</li></ul>',
    risk: '<div class="lead">Users who cannot see their full balance make poor financial decisions.</div><ul><li>Hidden assets across chains mean missed DeFi opportunities</li><li>Underutilized capital fragmented across L2s</li><li>Pushes users toward centralized exchanges where "everything is in one place"</li></ul>'
  },
  'Bridging Pain': {
    story: '<span class="persona">Tom</span> needs $50 of USDC on Arbitrum, but his funds sit on Ethereum mainnet. The bridge quotes $8 in gas and 7 minutes wait time. He initiates the transfer and spends the next 7 minutes switching between two block explorers, refreshing, unsure if his money is in transit or lost. The funds arrive. He does this twice a week.',
    opportunity: '<div class="lead">Single-click bridging captures cross-chain fees in a $500M+ annual market.</div><ul><li>Intent-based protocols already capturing significant volume by abstracting this pain</li><li>Seamless bridging is a revenue multiplier for every dapp</li><li>Protocols that remove bridging friction capture cross-chain volume by default</li></ul>',
    risk: '<div class="lead">Bridge friction locks liquidity on single chains, reducing ecosystem efficiency.</div><ul><li>70% of onboarded wallet users never complete a bridge transaction</li><li>Users who bridge incorrectly can lose funds permanently with no recourse</li><li>Complex bridging concentrates risk in a few large bridge protocols</li><li>Friction discourages the multi-chain usage Ethereum needs</li></ul>'
  },
  'Prevalence of Scams': {
    story: '<span class="persona">Sarah</span> sees a new token appear in her wallet from an airdrop. The token name contains a URL. She visits it out of curiosity. The site says she can "claim rewards" by connecting her wallet and signing a transaction. She signs. The transaction drains every approved token in her wallet. She loses $12,000.',
    opportunity: '<div class="lead">Security-first wallets command premium user loyalty and retention.</div><ul><li>Proactive scam prevention saves users hundreds of millions annually</li><li>Simulation, warnings, and reputation scoring position wallets as trusted gatekeepers</li><li>Security features become the top differentiator in wallet selection</li></ul>',
    risk: '<div class="lead">Each major scam event suppresses adoption across the entire ecosystem.</div><ul><li>Media narratives after high-profile thefts erode public trust broadly</li><li>Regulatory responses triggered by cumulative phishing losses</li><li>Ecosystem credibility as a financial platform at stake</li></ul>'
  },
  'Mobile Connection Dance': {
    story: '<span class="persona">James</span> finds a yield opportunity on Twitter and taps the link. It opens in Safari. The dapp says "Connect Wallet." He picks MetaMask. The MetaMask app opens but loses the dapp URL. He copies the link, opens MetaMask\'s built-in browser, pastes it. The page loads differently. The connect button doesn\'t work. He gives up and puts his phone down.',
    opportunity: '<div class="lead">Mobile is 60%+ of web traffic, yet 65% of protocols are not optimized for mobile-first.</div><ul><li>Wallets with smooth mobile flows capture the majority of new user interactions</li><li>Seamless mobile UX unlocks the largest computing platform on Earth</li><li>Wallets that solve mobile connection will be where most new users start</li></ul>',
    risk: '<div class="lead">Failed mobile connections are the top reason users abandon dapp interactions on phones.</div><ul><li>Every broken flow is a lost transaction and a lost fee</li><li>Users who fail once conclude "crypto doesn\'t work on mobile"</li><li>Users who fail on mobile do not come back to try again on desktop</li></ul>'
  },
  'Inscrutable Jargon': {
    story: '<span class="persona">Wei</span> downloads a wallet and is immediately asked about "gas limits," "nonce values," and "smart contract interactions." She has a computer science degree, but none of these terms match anything from her education. She assumes this technology is not meant for her. She is exactly the user Ethereum needs.',
    opportunity: '<div class="lead">Plain language yields 2-3x higher retention in onboarding flows.</div><ul><li>Every term a user understands is one less support ticket</li><li>Clear terminology is a compounding competitive advantage</li><li>Each understood concept leads to one more completed transaction</li></ul>',
    risk: '<div class="lead">Jargon creates a self-selecting user base of crypto insiders.</div><ul><li>Without plain language, mainstream financial use cases remain out of reach</li><li>Ethereum stays a tool for technical enthusiasts, not a global settlement layer</li><li>Every unexplained term is a potential exit point for new users</li></ul>'
  }
};


// ===========================================
// PROBLEM DETAILS
// ===========================================
const PROBLEM_DETAILS = {
  // User Onboarding
  'Inconsistent Recovery Phrase Terminology': {
    opportunity: '<div class="lead">A single industry-standard term cuts support tickets across all wallets.</div><ul><li>Estimated 15-20% reduction in support volume</li><li>Consistent language builds user confidence during onboarding</li><li>Reduces friction at the most sensitive setup step</li></ul>',
    risk: '<div class="lead">Every synonym is a new confusion point and a phishing opportunity.</div><ul><li>Each variant generates separate search queries leading to scam sites</li><li>Users second-guess themselves when terminology doesn\'t match</li><li>Phishing sites exploit these gaps with fake "recovery" flows</li></ul>'
  },
  'English-Only Recovery Phrases': {
    opportunity: '<div class="lead">Multilingual seed phrases open Ethereum to 4.5B+ non-English speakers.</div><ul><li>Fastest-growing crypto markets are in Asia, Africa, and Latin America</li><li>Wallets that localize recovery gain first-mover access to these markets</li><li>BIP-39 already supports wordlists in 8 languages</li></ul>',
    risk: '<div class="lead">English-only recovery excludes the majority of the world\'s population.</div><ul><li>Users who don\'t fully understand their seed phrase are more likely to lose funds</li><li>Increased vulnerability to social engineering attacks</li><li>Entire continents effectively locked out of self-custody</li></ul>'
  },
  'Forced Backup Friction': {
    opportunity: '<div class="lead">Deferring backup until users hold real value increases completion rates.</div><ul><li>Smart account wallets skipping seed phrases report 3-5x higher onboarding conversion</li><li>Progressive security matches user commitment level</li><li>Reduces the #1 onboarding drop-off point</li></ul>',
    risk: '<div class="lead">Forcing backup on empty wallets teaches users to dismiss security prompts.</div><ul><li>Habit of skipping is already formed when real funds arrive</li><li>Users treat all future security prompts as annoyances</li><li>Creates false sense that backup is optional</li></ul>'
  },
  'Geographic Onramp Restrictions': {
    opportunity: '<div class="lead">Regions with limited banking access are the largest potential crypto user base.</div><ul><li>P2P onramps and local exchange integrations unlock entirely new markets</li><li>Underserved populations represent the highest growth potential</li><li>Alternative onramps bypass traditional banking gatekeepers</li></ul>',
    risk: '<div class="lead">Users who cannot onramp within their wallet turn to unregulated channels.</div><ul><li>Increased exposure to OTC scams and fraud</li><li>Users pay premiums to middlemen instead of using wallets</li><li>Regulatory gaps widen as activity moves underground</li></ul>'
  },
  // Transaction Clarity
  'Signing Fatigue': {
    opportunity: '<div class="lead">Batching signatures into a single approval reduces friction by 50-70% per session.</div><ul><li>Session keys enable "one-click DeFi" experiences</li><li>Fewer popups means higher task completion rates</li><li>Users spend time using dapps instead of approving requests</li></ul>',
    risk: '<div class="lead">Fatigued users rubber-stamp every signature request.</div><ul><li>Learned behavior is the primary reason phishing succeeds on experienced users</li><li>Attackers count on approval fatigue to slip malicious requests through</li><li>Even security-aware users eventually stop reading</li></ul>'
  },
  'Missing Signing Context': {
    opportunity: '<div class="lead">Progress indicators increase transaction completion by 25-40%.</div><ul><li>Users who see "Step 2 of 3" rarely abandon complex operations</li><li>Context reduces support tickets about "stuck" transactions</li><li>Builds user confidence with each completed step</li></ul>',
    risk: '<div class="lead">Without context, users can\'t distinguish legitimate requests from phishing.</div><ul><li>Second signature could be real or an attack inserted between steps</li><li>Ambiguity is the attacker\'s advantage</li><li>Users either approve everything or abandon everything</li></ul>'
  },
  'Redundant Token Approvals': {
    opportunity: '<div class="lead">Batched approve+swap saves $2-5 in gas per operation.</div><ul><li>Eliminates the most confusing step in DeFi for new users</li><li>Permit2 adoption growing rapidly among top protocols</li><li>Single-action swaps match the UX users expect from TradFi</li></ul>',
    risk: '<div class="lead">The separate approval step is where most users abandon their first DeFi interaction.</div><ul><li>Creates permanent confusion about why two transactions are needed</li><li>First-time users assume the dapp is broken</li><li>Drop-off at this step is measurable and significant</li></ul>'
  },
  'Token Approval Management': {
    opportunity: '<div class="lead">In-wallet revocation turns security into a retention feature.</div><ul><li>Users who manage permissions feel safer and transact more frequently</li><li>Revocation UX is a differentiator for security-conscious users</li><li>Proactive management reduces exposure surface</li></ul>',
    risk: '<div class="lead">Stale unlimited approvals are ticking time bombs.</div><ul><li>Exploited contracts months later drain funds from forgotten approvals</li><li>Users have no visibility into their current exposure</li><li>A single compromised protocol can cascade across all approvers</li></ul>'
  },
  'Blanket Warnings': {
    opportunity: '<div class="lead">Risk-differentiated warnings direct attention to genuine threats.</div><ul><li>Calibrated severity increases user trust in the warning system</li><li>Lower false-alarm dismissal rates</li><li>Users actually read warnings that are proportional to real risk</li></ul>',
    risk: '<div class="lead">Uniform red alerts for every transaction create warning blindness.</div><ul><li>Users stop reading alerts entirely after repeated false alarms</li><li>Truly dangerous approvals treated identically to routine ones</li><li>The warning system becomes invisible through overuse</li></ul>'
  },
  // Cross-chain
  'Manual Network Switching': {
    opportunity: '<div class="lead">Auto-switching removes an entire interaction step from every cross-chain action.</div><ul><li>Dapps with transparent switching report 30% higher task completion</li><li>Users never see a "wrong network" error again</li><li>Reduces the cognitive load of multi-chain usage</li></ul>',
    risk: '<div class="lead">Manual switching causes wrong-network transactions and failed interactions.</div><ul><li>Users don\'t understand why their transaction "didn\'t work"</li><li>Funds sent on wrong network require recovery steps</li><li>Confusion compounds with every new L2 added</li></ul>'
  },
  'Different L2 Addresses': {
    opportunity: '<div class="lead">Deterministic addresses across chains let users share one address for all L2s.</div><ul><li>Simplifies payments, portfolio tracking, and social identity</li><li>One address to share instead of one per chain</li><li>Foundation for unified cross-chain identity</li></ul>',
    risk: '<div class="lead">Funds sent to an Ethereum address on a new L2 may be unreachable.</div><ul><li>Irreversible and deeply frustrating loss</li><li>No standard recovery mechanism exists</li><li>Users learn through expensive mistakes</li></ul>'
  },
  'Asset Fragmentation': {
    opportunity: '<div class="lead">Intent-based auto-routing eliminates manual balance management.</div><ul><li>Auto-route from any chain to the needed chain transparently</li><li>The path to "it just works" multi-chain</li><li>Users think in assets, not chains</li></ul>',
    risk: '<div class="lead">Fragmented assets mean underutilized capital across chains.</div><ul><li>$100 spread across 5 chains can\'t meet DeFi minimum amounts</li><li>Users can\'t participate in opportunities on the "wrong" chain</li><li>Capital efficiency drops with every new L2</li></ul>'
  },
  // Safety
  'Sending to Wrong Address': {
    opportunity: '<div class="lead">ENS and address verification could prevent millions in annual losses.</div><ul><li>Human-readable addresses reduce support tickets</li><li>Address books and recent contacts prevent typos</li><li>Verification screens catch clipboard hijacks</li></ul>',
    risk: '<div class="lead">Crypto transfers are irreversible. One typo means permanent loss.</div><ul><li>Clipboard hijack malware swaps addresses silently</li><li>#1 fear preventing mainstream users from sending transactions</li><li>No recourse, no undo, no customer support</li></ul>'
  },
  'Spam & Junk Tokens': {
    opportunity: '<div class="lead">Clean token lists and smart filtering create a premium wallet experience.</div><ul><li>Users not distracted by spam engage more with real assets</li><li>Filtering removes the primary phishing entry point</li><li>Premium, curated feel differentiates security-first wallets</li></ul>',
    risk: '<div class="lead">Spam tokens with phishing URLs are the entry point for many wallet drains.</div><ul><li>A single curious click on a fake airdrop can lead to full compromise</li><li>Token names containing URLs are social engineering at scale</li><li>Every spam token is an active attack vector</li></ul>'
  },
  // Mobile
  'Connection Failures': {
    opportunity: '<div class="lead">EIP-6963 multi-wallet discovery solves the "Install MetaMask" problem.</div><ul><li>Dapps detecting all wallets see 20-30% higher connection success</li><li>Users choose their preferred wallet instead of being forced</li><li>Eliminates the most common first-interaction failure</li></ul>',
    risk: '<div class="lead">Connection failures are the first impression of web3 for many users.</div><ul><li>Failed connection on the first try often means the user never returns</li><li>Sets an immediate negative tone for the entire ecosystem</li><li>Users conclude the technology is unreliable</li></ul>'
  },
  'Mobile Apps Don\'t Respond': {
    opportunity: '<div class="lead">Reliable mobile SDKs unlock 60%+ of web traffic for dapps.</div><ul><li>First-mover wallets with smooth mobile flows capture the majority of new users</li><li>Mobile-first markets represent the highest growth potential</li><li>Smooth mobile UX is the #1 competitive differentiator</li></ul>',
    risk: '<div class="lead">Unresponsive wallets train users to avoid mobile dapps entirely.</div><ul><li>The market loses access to the largest computing platform on Earth</li><li>Users who fail on mobile don\'t switch to desktop, they leave</li><li>Mobile avoidance becomes a permanent habit</li></ul>'
  },
  'Wallet Lock-in': {
    opportunity: '<div class="lead">Portable account standards let users switch wallets without losing history.</div><ul><li>Interoperability increases the total addressable market for every wallet</li><li>Users commit more deeply when they know they can leave</li><li>Competition improves the entire ecosystem</li></ul>',
    risk: '<div class="lead">Lock-in fragments the ecosystem into wallet silos.</div><ul><li>Users avoid committing to any wallet, reducing engagement depth</li><li>Switching costs discourage trying better alternatives</li><li>Innovation stalls when users can\'t migrate</li></ul>'
  },
  // Language
  'Conflicting Mental Models': {
    opportunity: '<div class="lead">Contextual education at the point of need converts confusion into confidence.</div><ul><li>Dapps that explain terms inline see 2x longer session times</li><li>Users learn by doing instead of reading documentation</li><li>Reduces the knowledge barrier from "study first" to "learn as you go"</li></ul>',
    risk: '<div class="lead">Unfamiliar financial concepts without explanation lead to costly mistakes.</div><ul><li>Users who don\'t understand what they\'re doing lose money</li><li>Bad experiences get shared widely, deterring others</li><li>Permanent ecosystem exit for users who feel deceived</li></ul>'
  },
  'Poor Localization': {
    opportunity: '<div class="lead">Localized interfaces tap into 75% of internet users who don\'t speak English.</div><ul><li>Every language added opens a new market segment</li><li>Localized content ranks in local search results</li><li>Community translators already volunteer for open-source projects</li></ul>',
    risk: '<div class="lead">English-only interfaces exclude entire continents.</div><ul><li>The next billion crypto users will not come from English-speaking countries</li><li>Non-English users fall back on poorly translated guides</li><li>Misinformation spreads faster in underserved language markets</li></ul>'
  },
  'Inconsistent Design Patterns': {
    opportunity: '<div class="lead">Shared UX conventions across dapps reduce the learning curve for new users.</div><ul><li>Knowledge transfers between dapps when patterns are consistent</li><li>Users explore the ecosystem instead of sticking to one app</li><li>Design systems lower development cost for new dapps</li></ul>',
    risk: '<div class="lead">Inconsistent patterns mean every dapp requires re-learning.</div><ul><li>Users stick with the one app they know instead of exploring</li><li>Every inconsistency is a potential confusion point</li><li>Ecosystem growth limited by per-dapp learning curves</li></ul>'
  },
  // Gas
  'Gas Volatility': {
    opportunity: '<div class="lead">Predictable fee UX removes the primary source of transaction anxiety.</div><ul><li>Fiat display, warnings, and timing suggestions build trust in costs</li><li>Users transact more when they trust the price</li><li>Fee prediction features reduce failed transactions</li></ul>',
    risk: '<div class="lead">Gas spikes cause failed transactions and lasting aversion to on-chain activity.</div><ul><li>Users burned by high gas once develop permanent anxiety</li><li>Overpayment erodes trust in the fee system</li><li>Failed transactions from insufficient gas waste money with no result</li></ul>'
  },
  'L2 Fee Confusion': {
    opportunity: '<div class="lead">Clear L1+L2 fee breakdowns accelerate rollup migration from mainnet.</div><ul><li>Users understand the value proposition of L2s when fees are transparent</li><li>Transparent display builds confidence in the L2 ecosystem</li><li>Comparison shopping between L2s becomes possible</li></ul>',
    risk: '<div class="lead">Opaque L2 fees erode the "cheap transactions" narrative driving adoption.</div><ul><li>Users who can\'t predict costs avoid transacting</li><li>Hidden fees feel deceptive compared to upfront pricing</li><li>Trust in L2 cost savings undermined by unpredictable totals</li></ul>'
  },
  // DeFi
  'Complex DeFi Flows': {
    opportunity: '<div class="lead">Simplified interfaces abstracting multi-step processes can increase participation 10x.</div><ul><li>Single-action DeFi matches the UX of traditional finance</li><li>Lower barriers expand the user base beyond power users</li><li>Simplified flows reduce error rates and support burden</li></ul>',
    risk: '<div class="lead">Complex flows gate DeFi behind technical expertise.</div><ul><li>Total value locked stagnates when only power users can navigate</li><li>Institutional capital stays on the sidelines</li><li>DeFi remains a niche instead of becoming financial infrastructure</li></ul>'
  },
  'Impermanent Loss Opacity': {
    opportunity: '<div class="lead">Clear IL visualization would dramatically increase LP confidence and capital efficiency.</div><ul><li>Real-time P&L tracking lets LPs make informed decisions</li><li>Transparent IL display builds trust in liquidity provision</li><li>Better-informed LPs optimize positions instead of panic-withdrawing</li></ul>',
    risk: '<div class="lead">Users who discover impermanent loss after the fact lose trust in all of DeFi.</div><ul><li>Lack of upfront disclosure feels like deception</li><li>Post-hoc IL discovery triggers permanent ecosystem exit</li><li>Word-of-mouth warnings from burned LPs deter new participants</li></ul>'
  },
  // Protocol Design
  'No Default Native Account Abstraction': {
    opportunity: '<div class="lead">Native AA would let every Ethereum user benefit from smart accounts without opting in.</div><ul><li>Smart wallets retain 70% of users vs 60% for seed-phrase wallets. Social recovery adoption is growing 44% YoY.</li><li>Gas sponsorship, social recovery, and session keys become universal rather than opt-in</li><li>Dapp developers can assume every user has a smart account, simplifying integration</li><li>Ethereum closes the gap with chains like Starknet where this is already the default</li></ul>',
    risk: '<div class="lead">Without native AA, the ecosystem remains split between EOA and smart account users.</div><ul><li>Dapps must support two account models, increasing complexity and fragmentation</li><li>Users on EOAs miss out on safety features like transaction simulation and spending limits</li><li>The UX gap between Ethereum and native-AA chains becomes a competitive disadvantage</li></ul>'
  },
  'No Shared Design Infrastructure': {
    opportunity: '<div class="lead">A shared design commons would raise the quality floor across all Ethereum dapps.</div><ul><li>Audited, accessible UI components for wallet connection, transaction flows, and error states reduce reinvention</li><li>Consistent interaction patterns build user confidence across the ecosystem</li><li>New teams ship faster by building on proven patterns instead of starting from scratch</li></ul>',
    risk: '<div class="lead">Without shared patterns, every dapp trains users differently.</div><ul><li>Users cannot transfer skills between dapps, increasing the learning curve for each new product</li><li>Brand fragmentation makes it harder to distinguish legitimate apps from scams</li><li>Design debt accumulates as teams copy outdated patterns from forks</li></ul>'
  },
  'On-chain Activity Is Public by Default': {
    opportunity: '<div class="lead">Privacy tools that maintain compliance would unlock mainstream financial use cases.</div><ul><li>Users could receive salary, pay merchants, and use DeFi without exposing their full financial history</li><li>Privacy Pools\' association set model demonstrates that privacy and compliance can coexist</li><li>Wallet-integrated privacy (via frameworks like Kohaku) would make protection seamless rather than requiring active effort</li></ul>',
    risk: '<div class="lead">Public-by-default transactions make everyday financial use of Ethereum untenable.</div><ul><li>Employers, merchants, and counterparties can see a user\'s complete balance and transaction history</li><li>Users who discover this after the fact feel deceived and leave permanently</li><li>The transparency that enables trustless verification also enables surveillance, a tradeoff most users never consented to</li></ul>'
  }
};

// Merge critical details into problem details for unified lookup
Object.keys(CRITICAL_DETAILS).forEach(k => {
  if (!PROBLEM_DETAILS[k]) PROBLEM_DETAILS[k] = {};
  PROBLEM_DETAILS[k].opportunity = PROBLEM_DETAILS[k].opportunity || CRITICAL_DETAILS[k].opportunity;
  PROBLEM_DETAILS[k].risk = PROBLEM_DETAILS[k].risk || CRITICAL_DETAILS[k].risk;
  PROBLEM_DETAILS[k].story = CRITICAL_DETAILS[k].story;
});


// ===========================================
// EIP/STANDARD DOC URLS
// ===========================================
const DOC_URLS = {
  'EIP-2612': 'https://eips.ethereum.org/EIPS/eip-2612',
  'Permit2': 'https://docs.uniswap.org/contracts/permit2/overview',
  'EIP-5792': 'https://eips.ethereum.org/EIPS/eip-5792',
  'EIP-712': 'https://eips.ethereum.org/EIPS/eip-712',
  'ERC-7730': 'https://clear-signing.org/',
  'EIP-4361': 'https://login.xyz/',
  'ERC-7677': 'https://eips.ethereum.org/EIPS/eip-7677',
  'EIP-7702': 'https://eip7702.io/',
  'EIP-1559': 'https://eips.ethereum.org/EIPS/eip-1559',
  'EIP-7811': 'https://eips.ethereum.org/EIPS/eip-7811',
  'ERC-7828': 'https://interopaddress.com',
  'ERC-7930': 'https://eips.ethereum.org/EIPS/eip-7930',
  'ERC-7683': 'https://across.to/intents',
  'BIP-39': 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
  'WCAG 2.2': 'https://www.w3.org/TR/WCAG22/',
  'EIP-6963': 'https://eip6963.org/',
  'WalletConnect v2': 'https://docs.walletconnect.com/',
  'ERC-55': 'https://eips.ethereum.org/EIPS/eip-55',
  'ENS': 'https://docs.ens.domains/',
  'EIP-191': 'https://eips.ethereum.org/EIPS/eip-191',
  'EIP-8141': 'https://eips.ethereum.org/EIPS/eip-8141',
  'ERC-4337': 'https://www.erc4337.io/',
  'EIP-4844': 'https://eips.ethereum.org/EIPS/eip-4844',
  'EIP-3326': 'https://eips.ethereum.org/EIPS/eip-3326',
  'EIP-7701': 'https://eips.ethereum.org/EIPS/eip-7701',
  'ENS (EIP-137)': 'https://docs.ens.domains/',
  'ERC-721': 'https://eips.ethereum.org/EIPS/eip-721',
  'ERC-1155': 'https://eips.ethereum.org/EIPS/eip-1155',
  'ERC-3009': 'https://eips.ethereum.org/EIPS/eip-3009',
  'ERC-7677': 'https://eips.ethereum.org/EIPS/eip-7677'
};


// ===========================================
// BETTER RESOURCE URLS (user-friendly docs beyond the EIP page)
// ===========================================
const RESOURCE_URLS = {
  'ERC-7828': { url: 'https://interopaddress.com', label: 'interopaddress.com' },
  'ERC-4337': { url: 'https://www.erc4337.io/', label: 'erc4337.io' },
  'EIP-7702': { url: 'https://eip7702.io/', label: 'eip7702.io' },
  'Permit2': { url: 'https://docs.uniswap.org/contracts/permit2/overview', label: 'Uniswap Docs' },
  'EIP-6963': { url: 'https://eip6963.org/', label: 'eip6963.org' },
  'ERC-7683': { url: 'https://across.to/intents', label: 'Across Intents' },
  'EIP-4361': { url: 'https://login.xyz/', label: 'login.xyz' },
  'ERC-7730': { url: 'https://clear-signing.org/', label: 'clear-signing.org' },
  'ENS': { url: 'https://docs.ens.domains/', label: 'ENS Docs' }
};

// ===========================================
// SKILL ICONS
// ===========================================
const SKILL_ICONS = {
  approvals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  signing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  gas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  multichain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  onboarding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
  wallets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  safety: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
};


// ===========================================
// SKILL DESCRIPTIONS
// ===========================================
const SKILL_DESCRIPTIONS = {
  approvals: {
    humanDesc: 'Guides your AI agent through safe token approval patterns. Covers the difference between unlimited and exact-amount approvals, when to use Permit2 vs EIP-2612, and how to batch approve+action into a single user click.',
    useCases: ['Building a swap or DEX interface', 'Any dapp that moves ERC-20 tokens on behalf of users', 'Implementing gasless approvals with Permit2']
  },
  signing: {
    humanDesc: 'Teaches your agent to implement human-readable transaction signing. Covers EIP-712 structured data, transaction simulation previews, multi-step progress indicators, and approval batching.',
    useCases: ['Any dapp that requests wallet signatures', 'Login/authentication flows', 'DeFi interactions requiring multiple signatures']
  },
  gas: {
    humanDesc: 'Covers gas abstraction and fee UX. Your agent learns to detect empty wallets, sponsor gas via paymasters, display fees in fiat, and let users pay gas with stablecoins.',
    useCases: ['Onboarding flows for new users with no ETH', 'Any transaction-heavy application', 'L2 dapps where fee display is confusing']
  },
  multichain: {
    humanDesc: 'Handles cross-chain complexity. Covers unified balance display, automatic network switching, chain-specific address formats, intent-based bridging, and consistent smart account addresses.',
    useCases: ['Portfolio or dashboard interfaces', 'Dapps deployed on multiple chains', 'Cross-chain transfer or bridge interfaces']
  },
  onboarding: {
    humanDesc: 'Guides progressive onboarding design. Covers delayed backup prompts, jargon-free copy, simple/advanced mode toggles, WCAG accessibility, and internationalization.',
    useCases: ['First-time user registration flows', 'Wallet setup wizards', 'Any consumer-facing Ethereum application']
  },
  wallets: {
    humanDesc: 'Covers wallet connection patterns. Your agent learns EIP-6963 multi-wallet discovery, mobile deep linking, session persistence, embedded wallets, and WalletConnect fallbacks.',
    useCases: ['Connect Wallet buttons and modals', 'Mobile dapp experiences', 'Dapps supporting multiple wallet providers']
  },
  safety: {
    humanDesc: 'Implements safety guardrails. Covers risk-differentiated warnings, ENS name display, checksum address verification, spam token filtering, and safe max-send calculations.',
    useCases: ['Send/transfer interfaces', 'Displaying token balances and transaction history', 'Any flow where users approve or sign transactions']
  }
};
