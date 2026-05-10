const api = {
  post: (path, data) => fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  get: (path) => fetch(path).then(r => r.json()),
};

// UI helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
function show(el) { if (!el) return; el.classList.remove('hidden'); }
function hide(el) { if (!el) return; el.classList.add('hidden'); }
function toast(msg, timeout = 3000) { const t = $('#toast'); if (!t) return; t.textContent = msg; show(t); setTimeout(() => hide(t), timeout); }
function addListenerIfExists(sel, event, fn) { const el = typeof sel === 'string' ? $(sel) : sel; if (el) el.addEventListener(event, fn); else console.warn('Element not found for', sel); }

// Navigation
const navBtns = $$('.nav-btn') || [];
navBtns.forEach(btn => btn.addEventListener('click', (e) => {
  try {
    navBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const id = e.target.id.replace('nav', '').toLowerCase();
    ['dashboard','planner','portals'].forEach(s => { const el = $('#'+s); if (!el) return; if (s === id) show(el); else hide(el); });
  } catch (err) { console.error('Nav handler error', err); }
}));

// Revenue modal
addListenerIfExists('#openRevenueModal','click', () => show($('#revenueModal')));
addListenerIfExists('#closeRevenueModal','click', () => hide($('#revenueModal')));

// Chart
let revenueChart;
function initChart() {
  try {
    if (typeof Chart === 'undefined') { console.warn('Chart.js not loaded'); return; }
    const canvas = document.getElementById('revenueChart');
    if (!canvas) { console.warn('revenueChart element missing'); return; }
    const ctx = canvas.getContext('2d');
    revenueChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Revenue INR', data: [], backgroundColor: '#2c7a7b' }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  } catch (err) {
    console.error('Chart init failed', err);
  }
}

// Render lists/tables
async function refreshFarmers() {
  try {
    const data = await api.get('/api/portals/farmers');
    const preview = $('#farmersPreview'); if (preview) preview.textContent = data.slice(0,5).map(f => `${f.name} — ${f.location || ''} (${f.acreageHa||''} ha)`).join('\n') || 'No farmers';
    const tbody = $('#farmersTable tbody'); if (tbody) { tbody.innerHTML = ''; data.forEach(f => { const tr = document.createElement('tr'); tr.innerHTML = `<td>${f.name}</td><td>${f.contact||''}</td><td>${f.location||''}</td><td>${f.acreageHa||''}</td>`; tbody.appendChild(tr); }); }
  } catch (err) { console.error('Failed to refresh farmers', err); toast('Failed to load farmers'); }
}
async function refreshContractors() {
  try {
    const data = await api.get('/api/portals/contractors');
    const preview = $('#contractorsPreview'); if (preview) preview.textContent = data.slice(0,5).map(f => `${f.name} — ${f.region || ''} (${f.requiredAcreageHa||''} ha)`).join('\n') || 'No contractors';
    const tbody = $('#contractorsTable tbody'); if (tbody) { tbody.innerHTML = ''; data.forEach(f => { const tr = document.createElement('tr'); tr.innerHTML = `<td>${f.name}</td><td>${f.contact||''}</td><td>${f.region||''}</td><td>${f.requiredAcreageHa||''}</td>`; tbody.appendChild(tr); }); }
  } catch (err) { console.error('Failed to refresh contractors', err); toast('Failed to load contractors'); }
}

// Revenue calculation
addListenerIfExists('#revenueForm','submit', async (e) => {
  e.preventDefault();
  try {
    const fd = Object.fromEntries(new FormData(e.target).entries());
    fd.fieldSizeHa = Number(fd.fieldSizeHa); fd.soilQuality = Number(fd.soilQuality);
    const res = await api.post('/api/revenue', fd);
    const revenueResult = $('#revenueResult'); if (revenueResult) revenueResult.textContent = JSON.stringify(res, null, 2);
    const revCard = $('#revenueCardContent'); if (revCard) revCard.textContent = `${res.cropType} — ₹${res.revenueINR} for ${res.totalYieldKg} kg`;
    if (revenueChart) { revenueChart.data.labels.push(res.cropType + ' ' + new Date().toLocaleTimeString()); revenueChart.data.datasets[0].data.push(res.revenueINR); revenueChart.update(); }
    hide($('#revenueModal'));
  } catch (err) { console.error('Revenue calculation failed', err); toast('Revenue calculation failed'); }
});

// Quick planner
addListenerIfExists('#quickPlannerForm','submit', async (e) => {
  e.preventDefault();
  try {
    const fd = Object.fromEntries(new FormData(e.target).entries()); fd.durationDays = Number(fd.durationDays);
    const res = await api.post('/api/crop-planner', fd);
    const out = $('#quickPlannerResult'); if (out) out.textContent = JSON.stringify(res, null, 2);
  } catch (err) { console.error('Quick planner failed', err); toast('Planner failed'); }
});

// Full planner
addListenerIfExists('#plannerFormFull','submit', async (e) => {
  e.preventDefault();
  try {
    const fd = Object.fromEntries(new FormData(e.target).entries()); fd.durationDays = Number(fd.durationDays);
    const res = await api.post('/api/crop-planner', fd);
    const out = $('#plannerResultFull'); if (out) out.textContent = JSON.stringify(res, null, 2);
    toast('Planner generated');
  } catch (err) { console.error('Planner failed', err); toast('Planner failed'); }
});

// Portals forms
addListenerIfExists('#farmerForm','submit', async (e) => {
  e.preventDefault();
  try {
    const fd = Object.fromEntries(new FormData(e.target).entries()); if (fd.crops) fd.crops = fd.crops.split(',').map(s => s.trim()); if (fd.acreageHa) fd.acreageHa = Number(fd.acreageHa);
    const res = await api.post('/api/portals/farmers', fd);
    toast('Farmer created'); await refreshFarmers();
  } catch (err) { console.error('Create farmer failed', err); toast('Create farmer failed'); }
});
addListenerIfExists('#contractorForm','submit', async (e) => {
  e.preventDefault();
  try {
    const fd = Object.fromEntries(new FormData(e.target).entries()); if (fd.crops) fd.crops = fd.crops.split(',').map(s => s.trim()); if (fd.requiredAcreageHa) fd.requiredAcreageHa = Number(fd.requiredAcreageHa);
    const res = await api.post('/api/portals/contractors', fd);
    toast('Contractor created'); await refreshContractors();
  } catch (err) { console.error('Create contractor failed', err); toast('Create contractor failed'); }
});

// Refresh buttons
addListenerIfExists('#refreshFarmers','click', refreshFarmers);
addListenerIfExists('#refreshContractors','click', refreshContractors);

// Initialize
window.addEventListener('load', async () => {
  try {
    initChart();
    await refreshFarmers();
    await refreshContractors();
  } catch (err) { console.error('Init failed', err); }
});

// Navigation shortcuts
addListenerIfExists('#goPortalsFromFarmers','click', () => { addListenerIfExists('#navPortals','click', () => {}); const nav = $('#navPortals'); if (nav) nav.click(); });
addListenerIfExists('#goPortalsFromContractors','click', () => { const nav = $('#navPortals'); if (nav) nav.click(); });