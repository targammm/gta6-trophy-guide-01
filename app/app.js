// Leonida Trophy Tracker: loads the 55 official trophies from data/trophies.json,
// renders the checklist, saves progress in localStorage, and shows one trophy's
// cited guide at a time. No network at run time beyond this app's own files.
const STORE_KEY = 'leonida-tracker-v1';
const SPOILER_KEY = 'leonida-spoiler-v1';
const STAGES = {
  1: 'Stage 1 — Story playthrough',
  2: 'Stage 2 — Strangers & contacts',
  3: 'Stage 3 — Activities & combat',
  4: 'Stage 4 — Collectibles & exploration',
  5: 'Stage 5 — Money, properties & 100%',
};
const params = new URLSearchParams(location.search);
const demo = params.get('demo') === '1';
const DEMO_EARNED = [2, 3, 4, 5, 8, 10, 11, 16, 21, 33, 44, 46, 51, 55];

let trophies = [];
let earned = new Set();
let filter = params.get('filter') || 'all';
let grade = 'all';
let query = '';
let spoiler = params.get('spoiler') === 'on';
let selected = Number(params.get('open')) || null;

const $ = (id) => document.getElementById(id);
const listEl = $('list'), detailEl = $('detail'), countEl = $('count'), emptyEl = $('empty');

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) earned = new Set(JSON.parse(raw).filter((n) => Number.isInteger(n)));
  } catch { earned = new Set(); }
  try { spoiler = spoiler || localStorage.getItem(SPOILER_KEY) === '1'; } catch { /* ignore */ }
  if (demo) earned = new Set(DEMO_EARNED);
}
function saveStore() {
  if (demo) return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
    localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
  } catch { /* storage unavailable: progress lives only for this visit */ }
}
function isHidden(t) { return spoiler && t.kind === 'story' && !earned.has(t.id); }
function gradeLabel(g) { return g[0].toUpperCase() + g.slice(1); }

function visible(t) {
  if (grade !== 'all' && t.grade !== grade) return false;
  if (filter === 'story' && t.kind !== 'story') return false;
  if (filter === 'missable' && !t.missable) return false;
  if (filter === 'collectibles' && t.kind !== 'collectibles') return false;
  if (filter === 'activities' && t.kind !== 'activities') return false;
  if (filter === 'online') return false;
  if (query) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function renderStats() {
  $('stat-earned').textContent = earned.size + '/55';
  const pct = Math.round((earned.size / 55) * 100);
  $('stat-pct').textContent = pct + '%';
  $('bar-fill').style.width = pct + '%';
  const shown = trophies.filter(visible).length;
  countEl.textContent = 'Showing ' + shown + ' of 55 trophies';
  emptyEl.hidden = shown !== 0;
}

function renderList() {
  listEl.replaceChildren();
  for (const t of trophies) {
    if (!visible(t)) continue;
    const li = document.createElement('li');
    li.className = 'row' + (earned.has(t.id) ? ' earned' : '') + (selected === t.id ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveStore(); renderStats(); renderList(); renderDetail();
    });
    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'row-body';
    body.addEventListener('click', () => { selected = t.id; renderList(); renderDetail(); });
    const name = document.createElement('span');
    name.className = 't-name';
    name.textContent = isHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
    const desc = document.createElement('span');
    desc.className = 't-desc';
    desc.textContent = isHidden(t) ? 'Story trophy. Its name and description stay hidden until earned.' : t.description;
    const meta = document.createElement('span');
    meta.className = 't-meta';
    const badge = document.createElement('span');
    badge.className = 'grade ' + t.grade;
    badge.textContent = gradeLabel(t.grade);
    meta.append(badge);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'flag missable';
      m.textContent = 'MISSABLE';
      meta.append(m);
    }
    if (t.hidden) {
      const h = document.createElement('span');
      h.className = 'flag hidden';
      h.textContent = 'HIDDEN';
      meta.append(h);
    }
    if (t.count) {
      const c = document.createElement('span');
      c.className = 'flag count';
      c.textContent = '×' + t.count;
      meta.append(c);
    }
    body.append(name, desc, meta);
    li.append(box, body);
    listEl.append(li);
  }
  renderStats();
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selected);
  detailEl.replaceChildren();
  if (!t) {
    const p = document.createElement('p');
    p.className = 'detail-hint';
    p.textContent = 'Select a trophy to read its guide and its sources.';
    detailEl.append(p);
    return;
  }
  const left = document.createElement('div');
  left.className = 'detail-left';
  const h = document.createElement('h2');
  h.textContent = isHidden(t) ? 'Hidden trophy' : t.name;
  const off = document.createElement('p');
  off.className = 'official';
  off.textContent = isHidden(t)
    ? 'Official name and description hidden by the spoiler setting until this story trophy is earned.'
    : 'Official: ' + t.description;
  const tags = document.createElement('p');
  tags.className = 'tags';
  const bits = [gradeLabel(t.grade), t.kind, STAGES[t.roadmap]];
  if (t.missable) bits.push('MISSABLE — do it when it appears');
  if (t.hidden) bits.push('Hidden on PS5 until earned');
  if (t.count) bits.push('Count tracked: ' + t.count);
  tags.textContent = bits.join(' · ');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'earn-btn';
  toggle.textContent = earned.has(t.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
    saveStore(); renderStats(); renderList(); renderDetail();
  });
  left.append(h, off, tags, toggle);
  const right = document.createElement('div');
  right.className = 'detail-right';
  const g = document.createElement('p');
  g.className = 'guide';
  g.textContent = t.guide;
  const s = document.createElement('p');
  s.className = 'source';
  s.textContent = 'Source: ' + t.source;
  right.append(g, s);
  detailEl.append(left, right);
  window.__shotReady = true;
}

function exportProgress() {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const ids = Array.isArray(data) ? data : data.earned;
      const valid = new Set(trophies.map((t) => t.id));
      earned = new Set(ids.filter((n) => valid.has(n)));
      saveStore(); renderStats(); renderList(); renderDetail();
    } catch { alert('That file is not a Leonida progress export.'); }
  };
  reader.readAsText(file);
}

async function main() {
  const res = await fetch('data/trophies.json');
  const data = await res.json();
  trophies = data.trophies;
  loadStore();
  if (!trophies.some((t) => t.id === selected)) selected = null;
  document.querySelectorAll('#chips .chip').forEach((chip) => {
    if (chip.dataset.filter === filter) chip.classList.add('on');
    else chip.classList.remove('on');
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter;
      document.querySelectorAll('#chips .chip').forEach((c) => c.classList.toggle('on', c === chip));
      renderList();
    });
  });
  $('grade').addEventListener('change', (e) => { grade = e.target.value; renderList(); });
  $('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); renderList(); });
  $('spoiler').checked = spoiler;
  $('spoiler').addEventListener('change', (e) => { spoiler = e.target.checked; saveStore(); renderList(); renderDetail(); });
  $('export').addEventListener('click', exportProgress);
  $('import').addEventListener('change', (e) => { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ''; });
  $('reset').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies?')) return;
    earned = new Set(); saveStore(); renderStats(); renderList(); renderDetail();
  });
  renderList();
  renderDetail();
  window.__shotReady = true;
}
main();
