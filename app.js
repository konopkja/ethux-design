// ===========================================
// EthUX Application
// Theme, icons, helpers, renderers, router.
// Expects data.js to be loaded first.
// ===========================================

// ===========================
// THEME
// ===========================
(function() {
  const saved = localStorage.getItem('ethux-theme');
  if (saved === 'light') document.documentElement.classList.add('light');
})();
function toggleTheme() {
  const h = document.documentElement;
  h.classList.toggle('light');
  localStorage.setItem('ethux-theme', h.classList.contains('light') ? 'light' : 'dark');
}


// ===========================
// SVG ICONS
// ===========================
const ICONS = {
  rocket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  chain:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  ethDiamond:'<svg viewBox="0 0 256 417" fill="none"><path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#083AF3"/><path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#083AF3"/><path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#083AF3"/><path d="M127.962 416.905v-104.72L0 236.585z" fill="#083AF3"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
};
function getIcon(n) { return ICONS[n] || ''; }



function getDocUrl(eip) { return eip ? DOC_URLS[eip] || null : null; }

// ===========================
// UTILITIES
// ===========================
function getCategoryStats(cat) {
  const t = cat.problems.length;
  let s=0, ip=0, u=0, r=0;
  cat.problems.forEach(p => { if(p.status==='solved')s++; else if(p.status==='in-progress')ip++; else if(p.status==='research')r++; else u++; });
  return { total:t, solved:s, inProgress:ip, unsolved:u, research:r, progress: Math.round(((s+ip+r)/t)*100) };
}
function getTotalStats() {
  let t=0,s=0,ip=0,u=0,c=0;
  DATA.categories.forEach(cat => { const st=getCategoryStats(cat); t+=st.total; s+=st.solved; ip+=st.inProgress+st.research; u+=st.unsolved; cat.problems.forEach(p=>{if(p.severity==='critical')c++;}); });
  return { total:t, solved:s, inProgress:ip, unsolved:u, critical:c, totalPatterns:DATA.checklists.reduce((a,cl)=>a+(cl.patterns||0),0) };
}
function getCriticalProblems() {
  const r=[];
  DATA.categories.forEach(cat => { cat.problems.forEach(p => { if(p.severity==='critical') r.push({...p,catId:cat.id,catTitle:cat.title}); }); });
  return r;
}
function progressColor(pct) {
  // Red (low) → Amber (mid) → Green (high)
  if (pct <= 50) {
    const t = pct / 50;
    const r = Math.round(224 + (210 - 224) * t);
    const g = Math.round(85 + (160 - 85) * t);
    const b = Math.round(69 + (60 - 69) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = (pct - 50) / 50;
    const r = Math.round(210 + (69 - 210) * t);
    const g = Math.round(160 + (196 - 160) * t);
    const b = Math.round(60 + (112 - 60) * t);
    return `rgb(${r},${g},${b})`;
  }
}
function severityBadge(s) { return `<span class="badge badge-${s}">${s}</span>`; }
function statusBadge(s) { const l={'solved':'Solved','in-progress':'In Progress','unsolved':'Unsolved','research':'Research'}; return `<span class="badge badge-${s}">${l[s]||s}</span>`; }
function solStatusBadge(s) { const m={'Live':'solved','Ongoing':'in-progress','In Progress':'in-progress','Research':'research','None':'unsolved'}; return `<span class="badge badge-${m[s]||'unsolved'}">${s}</span>`; }


// ===========================
// RENDERERS
// ===========================
function renderNav(active) {
  return `
    <nav class="nav" aria-label="Main navigation">
      <a href="#/" class="nav-home" aria-label="EthUX home">
        ${ICONS.ethDiamond}
        <span class="nav-wordmark">EthUX</span>
      </a>
      <div class="nav-links">
        <a href="#/category/getting-started" class="${active==='map'?'active':''}">Pain Points</a>
        <a href="#/checklists" class="${active==='checklists'?'active':''}">Solutions</a>
        <a href="#/insights" class="${active==='insights'?'active':''}">Insights</a>
        <a href="#/agents" class="${active==='agents'?'active':''}">AI Agents</a>
        <a href="#/about" class="${active==='about'?'active':''}">About</a>
        <a href="#/submit" class="${active==='submit'?'active':''}">Submit</a>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <span class="icon-moon">${ICONS.moon}</span>
        <span class="icon-sun">${ICONS.sun}</span>
      </button>
    </nav>`;
}

function renderFooter() {
  return `<div class="container"><footer class="footer"><div class="footer-text"><strong>EthUX</strong> &mdash; Open source UX research. <a href="https://github.com/ethereum/ux" target="_blank" rel="noopener noreferrer">GitHub</a> &middot; <a href="mailto:ux@ethereum.org">ux@ethereum.org</a></div><div class="footer-issue">Issue 02 / Feb 2026</div></footer></div>`;
}

function renderHome() {
  const stats = getTotalStats();
  const crits = getCriticalProblems();

  let catCards = '';
  DATA.categories.forEach((cat, i) => {
    const s = getCategoryStats(cat);
    const num = String(i + 1).padStart(2, '0');
    catCards += `<div class="cat-card fade-up stagger-${i+1}" style="--cat-color:${cat.color};" role="button" tabindex="0" aria-label="View ${cat.title}" onclick="navigate('/category/${cat.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('/category/${cat.id}')}"><div class="cat-card-title">${cat.title}</div><div class="cat-card-bottom"><div class="cat-card-count">${s.total} pain points</div></div></div>`;
  });

  let critItems = '';
  crits.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const details = CRITICAL_DETAILS[p.title] || {};
    const solTags = p.solutions.map(s => `<span class="crit-sol-tag">${s.name}</span>`).join('');
    critItems += `<div class="crit-card" id="crit-${i}"><div class="crit-item" onclick="toggleCrit(${i})"><span class="crit-num">${num}</span><div class="crit-info"><div class="crit-info-title">${p.title}</div><div class="crit-info-cat">${p.catTitle}</div></div><span class="crit-severity">Critical</span><span class="crit-expand" aria-hidden="true">&#9654;</span></div><div class="crit-detail"><div class="crit-detail-inner">${details.story ? `<div class="crit-story">${details.story}</div>` : `<div class="crit-story">${p.desc}</div>`}<div class="crit-solutions-row">${solTags}</div><div class="crit-meta-grid">${details.opportunity ? `<div class="crit-meta-box"><div class="crit-meta-label opp">Opportunity if fixed</div><div class="crit-meta-text">${details.opportunity}</div></div>` : ''} ${details.risk ? `<div class="crit-meta-box"><div class="crit-meta-label risk">Risk if ignored</div><div class="crit-meta-text">${details.risk}</div></div>` : ''}</div><a class="crit-link-cat" href="#/category/${p.catId}">View in ${p.catTitle} &rarr;</a></div></div></div>`;
  });

  let guideCards = '';
  DATA.checklists.forEach(cl => {
    guideCards += `<a href="#/checklists/${cl.id}" class="guide-card" style="text-decoration:none;color:inherit;display:block;"><div class="guide-card-title">${cl.title}<span class="guide-format-badges"><span class="guide-format human">UI Checklist</span><span class="guide-format agent">Agent MD</span></span></div><div class="guide-card-desc">${cl.desc}</div><div class="guide-tags"><span class="guide-tag">${cl.patterns} patterns</span>${(cl.standards||[]).map(s=>`<span class="guide-tag">${s}</span>`).join('')}</div></a>`;
  });

  return `
    ${renderNav('map')}
    <main id="main-content">
      <div class="container">
        <section class="hero">
          <div class="hero-eyebrow">UX Observatory</div>
          <h1 class="hero-title">Mapping<br><span class="accent">Ethereum UX</span></h1>
          <p class="hero-desc"><a href="#/chasm" class="hero-desc-link">What got us here won't get us there.</a> Early adopters adopt for different reasons than majority adopters.</p>
          <p class="hero-desc" style="margin-top:8px;">A living catalog of the usability and comprehension barriers that stand between blockchain applications and their next million users.</p>
          <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;">
            <a href="#/category/getting-started" class="hero-cta">View Pain Points ${ICONS.arrow}</a>
            <a href="#/checklists" class="hero-cta" style="background:none;color:var(--amber);padding-left:0;">Explore Solutions ${ICONS.arrow}</a>
          </div>
        </section>
      </div>

      <div class="container">
        <div class="stats-bar">
          <div class="stat-cell"><div class="stat-value">${stats.total}</div><div class="stat-label">Pain Points</div></div>
          <div class="stat-cell"><div class="stat-value accent">${stats.inProgress}</div><div class="stat-label">Being Solved</div></div>
          <div class="stat-cell"><div class="stat-value">${DATA.checklists.length}</div><div class="stat-label">Solutions</div></div>
        </div>
      </div>

      <div class="container">
        <section class="section">
          <div class="section-eyebrow">Categories</div>
          <div class="section-title">Problem Map</div>
          <div class="section-desc">${stats.total} UX pain points organized across 8 categories. Each tracks severity, solution progress, and adoption across the wallet ecosystem. Click any category to explore.</div>
          <div class="cat-grid">${catCards}</div>
        </section>

        <section class="section">
          <div class="section-eyebrow">Research</div>
          <div class="section-title">Insights</div>
          <div class="section-desc">Foundational UX frameworks from the CRADL research (2022). Why the current approach to Ethereum UX doesn't scale, and what needs to change.</div>
          <div class="insight-grid">
            <a href="#/chasm" class="insight-card">
              <div class="insight-card-eyebrow">Adoption</div>
              <div class="insight-card-title">The Chasm</div>
              <div class="insight-card-desc">Why early adopter UX doesn't scale to the majority. Beautiful UI can mask dangerous UX.</div>
            </a>
            <a href="#/onboarding" class="insight-card">
              <div class="insight-card-eyebrow">Framework</div>
              <div class="insight-card-title">Onboarding Journey</div>
              <div class="insight-card-desc">Five barriers between curiosity and competence. The minimum viable knowledge problem.</div>
            </a>
            <a href="#/paradigms" class="insight-card">
              <div class="insight-card-eyebrow">Design</div>
              <div class="insight-card-title">Investing vs Transacting</div>
              <div class="insight-card-desc">Ethereum has a dual-nature problem. Mixing investment and payment UX creates confusion.</div>
            </a>
          </div>
        </section>

        <section class="section">
          <div class="section-eyebrow">For Builders</div>
          <div class="section-title">Solutions</div>
          <div class="section-desc">Each solution ships as a UI checklist for design reviews and an agent-readable SKILL.md for AI coding assistants. Decision trees, code examples, and wallet support matrices included.</div>
          <div class="guide-grid">${guideCards}</div>
          <a href="#/checklists" class="btn btn-ghost" style="margin-top:24px;">All Solutions</a>
        </section>

        <div class="cta-section">
          <div class="cta-text"><strong>Encountered a UX issue?</strong> Help us track what needs fixing.</div>
          <a href="#/submit" class="btn btn-primary">Report It</a>
        </div>
      </div>

      ${renderFooter()}
    </main>`;
}

function renderCategory(catId) {
  const cat = DATA.categories.find(c=>c.id===catId);
  if (!cat) return renderHome();
  const stats = getCategoryStats(cat);
  let cards = '';
  cat.problems.forEach((p,i) => {
    const details = PROBLEM_DETAILS[p.title] || {};
    let solRows = '';
    p.solutions.forEach(s => { solRows += `<tr><td>${s.name}</td><td>${solStatusBadge(s.status)}</td></tr>`; });
    let eipTags = '';
    if (p.eips.length) { eipTags = `<div class="problem-eips"><span class="problem-eips-label">Related standards:</span>${p.eips.map(e=>`<span class="eip-tag">${e}</span>`).join('')}</div>`; }
    let clLink = '';
    if (p.checklist) { clLink = `<a class="problem-checklist-link" href="#/checklists">View ${p.checklist} solution &rarr;</a>`; }
    let metaGrid = '';
    if (details.opportunity || details.risk) {
      metaGrid = `<div class="problem-meta-grid">${details.opportunity ? `<div class="problem-meta-box"><div class="problem-meta-label opp">Opportunity if fixed</div><div class="problem-meta-text">${details.opportunity}</div></div>` : ''}${details.risk ? `<div class="problem-meta-box"><div class="problem-meta-label risk">Risk if ignored</div><div class="problem-meta-text">${details.risk}</div></div>` : ''}</div>`;
    }
    cards += `<div class="problem-card fade-up stagger-${Math.min(i+1,8)}" id="problem-${catId}-${i}"><div class="problem-head" role="button" tabindex="0" aria-expanded="false" aria-controls="pb-${catId}-${i}" onclick="toggleProblem('${catId}',${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleProblem('${catId}',${i})}"><span class="problem-expand" aria-hidden="true">&#9654;</span><span class="problem-title">${p.title}</span><div class="problem-badges">${severityBadge(p.severity)}${statusBadge(p.status)}</div></div><div class="problem-body" id="pb-${catId}-${i}" role="region" aria-label="${p.title} details"><div class="problem-content"><div class="problem-desc">${p.desc}</div><div class="sol-section"><table class="sol-table"><thead><tr><th>Solution</th><th>Status</th></tr></thead><tbody>${solRows}</tbody></table></div>${metaGrid}${eipTags}${clLink}</div></div></div>`;
  });
  let catNav = DATA.categories.map(c => c.id === catId ? `<span class="cat-nav-item active">${c.title}</span>` : `<a class="cat-nav-item" href="#/category/${c.id}">${c.title}</a>`).join('');
  return `
    ${renderNav('map')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <a class="cat-back" href="#/">Back to map</a>
        <div class="cat-page-title">${cat.title}</div>
        <div class="cat-page-desc">${cat.desc}</div>
        <div class="cat-nav">${catNav}</div>
        <div class="cat-progress-row">
          <div class="progress-track" role="progressbar" aria-valuenow="${stats.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${cat.title} progress"><div class="progress-fill" style="background:${cat.color};" data-width="${stats.progress}%"></div></div>
          <span class="cat-progress-pct">${stats.progress}%</span>
          <span class="cat-progress-stats">${stats.inProgress+stats.research} active &middot; ${stats.unsolved} unsolved</span>
        </div>
        <div class="problem-list">${cards}</div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderSubmit() {
  return `
    ${renderNav('submit')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <div style="max-width:640px;">
          <div class="section-eyebrow">Community</div>
          <div class="section-title">Report a UX Issue</div>
          <div class="section-desc">Every submission is reviewed and triaged. Your frustration helps us build the case for better UX across the ecosystem.</div>
          <div class="form-card">
            <form id="submit-form" onsubmit="handleSubmit(event)">
              <div class="form-group"><label class="form-label" for="s-title">What happened</label><input class="form-input" id="s-title" type="text" placeholder="e.g., Can't see my tokens on Arbitrum" required></div>
              <div class="form-group"><label class="form-label" for="s-desc">Tell us more</label><textarea class="form-textarea" id="s-desc" placeholder="What did you expect? What wallet or dapp were you using?" required></textarea></div>
              <div class="form-group"><label class="form-label" for="s-cat">Category</label><select class="form-select" id="s-cat"><option value="">Pick the closest match...</option>${DATA.categories.map(c=>`<option value="${c.id}">${c.title}</option>`).join('')}<option value="other">Other / Not sure</option></select></div>
              <div class="form-group"><label class="form-label" for="s-contact">Contact <span class="form-label-opt">(optional)</span></label><input class="form-input" id="s-contact" type="text" placeholder="Email, Telegram, or Twitter handle"><div class="form-hint">Only used if we need clarification. Never shared.</div></div>
              <button class="btn btn-primary" type="submit">Submit</button>
              <div class="success-msg">Thanks for sharing. We'll review this and add it to the tracker.</div>
            </form>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderChecklists() {
  const tp = DATA.checklists.reduce((s,c)=>s+(c.items?c.items.length:c.patterns||0),0);
  const ts = new Set(DATA.checklists.flatMap(c=>c.standards||[])).size;
  const checked = getCheckedItems();

  let sections = '';
  DATA.checklists.forEach((cl, i) => {
    let done = 0;
    cl.items.forEach((_, j) => { if (checked[`${cl.id}-${j}`]) done++; });
    const pct = Math.round((done / cl.items.length) * 100);
    const circ = 2 * Math.PI * 17;
    const offset = circ - (circ * pct / 100);

    let items = '';
    cl.items.forEach((item, j) => {
      const key = `${cl.id}-${j}`;
      const isDone = checked[key];
      const docUrl = getDocUrl(item.eip);
      const docLink = docUrl ? `<a class="cl-item-doc" href="${docUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Docs</a>` : '';
      items += `<div class="cl-item ${isDone ? 'done' : ''}" data-cl="${key}"><button class="cl-checkbox ${isDone ? 'checked' : ''}" onclick="toggleCheckItem('${cl.id}',${j})" aria-label="Toggle ${item.text}"></button><span class="cl-item-num">${j+1}</span><div class="cl-item-content" onclick="toggleCheckItem('${cl.id}',${j})"><div class="cl-item-text">${item.text}</div>${item.benefit ? `<div class="cl-item-benefit">${item.benefit}</div>` : ''}<div class="cl-item-meta">${item.eip ? `<span class="cl-item-eip">${item.eip}</span>` : ''}<span class="cl-item-priority ${item.priority}">${item.priority}</span>${docLink}</div></div></div>`;
    });

    sections += `<div class="cl-section fade-up stagger-${Math.min(i+1,7)}" id="cl-${cl.id}"><div class="cl-header" onclick="toggleCLSection('${cl.id}')"><span class="cl-expand" aria-hidden="true">&#9654;</span><div class="cl-header-info"><div class="cl-header-title">${cl.title}</div><div class="cl-header-desc">${cl.desc}</div></div><div class="cl-header-meta"><div class="cl-progress-ring"><svg><circle class="track" cx="20" cy="20" r="17" /><circle class="fill" cx="20" cy="20" r="17" style="stroke-dasharray:${circ.toFixed(1)};stroke-dashoffset:${offset.toFixed(1)}" /></svg><div class="cl-progress-text">${pct}%</div></div></div></div><div class="cl-body"><div class="cl-body-inner"><div class="cl-items">${items}</div><div class="cl-agent-bar"><div class="cl-agent-bar-text"><strong>AI Agent:</strong> Point your coding agent to <code>checklists/${cl.id}/SKILL.md</code></div><button class="cl-dl-btn" onclick="event.stopPropagation();downloadSkill('${cl.id}')">Download</button></div></div></div></div>`;
  });

  return `
    ${renderNav('checklists')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <div class="section-eyebrow">Reference</div>
        <div class="section-title">Solutions</div>
        <div class="section-desc">${tp} patterns across ${DATA.checklists.length} solutions. Tick items off as you implement them. Your progress is saved locally. Each solution also ships as an agent-readable SKILL.md.</div>
        <div style="display:flex;gap:40px;margin-bottom:40px;">
          <div><div class="stat-value">${DATA.checklists.length}</div><div class="stat-label">Solutions</div></div>
          <div><div class="stat-value">${tp}</div><div class="stat-label">Patterns</div></div>
          <div><div class="stat-value accent">${ts}+</div><div class="stat-label">Standards</div></div>
        </div>
        <div class="cl-accordion">${sections}</div>
        <div class="section" style="margin-top:64px;">
          <div class="section-eyebrow">Recipes</div>
          <div class="section-title" style="font-size:clamp(1.6rem,3vw,2.4rem);margin-bottom:12px;">Which solutions to combine</div>
          <div class="section-desc">Most features touch multiple solutions. Here's which to combine:</div>
          <div style="border:1px solid var(--border);background:var(--bg-panel-solid);padding:24px;border-radius:12px;color:var(--text);">
            <table class="recipe-table"><thead><tr><th>Feature</th><th>Primary</th><th>Also Read</th></tr></thead><tbody>
              <tr><td>Swap interface</td><td><span class="eip-tag">approvals</span></td><td>signing, gas, onboarding</td></tr>
              <tr><td>Send tokens</td><td><span class="eip-tag">safety</span></td><td>gas, multichain</td></tr>
              <tr><td>Bridge assets</td><td><span class="eip-tag">multichain</span></td><td>gas, signing</td></tr>
              <tr><td>Onboard new users</td><td><span class="eip-tag">onboarding</span></td><td>wallets, gas</td></tr>
              <tr><td>Wallet connection</td><td><span class="eip-tag">wallets</span></td><td>onboarding, safety</td></tr>
              <tr><td>DeFi deposit/stake</td><td><span class="eip-tag">approvals</span></td><td>signing, gas</td></tr>
            </tbody></table>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderAbout() {
  return `
    ${renderNav('about')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <div style="max-width:640px;" class="about-content">
          <h1>About<br>EthUX</h1>
          <p>EthUX is a living, community-sourced map of Ethereum's biggest UX problems, matched with the solutions being built to address them.</p>
          <p>The goal is to surface critical UX issues from the user's perspective, triage them, coordinate communities around these problems, and track adoption of solutions across the ecosystem.</p>
          <p>This is not a polished report. It's a collaborative, evolving tracker. Based on research from <strong>14,900+ real Ethereum user stories</strong>.</p>
          <h2>Collaborate</h2>
          <p>Join the conversation on <a href="https://discord.gg/tFmDq3c7" target="_blank" rel="noopener noreferrer">Discord</a> to connect with designers, researchers, and builders working on Ethereum UX.</p>
          <h2>For AI Agents</h2>
          <p>Our solutions are designed to be consumed by AI coding agents. Each solution is a markdown file with YAML frontmatter, decision trees, and code examples.</p>
          <p>Point your agent to <code class="code-path" style="display:inline;">ux.ethereum.org/SKILL.md</code> for the root index.</p>
          <h2>Contributing</h2>
          <p>This project is open source. Submit UX issues through our <a href="#/submit">feedback form</a>, contribute on <a href="https://github.com/ethereum/ux" target="_blank" rel="noopener noreferrer">GitHub</a>, or reach out at <a href="mailto:ux@ethereum.org">ux@ethereum.org</a>.</p>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderInsights() {
  return `
    ${renderNav('insights')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <div class="section-eyebrow">Research</div>
        <div class="section-title">Insights</div>
        <div class="section-desc">Foundational UX frameworks from the CRADL research (2022). Why the current approach to Ethereum UX doesn't scale, and what needs to change.</div>
        <div class="insight-grid" style="margin-top:32px;">
          <a href="#/chasm" class="insight-card">
            <div class="insight-card-eyebrow">Adoption</div>
            <div class="insight-card-title">The Chasm</div>
            <div class="insight-card-desc">Why early adopter UX doesn't scale to the majority. Beautiful UI can mask dangerous UX.</div>
          </a>
          <a href="#/onboarding" class="insight-card">
            <div class="insight-card-eyebrow">Framework</div>
            <div class="insight-card-title">Onboarding Journey</div>
            <div class="insight-card-desc">Five barriers between curiosity and competence. The minimum viable knowledge problem.</div>
          </a>
          <a href="#/paradigms" class="insight-card">
            <div class="insight-card-eyebrow">Design</div>
            <div class="insight-card-title">Investing vs Transacting</div>
            <div class="insight-card-desc">Ethereum has a dual-nature problem. Mixing investment and payment UX creates confusion.</div>
          </a>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderChasm() {
  return `
    ${renderNav('insights')}
    <main id="main-content">
      <div class="container">
        <div class="prose">
          <h1>The Chasm</h1>
          <p class="page-subtitle">Why early adopter UX doesn't scale to the mainstream.</p>

          <div class="curve-container">
            <div class="curve-segments">
              <div class="curve-bar innovators">
                <div class="curve-bar-fill"></div>
                <div class="curve-bar-label">Innovators</div>
                <div class="curve-bar-pct">2.5%</div>
              </div>
              <div class="curve-bar early-adopters">
                <div class="curve-bar-fill"></div>
                <div class="curve-bar-label">Early Adopters</div>
                <div class="curve-bar-pct">13.5%</div>
              </div>
              <div class="curve-chasm"><span class="curve-chasm-label">Chasm</span></div>
              <div class="curve-bar early-majority">
                <div class="curve-bar-fill"></div>
                <div class="curve-bar-label">Early Majority</div>
                <div class="curve-bar-pct">34%</div>
              </div>
              <div class="curve-bar late-majority">
                <div class="curve-bar-fill"></div>
                <div class="curve-bar-label">Late Majority</div>
                <div class="curve-bar-pct">34%</div>
              </div>
              <div class="curve-bar laggards">
                <div class="curve-bar-fill"></div>
                <div class="curve-bar-label">Laggards</div>
                <div class="curve-bar-pct">16%</div>
              </div>
            </div>
          </div>

          <h2>Why Early Adopter UX Doesn't Scale</h2>
          <p>Early adopters are willing to tolerate friction. They're motivated by ideology, speculation, or technical curiosity. They'll learn seed phrases, navigate gas fees, and debug failed transactions because the payoff justifies the pain.</p>
          <p>The majority adopter is different. They need things to "just work." They won't read documentation, won't troubleshoot, and won't forgive a single catastrophic error. The UX that got Ethereum to 10 million users will not get it to 100 million.</p>

          <h2>Conceptual vs Material Barriers</h2>
          <p>There are two distinct types of barriers that prevent adoption:</p>
          <ul>
            <li><strong>Conceptual barriers</strong> are knowledge gaps. Users don't understand what a wallet is, what gas means, or why they need to approve a token before swapping it. These barriers can be addressed through education and better framing.</li>
            <li><strong>Material barriers</strong> are real friction in the product. Slow confirmation times, high fees, irreversible mistakes, and fragmented liquidity across chains. These require protocol-level and infrastructure improvements.</li>
          </ul>
          <p>Most current UX work focuses on material barriers (faster chains, cheaper fees). But conceptual barriers are equally responsible for drop-off. Users who don't understand what they're doing will leave, no matter how fast the chain is.</p>

          <h2>Beautiful UI Masks Dangerous UX</h2>
          <blockquote><p>A polished interface can make a dangerous action feel safe. The "landmine" problem: everything looks fine until something goes catastrophically wrong.</p></blockquote>
          <p>Modern wallets and dApps have significantly improved visual design. But aesthetic polish often obscures the underlying risks: unlimited token approvals hidden behind friendly "Approve" buttons, irreversible cross-chain transfers presented as simple sends, and phishing sites that look pixel-perfect.</p>
          <p>For majority adopters, the gap between perceived safety and actual safety is where trust collapses. One bad experience, one lost transaction, and they're gone permanently.</p>

          <h2>What Majority Adopters Need</h2>
          <ul>
            <li><strong>Reversibility by default.</strong> Cancel, undo, or at minimum a clear warning before anything irreversible happens.</li>
            <li><strong>Progressive disclosure.</strong> Don't front-load complexity. Show advanced options only when needed.</li>
            <li><strong>Familiar mental models.</strong> Map crypto concepts to patterns users already know (sending money, logging in, saving).</li>
            <li><strong>Error recovery.</strong> When something goes wrong, guide users to fix it rather than showing a transaction hash and a shrug.</li>
            <li><strong>Social proof and trust signals.</strong> Majority adopters adopt because people they trust have adopted. UX should support social onboarding paths.</li>
          </ul>

          <div class="cross-links">
            <div class="cross-links-title">Related</div>
            <div class="cross-links-list">
              <a href="#/category/onboarding" class="cross-link">User Onboarding</a>
              <a href="#/category/language" class="cross-link">Language & Accessibility</a>
              <a href="#/onboarding" class="cross-link">Onboarding Journey</a>
              <a href="#/paradigms" class="cross-link">Investing vs Transacting</a>
            </div>
          </div>

          <div class="cradl-attribution">
            Based on research from <a href="https://cradl.org" target="_blank" rel="noopener noreferrer">CRADL</a> (2022), funded by the World Economic Forum and Ethereum Foundation. Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderOnboarding() {
  return `
    ${renderNav('insights')}
    <main id="main-content">
      <div class="container">
        <div class="prose">
          <h1>Onboarding<br>Journey</h1>
          <p class="page-subtitle">Five barriers between first curiosity and confident use. A framework for understanding where users get stuck.</p>

          <div class="journey-steps">
            <div class="journey-step active">
              <div class="journey-step-num">1</div>
              <div class="journey-step-title">The Spark</div>
              <div class="journey-step-desc">Something triggers interest: a friend's recommendation, a news story, a financial incentive. The user decides to explore. This moment is fragile. Confusion in the next 60 seconds means permanent drop-off.</div>
            </div>
            <div class="journey-step">
              <div class="journey-step-num">2</div>
              <div class="journey-step-title">Understanding Barrier</div>
              <div class="journey-step-desc">The user encounters unfamiliar concepts: wallets, keys, gas, networks. They need just enough understanding to proceed, not comprehensive education. Most onboarding fails by explaining too much or too little.</div>
            </div>
            <div class="journey-step">
              <div class="journey-step-num">3</div>
              <div class="journey-step-title">Setup Barrier</div>
              <div class="journey-step-desc">Installing a wallet, securing a seed phrase, funding with ETH. Each step is a potential drop-off. The gap between "I want to try this" and "I'm ready to use this" is where most users are lost.</div>
            </div>
            <div class="journey-step">
              <div class="journey-step-num">4</div>
              <div class="journey-step-title">First-Time Experience</div>
              <div class="journey-step-desc">The first real transaction: a swap, a send, a mint. This moment defines the user's mental model. If it feels safe and predictable, they continue. If anything unexpected happens, trust breaks.</div>
            </div>
            <div class="journey-step">
              <div class="journey-step-num">5</div>
              <div class="journey-step-title">Overarching Experience</div>
              <div class="journey-step-desc">The ongoing relationship with the ecosystem. Portfolio management, cross-chain movement, recovery from errors. This is where retained users either deepen engagement or slowly drift away.</div>
            </div>
          </div>

          <h2>Minimum Viable Knowledge</h2>
          <p>Users don't need to understand blockchain to use it. They need the minimum knowledge to complete their first task safely. This means:</p>
          <ul>
            <li>What a wallet is (not how cryptography works)</li>
            <li>That transactions cost gas (not how the EVM prices computation)</li>
            <li>That seed phrases must be kept private (not how key derivation works)</li>
            <li>That some actions are irreversible (not why consensus requires finality)</li>
          </ul>
          <p>Over-explaining is as harmful as under-explaining. The goal is confidence, not comprehension.</p>

          <h2>Ownership Is the Best Teacher</h2>
          <p>Abstract education doesn't work. Users learn by doing. The most effective onboarding gets users to own something real as quickly as possible: a small amount of ETH, an NFT, a token. Once they own it, concepts like wallets, transactions, and gas become concrete rather than theoretical.</p>
          <blockquote><p>People don't learn to swim by reading about water. Get them in the pool with supervision, not a textbook.</p></blockquote>

          <h2>Onboarding Is Social</h2>
          <p>The most successful onboarding happens through trusted relationships: a friend walking someone through their first wallet setup, a community member explaining a protocol. Technology alone can't replace this social layer.</p>
          <p>Products that support social onboarding (referral flows, guided setup with a friend, community-led education) consistently outperform those that rely on documentation and tutorials alone.</p>

          <h2>Evaluate Your Onboarding</h2>
          <h3>Self-assessment checklist</h3>
          <ul>
            <li>Can a user complete their first meaningful action within 5 minutes?</li>
            <li>Does the setup process require fewer than 3 unfamiliar concepts?</li>
            <li>Is there a clear recovery path if the user makes a mistake during setup?</li>
            <li>Can the user explain what they did to a friend after completing onboarding?</li>
            <li>Does onboarding lead to ownership of something real (not just a tutorial)?</li>
            <li>Is there a social sharing or referral mechanism built into the flow?</li>
            <li>Do you track where users drop off and iterate on those specific steps?</li>
          </ul>

          <div class="cross-links">
            <div class="cross-links-title">Related</div>
            <div class="cross-links-list">
              <a href="#/category/onboarding" class="cross-link">User Onboarding</a>
              <a href="#/chasm" class="cross-link">The Chasm</a>
              <a href="#/checklists" class="cross-link">Onboarding Solution</a>
              <a href="#/paradigms" class="cross-link">Investing vs Transacting</a>
            </div>
          </div>

          <div class="cradl-attribution">
            Based on research from <a href="https://cradl.org" target="_blank" rel="noopener noreferrer">CRADL</a> (2022), funded by the World Economic Forum and Ethereum Foundation. Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderParadigms() {
  return `
    ${renderNav('insights')}
    <main id="main-content">
      <div class="container">
        <div class="prose">
          <h1>Investing vs<br>Transacting</h1>
          <p class="page-subtitle">Ethereum serves two fundamentally different user mindsets. Mixing them in the same interface creates confusion and risk.</p>

          <div class="paradigm-compare">
            <div class="paradigm-box investing">
              <div class="paradigm-box-title">
                <svg class="paradigm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h20"/><path d="M5 20V9l4-5 4 6 4-3 3 4v9"/></svg>
                Investing Mindset
              </div>
              <ul>
                <li>Price-focused, portfolio view</li>
                <li>Hold, stake, yield-seeking</li>
                <li>Tolerates complexity for returns</li>
                <li>Charts, analytics, comparisons</li>
                <li>Risk is calculated and accepted</li>
                <li>Time horizon: weeks to years</li>
              </ul>
            </div>
            <div class="paradigm-box transacting">
              <div class="paradigm-box-title">
                <svg class="paradigm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                Transacting Mindset
              </div>
              <ul>
                <li>Task-focused, action-oriented</li>
                <li>Send, swap, pay, mint</li>
                <li>Expects simplicity and speed</li>
                <li>Status, confirmation, receipts</li>
                <li>Risk should be near-zero</li>
                <li>Time horizon: seconds to minutes</li>
              </ul>
            </div>
          </div>

          <h2>The Dual Nature Problem</h2>
          <p>Most crypto interfaces try to serve both mindsets simultaneously. A wallet shows your portfolio balance (investing) right next to a "Send" button (transacting). A DEX shows price charts (investing) alongside a swap form (transacting).</p>
          <p>This creates a fundamental UX tension. Investing UI wants to give you more information, more options, more control. Transacting UI wants to strip everything away and get you to your goal as fast as possible.</p>

          <h2>Why Mixing Creates Confusion</h2>
          <ul>
            <li><strong>Cognitive overload.</strong> A user trying to pay a friend doesn't need to see their portfolio performance. A user analyzing yield opportunities doesn't need a simplified send form.</li>
            <li><strong>Risk miscalibration.</strong> Investment interfaces normalize high-value interactions. This can make a $5,000 approval feel routine when it should feel significant.</li>
            <li><strong>Feature creep.</strong> Serving both mindsets in one view leads to interfaces that do everything adequately and nothing excellently.</li>
          </ul>

          <h2>Contained vs Disparate Experiences</h2>
          <p>There's an important distinction between:</p>
          <ul>
            <li><strong>Contained experiences</strong> keep the user within a single, coherent flow. Everything needed to complete a task is in one place. Example: a swap interface that handles token selection, pricing, approval, and confirmation without leaving the page.</li>
            <li><strong>Disparate experiences</strong> scatter the flow across multiple tools, sites, and contexts. Example: needing to check a portfolio tracker, then open a DEX, then approve in a wallet popup, then confirm in another popup, then check a block explorer for confirmation.</li>
          </ul>
          <p>Most Ethereum interactions today are disparate. The user's mental model is constantly interrupted by context switches.</p>

          <h2>Experience Bridges</h2>
          <p>Rather than forcing one interface to serve both mindsets, the research suggests building "bridges" between them:</p>
          <ul>
            <li>A portfolio view that offers contextual actions ("You could earn 4.2% on this idle ETH")</li>
            <li>A transaction flow that shows portfolio impact after completion ("Your ETH balance is now X")</li>
            <li>Clear mode switches that change the entire UI context rather than mixing elements</li>
          </ul>

          <h2>Design Recommendation</h2>
          <blockquote><p>Choose a primary paradigm and design for it. Then build bridges to the secondary paradigm rather than mixing both into every screen.</p></blockquote>
          <p>If your product is primarily for transacting (payments, remittances, daily use), optimize for speed and simplicity. Offer investment features as an optional layer. If your product is primarily for investing (DeFi, portfolio management), optimize for information density and control. Offer quick-action shortcuts for common transactions.</p>

          <div class="cross-links">
            <div class="cross-links-title">Related</div>
            <div class="cross-links-list">
              <a href="#/category/operations" class="cross-link">Daily Operations</a>
              <a href="#/category/cross-chain" class="cross-link">Cross-chain</a>
              <a href="#/chasm" class="cross-link">The Chasm</a>
              <a href="#/onboarding" class="cross-link">Onboarding Journey</a>
            </div>
          </div>

          <div class="cradl-attribution">
            Based on research from <a href="https://cradl.org" target="_blank" rel="noopener noreferrer">CRADL</a> (2022), funded by the World Economic Forum and Ethereum Foundation. Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}


function renderAgents() {
  const tp = DATA.checklists.reduce((s,c) => s + (c.items ? c.items.length : 0), 0);

  let skillCards = '';
  DATA.checklists.forEach((cl, i) => {
    const info = SKILL_DESCRIPTIONS[cl.id] || {};
    const useCases = (info.useCases || []).map(u => `<div class="skill-card-what-item">${u}</div>`).join('');
    const tags = (cl.standards || []).map(s => `<span class="eip-tag">${s}</span>`).join('');

    const icon = SKILL_ICONS[cl.id] || '';
    skillCards += `<div class="skill-card fade-up stagger-${Math.min(i+1,7)}"><div class="skill-card-info"><div class="skill-card-head"><div class="skill-card-icon">${icon}</div><div><div class="skill-card-title">${cl.title}</div><div class="skill-card-path">checklists/${cl.id}/SKILL.md</div></div></div><div class="skill-card-desc">${info.humanDesc || cl.desc}</div><div class="skill-card-what"><div class="skill-card-what-title">When to use</div>${useCases}</div><div class="skill-card-tags" style="margin-top:12px;">${tags}</div></div><div class="skill-card-actions"><button class="cl-dl-btn" onclick="downloadSkill('${cl.id}')">Download</button></div></div>`;
  });

  return `
    ${renderNav('agents')}
    <main id="main-content">
      <div class="container" style="padding-top:80px;min-height:100vh;">
        <div class="section-eyebrow">For AI Coding Agents</div>
        <div class="section-title">SKILL.md Files</div>
        <div class="section-desc" style="margin-bottom:32px;">Each SKILL.md is a structured markdown file your AI coding agent can read to implement Ethereum UX patterns correctly. Point your agent to the file path and it gets decision trees, code examples, NEVER/ALWAYS rules, and wallet support data.</div>

        <div class="agents-hero-box">
          <div class="agents-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
          <div class="agents-hero-content">
            <div class="agents-hero-title">Quick Start</div>
            <p>Point your agent to <code>ux.ethereum.org/SKILL.md</code> for the root index. It contains all 7 skill files with decision trees, code examples, and wallet support matrices. Or download individual files below.</p>
            <div class="agents-dl-all"><button class="cl-dl-btn" onclick="downloadAllSkills()" style="margin-top:0;">Download All Skills</button><span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);">7 files &middot; ${tp} patterns</span></div>
          </div>
        </div>

        <div class="skill-grid">${skillCards}</div>

        <div class="section" style="margin-top:64px;">
          <div class="section-eyebrow">How it works</div>
          <div class="section-title" style="font-size:clamp(1.6rem,3vw,2.4rem);margin-bottom:12px;">Integration Guide</div>
          <div style="display:flex;flex-direction:column;gap:2px;background:var(--border);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
            <div style="background:var(--bg-panel-solid);padding:24px 28px;"><div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);margin-bottom:8px;">Step 1</div><div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px;">Download or point to the SKILL.md</div><div style="font-size:0.9rem;color:var(--text-dim);">Add the file to your project root or reference the URL. Most AI agents (Cursor, Claude Code, GitHub Copilot) can read markdown files as context.</div></div>
            <div style="background:var(--bg-panel-solid);padding:24px 28px;"><div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);margin-bottom:8px;">Step 2</div><div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px;">Tell your agent to follow it</div><div style="font-size:0.9rem;color:var(--text-dim);">Prompt: "Follow the UX patterns in checklists/gas/SKILL.md when implementing this feature." The agent reads the decision tree and applies the correct pattern.</div></div>
            <div style="background:var(--bg-panel-solid);padding:24px 28px;"><div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);margin-bottom:8px;">Step 3</div><div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px;">Review against the UI Checklist</div><div style="font-size:0.9rem;color:var(--text-dim);">Use the <a href="#/checklists" style="color:var(--amber);text-decoration:none;border-bottom:1px solid var(--amber-dim);">Solutions</a> to manually verify the agent's output matches each checklist item.</div></div>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}


// ===========================
// INTERACTIONS
// ===========================
function toggleProblem(catId, index) {
  const el = document.getElementById(`problem-${catId}-${index}`);
  if (!el) return;
  const body = el.querySelector('.problem-body');
  el.classList.toggle('open');
  const isOpen = el.classList.contains('open');
  const h = el.querySelector('.problem-head');
  if (h) h.setAttribute('aria-expanded', isOpen);
  if (body) {
    if (isOpen) {
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = '';
    }
  }
}
function toggleCrit(index) {
  const el = document.getElementById(`crit-${index}`);
  if (el) { el.classList.toggle('open'); }
}
function toggleCLSection(id) {
  const el = document.getElementById(`cl-${id}`);
  if (el) { el.classList.toggle('open'); }
}
function getCheckedItems() {
  try { return JSON.parse(localStorage.getItem('ethux-checked') || '{}'); } catch(e) { return {}; }
}
function toggleCheckItem(guideId, idx) {
  const checked = getCheckedItems();
  const key = `${guideId}-${idx}`;
  if (checked[key]) { delete checked[key]; } else { checked[key] = true; }
  localStorage.setItem('ethux-checked', JSON.stringify(checked));
  const item = document.querySelector(`[data-cl="${key}"]`);
  const cb = item?.querySelector('.cl-checkbox');
  if (item && cb) {
    item.classList.toggle('done');
    cb.classList.toggle('checked');
  }
  updateCLProgress(guideId);
}
function updateCLProgress(guideId) {
  const cl = DATA.checklists.find(c => c.id === guideId);
  if (!cl) return;
  const checked = getCheckedItems();
  let done = 0;
  cl.items.forEach((_, i) => { if (checked[`${guideId}-${i}`]) done++; });
  const pct = Math.round((done / cl.items.length) * 100);
  const ring = document.querySelector(`#cl-${guideId} .cl-progress-ring .fill`);
  const txt = document.querySelector(`#cl-${guideId} .cl-progress-text`);
  if (ring) { const c = 2 * Math.PI * 17; ring.style.strokeDashoffset = c - (c * pct / 100); }
  if (txt) { txt.textContent = pct + '%'; }
}
// ===========================
// SKILL.MD GENERATION & DOWNLOAD
// ===========================
function generateSkillMD(cl) {
  let md = `---\ntitle: "${cl.title}"\ndescription: "${cl.desc}"\nstandards: [${(cl.standards||[]).map(s=>`"${s}"`).join(', ')}]\npatterns: ${cl.items.length}\n---\n\n# ${cl.title}\n\n${cl.desc}\n\n## Checklist\n\n`;
  cl.items.forEach((item, i) => {
    md += `### ${i+1}. ${item.text}\n`;
    if (item.eip) md += `- **Standard:** ${item.eip}\n`;
    md += `- **Priority:** ${item.priority}\n\n`;
  });
  md += `## Standards Referenced\n\n${(cl.standards||[]).map(s=>`- ${s}`).join('\n')}\n`;
  return md;
}
function downloadSkill(guideId) {
  const cl = DATA.checklists.find(c => c.id === guideId);
  if (!cl) return;
  const md = generateSkillMD(cl);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cl.id}-SKILL.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function downloadAllSkills() {
  DATA.checklists.forEach(cl => {
    setTimeout(() => downloadSkill(cl.id), 0);
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const form=e.target, msg=form.querySelector('.success-msg');
  if (msg) { msg.classList.add('show'); form.reset(); successTimeout=setTimeout(()=>msg.classList.remove('show'),5000); }
}

// ===========================
// ROUTER
// ===========================
function navigate(path) { window.location.hash = path; return false; }
let successTimeout = null;

function router() {
  if (successTimeout) { clearTimeout(successTimeout); successTimeout=null; }
  const hash = window.location.hash.slice(1) || '/';
  const app = document.getElementById('app');
  app.classList.remove('ready');
  setTimeout(() => {
    let html='';
    let scrollToChecklist = null;
    if (hash.startsWith('/category/')) { const id=hash.replace('/category/',''); const cat=DATA.categories.find(c=>c.id===id); html=cat?renderCategory(cat.id):renderHome(); }
    else if (hash==='/submit') html=renderSubmit();
    else if (hash.startsWith('/checklists/')) { scrollToChecklist=hash.replace('/checklists/',''); html=renderChecklists(); }
    else if (hash==='/checklists') html=renderChecklists();
    else if (hash==='/insights') html=renderInsights();
    else if (hash==='/agents') html=renderAgents();
    else if (hash==='/about') html=renderAbout();
    else if (hash==='/chasm') html=renderChasm();
    else if (hash==='/onboarding') html=renderOnboarding();
    else if (hash==='/paradigms') html=renderParadigms();
    else html=renderHome();
    app.innerHTML=html;
    if (scrollToChecklist) { const el=document.getElementById('cl-'+scrollToChecklist); if(el){toggleCLSection(scrollToChecklist);setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),150);} else { window.scrollTo(0,0); } }
    else { window.scrollTo(0,0); }
    requestAnimationFrame(()=>{
      document.querySelectorAll('.progress-fill[data-width]').forEach(el=>{requestAnimationFrame(()=>{el.style.width=el.dataset.width;});});
      app.classList.add('ready');
    });
  }, 120);
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  const hash=window.location.hash.slice(1)||'/';
  const app=document.getElementById('app');
  let html='';
  let scrollToChecklist = null;
  if (hash.startsWith('/category/')) { const id=hash.replace('/category/',''); const cat=DATA.categories.find(c=>c.id===id); html=cat?renderCategory(cat.id):renderHome(); }
  else if (hash==='/submit') html=renderSubmit();
  else if (hash.startsWith('/checklists/')) { scrollToChecklist=hash.replace('/checklists/',''); html=renderChecklists(); }
  else if (hash==='/checklists') html=renderChecklists();
  else if (hash==='/insights') html=renderInsights();
  else if (hash==='/agents') html=renderAgents();
  else if (hash==='/about') html=renderAbout();
  else if (hash==='/chasm') html=renderChasm();
  else if (hash==='/onboarding') html=renderOnboarding();
  else if (hash==='/paradigms') html=renderParadigms();
  else html=renderHome();
  app.innerHTML=html;
  if (scrollToChecklist) { const el=document.getElementById('cl-'+scrollToChecklist); if(el){toggleCLSection(scrollToChecklist);setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),150);} }
  requestAnimationFrame(()=>{
    document.querySelectorAll('.progress-fill[data-width]').forEach(el=>{requestAnimationFrame(()=>{el.style.width=el.dataset.width;});});
    app.classList.add('ready');
  });
});
