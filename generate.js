#!/usr/bin/env node
// generate.js — Produces agent-readable files from data.js
// Run: node generate.js
// No dependencies required.

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// ---------------------------------------------------------------------------
// 1. Load data.js in a sandbox
// ---------------------------------------------------------------------------
const src = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf-8');
// data.js uses `const` declarations which don't attach to the sandbox object.
// Wrap in a function that returns them explicitly.
const wrapper = `(function() { ${src}; return { DATA, CRITICAL_DETAILS, PROBLEM_DETAILS, DOC_URLS, RESOURCE_URLS, SKILL_DESCRIPTIONS, SKILL_ICONS }; })()`;
const sandbox = {};
const result = vm.runInNewContext(wrapper, sandbox);

const { DATA, CRITICAL_DETAILS, PROBLEM_DETAILS, DOC_URLS, RESOURCE_URLS, SKILL_DESCRIPTIONS } = result;

// Replicate the merge logic from data.js (lines 268-274)
Object.keys(CRITICAL_DETAILS).forEach(k => {
  if (!PROBLEM_DETAILS[k]) PROBLEM_DETAILS[k] = {};
  PROBLEM_DETAILS[k].opportunity = PROBLEM_DETAILS[k].opportunity || CRITICAL_DETAILS[k].opportunity;
  PROBLEM_DETAILS[k].risk = PROBLEM_DETAILS[k].risk || CRITICAL_DETAILS[k].risk;
  PROBLEM_DETAILS[k].story = CRITICAL_DETAILS[k].story || PROBLEM_DETAILS[k].story;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<\/ul>/gi, '')
    .replace(/<ul>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<span class="quote-source">(.*?)<\/span>/gi, '($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const TODAY = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// 2. Generate llms-full.txt
// ---------------------------------------------------------------------------
function generateMarkdown() {
  const lines = [];
  const push = (...args) => lines.push(...args);

  push('# EthUX Design — Complete Dataset');
  push(`Generated: ${TODAY} | Source: https://ethux.design`);
  push('');
  push('A community-sourced map of Ethereum UX pain points with solution checklists, adoption tracking, and real user evidence from 32,000+ reports.');
  push('');
  push('---');
  push('');

  // --- Categories & Problems ---
  push('## Categories & Problems');
  push('');

  DATA.categories.forEach((cat, ci) => {
    push(`### ${ci + 1}. ${cat.title}`);
    push(`*${cat.hook}*`);
    push('');
    push(stripHtml(cat.desc));
    push('');

    cat.problems.forEach(prob => {
      push(`#### ${prob.title}`);
      push(`- **Severity:** ${capitalize(prob.severity)}`);
      push(`- **Status:** ${capitalize(prob.status)}`);
      if (prob.checklist) {
        push(`- **Checklist:** [${prob.checklist}](#checklist-${prob.checklist})`);
      }
      if (prob.eips && prob.eips.length) {
        const eipLinks = prob.eips.map(e => DOC_URLS[e] ? `[${e}](${DOC_URLS[e]})` : e);
        push(`- **Related EIPs:** ${eipLinks.join(', ')}`);
      }
      push('');
      push(stripHtml(prob.desc));
      push('');

      // Solutions table
      if (prob.solutions && prob.solutions.length) {
        push('| Solution | Status | Adoption |');
        push('|----------|--------|----------|');
        prob.solutions.forEach(s => {
          push(`| ${s.name} | ${s.status} | ${s.adoption} |`);
        });
        push('');
      }

      // Details from PROBLEM_DETAILS / CRITICAL_DETAILS
      const details = PROBLEM_DETAILS[prob.title];
      if (details) {
        if (details.story) {
          push('**User evidence:**');
          const stories = Array.isArray(details.story) ? details.story : [details.story];
          stories.forEach(s => {
            push(`> ${stripHtml(s)}`);
            push('');
          });
        }
        if (details.opportunity) {
          push('**Opportunity:**');
          push(stripHtml(details.opportunity));
          push('');
        }
        if (details.risk) {
          push('**Risk:**');
          push(stripHtml(details.risk));
          push('');
        }
      }

      push('---');
      push('');
    });
  });

  // --- Checklists ---
  push('## Builder Checklists');
  push('');

  DATA.checklists.forEach(cl => {
    push(`### <a id="checklist-${cl.id}"></a>${cl.title}`);
    push(`*${cl.desc}*`);
    if (cl.standards && cl.standards.length) {
      const stdLinks = cl.standards.map(s => DOC_URLS[s] ? `[${s}](${DOC_URLS[s]})` : s);
      push(`Standards: ${stdLinks.join(', ')}`);
    }
    push('');
    push('| Priority | Pattern | Standard | Benefit |');
    push('|----------|---------|----------|---------|');
    cl.items.forEach(item => {
      const eip = item.eip || '';
      push(`| ${capitalize(item.priority)} | ${item.text} | ${eip} | ${item.benefit} |`);
    });
    push('');
  });

  // --- Skills ---
  push('## Implementation Skills');
  push('');
  push('Detailed implementation guidance for each checklist area. Each skill contains patterns, code examples, decision trees, and error states.');
  push('');
  push('| Skill | Path | Description |');
  push('|-------|------|-------------|');
  Object.keys(SKILL_DESCRIPTIONS).forEach(id => {
    const sk = SKILL_DESCRIPTIONS[id];
    push(`| ${capitalize(id)} | [skills/${id}/SKILL.md](https://ethux.design/skills/${id}/SKILL.md) | ${sk.humanDesc} |`);
  });
  push('');

  // --- EIP Reference ---
  push('## EIP & Standard Reference');
  push('');
  push('| Standard | Documentation |');
  push('|----------|---------------|');
  Object.keys(DOC_URLS).forEach(eip => {
    push(`| ${eip} | ${DOC_URLS[eip]} |`);
  });
  push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 3. Generate api/data.json
// ---------------------------------------------------------------------------
function generateJson() {
  // Merge details into problems for a self-contained JSON
  const categories = DATA.categories.map(cat => ({
    id: cat.id,
    title: cat.title,
    hook: cat.hook,
    description: stripHtml(cat.desc),
    problems: cat.problems.map(prob => {
      const details = PROBLEM_DETAILS[prob.title] || {};
      const stories = details.story
        ? (Array.isArray(details.story) ? details.story : [details.story]).map(stripHtml)
        : [];
      return {
        title: prob.title,
        severity: prob.severity,
        status: prob.status,
        description: stripHtml(prob.desc),
        solutions: prob.solutions,
        eips: prob.eips,
        checklist: prob.checklist,
        userEvidence: stories.length ? stories : undefined,
        opportunity: details.opportunity ? stripHtml(details.opportunity) : undefined,
        risk: details.risk ? stripHtml(details.risk) : undefined
      };
    })
  }));

  const checklists = DATA.checklists.map(cl => ({
    id: cl.id,
    title: cl.title,
    description: cl.desc,
    standards: cl.standards,
    items: cl.items
  }));

  return JSON.stringify({
    meta: {
      generatedAt: TODAY,
      source: 'https://ethux.design',
      description: 'Ethereum UX pain points, solutions, adoption tracking, and builder checklists from 32,000+ community reports.',
      license: 'MIT (code), CC-BY 4.0 (content)'
    },
    categories,
    checklists,
    skills: SKILL_DESCRIPTIONS,
    eipDocs: DOC_URLS,
    resourceUrls: RESOURCE_URLS
  }, null, 2);
}

// ---------------------------------------------------------------------------
// 4. Generate sitemap.xml
// ---------------------------------------------------------------------------
function generateSitemap() {
  const staticUrls = [
    { loc: 'https://ethux.design/', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://ethux.design/llms.txt', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://ethux.design/llms-full.txt', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://ethux.design/api/data.json', changefreq: 'weekly', priority: '0.7' },
    { loc: 'https://ethux.design/SKILL.md', changefreq: 'monthly', priority: '0.6' },
    { loc: 'https://ethux.design/AGENTS.md', changefreq: 'monthly', priority: '0.5' },
  ];

  // Add skill file URLs from data
  Object.keys(SKILL_DESCRIPTIONS).forEach(id => {
    staticUrls.push({
      loc: `https://ethux.design/skills/${id}/SKILL.md`,
      changefreq: 'monthly',
      priority: '0.5'
    });
  });

  const entries = staticUrls.map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// 5. Generate noscript HTML fragment
// ---------------------------------------------------------------------------
function generateNoscript() {
  const catItems = DATA.categories.map(cat => {
    const count = cat.problems.length;
    const topProblems = cat.problems.slice(0, 3).map(p => p.title.toLowerCase()).join(', ');
    return `        <li><strong>${cat.title}</strong> — ${cat.hook} ${count} problems including ${topProblems}.</li>`;
  }).join('\n');

  const clItems = DATA.checklists.map(cl => {
    const stds = cl.standards.join(', ');
    return `        <li><strong>${cl.title}</strong> — ${stds} (${cl.items.length} patterns)</li>`;
  }).join('\n');

  return `  <noscript>
    <style>
      .noscript-content { max-width: 720px; margin: 4rem auto; padding: 0 1.5rem; font-family: system-ui, sans-serif; color: #e0e0e6; background: #0a0a0f; line-height: 1.7; }
      .noscript-content h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #f0f0f5; }
      .noscript-content h2 { font-size: 1.3rem; margin-top: 2rem; color: #f0f0f5; border-bottom: 1px solid #222; padding-bottom: 0.4rem; }
      .noscript-content ul { padding-left: 1.2rem; }
      .noscript-content li { margin-bottom: 0.5rem; }
      .noscript-content a { color: #8ab4f8; }
      .noscript-content strong { color: #f0f0f5; }
      .noscript-content .note { margin-top: 2rem; padding: 1rem; background: #151520; border-radius: 8px; font-size: 0.9rem; color: #a0a0aa; }
    </style>
    <div class="noscript-content">
      <h1>EthUX — Ethereum UX Pain Points, Solutions & Research</h1>
      <p>A community-sourced map of ${DATA.categories.reduce((n, c) => n + c.problems.length, 0)} Ethereum UX pain points with real user evidence, solution checklists, and adoption tracking. Built from 32,000+ community reports.</p>

      <h2>UX Problem Categories</h2>
      <ul>
${catItems}
      </ul>

      <h2>Builder Checklists</h2>
      <ul>
${clItems}
      </ul>

      <h2>For AI Agents & Developers</h2>
      <p>Machine-readable data available at:</p>
      <ul>
        <li><a href="/llms.txt">llms.txt</a> — Entry point for AI agents</li>
        <li><a href="/llms-full.txt">llms-full.txt</a> — Complete dataset in markdown</li>
        <li><a href="/api/data.json">api/data.json</a> — Complete dataset in JSON</li>
        <li><a href="/SKILL.md">SKILL.md</a> — Implementation skill router for ${Object.keys(SKILL_DESCRIPTIONS).length} UX domains</li>
      </ul>

      <div class="note">This site requires JavaScript for the full interactive experience. The data above is also available in machine-readable formats via the links above.</div>
    </div>
  </noscript>`;
}

// ---------------------------------------------------------------------------
// 6. Write files
// ---------------------------------------------------------------------------
const markdown = generateMarkdown();
const json = generateJson();
const sitemap = generateSitemap();
const noscript = generateNoscript();

fs.mkdirSync(path.join(ROOT, 'api'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), markdown, 'utf-8');
fs.writeFileSync(path.join(ROOT, 'api', 'data.json'), json, 'utf-8');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf-8');
fs.writeFileSync(path.join(ROOT, 'noscript-fragment.html'), noscript, 'utf-8');

const mdLines = markdown.split('\n').length;
const jsonBytes = Buffer.byteLength(json);
console.log(`Generated llms-full.txt (${mdLines} lines)`);
console.log(`Generated api/data.json (${(jsonBytes / 1024).toFixed(1)} KB)`);
console.log(`Generated sitemap.xml (${sitemap.split('\n').length} lines)`);
console.log(`Generated noscript-fragment.html (reference for index.html)`);
