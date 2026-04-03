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
// 4. Write files
// ---------------------------------------------------------------------------
const markdown = generateMarkdown();
const json = generateJson();

fs.mkdirSync(path.join(ROOT, 'api'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), markdown, 'utf-8');
fs.writeFileSync(path.join(ROOT, 'api', 'data.json'), json, 'utf-8');

const mdLines = markdown.split('\n').length;
const jsonBytes = Buffer.byteLength(json);
console.log(`Generated llms-full.txt (${mdLines} lines)`);
console.log(`Generated api/data.json (${(jsonBytes / 1024).toFixed(1)} KB)`);
