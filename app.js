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
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
function toggleTheme() {
  const h = document.documentElement;
  h.classList.toggle('dark');
  localStorage.setItem('ethux-theme', h.classList.contains('dark') ? 'dark' : 'light');
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
  ethDiamond:'<svg viewBox="0 0 256 417" fill="none"><path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="currentColor"/><path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="currentColor"/><path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="currentColor"/><path d="M127.962 416.905v-104.72L0 236.585z" fill="currentColor"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  external:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
};
function getIcon(n) { return ICONS[n] || ''; }



function getDocUrl(eip) { return eip ? DOC_URLS[eip] || null : null; }
function getResourceUrl(eip) { return eip && typeof RESOURCE_URLS !== 'undefined' ? RESOURCE_URLS[eip] || null : null; }

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
function statusBadge(s) { const l={'solved':'Solved','in-progress':'In Progress','unsolved':'Open','research':'Research'}; return `<span class="badge badge-${s}">${l[s]||s}</span>`; }
const SOL_STATUS = {
  'Live':{'cls':'solved','tip':'Shipped and usable today'},
  'Final':{'cls':'solved','tip':'Standard finalized, adoption underway'},
  'Building':{'cls':'in-progress','tip':'Teams actively building or shipping this'},
  'Draft':{'cls':'research','tip':'Standard being drafted, not yet finalized'},
  'Standard exists':{'cls':'research','tip':'Standard defined but not adopted by wallets'},
  'Research':{'cls':'research','tip':'Early R&D, no implementation yet'},
  'None':{'cls':'none','tip':'Nobody is working on this'},
  'Live in web2':{'cls':'unsolved','tip':'Solved outside crypto, not adopted in web3'}
};
function solStatusTag(s) { const info = SOL_STATUS[s] || {cls:'unsolved',tip:''}; return `<span class="sol-tag sol-tag-${info.cls}">${s}<span class="sol-tag-tip" aria-label="${info.tip}"><svg class="sol-tag-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4"/><circle cx="8" cy="5" r="0.5" fill="currentColor" stroke="none"/></svg><span class="sol-tag-tooltip">${info.tip}</span></span></span>`; }


// ===========================
// RENDERERS
// ===========================
function renderNav(active) {
  return `
    <nav class="nav" aria-label="Main navigation">
      <div class="nav-inner container">
      <a href="#/" class="nav-home" aria-label="EthUX home">
        ${ICONS.ethDiamond}
        <span class="nav-wordmark">EthUX</span>
      </a>
      <div class="nav-links-desktop">
        <a href="#/" class="${active==='map'?'active':''}" onclick="event.preventDefault();navigate('/');setTimeout(()=>{const el=document.getElementById('ux-map');if(el)el.scrollIntoView({behavior:'smooth'})},100)">UX Map</a>
        <a href="#/checklists" class="${active==='checklists'?'active':''}">Solutions</a>
        <a href="#/insights" class="${active==='insights'?'active':''}">Insights</a>
        <a href="#/agents" class="${active==='agents'?'active':''}">For Builders</a>

        <a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer" class="nav-external">Submit ${ICONS.external}</a>
      </div>
      <button class="nav-theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode">${ICONS.moon}${ICONS.sun}</button>
      <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Toggle menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <a href="#/" class="${active==='map'?'active':''}" onclick="event.preventDefault();navigate('/');setTimeout(()=>{const el=document.getElementById('ux-map');if(el)el.scrollIntoView({behavior:'smooth'})},100)">UX Map</a>
      <a href="#/checklists" class="${active==='checklists'?'active':''}">Solutions</a>
      <a href="#/insights" class="${active==='insights'?'active':''}">Insights</a>
      <a href="#/agents" class="${active==='agents'?'active':''}">For Builders</a>
      <a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer" class="nav-external">Submit ${ICONS.external}</a>
    </div>`;
}

function toggleMobileNav() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.querySelector('.nav-hamburger');
  if (menu && btn) {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.innerHTML = open
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }
}

function renderFooter() {
  return `<footer class="site-footer"><div class="container"><div class="footer-inner"><a href="https://ethereum.foundation" target="_blank" rel="noopener noreferrer" class="footer-initiative" aria-label="ethereum foundation initiative"><img src="iniciative.svg" alt="ethereum foundation initiative" height="31"></a><div class="footer-links"><a href="#/about">About</a><a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer">Submit an issue</a><a href="https://github.com/konopkja/protocol-ux" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://discord.gg/X8A7SuZ8" target="_blank" rel="noopener noreferrer">Discord</a></div></div></div></footer>`;
}

function renderHome() {
  const stats = getTotalStats();
  const crits = getCriticalProblems();

  let catCards = '';
  DATA.categories.forEach((cat, i) => {
    const s = getCategoryStats(cat);
    const num = String(i + 1).padStart(2, '0');
    catCards += `<div class="cat-card" style="--cat-color:${cat.color}" role="button" tabindex="0" aria-label="View ${cat.title}" onclick="navigate('/category/${cat.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('/category/${cat.id}')}"><div class="cat-card-icon">${cat.img ? `<img src="${cat.img}" alt="${cat.title}">` : getIcon(cat.icon)}</div><div class="cat-card-title">${cat.title}</div><div class="cat-card-hook">${cat.hook || ''}</div></div>`;
  });


  let guideCards = '';
  DATA.checklists.forEach(cl => {
    guideCards += `<a href="#/checklists/${cl.id}" class="guide-card-v2"><div class="guide-card-v2-header"><span class="guide-card-v2-title">${cl.title}</span><span class="guide-card-v2-desc">${cl.desc}</span></div><span class="guide-card-v2-patterns">${cl.patterns}</span></a>`;
  });

  return `
    ${renderNav('')}
    <main id="main-content">
      <div class="container">
        <section class="hero">
          <div class="hero-content">
            <h1 class="hero-title">Mapping<br><span class="accent">Ethereum UX</span></h1>
            <p class="hero-desc">Ethereum's infrastructure is a masterpiece of cryptography. Now, let's build the UX renaissance.</p>
            <p class="hero-desc hero-desc--secondary">A living catalog of the improvements that will take blockchain applications from early adopters to the majority.</p>
            <div class="hero-cta-group">
              <a href="#" class="hero-cta" onclick="event.preventDefault();document.getElementById('ux-map').scrollIntoView({behavior:'smooth'})">Browse Categories <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg></a>
              <a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer" class="hero-cta hero-cta--ghost">Add UX Problem ${ICONS.external}</a>
            </div>
          </div>
          <div class="hero-image">
            <svg class="hero-svg" viewBox="0 0 419 428" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g class="hero-svg-circle"><circle cx="198" cy="224" r="169" stroke-width="2"/></g>
              <g class="hero-svg-glyph">
                <path d="M197.756 310.064V390.913L100 247.567L197.756 310.064Z" stroke-width="2" stroke-linejoin="round"/>
                <path d="M295.522 247.567L197.759 390.913V310.064L295.522 247.567Z" stroke-width="2" stroke-linejoin="round"/>
                <path d="M295.522 227.37L197.759 171.605V289.875L295.522 227.37Z" stroke-width="2" stroke-linejoin="round"/>
                <path d="M295.522 227.37L197.759 57V171.604L295.522 227.37Z" stroke-width="2" stroke-linejoin="round"/>
                <path d="M197.756 57V171.604L100 227.37L197.756 57Z" stroke-width="2" stroke-linejoin="round"/>
                <path d="M197.756 171.605V289.875L100 227.37L197.756 171.605Z" stroke-width="2" stroke-linejoin="round"/>
              </g>
              <g class="hero-svg-rays">
                <path d="M198.5 289L411.5 154" stroke-width="2"/>
                <path d="M197.5 172L7 279.5" stroke-width="2"/>
                <path d="M293.5 226.5L46.5 84.5" stroke-width="2"/>
                <path d="M198 310.5L198 421" stroke-width="2"/>
                <path d="M198 7L198 117.5" stroke-width="2"/>
              </g>
              <g class="hero-svg-nodes">
                <circle cx="198" cy="421" r="6"/><circle cx="198" cy="7" r="6"/>
                <circle cx="198" cy="393" r="6"/><circle cx="198" cy="308" r="6"/>
                <circle cx="198" cy="289" r="6"/><circle cx="198" cy="172" r="6"/>
                <circle cx="148" cy="144" r="6"/><circle cx="79" cy="104" r="6"/>
                <circle cx="47" cy="85" r="6"/><circle cx="198" cy="55" r="6"/>
                <circle cx="296" cy="248" r="6"/><circle cx="295" cy="228" r="6"/>
                <circle cx="362" cy="186" r="6"/><circle cx="412" cy="154" r="6"/>
                <circle cx="102" cy="248" r="6"/><circle cx="102" cy="226" r="6"/>
                <circle cx="34" cy="264" r="6"/><circle cx="7" cy="280" r="6"/>
              </g>
            </svg>
          </div>
        </section>
      </div>

      <div class="container">
        <section class="section" id="ux-map">
          <div class="section-eyebrow reveal">The UX Map</div>
          <h2 class="section-title reveal">Opportunities for Growth</h2>
          <div class="section-desc reveal">Sourced from user feedback, community research, and ecosystem data. Each one is a chance to make Ethereum work better for the next wave of users.</div>
          <div class="cat-grid reveal-grid">${catCards}</div>
        </section>
      </div>

      <div class="container">
        <div class="pull-quote reveal">700 million people hold crypto. Fewer than 70 million use it actively onchain.</div>

        <section class="section">
          <div class="section-eyebrow">Insights</div>
          <h2 class="section-title section-title--sm">Why Adoption Stalls</h2>
          <div class="section-desc">Three frameworks that explain the gap between 700 million crypto holders and 70 million active onchain users.</div>
          <div class="insight-grid">
            <a href="#/chasm" class="insight-card">
              <div class="insight-card-eyebrow">Adoption</div>
              <div class="insight-card-title">The Chasm</div>
              <div class="insight-card-desc">87% of new wallet users leave within a week. Beautiful UI won't save you if the mental model is wrong.</div>
            </a>
            <a href="#/onboarding" class="insight-card">
              <div class="insight-card-eyebrow">Framework</div>
              <div class="insight-card-title">Onboarding Journey</div>
              <div class="insight-card-desc">Five stages between first curiosity and confident use. Most products lose people at stage two.</div>
            </a>
            <a href="#/paradigms" class="insight-card">
              <div class="insight-card-eyebrow">Design</div>
              <div class="insight-card-title">Investing vs Transacting</div>
              <div class="insight-card-desc">Wallets show your portfolio and a Send button on the same screen. These are two different products pretending to be one.</div>
            </a>
          </div>
        </section>

        <div class="cta-section">
          <div class="cta-content">
            <h3 class="cta-headline">Seen something we missed?</h3>
            <div class="cta-text">Every item on this map started as one person's story. Share yours and help shape what builders fix next.</div>
          </div>
          <a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Add to the Map</a>
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
  const severityOrder = {critical:0, high:1, medium:2, info:3};
  const sortedProblems = [...cat.problems].sort((a,b) => (severityOrder[a.severity]??9) - (severityOrder[b.severity]??9));
  sortedProblems.forEach((p,i) => {
    const details = PROBLEM_DETAILS[p.title] || {};
    let solRows = '';
    p.solutions.forEach(s => { const noOne = s.status === 'None'; solRows += `<tr${noOne?' class="sol-none"':''}><td>${s.name} ${solStatusTag(s.status)}</td><td class="sol-adoption">${s.adoption||''}</td></tr>`; });
    let eipTags = '';
    if (p.eips.length) { eipTags = `<div class="problem-eips"><span class="problem-eips-label">Related standards:</span>${p.eips.map(e=>{ const url=getDocUrl(e); return url ? `<a class="eip-tag" href="${url}" target="_blank" rel="noopener noreferrer">${e}</a>` : `<span class="eip-tag">${e}</span>`; }).join('')}</div>`; }
    let clLink = '';
    if (p.checklist) { clLink = `<a class="btn btn-primary problem-checklist-btn" href="#/checklists/${p.checklist}">View ${p.checklist} checklist</a>`; }
    let metaGrid = '';
    if (details.opportunity || details.risk) {
      metaGrid = `<div class="problem-meta-grid">${details.opportunity ? `<div class="problem-meta-box"><div class="problem-meta-label opp">Opportunity</div><div class="problem-meta-text">${details.opportunity}</div></div>` : ''}${details.risk ? `<div class="problem-meta-box"><div class="problem-meta-label risk">Risk of inaction</div><div class="problem-meta-text">${details.risk}</div></div>` : ''}</div>`;
    }
    let storyBlock = '';
    if (details.story) {
      const quotes = Array.isArray(details.story) ? details.story : [details.story];
      if (quotes.length === 1) {
        storyBlock = `<div class="quote-carousel"><div class="quote-slide active">${quotes[0]}</div></div>`;
      } else {
        const cid = `qc-${catId}-${i}`;
        const slides = quotes.map((q,qi) => `<div class="quote-slide${qi===0?' active':''}">${q}</div>`).join('');
        storyBlock = `<div class="quote-carousel" id="${cid}"><div class="quote-carousel-track">${slides}</div><div class="quote-carousel-nav"><button onclick="rotateQuote('${cid}',-1)" aria-label="Previous quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button><span class="quote-carousel-counter">1 / ${quotes.length}</span><button onclick="rotateQuote('${cid}',1)" aria-label="Next quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button></div></div>`;
      }
    }
    cards += `<div class="problem-card fade-up stagger-${Math.min(i+1,12)}" data-severity="${p.severity}" id="problem-${catId}-${i}"><div class="problem-head" role="button" tabindex="0" aria-expanded="false" aria-controls="pb-${catId}-${i}" onclick="toggleProblem('${catId}',${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleProblem('${catId}',${i})}"><span class="problem-expand" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 2 8 6 4 10"/></svg></span><span class="problem-title">${p.title}</span><div class="problem-badges">${severityBadge(p.severity)}</div></div><div class="problem-body" id="pb-${catId}-${i}" role="region" aria-label="${p.title} details"><div class="problem-content"><div class="problem-desc">${p.desc}</div>${storyBlock}<div class="sol-section"><table class="sol-table"><thead><tr><th>Solution</th><th>Adoption</th></tr></thead><tbody>${solRows}</tbody></table></div>${clLink}${metaGrid}${eipTags}</div></div></div>`;
  });
  let catNav = DATA.categories.map(c => c.id === catId ? `<span class="cat-nav-item active">${c.title}</span>` : `<a class="cat-nav-item" href="#/category/${c.id}">${c.title}</a>`).join('');
  return `
    ${renderNav('map')}
    <main id="main-content">
      <div class="container page-container">
        <a class="cat-back" href="#/">Back to map</a>
        <div class="cat-nav">${catNav}</div>
        <div class="cat-page-title">${cat.title}</div>
        <div class="cat-page-desc">${cat.desc}</div>
        <div class="problem-list">${cards}</div>
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
      const resUrl = getResourceUrl(item.eip);
      const linkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
      const docLink = docUrl ? `<a class="cl-item-doc" href="${docUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">${linkIcon}EIP</a>` : '';
      const resLink = resUrl ? `<a class="cl-item-doc" href="${resUrl.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">${linkIcon}${resUrl.label}</a>` : '';
      items += `<div class="cl-item ${isDone ? 'done' : ''}" data-cl="${key}" onclick="toggleCheckItem('${cl.id}',${j})" style="cursor:pointer;"><button class="cl-checkbox ${isDone ? 'checked' : ''}" onclick="event.stopPropagation();toggleCheckItem('${cl.id}',${j})" aria-label="Toggle ${item.text}" role="checkbox" aria-checked="${isDone ? 'true' : 'false'}"></button><span class="cl-item-num">${j+1}</span><div class="cl-item-content"><div class="cl-item-text">${item.text}</div>${item.benefit ? `<div class="cl-item-benefit">${item.benefit}</div>` : ''}<div class="cl-item-meta">${item.eip ? `<span class="cl-item-eip">${item.eip}</span>` : ''}<span class="cl-item-priority ${item.priority}">${item.priority}</span>${docLink}${resLink}</div></div></div>`;
    });

    sections += `<div class="cl-section fade-up stagger-${Math.min(i+1,7)}" id="cl-${cl.id}"><div class="cl-header" onclick="toggleCLSection('${cl.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleCLSection('${cl.id}')}" role="button" tabindex="0" aria-expanded="false"><span class="cl-expand" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 2 8 6 4 10"/></svg></span><div class="cl-header-info"><div class="cl-header-title">${cl.title}</div><div class="cl-header-desc">${cl.desc}</div></div><div class="cl-header-meta"><div class="cl-progress-ring"><svg><circle class="track" cx="20" cy="20" r="17" /><circle class="fill" cx="20" cy="20" r="17" style="stroke-dasharray:${circ.toFixed(1)};stroke-dashoffset:${offset.toFixed(1)}" /></svg><div class="cl-progress-text">${pct}%</div></div></div></div><div class="cl-body"><div class="cl-body-inner"><div class="cl-items">${items}</div><div class="cl-agent-bar"><div class="cl-agent-bar-text"><strong>AI Agent:</strong> Point your coding agent to <code>checklists/${cl.id}/SKILL.md</code></div><button class="cl-dl-btn" onclick="event.stopPropagation();downloadSkill('${cl.id}')">Download</button></div></div></div></div>`;
  });

  return `
    ${renderNav('checklists')}
    <main id="main-content">
      <div class="container page-container">
        <div class="section-eyebrow">Reference</div>
        <h2 class="section-title">Solutions</h2>
        <div class="section-desc">${tp} patterns across ${DATA.checklists.length} solutions. Tick items off as you implement them. Your progress is saved locally.</div>
        <div class="cl-accordion">${sections}</div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderAbout() {
  return `
    ${renderNav('about')}
    <main id="main-content">
      <div class="container page-container">
        <div style="max-width:640px;" class="about-content">
          <h1>About<br>EthUX</h1>
          <p>EthUX is a living, community-sourced map of Ethereum's highest-impact UX issues, matched with the solutions being built to address them.</p>
          <p>The goal is to surface critical UX issues from the user's perspective, triage them, coordinate builders around solutions, and track adoption of solutions across the ecosystem.</p>
          <p>This is not a polished report. It's a collaborative, evolving tracker. Sourced from user feedback surveys, social media monitoring, community research, and ecosystem data.</p>
          <h2>Collaborate</h2>
          <p>Join the conversation on <a href="https://discord.gg/X8A7SuZ8" target="_blank" rel="noopener noreferrer">Discord</a> to connect with designers, researchers, and builders working on Ethereum UX.</p>
          <h2>For Builders</h2>
          <p>Our UX checklists are available as structured markdown files for AI coding agents. For implementation-level skills with code examples and decision trees, see <a href="https://ethskills.com/" target="_blank" rel="noopener noreferrer">ethskills.com</a>.</p>
          <h2>Contributing</h2>
          <p>This project is open source. Submit UX issues through our <a href="https://web3ux.paperform.co/" target="_blank" rel="noopener noreferrer">feedback form</a>, contribute on <a href="https://github.com/konopkja/protocol-ux" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        </div>
      </div>
      ${renderFooter()}
    </main>`;
}

function renderInsights() {
  return `
    ${renderNav('insights')}
    <main id="main-content">
      <div class="container page-container">
        <div class="section-eyebrow">Research</div>
        <h2 class="section-title">Insights</h2>
        <div class="section-desc">Foundational UX frameworks that explain the adoption gap. How Ethereum UX can scale from early adopters to the mainstream, and what builders can do about it.</div>
        <div class="insight-grid" style="margin-top:32px;">
          <a href="#/chasm" class="insight-card">
            <div class="insight-card-eyebrow">Adoption</div>
            <div class="insight-card-title">The Chasm</div>
            <div class="insight-card-desc">How to bridge the gap between early adopter and mainstream UX. Why good UI alone isn't enough.</div>
          </a>
          <a href="#/onboarding" class="insight-card">
            <div class="insight-card-eyebrow">Framework</div>
            <div class="insight-card-title">Onboarding Journey</div>
            <div class="insight-card-desc">Five stages between curiosity and competence. The minimum viable knowledge gap.</div>
          </a>
          <a href="#/paradigms" class="insight-card">
            <div class="insight-card-eyebrow">Design</div>
            <div class="insight-card-title">Investing vs Transacting</div>
            <div class="insight-card-desc">Ethereum serves two user mindsets. Separating investment and payment UX is a design opportunity.</div>
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
          <a class="cat-back" href="#/">Back to home</a>
          <h1>The Chasm</h1>
          <p class="page-subtitle">How Ethereum UX can scale from early adopters to the mainstream.</p>

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

          <div class="evidence-callout">
            <div class="evidence-callout-title">Where we are</div>
            <div class="evidence-stats">
              <div class="evidence-stat"><div class="evidence-stat-value">13%</div><div class="evidence-stat-label">of Americans say crypto wallets are easy to use</div></div>
              <div class="evidence-stat"><div class="evidence-stat-value">87%</div><div class="evidence-stat-label">of new wallet users leave within the first week</div></div>
              <div class="evidence-stat"><div class="evidence-stat-value">80%+</div><div class="evidence-stat-label">of US adults use Venmo or Zelle. Fewer than 1 in 10 use crypto for payments.</div></div>
              <div class="evidence-stat"><div class="evidence-stat-value">716M</div><div class="evidence-stat-label">people own crypto. Fewer than 70M use it actively onchain.</div></div>
            </div>
            <div class="evidence-sources">Sources: Mercuryo/Protocol Theory (2025); Federal Reserve (2024); The Protocol Report (2026)</div>
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
          <p>Research shows two factors explain most of whether someone adopts a new wallet: <strong>perceived improvement over existing tools</strong> (44% of adoption variance) and <strong>compatibility with daily routines</strong> (24%). The question for builders is straightforward: does your feature feel better than what people already use, and does it fit how they already manage money? <span class="evidence-inline-source">(Mercuryo/Protocol Theory, 2025)</span></p>
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
          <a class="cat-back" href="#/">Back to home</a>
          <h1>Onboarding<br>Journey</h1>
          <p class="page-subtitle">Five stages between first curiosity and confident use. A framework for understanding where builders can have the most impact.</p>

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
          <a class="cat-back" href="#/">Back to home</a>
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

          <h2>The Dual Nature Challenge</h2>
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
  const REPO_BASE = 'https://raw.githubusercontent.com/konopkja/protocol-ux/main/skills';

  let skillCards = '';
  DATA.checklists.forEach((cl, i) => {
    const info = SKILL_DESCRIPTIONS[cl.id] || {};
    const useCases = (info.useCases || []).map(u => `<div class="skill-card-what-item">${u}</div>`).join('');
    const tags = (cl.standards || []).map(s => `<span class="eip-tag">${s}</span>`).join('');
    const icon = SKILL_ICONS[cl.id] || '';
    const rawUrl = `${REPO_BASE}/${cl.id}.md`;

    skillCards += `<div class="skill-card fade-up stagger-${Math.min(i+1,7)}"><div class="skill-card-info"><div class="skill-card-head"><div class="skill-card-icon">${icon}</div><div><div class="skill-card-title">${cl.title}</div><div class="skill-card-path">skills/${cl.id}.md</div></div></div><div class="skill-card-desc">${info.humanDesc || cl.desc}</div><div class="skill-card-what"><div class="skill-card-what-title">When to use</div>${useCases}</div><div class="skill-card-tags" style="margin-top:12px;">${tags}</div></div><div class="skill-card-actions"><button class="cl-dl-btn skill-btn-primary" onclick="copyText('${rawUrl}',this)">Copy URL</button><button class="cl-dl-btn skill-btn-secondary" onclick="copySkillContent('${cl.id}',this)">Copy Content</button><button class="cl-dl-btn skill-btn-tertiary" onclick="downloadSkill('${cl.id}')">Download</button></div></div>`;
  });

  return `
    ${renderNav('agents')}
    <main id="main-content">
      <div class="container page-container">
        <section class="builders-hero">
          <p class="builders-hero-eyebrow">For Builders</p>
          <h2 class="builders-hero-title">UX Skill Files</h2>
          <p class="builders-hero-desc">Structured Ethereum UX rules your AI agent can read directly. Built from real user pain data, updated as standards evolve. For implementation code and Solidity patterns, see <a href="https://ethskills.com/" target="_blank" rel="noopener noreferrer">ethskills.com</a>.</p>

          <div class="builders-hero-action">
            <div class="builders-hero-tabs" role="tablist">
              <button class="builders-hero-tab active" role="tab" onclick="switchQuickstart('claude',this)">Claude Code</button>
              <button class="builders-hero-tab" role="tab" onclick="switchQuickstart('cursor',this)">Cursor / Copilot</button>
            </div>
            <div class="builders-hero-code" id="qs-claude">
              <span class="builders-hero-code-label">Add to project instructions</span>
              <div class="builders-hero-code-block"><code>Fetch _shared.md and the relevant skill file from protocol-ux/skills/ when building Ethereum dapp UX.</code><button class="builders-hero-copy" onclick="copyText('Fetch ${REPO_BASE}/_shared.md and the relevant skill file from ${REPO_BASE}/ when building Ethereum dapp UX. Follow all ALWAYS/NEVER rules.',this)">Copy</button></div>
            </div>
            <div class="builders-hero-code" id="qs-cursor" style="display:none;">
              <span class="builders-hero-code-label">Copy all skill content into .cursorrules</span>
              <div class="builders-hero-code-block"><code>8 skill files. Approvals, signing, gas, multi-chain, onboarding, wallets, safety, shared patterns.</code><button class="builders-hero-copy" onclick="copyAllSkillContent(this)">Copy All Skills</button></div>
            </div>
          </div>
        </section>

        <div class="skill-grid">${skillCards}</div>
      </div>
      ${renderFooter()}
    </main>`;
}


// ===========================
// INTERACTIONS
// ===========================
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  });
}
function copySkillContent(guideId, btn) {
  const cl = DATA.checklists.find(c => c.id === guideId);
  if (!cl) return;
  const md = generateSkillMD(cl);
  copyText(md, btn);
}
function copyAllSkillContent(btn) {
  let all = '';
  DATA.checklists.forEach(cl => {
    all += `\n\n${'='.repeat(60)}\n# ${cl.title} (skills/${cl.id}.md)\n${'='.repeat(60)}\n\n`;
    all += generateSkillMD(cl);
  });
  copyText(all.trim(), btn);
}
function switchQuickstart(tab, btn) {
  document.querySelectorAll('.builders-hero-code').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.builders-hero-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('qs-' + tab).style.display = 'block';
  btn.classList.add('active');
}
function rotateQuote(carouselId, dir) {
  const el = document.getElementById(carouselId);
  if (!el) return;
  const slides = el.querySelectorAll('.quote-slide');
  const counter = el.querySelector('.quote-carousel-counter');
  let cur = 0;
  slides.forEach((s,i) => { if (s.classList.contains('active')) cur = i; });
  slides[cur].classList.remove('active');
  cur = (cur + dir + slides.length) % slides.length;
  slides[cur].classList.add('active');
  if (counter) counter.textContent = `${cur + 1} / ${slides.length}`;
}
function toggleProblem(catId, index) {
  const el = document.getElementById(`problem-${catId}-${index}`);
  if (!el) return;
  el.classList.toggle('open');
  const isOpen = el.classList.contains('open');
  const h = el.querySelector('.problem-head');
  if (h) h.setAttribute('aria-expanded', isOpen);
}
function toggleCrit(index) {
  const el = document.getElementById(`crit-${index}`);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.crit-card.open').forEach(c => {
    c.classList.remove('open');
    const b = c.querySelector('.crit-detail');
    if (b) b.style.maxHeight = '';
    const ci = c.querySelector('.crit-item');
    if (ci) ci.setAttribute('aria-expanded', 'false');
  });
  if (!wasOpen) {
    el.classList.add('open');
    const body = el.querySelector('.crit-detail');
    if (body) body.style.maxHeight = body.scrollHeight + 'px';
    const ci = el.querySelector('.crit-item');
    if (ci) ci.setAttribute('aria-expanded', 'true');
  }
}
function toggleCLSection(id) {
  const el = document.getElementById(`cl-${id}`);
  if (!el) return;
  const body = el.querySelector('.cl-body');
  el.classList.toggle('open');
  const header = el.querySelector('.cl-header');
  if (header) header.setAttribute('aria-expanded', el.classList.contains('open'));
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
    cb.setAttribute('aria-checked', cb.classList.contains('checked') ? 'true' : 'false');
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
  const section = document.getElementById('cl-'+guideId);
  if (section) {
    if (pct === 100) { section.classList.add('cl-complete'); } else { section.classList.remove('cl-complete'); }
  }
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


// ===========================
// ROUTER
// ===========================
function navigate(path) { window.location.hash = path; return false; }
let successTimeout = null;

function router() {
  if (successTimeout) { clearTimeout(successTimeout); successTimeout=null; }
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.remove('open');
  const hamburger = document.querySelector('.nav-hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  }
  document.body.style.overflow = '';
  const hash = window.location.hash.slice(1) || '/';
  const app = document.getElementById('app');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  {
    let html='';
    let scrollToChecklist = null;
    if (hash.startsWith('/category/')) { const id=hash.replace('/category/',''); const cat=DATA.categories.find(c=>c.id===id); html=cat?renderCategory(cat.id):renderHome(); }
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
      document.querySelectorAll('.progress-fill[data-width]').forEach(el=>{
        const visited = sessionStorage.getItem('visited-'+el.closest('[id]')?.id);
        if (visited) { el.style.transition='none'; el.style.width=el.dataset.width; }
        else { requestAnimationFrame(()=>{el.style.width=el.dataset.width;}); }
      });
      const pageId = window.location.hash.slice(1) || '/';
      sessionStorage.setItem('visited-'+pageId, '1');
      // Scroll-triggered reveals
      const revealEls = document.querySelectorAll('.reveal, .reveal-grid');
      if (!reduceMotion) {
        const revealObs = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
        }, { threshold: 0 });
        revealEls.forEach(el => revealObs.observe(el));
      } else {
        revealEls.forEach(el => el.classList.add('revealed'));
      }
    });
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  router();
  // Close mobile menu on any link tap
  document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-menu a')) {
      const menu = document.getElementById('mobile-menu');
      const btn = document.querySelector('.nav-hamburger');
      if (menu) menu.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', false);
    }
  });
});
