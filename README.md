# EthUX — Ethereum UX Observatory

A community-sourced map of Ethereum UX pain points, solution tracking, and adoption data. Built from 32,000+ real user reports across Telegram, Reddit, and X.

**Live site:** [ethux.design](https://ethux.design)

## What this is

EthUX tracks 38+ usability problems across 8 categories that affect Ethereum wallets, dapps, and protocols. Each pain point includes:

- Real user quotes from community research
- Solutions with researched adoption data from sources like [bundlebear.com](https://www.bundlebear.com), [walletbeat.eth](https://beta.walletbeat.eth.limo), [7702beat](https://swiss-knife.xyz/7702beat), and [trilliondollarsecurity.org](https://trilliondollarsecurity.org)
- Opportunity and risk assessments
- Related EIPs and standards

It also includes solution checklists for builders and adoption frameworks from CRADL research.

## Categories

- **User Onboarding** — gas hurdle, seed phrases, backup friction
- **Transaction Clarity** — blind signing, signing fatigue, approvals
- **Cross-chain Flow** — bridging, fragmented balances, network switching
- **Safety & Security** — scams, wrong addresses, spam tokens
- **Mobile & Connectivity** — connection failures, deep linking
- **Accessibility** — jargon, localization, WCAG compliance
- **Protocol Design** — native AA, shared design infra, privacy
- **Daily Operations** — gas fees, fiat values, tax tracking

## Contributing

Contributions are welcome. You can:

### Report a new UX pain point

[Open an issue](../../issues/new) with:
- What happened (the UX failure)
- Where it happened (wallet, dapp, flow)
- How it affects users
- Any solutions you know of

### Improve existing data

Submit a PR to `data.js`. The data structure:

```js
{
  title: 'Pain Point Name',
  severity: 'critical|high|medium|info',
  status: 'unsolved|in-progress|research',
  desc: 'Clear description of the problem.',
  solutions: [
    {
      name: 'Solution Name',
      status: 'Live|Final|Building|Draft|Research|None',
      adoption: 'Specific, sourced adoption data'
    }
  ],
  eips: ['EIP-XXXX'],
  checklist: 'checklist-id or null'
}
```

### Add a user quote

Quotes go in `CRITICAL_DETAILS` or `PROBLEM_DETAILS` in `data.js` as a `story` field. Rules:
- Must be from a real user (community report, not fabricated)
- No project name-drops in quotes
- Include a `<span class="quote-source">` attribution (e.g. "User, community report")
- Multiple quotes use an array for the carousel

### Update adoption data

Adoption fields must be sourced. Include where the data comes from. We use:
- [bundlebear.com](https://www.bundlebear.com) for ERC-4337 and EIP-7702 stats
- [walletbeat.eth](https://beta.walletbeat.eth.limo) for wallet feature comparisons
- [swiss-knife.xyz/7702beat](https://swiss-knife.xyz/7702beat) for EIP-7702 wallet support
- [trilliondollarsecurity.org](https://trilliondollarsecurity.org) for security adoption
- Scam Sniffer annual reports for phishing/drainer data
- EIP status pages for standard progress

Do not use made-up statistics. If you can't source it, describe the state qualitatively.

## Solution status labels

| Status | Meaning |
|--------|---------|
| **Live** | Shipped and usable today |
| **Final** | Standard finalized, adoption underway |
| **Building** | Teams actively building or shipping |
| **Draft** | Standard being drafted, not yet finalized |
| **Research** | Early R&D, no implementation yet |
| **Standard exists** | Standard defined but not adopted |
| **None** | Nobody is working on this |
| **Live in web2** | Solved outside crypto, not adopted in web3 |

## Tech stack

Static site. No framework. Three files:
- `index.html` — shell with metadata
- `data.js` — all content data
- `app.js` — rendering, routing, interactions
- `style.css` — styles

Deployed on Vercel via GitHub push to `main`.

## License

Code: [MIT](LICENSE)
Content (pain points, quotes, descriptions): [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)
