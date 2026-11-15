/* UptoZishu Admin — separate admin website (static, Firebase). Admin = admins/<uid> === true */
(function () {
'use strict';
firebase.initializeApp({
  apiKey: "AIzaSyDCOq720_5pxOsUYXovvi4DaUsryv1oPeA", authDomain: "stardust-store.firebaseapp.com",
  databaseURL: "https://stardust-store-default-rtdb.firebaseio.com", projectId: "stardust-store",
  storageBucket: "stardust-store.firebasestorage.app", messagingSenderId: "979834482722", appId: "1:979834482722:web:dabbc453543b7e03c91a7b"
});
const auth = firebase.auth(), db = firebase.database();
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = {
  home: '<path d="M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10"/>', apps: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.500l6.100-.9Z"/>', flag: '<path d="M5 21V4M5 4h11l-1.500 4L16 12H5"/>', shield: '<path d="M12 3 4 6v6c0 5 3.400 8 8 9 4.600-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  users: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c.6-3.500 3-5.500 6.500-5.500s5.900 2 6.500 5.500M16 4.500a3.500 3.500 0 0 1 0 7M18 14.800c2 .6 3.200 2.300 3.500 5.200"/>',
  mega: '<path d="M3 11v2a2 2 0 0 0 2 2h2l7 4V5L7 9H5a2 2 0 0 0-2 2ZM18 8.500a5 5 0 0 1 0 7"/>', dl: '<path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/>', eye: '<path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.500 7.200L3 21l1.800-5.500A8 8 0 1 1 21 12Z"/>', check: '<path d="m5 12 5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>', play: '<path d="m7 4 13 8-13 8z"/>', swap: '<path d="M7 7h13l-3-3M17 17H4l3 3"/>', search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.500-3.500"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>',
  moon: '<path d="M21 12.800A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800Z"/>', send: '<path d="m22 2-11 11M22 2l-7 20-4-9-9-4Z"/>', plus: '<path d="M12 5v14M5 12h14"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', eyeoff: '<path d="M3 3l18 18M10.600 6.100A10 10 0 0 1 12 5c6.400 0 10 7 10 7a17 17 0 0 1-3.200 4M6.600 6.600A17 17 0 0 0 2 12s3.600 7 10 7c1.600 0 3-.4 4.300-1M9.900 9.900a3 3 0 0 0 4.200 4.200"/>'
};
const avc = s => { let h = 0; s = String(s || 'G').toLowerCase(); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return 'c' + (h % 8); };
const ico = n => '<svg viewBox="0 0 24 24">' + (I[n] || '') + '</svg>';
const NAV = [
  ['', 'Overview', 'home'], ['apps', 'Apps', 'apps'], ['reviews', 'Reviews', 'star'], ['h', 'Moderation'], ['reports', 'Reports', 'flag'], ['claims', 'Claims', 'shield'],
  ['h', 'People'], ['users', 'Users & developers', 'users'], ['broadcast', 'Broadcast', 'mega']
];
const TITLES = { '': 'Overview', apps: 'Apps', reviews: 'Reviews', reports: 'Reports', claims: 'Claim requests', users: 'Users & developers', broadcast: 'Broadcast' };
const S = { user: null, apps: {}, users: {}, devs: {}, profiles: {}, reports: {}, claims: {}, reviews: {}, stats: {}, failed: [], loaded: false };
const UI = { appQ: '', appF: 'all', appSort: 'new', revQ: '', revF: 'all', claimTab: 'pending', userQ: '', userF: 'all', range: 14, appLimit: 40, revLimit: 30 };

/* ---------- helpers ---------- */
const nf = n => { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : n.toLocaleString('en-US'); };
const PUSH = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
function pushTime(id) { if (!id || id.length < 8) return 0; let t = 0; for (let i = 0; i < 8; i++) { const k = PUSH.indexOf(id[i]); if (k < 0) return 0; t = t * 64 + k; } return t > 1.2e12 && t < 4e12 ? t : 0; }
function appCreated(a) { const v = a.timestamp || a.createdAt || a.uploadDate; if (typeof v === 'number') return v < 1e11 ? v * 1000 : v; if (typeof v === 'string' && !isNaN(Date.parse(v))) return Date.parse(v); return pushTime(a.id) || 0; }
const dstr = t => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
function ago(t) { if (!t) return ''; const s = Math.max(1, (Date.now() - t) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 2592000) return Math.floor(s / 86400) + 'd ago'; return dstr(t); }
const ICON = 'https://img.icons8.com/color/144/android-os.png';
const stat = a => a.status === 'suspended' ? 'suspended' : a.status === 'draft' ? 'draft' : 'live';
const pill = (k, t) => `<span class="pill ${k}">${esc(t)}</span>`;
const statPill = a => { const s = stat(a); return pill(s === 'live' ? 'ok' : s === 'draft' ? '' : 'bad', s === 'live' ? 'Live' : s === 'draft' ? 'Draft' : 'Suspended'); };
const stars = r => { r = Math.round(+r || 0); return '<span class="stars">' + '★'.repeat(r) + '<span style="opacity:.3">' + '★'.repeat(5 - r) + '</span></span>'; };
const ckey = s => String(s || '').replace(/[^A-Za-z0-9_-]/g, '_');
const appList = () => Object.keys(S.apps).map(id => ({ id, ...S.apps[id] }));
const userName = uid => (S.users[uid] && S.users[uid].name) || (S.devs[uid] && S.devs[uid].displayName) || '';
function allReviews() { const out = []; Object.keys(S.reviews).forEach(aid => { const b = S.reviews[aid]; if (!b || typeof b !== 'object') return; Object.keys(b).forEach(rid => { const r = b[rid]; if (r && typeof r === 'object') out.push({ ...r, appId: aid, revId: rid }); }); }); return out; }
const pendingClaims = () => claimList().filter(c => c.status === 'pending');
function claimList() { const o = []; Object.keys(S.claims || {}).forEach(u => Object.keys(S.claims[u] || {}).forEach(a => { const c = S.claims[u][a]; if (c && typeof c === 'object') o.push({ ...c, uid: u, appId: a }); })); return o; }
const reportList = () => Object.keys(S.reports || {}).map(id => ({ id, ...S.reports[id] })).filter(r => r && typeof r === 'object');

/* ---------- toasts & dialogs ---------- */
function toast(msg, kind) { const t = document.createElement('div'); t.className = 'toast ' + (kind || 'ok'); t.innerHTML = ico(kind === 'bad' ? 'x' : 'check') + '<span>' + esc(msg) + '</span>'; $('#toasts').appendChild(t); setTimeout(() => { t.style.opacity = 0; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 3200); }
const ov = $('#overlay'), dlg = $('#dialog');
function closeOv() { UI.openId = null; ov.hidden = true; ov.className = 'overlay'; ov.innerHTML = ''; document.onkeydown = null; }
ov.addEventListener('mousedown', e => { if (e.target === ov && !ov.dataset.lock) closeOv(); });
function ask(o) {
  return new Promise(res => {
    dlg.hidden = false;
    dlg.innerHTML = `<form class="modal"><h3>${esc(o.title)}</h3>${o.text ? '<p>' + esc(o.text) + '</p>' : ''}${o.input ? `<label class="field"><span>${esc(o.input)}</span>${o.area ? '<textarea id="askIn" maxlength="300">' : '<input id="askIn" autocomplete="off"'} ${o.area ? '' : 'value="' + esc(o.value || '') + '">'}${o.area ? esc(o.value || '') + '</textarea>' : ''}</label>` : ''}<div class="actions"><button type="button" class="btn" id="askNo">Cancel</button><button class="btn ${o.danger ? 'danger' : 'primary'}" id="askOk">${esc(o.ok || 'Confirm')}</button></div></form>`;
    const inp = $('#askIn'); if (inp) setTimeout(() => inp.focus(), 30);
    const done = v => { dlg.hidden = true; dlg.innerHTML = ''; document.onkeydown = UI.openId ? (e => { if (e.key === 'Escape') closeOv(); }) : null; res(v); };
    $('#askNo').onclick = () => done(null);
    $('.modal').onsubmit = e => { e.preventDefault(); if (o.input) { const v = inp.value.trim(); if (o.must && v !== o.must) { inp.style.borderColor = 'var(--bad)'; return; } if (o.required && !v) { inp.style.borderColor = 'var(--bad)'; return; } done(v); } else done(true); };
    document.onkeydown = e => { if (e.key === 'Escape') done(null); };
  });
}

/* ---------- data ---------- */
async function loadAll() {
  S.failed = [];
  const get = (p, k) => db.ref(p).once('value').then(s => { S[k] = s.val() || {}; }).catch(() => { S.failed.push(p); S[k] = S[k] || {}; });
  await Promise.all([get('apps', 'apps'), get('users', 'users'), get('developers', 'devs'), get('reports', 'reports'), get('claims', 'claims'), get('reviews', 'reviews'), get('stats', 'stats'), get('devprofiles', 'profiles')]);
  S.loaded = true;
}
async function recount(appId) {
  const rs = Object.values(S.reviews[appId] || {}).filter(r => r && r.text && !r.hidden);
  const avg = rs.length ? Math.round(rs.reduce((s, r) => s + Math.min(5, Math.max(1, +r.rating || 5)), 0) / rs.length * 10) / 10 : 0;
  await db.ref('apps/' + appId).update({ rating: avg, reviewCount: rs.length });
  if (S.apps[appId]) { S.apps[appId].rating = avg; S.apps[appId].reviewCount = rs.length; }
}
function note(uid, key, text, appId) { return uid ? { path: `notifications/${uid}/${key}`, value: { type: 'admin', appId: appId || '', text: String(text).slice(0, 280), timestamp: Date.now(), read: false } } : null; }
const fail = e => toast('Failed: ' + ((e && e.message) || 'error') + ' — check the Firebase rules', 'bad');

/* ---------- actions ---------- */
const ACT = {
  async suspend(d) {
    const a = S.apps[d.id]; if (!a) return;
    const why = await ask({ title: 'Suspend "' + a.name + '"?', text: 'It will disappear from the store after the next store rebuild. The developer gets a notification.', input: 'Reason (shown to developer)', value: 'Reported for breaking the store rules.', ok: 'Suspend', danger: true, required: true }); if (why === null) return;
    const up = {}; up[`apps/${d.id}/status`] = 'suspended'; up[`apps/${d.id}/suspendedReason`] = why.slice(0, 200); up[`apps/${d.id}/prevStatus`] = a.status === 'suspended' ? (a.prevStatus || 'live') : (a.status || 'live');
    const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was suspended. Reason: ${why}`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); a.prevStatus = up[`apps/${d.id}/prevStatus`]; a.status = 'suspended'; a.suspendedReason = why; toast('App suspended'); rerender(); } catch (e) { fail(e); }
  },
  async restore(d) {
    const a = S.apps[d.id]; if (!a) return;
    if (!(await ask({ title: 'Restore "' + a.name + '"?', text: 'It will be listed again after the next store rebuild.', ok: 'Restore' }))) return;
    const st = a.prevStatus && a.prevStatus !== 'suspended' ? a.prevStatus : 'live', up = {}; up[`apps/${d.id}/status`] = st; up[`apps/${d.id}/suspendedReason`] = null;
    const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was restored.`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); a.status = st; a.suspendedReason = null; toast('App restored'); rerender(); } catch (e) { fail(e); }
  },
  async del(d) {
    const a = S.apps[d.id]; if (!a) return;
    if ((await ask({ title: 'Delete "' + a.name + '" forever?', text: 'This removes the app from the database. It cannot be undone.', input: 'Type DELETE to confirm', must: 'DELETE', ok: 'Delete app', danger: true })) === null) return;
    const up = {}; up[`apps/${d.id}`] = null; const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was removed from the store by the admin.`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); delete S.apps[d.id]; closeOv(); toast('App deleted'); rerender(); } catch (e) { fail(e); }
  },
  async transfer(d) {
    const a = S.apps[d.id]; if (!a) return;
    const uid = await ask({ title: 'Transfer ownership', text: 'Paste the uid of the new owner. The app moves to their My Apps.', input: 'New owner uid', required: true, ok: 'Continue' }); if (!uid) return;
    const nm = userName(uid) || 'Developer';
    if (!userName(uid) && !(await ask({ title: 'Unknown uid', text: 'No user with this uid was found in the data. Transfer anyway?', ok: 'Transfer', danger: true }))) return;
    const up = {}; up[`apps/${d.id}/developerUid`] = uid; up[`apps/${d.id}/developerName`] = nm;
    const n1 = note(uid, 'adm_' + ckey(d.id) + '_' + Date.now(), `The app "${a.name}" was transferred to you.`, d.id), n2 = a.developerUid !== uid && note(a.developerUid, 'adm_' + ckey(d.id) + '_o' + Date.now(), `The app "${a.name}" was transferred to another developer.`, d.id);
    if (n1) up[n1.path] = n1.value; if (n2) up[n2.path] = n2.value;
    try { await db.ref().update(up); a.developerUid = uid; a.developerName = nm; toast('Ownership transferred'); rerender(); } catch (e) { fail(e); }
  },
  async hideRev(d) {
    const r = (S.reviews[d.a] || {})[d.r]; if (!r) return; const hide = !r.hidden;
    try { await db.ref(`reviews/${d.a}/${d.r}/hidden`).set(hide ? true : null); if (hide) r.hidden = true; else delete r.hidden; await recount(d.a); toast(hide ? 'Review hidden' : 'Review visible again'); rerender(); } catch (e) { fail(e); }
  },
  async delRev(d) {
    const r = (S.reviews[d.a] || {})[d.r]; if (!r) return;
    if (!(await ask({ title: 'Delete this review?', text: '"' + String(r.text || '').slice(0, 120) + '"\n\nThis cannot be undone.', ok: 'Delete', danger: true }))) return;
    try { await db.ref(`reviews/${d.a}/${d.r}`).remove(); delete S.reviews[d.a][d.r]; await recount(d.a); toast('Review deleted'); rerender(); } catch (e) { fail(e); }
  },
  async verifyDev(d) {
    const p = S.profiles[d.u]; if (!p) return; const on = p.verified !== true;
    if (!(await ask({ title: (on ? 'Verify ' : 'Remove verified badge from ') + (p.name || 'this developer') + '?', text: on ? 'A Verified badge shows on their store developer page.' : '', ok: on ? 'Verify' : 'Remove', danger: !on }))) return;
    try { await db.ref(`devprofiles/${d.u}/verified`).set(on ? true : null); if (on) p.verified = true; else delete p.verified; toast(on ? 'Developer verified' : 'Badge removed'); rerender(); } catch (e) { fail(e); }
  },
  async resolve(d) { try { await db.ref('reports/' + d.id).remove(); delete S.reports[d.id]; toast('Report resolved'); rerender(); } catch (e) { fail(e); } },
  async approve(d) {
    const c = ((S.claims[d.u] || {})[d.a]); if (!c) return;
    if (!(await ask({ title: 'Approve this claim?', text: `"${c.appName}" moves to ${c.claimantName}. The previous owner loses access.`, ok: 'Approve' }))) return;
    const now = Date.now(), up = {}; up[`apps/${d.a}/developerUid`] = d.u; up[`apps/${d.a}/developerName`] = c.claimantName || 'Developer'; up[`apps/${d.a}/claimedAt`] = now;
    up[`claims/${d.u}/${d.a}/status`] = 'approved'; up[`claims/${d.u}/${d.a}/decidedAt`] = now;
    const n1 = { path: `notifications/${d.u}/claim_${ckey(d.a)}`, value: { type: 'claim', appId: d.a, text: `Your claim for "${c.appName}" was approved. It is now in your My Apps.`, timestamp: now, read: false } }; up[n1.path] = n1.value;
    if (c.currentOwner && c.currentOwner !== d.u) { up[`notifications/${c.currentOwner}/claimout_${ckey(d.a)}`] = { type: 'claim', appId: d.a, text: `"${c.appName}" was moved to its original developer after a claim.`, timestamp: now, read: false }; }
    try { await db.ref().update(up); Object.assign(c, { status: 'approved', decidedAt: now }); if (S.apps[d.a]) { S.apps[d.a].developerUid = d.u; S.apps[d.a].developerName = c.claimantName; } toast('Claim approved'); rerender(); } catch (e) { fail(e); }
  },
  async reject(d) {
    const c = ((S.claims[d.u] || {})[d.a]); if (!c) return;
    const why = await ask({ title: 'Reject this claim?', text: 'Say why. The developer will see it.', input: 'Reason', value: 'We could not confirm that you own this app.', ok: 'Reject', danger: true, required: true }); if (why === null) return;
    const now = Date.now(), up = {}; up[`claims/${d.u}/${d.a}/status`] = 'rejected'; up[`claims/${d.u}/${d.a}/reason`] = why.slice(0, 200); up[`claims/${d.u}/${d.a}/decidedAt`] = now;
    up[`notifications/${d.u}/claim_${ckey(d.a)}`] = { type: 'claim', appId: d.a, text: `Your claim for "${c.appName}" was rejected. Reason: ${why.slice(0, 150)}`, timestamp: now, read: false };
    try { await db.ref().update(up); Object.assign(c, { status: 'rejected', reason: why, decidedAt: now }); toast('Claim rejected'); rerender(); } catch (e) { fail(e); }
  },
  openApp(d) { openApp(d.id); },
  go(d) { closeOv(); location.hash = '#/' + d.to; },
  more(d) { if (d.k === 'apps') UI.appLimit += 40; else UI.revLimit += 30; rerender(); },
  claimTab(d) { UI.claimTab = d.t; rerender(); }
};
document.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (!t || !ACT[t.dataset.act]) return; e.stopPropagation(); ACT[t.dataset.act](t.dataset); });

/* ---------- charts ---------- */
function dayKeys(n) { const out = [], base = Date.now() + 19800000; for (let i = n - 1; i >= 0; i--) out.push(new Date(base - i * 864e5).toISOString().slice(0, 10)); return out; }
function lineChart(keys, vals) {
  const W = 640, H = 230, p = { l: 36, r: 12, t: 14, b: 26 }, max = Math.max(4, ...vals), top = Math.ceil(max / 4) * 4, iw = W - p.l - p.r, ih = H - p.t - p.b;
  const x = i => p.l + (keys.length === 1 ? iw / 2 : i * iw / (keys.length - 1)), y = v => p.t + ih - v / top * ih;
  let g = '', l = '';
  for (let i = 0; i <= 4; i++) { const v = top / 4 * i, yy = y(v); g += `<line class="gl" x1="${p.l}" x2="${W - p.r}" y1="${yy}" y2="${yy}"/><text x="${p.l - 8}" y="${yy + 4}" text-anchor="end">${nf(v)}</text>`; }
  const step = Math.ceil(keys.length / 7); keys.forEach((k, i) => { if (i % step === 0 || i === keys.length - 1) l += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${k.slice(5).replace('-', '/')}</text>`; });
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const path = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
  const area = path + ` L${pts[pts.length - 1][0]} ${p.t + ih} L${pts[0][0]} ${p.t + ih}Z`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" ><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c8cff" stop-opacity=".45"/><stop offset="1" stop-color="#7c8cff" stop-opacity="0"/></linearGradient><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#6d7bff"/><stop offset="1" stop-color="#b07cff"/></linearGradient></defs>${g}${l}<path d="${area}" fill="url(#ag)"/><path d="${path}" fill="none" stroke="url(#lg)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>${pts.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="${keys.length > 20 ? 0 : 3.4}" fill="var(--panel)" stroke="#8d86ff" stroke-width="2"><title>${keys[i]}: ${vals[i]}</title></circle>`).join('')}</svg>`;
}

/* ---------- views ---------- */
function kpi(icn, tone, val, label, sub, href) { const inner = `<div class="ic">${ico(icn)}</div><b>${val}</b><span>${label}</span>${sub ? '<em>' + sub + '</em>' : ''}`; return href ? `<a class="card kpi t-${tone}" href="${href}">${inner}</a>` : `<div class="card kpi t-${tone}">${inner}</div>`; }
function vOverview() {
  const apps = appList(), live = apps.filter(a => stat(a) === 'live').length, susp = apps.filter(a => stat(a) === 'suspended').length, drafts = apps.filter(a => stat(a) === 'draft').length;
  const dl = apps.reduce((s, a) => s + (+a.downloadCount || 0), 0), views = apps.reduce((s, a) => s + (+a.views || 0), 0);
  const revs = allReviews(), vis = revs.filter(r => !r.hidden && r.rating), avg = vis.length ? vis.reduce((s, r) => s + (+r.rating || 0), 0) / vis.length : 0;
  const devIds = new Set([...Object.keys(S.devs), ...apps.map(a => a.developerUid).filter(Boolean)]);
  const pc = pendingClaims().length, rp = reportList().length;
  const keys = dayKeys(UI.range), perDay = {}; Object.keys(S.stats).forEach(aid => { const d = S.stats[aid]; if (d && typeof d === 'object') Object.keys(d).forEach(k => { perDay[k] = (perDay[k] || 0) + (+d[k] || 0); }); });
  const vals = keys.map(k => perDay[k] || 0), tot = vals.reduce((a, b) => a + b, 0);
  const top = apps.slice().sort((a, b) => (+b.downloadCount || 0) - (+a.downloadCount || 0)).slice(0, 6), topMax = Math.max(1, +(top[0] && top[0].downloadCount) || 1);
  const dist = [5, 4, 3, 2, 1].map(n => [n, vis.filter(r => Math.round(+r.rating) === n).length]), dmax = Math.max(1, ...dist.map(x => x[1]));
  const feed = [];
  apps.forEach(a => { const t = appCreated(a); if (t) feed.push({ t, ic: 'apps', cl: '', h: `<b>${esc(a.name)}</b> was published by ${esc(a.developerName || 'a developer')}` }); });
  revs.forEach(r => feed.push({ t: +r.timestamp || 0, ic: 'star', cl: r.hidden ? 'warn' : '', h: `<b>${esc(r.author || 'User')}</b> reviewed <b>${esc((S.apps[r.appId] || {}).name || 'an app')}</b> ${r.rating || ''}★` }));
  claimList().forEach(c => feed.push({ t: +c.timestamp || 0, ic: 'shield', cl: c.status === 'pending' ? 'warn' : 'ok', h: `<b>${esc(c.claimantName)}</b> claimed <b>${esc(c.appName)}</b> (${esc(c.status)})` }));
  reportList().forEach(r => feed.push({ t: +r.ts || 0, ic: 'flag', cl: 'bad', h: `Report on <b>${esc(r.appName || r.appId)}</b>: ${esc(r.reason || '')}` }));
  feed.sort((a, b) => b.t - a.t);
  const todo = (href, n, t, s) => `<a class="todo" href="${href}"><div class="ic fi"><span class="dot ${n ? 'warn' : 'ok'}">${ico(n ? 'clock' : 'check')}</span></div><div><b>${t}</b><span>${s}</span></div>${n ? `<span class="cnt">${n}</span>` : ''}</a>`;
  return (S.failed.length ? `<div class="item" style="border-color:rgba(251,191,36,.5);margin-bottom:16px"><b style="color:var(--warn)">Some data could not be loaded</b><div class="meta">${S.failed.map(esc).join(', ')} — publish the new Firebase rules, then press refresh.</div></div>` : '') + `
  <div class="grid g-kpi">${kpi('apps', '', nf(apps.length), 'Total apps', `${live} live · ${drafts} draft`, '#/apps')}${kpi('dl', 'ok', nf(dl), 'Downloads', 'all time')}${kpi('eye', 'info', nf(views), 'Views', 'all time')}${kpi('star', 'warn', avg ? avg.toFixed(1) : '—', 'Average rating', nf(vis.length) + ' visible reviews', '#/reviews')}${kpi('users', 'vio', nf(Object.keys(S.users).length), 'Store users', nf(devIds.size) + ' developers', '#/users')}${kpi('pause', susp ? 'bad' : '', nf(susp), 'Suspended apps', '', '#/apps')}</div>
  <div class="grid g-2">
    <div class="card"><div class="card-h"><div><h3>Downloads</h3><div class="sub">${nf(tot)} in the last ${UI.range} days</div></div><div class="seg">${[7, 14, 30].map(n => `<button class="${UI.range === n ? 'on' : ''}" data-act="range" data-n="${n}">${n}d</button>`).join('')}</div></div>${lineChart(keys, vals)}</div>
    <div class="card"><h3>Needs attention</h3><div class="sub">Things waiting for you</div>${todo('#/claims', pc, 'Claim requests', pc ? pc + ' pending' : 'All clear')}${todo('#/reports', rp, 'Reports', rp ? rp + ' open' : 'All clear')}${todo('#/apps', susp, 'Suspended apps', susp ? 'Review them' : 'None')}</div>
  </div>
  <div class="grid g-3">
    <div class="card"><h3>Top apps</h3><div class="sub">By downloads</div><div class="bars-h">${top.length ? top.map(a => `<div class="bh" data-act="openApp" data-id="${esc(a.id)}" style="cursor:pointer"><img src="${esc(a.icon || ICON)}" alt=""><div class="nm"><span>${esc(a.name)}</span><div class="tr"><i style="width:${Math.max(4, (+a.downloadCount || 0) / topMax * 100)}%"></i></div></div><b>${nf(a.downloadCount)}</b></div>`).join('') : '<div class="muted">No apps yet</div>'}</div></div>
    <div class="card"><h3>Rating split</h3><div class="sub">All visible reviews</div><div class="bars-h">${dist.map(([n, c]) => `<div class="bh"><b>${n}★</b><div class="tr"><i style="width:${c / dmax * 100}%"></i></div><b>${c}</b></div>`).join('')}</div></div>
    <div class="card"><h3>Recent activity</h3><div class="sub">Across the store</div><div class="feed">${feed.slice(0, 7).map(f => `<div class="fi"><span class="dot ${f.cl}">${ico(f.ic)}</span><div><p>${f.h}</p><small>${ago(f.t)}</small></div></div>`).join('') || '<div class="muted">Nothing yet</div>'}</div></div>
  </div>`;
}
ACT.range = d => { UI.range = +d.n; rerender(); };

function vApps() {
  let list = appList();
  const q = UI.appQ.trim().toLowerCase();
  if (q) list = list.filter(a => [a.name, a.package, a.developerName, a.category].join(' ').toLowerCase().includes(q));
  if (UI.appF !== 'all') list = list.filter(a => stat(a) === UI.appF);
  const so = { new: (a, b) => appCreated(b) - appCreated(a), dl: (a, b) => (+b.downloadCount || 0) - (+a.downloadCount || 0), rate: (a, b) => (+b.rating || 0) - (+a.rating || 0), name: (a, b) => String(a.name).localeCompare(String(b.name)) };
  list.sort(so[UI.appSort]);
  const cnt = k => appList().filter(a => k === 'all' || stat(a) === k).length;
  const shown = list.slice(0, UI.appLimit);
  return `<div class="toolbar"><div class="grow">${ico('search')}<input id="appQ" type="search" placeholder="Search name, package, developer…" value="${esc(UI.appQ)}"></div>
    <select id="appSort"><option value="new"${UI.appSort === 'new' ? ' selected' : ''}>Newest</option><option value="dl"${UI.appSort === 'dl' ? ' selected' : ''}>Most downloads</option><option value="rate"${UI.appSort === 'rate' ? ' selected' : ''}>Top rated</option><option value="name"${UI.appSort === 'name' ? ' selected' : ''}>Name A–Z</option></select></div>
  <div class="chips" style="margin-bottom:16px">${[['all', 'All'], ['live', 'Live'], ['draft', 'Draft'], ['suspended', 'Suspended']].map(([k, t]) => `<button class="chip ${UI.appF === k ? 'on' : ''}" data-act="appF" data-k="${k}">${t} · ${cnt(k)}</button>`).join('')}</div>
  <div class="table" style="--cols:minmax(0,2.4fr) minmax(0,1.3fr) 110px 90px 90px 110px"><div class="tr-h"><div>App</div><div>Developer</div><div>Status</div><div>Downloads</div><div>Rating</div><div class="cell r">Actions</div></div>
  ${shown.length ? shown.map(a => `<div class="tr-r" data-act="openApp" data-id="${esc(a.id)}"><div class="cell who"><img class="ico" src="${esc(a.icon || ICON)}" alt=""><div><b>${esc(a.name || 'Untitled')}</b><small>${esc(a.package || '')}</small></div></div><div class="cell hide-m"><span>${esc(a.developerName || userName(a.developerUid) || '—')}</span></div><div class="cell">${statPill(a)}</div><div class="cell hide-m">${nf(a.downloadCount)}</div><div class="cell hide-m">${+a.rating ? (+a.rating).toFixed(1) + ' ★' : '—'}</div><div class="cell r hide-m">${stat(a) === 'suspended' ? `<button class="btn sm good" data-act="restore" data-id="${esc(a.id)}">Restore</button>` : `<button class="btn sm danger" data-act="suspend" data-id="${esc(a.id)}">Suspend</button>`}</div></div>`).join('') : `<div class="empty">${ico('inbox')}<b>No apps found</b>Try another search or filter.</div>`}</div>
  ${list.length > shown.length ? `<div class="more"><button class="btn" data-act="more" data-k="apps">Show more (${list.length - shown.length})</button></div>` : ''}`;
}
ACT.appF = d => { UI.appF = d.k; UI.appLimit = 40; rerender(); };

function openApp(id) {
  const a = S.apps[id]; if (!a) return; a.id = id; UI.openId = id;
  const revs = allReviews().filter(r => r.appId === id).sort((x, y) => (+y.timestamp || 0) - (+x.timestamp || 0)).slice(0, 4);
  const kv = (k, v) => `<div><dt>${k}</dt><dd>${v == null || v === '' ? '—' : v}</dd></div>`;
  ov.className = 'overlay'; ov.hidden = false;
  ov.innerHTML = `<aside class="drawer"><div class="dr-h"><img class="ico" style="width:44px;height:44px;border-radius:12px" src="${esc(a.icon || ICON)}" alt=""><div class="grow"><h3>${esc(a.name)}</h3><div class="muted">${esc(a.package || '')}</div></div><button class="icon-btn" id="drClose" aria-label="Close">${ico('x')}</button></div>
  <div class="dr-b"><div class="dr-sec">${statPill(a)} ${a.status === 'suspended' && a.suspendedReason ? `<div class="meta" style="margin-top:8px">Reason: ${esc(a.suspendedReason)}</div>` : ''}</div>
  <div class="dr-sec"><h4>Overview</h4><dl class="kv">${kv('Version', esc(a.version))}${kv('Category', esc(a.category))}${kv('Downloads', nf(a.downloadCount))}${kv('Views', nf(a.views))}${kv('Rating', +a.rating ? (+a.rating).toFixed(1) + ' (' + (a.reviewCount || 0) + ')' : '')}${kv('Published', dstr(appCreated(a)))}</dl></div>
  <div class="dr-sec"><h4>Developer</h4><dl class="kv">${kv('Name', esc(a.developerName || userName(a.developerUid)))}${kv('Uid', '<code>' + esc(a.developerUid || '') + '</code>')}${kv('Website', a.website ? `<a href="${esc(a.website)}" target="_blank" rel="noopener">${esc(a.website)}</a>` : '')}${kv('Support', esc(a.supportEmail))}</dl></div>
  ${a.shortDescription ? `<div class="dr-sec"><h4>Description</h4><p>${esc(a.shortDescription)}</p></div>` : ''}
  <div class="dr-sec"><h4>Latest reviews</h4>${revs.length ? revs.map(r => `<div class="reply" style="border-color:${r.hidden ? 'var(--warn)' : 'var(--acc)'}"><b>${esc(r.author || 'User')}</b> ${stars(r.rating)}${r.hidden ? ' ' + pill('warn', 'Hidden') : ''}<div>${esc(String(r.text || '').slice(0, 220))}</div></div>`).join('') : '<div class="muted">No reviews</div>'}</div></div>
  <div class="dr-f">${stat(a) === 'suspended' ? `<button class="btn good" data-act="restore" data-id="${esc(id)}">${ico('play')}Restore</button>` : `<button class="btn danger" data-act="suspend" data-id="${esc(id)}">${ico('pause')}Suspend</button>`}<button class="btn" data-act="transfer" data-id="${esc(id)}">${ico('swap')}Transfer</button><button class="btn danger" data-act="del" data-id="${esc(id)}" style="margin-left:auto">${ico('trash')}Delete</button></div></aside>`;
  $('#drClose').onclick = closeOv; document.onkeydown = e => { if (e.key === 'Escape') closeOv(); };
}

function vReviews() {
  let list = allReviews(); const q = UI.revQ.trim().toLowerCase();
  if (q) list = list.filter(r => [r.author, r.username, r.text, (S.apps[r.appId] || {}).name].join(' ').toLowerCase().includes(q));
  const F = { all: () => true, low: r => +r.rating <= 2, hidden: r => r.hidden, reply: r => r.reply };
  const cnt = k => allReviews().filter(F[k]).length;
  list = list.filter(F[UI.revF]).sort((a, b) => (+b.timestamp || 0) - (+a.timestamp || 0));
  const shown = list.slice(0, UI.revLimit);
  return `<div class="toolbar"><div class="grow">${ico('search')}<input id="revQ" type="search" placeholder="Search reviews, people, apps…" value="${esc(UI.revQ)}"></div></div>
  <div class="chips" style="margin-bottom:16px">${[['all', 'All'], ['low', 'Low (1–2★)'], ['hidden', 'Hidden'], ['reply', 'Replied']].map(([k, t]) => `<button class="chip ${UI.revF === k ? 'on' : ''}" data-act="revF" data-k="${k}">${t} · ${cnt(k)}</button>`).join('')}</div>
  <div class="stack">${shown.length ? shown.map(r => { const ap = S.apps[r.appId] || {}; return `<div class="item"><div class="item-h"><img class="ico" src="${esc(ap.icon || ICON)}" alt=""><div class="grow"><b>${esc(ap.name || 'Deleted app')}</b><div class="meta">${esc(r.author || 'User')}${r.username ? ' · @' + esc(r.username) : ''} · ${ago(+r.timestamp)}</div></div>${stars(r.rating)}</div><p class="body">${esc(r.text || '')}</p>${r.reply ? `<div class="reply"><b>Developer reply</b><div>${esc(r.reply)}</div></div>` : ''}<div class="actions" style="margin-top:12px">${r.hidden ? pill('warn', 'Hidden') : ''}<button class="btn sm" data-act="hideRev" data-a="${esc(r.appId)}" data-r="${esc(r.revId)}">${ico(r.hidden ? 'eye' : 'eyeoff')}${r.hidden ? 'Unhide' : 'Hide'}</button><button class="btn sm danger" data-act="delRev" data-a="${esc(r.appId)}" data-r="${esc(r.revId)}">${ico('trash')}Delete</button></div></div>`; }).join('') : `<div class="empty">${ico('chat')}<b>No reviews here</b>Nothing matches this filter.</div>`}</div>
  ${list.length > shown.length ? `<div class="more"><button class="btn" data-act="more" data-k="rev">Show more (${list.length - shown.length})</button></div>` : ''}`;
}
ACT.revF = d => { UI.revF = d.k; UI.revLimit = 30; rerender(); };

function vReports() {
  const list = reportList().sort((a, b) => (+b.ts || 0) - (+a.ts || 0));
  if (!list.length) return `<div class="empty card">${ico('flag')}<b>No open reports</b>Reports from store users show up here.</div>`;
  return '<div class="stack">' + list.map(r => { const ap = S.apps[r.appId]; return `<div class="item"><div class="item-h"><img class="ico" src="${esc((ap && ap.icon) || ICON)}" alt=""><div class="grow"><b>${esc(r.appName || r.appId)}</b><div class="meta">${ago(+r.ts)}${r.username ? ' · reported by @' + esc(r.username) : ''}</div></div>${pill('bad', r.reason || 'Report')}${ap && stat(ap) === 'suspended' ? pill('', 'Already suspended') : ''}</div>${r.details ? `<p class="body">${esc(r.details)}</p>` : ''}<div class="actions">${ap ? `<button class="btn sm" data-act="openApp" data-id="${esc(r.appId)}">Open app</button>${stat(ap) !== 'suspended' ? `<button class="btn sm danger" data-act="suspend" data-id="${esc(r.appId)}">${ico('pause')}Suspend app</button>` : ''}` : '<span class="muted">App no longer exists</span>'}<button class="btn sm good" data-act="resolve" data-id="${esc(r.id)}" style="margin-left:auto">${ico('check')}Resolve</button></div></div>`; }).join('') + '</div>';
}

const shotsOf = c => { const l = String(c.screenshots || '').split(',').map(x => x.trim()).filter(x => /^https?:\/\//i.test(x)); return l.length ? `<div class="meta">Screenshots (${l.length}) — in the order the developer set</div><div class="shots">${l.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Screenshot ${i + 1}" loading="lazy"><span>${i + 1}</span></a>`).join('')}</div>` : ''; };
const hostOf = u => { try { return new URL(/^https?:/i.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return ''; } };
const baseDom = h => h.split('.').slice(-2).join('.');
function vClaims() {
  const all = claimList(), tabs = ['pending', 'approved', 'rejected'];
  const list = all.filter(c => c.status === UI.claimTab).sort((a, b) => (+b.timestamp || 0) - (+a.timestamp || 0));
  const head = `<div class="chips" style="margin-bottom:16px">${tabs.map(t => `<button class="chip ${UI.claimTab === t ? 'on' : ''}" data-act="claimTab" data-t="${t}">${t[0].toUpperCase() + t.slice(1)} · ${all.filter(c => c.status === t).length}</button>`).join('')}</div>`;
  if (!list.length) return head + `<div class="empty card">${ico('shield')}<b>No ${UI.claimTab} claims</b></div>`;
  return head + '<div class="stack">' + list.map(c => {
    const live = S.apps[c.appId] || {}, common = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me'];
    const sites = [live.website, live.privacyPolicy, (live.supportEmail || '').split('@')[1]].map(x => baseDom(hostOf(x || ''))).filter(Boolean);
    const mine = [(c.contactEmail || '').split('@')[1], (c.claimantEmail || '').split('@')[1]].map(x => baseDom(hostOf(x || ''))).filter(Boolean);
    const match = sites.length && mine.some(d => !common.includes(d) && sites.includes(d));
    return `<div class="item"><div class="item-h"><img class="ico" src="${esc(c.icon || ICON)}" alt=""><div class="grow"><b>${esc(c.appName)}</b><div class="meta">${esc(c.package)} · listed by ${esc(c.currentOwnerName || 'unknown')}</div></div>${pill(c.status === 'approved' ? 'ok' : c.status === 'rejected' ? 'bad' : 'warn', c.status)}</div>
    <dl class="kv"><div><dt>Claimed by</dt><dd>${esc(c.claimantName)}${c.claimantUsername ? ' (@' + esc(c.claimantUsername) + ')' : ''}</dd></div><div><dt>Relation</dt><dd>${esc(c.role)}</dd></div><div><dt>Login email</dt><dd>${esc(c.claimantEmail)}</dd></div><div><dt>Contact email</dt><dd>${esc(c.contactEmail)}</dd></div><div><dt>Sent</dt><dd>${dstr(+c.timestamp)}</dd></div><div><dt>Listing website</dt><dd>${esc(live.website || '—')}</dd></div></dl>
    <div class="meta">Proof</div><p class="body"><a href="${esc(c.proofUrl)}" target="_blank" rel="noopener">${esc(c.proofUrl)}</a></p><p class="body">${esc(c.message)}</p>${shotsOf(c)}
    <div class="hint ${match ? 'ok' : 'warn'}">${ico(match ? 'check' : 'flag')}${match ? "Email domain matches the app's website or support email" : 'No email-domain match with the listing — check the proof carefully'}</div>
    ${c.status === 'pending' ? `<div class="actions" style="margin-top:12px"><button class="btn good" data-act="approve" data-u="${esc(c.uid)}" data-a="${esc(c.appId)}">${ico('check')}Approve</button><button class="btn danger" data-act="reject" data-u="${esc(c.uid)}" data-a="${esc(c.appId)}">${ico('x')}Reject</button></div>` : (c.reason ? `<div class="meta">Reason: ${esc(c.reason)}</div>` : '')}</div>`;
  }).join('') + '</div>';
}

function vUsers() {
  const m = {}, ensure = u => m[u] || (m[u] = { uid: u, apps: 0, reviews: 0 });
  Object.keys(S.users).forEach(u => Object.assign(ensure(u), S.users[u]));
  Object.keys(S.devs).forEach(u => { const d = ensure(u); d.isDev = true; d.email = S.devs[u].email; d.name = d.name || S.devs[u].displayName; d.username = d.username || S.devs[u].username; });
  appList().forEach(a => { if (a.developerUid) { const d = ensure(a.developerUid); d.isDev = true; d.apps++; if (!d.name) d.name = a.developerName; } });
  allReviews().forEach(r => { ensure(r.revId).reviews++; });
  let list = Object.values(m); const q = UI.userQ.trim().toLowerCase();
  if (q) list = list.filter(u => [u.name, u.username, u.email, u.uid].join(' ').toLowerCase().includes(q));
  const cnt = f => Object.values(m).filter(u => f === 'all' || (f === 'dev' ? u.isDev : u.reviews)).length;
  if (UI.userF === 'dev') list = list.filter(u => u.isDev); else if (UI.userF === 'rev') list = list.filter(u => u.reviews);
  list.sort((a, b) => (b.apps - a.apps) || (b.reviews - a.reviews) || (+b.createdAt || 0) - (+a.createdAt || 0));
  const shown = list.slice(0, 80);
  return `<div class="toolbar"><div class="grow">${ico('search')}<input id="userQ" type="search" placeholder="Search name, username, email, uid…" value="${esc(UI.userQ)}"></div></div>
  <div class="chips" style="margin-bottom:16px">${[['all', 'Everyone'], ['dev', 'Developers'], ['rev', 'Reviewers']].map(([k, t]) => `<button class="chip ${UI.userF === k ? 'on' : ''}" data-act="userF" data-k="${k}">${t} · ${cnt(k)}</button>`).join('')}</div>
  <div class="table" style="--cols:minmax(0,2fr) minmax(0,1.4fr) 100px 90px 110px"><div class="tr-h"><div>Person</div><div>Email</div><div>Role</div><div>Reviews</div><div>Joined · Verify</div></div>
  ${shown.length ? shown.map(u => `<div class="tr-r" style="cursor:default"><div class="cell who"><div class="avatar ${avc(u.username || u.name)}" style="width:36px;height:36px;border-radius:50%">${esc((u.name || '?')[0].toUpperCase())}</div><div><b>${esc(u.name || 'Unnamed')}</b><small>${u.username ? '@' + esc(u.username) : esc(u.uid)}</small></div></div><div class="cell hide-m"><span>${esc(u.email || '—')}</span></div><div class="cell">${u.isDev ? pill('vio', u.apps + (u.apps === 1 ? ' app' : ' apps')) + ((S.profiles[u.uid] || {}).verified ? ' ' + pill('ok', 'Verified') : '') : pill('', 'User')}</div><div class="cell hide-m">${u.reviews}</div><div class="cell hide-m">${u.isDev && S.profiles[u.uid] ? `<button class="btn sm ${S.profiles[u.uid].verified ? '' : 'good'}" data-act="verifyDev" data-u="${esc(u.uid)}">${S.profiles[u.uid].verified ? 'Unverify' : 'Verify'}</button>` : dstr(+u.createdAt)}</div></div>`).join('') : `<div class="empty">${ico('users')}<b>No people found</b></div>`}</div>
  <div class="card" style="margin-top:16px"><h3>Add another admin</h3><div class="sub">Open Firebase → Realtime Database → add <code>admins</code> → <code>&lt;uid&gt;</code> = <code>true</code>. Removing it removes admin access immediately.</div></div>`;
}
ACT.userF = d => { UI.userF = d.k; rerender(); };

function vBroadcast() {
  const targets = new Set([...Object.keys(S.devs), ...appList().map(a => a.developerUid).filter(Boolean)]);
  return `<div class="compose"><div class="card"><h3>Message all developers</h3><div class="sub">Appears in the Notifications screen of every developer's console. Reaches ${targets.size} developer${targets.size === 1 ? '' : 's'}.</div>
  <label class="field"><span>Message</span><textarea id="bcText" maxlength="280" placeholder="e.g. We updated the store rules. Please review your app descriptions."></textarea></label>
  <div class="actions"><button class="btn primary" data-act="sendBc">${ico('send')}Send to ${targets.size}</button><span class="muted" id="bcLen" style="align-self:center">0 / 280</span></div></div>
  <div class="phone"><div class="muted" style="margin-bottom:10px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Preview</div><div class="nt"><b>UptoZishu Admin</b><div id="bcPrev" class="muted">Your message appears here…</div></div></div></div>`;
}
ACT.sendBc = async () => {
  const el = $('#bcText'), text = el.value.trim(); if (text.length < 3) { el.style.borderColor = 'var(--bad)'; return; }
  const targets = [...new Set([...Object.keys(S.devs), ...appList().map(a => a.developerUid).filter(Boolean)])];
  if (!(await ask({ title: 'Send to ' + targets.length + ' developers?', text: '"' + text + '"', ok: 'Send' }))) return;
  const up = {}, now = Date.now(); targets.forEach(u => { up[`notifications/${u}/bc_${now}`] = { type: 'admin', appId: '', text: text.slice(0, 280), timestamp: now, read: false }; });
  try { await db.ref().update(up); el.value = ''; toast('Sent to ' + targets.length + ' developers'); $('#bcPrev').textContent = 'Your message appears here…'; $('#bcLen').textContent = '0 / 280'; } catch (e) { fail(e); }
};

/* ---------- router ---------- */
const VIEWS = { '': vOverview, apps: vApps, reviews: vReviews, reports: vReports, claims: vClaims, users: vUsers, broadcast: vBroadcast };
function route() { return (location.hash.replace(/^#\/?/, '').split('/')[0]) || ''; }
function buildNav() {
  const c = { reports: reportList().length, claims: pendingClaims().length };
  $('#nav').innerHTML = NAV.map(n => n[0] === 'h' ? `<div class="nav-h">${n[1]}</div>` : `<a class="nav-a ${route() === n[0] ? 'on' : ''}" href="#/${n[0]}">${ico(n[2])}<span>${n[1]}</span>${c[n[0]] ? `<span class="cnt">${c[n[0]]}</span>` : ''}</a>`).join('');
}
function rerender() {
  if (!S.user) return; const r = route(), keepFocus = document.activeElement && document.activeElement.id;
  const sc = window.scrollY, pos = keepFocus && document.activeElement.selectionStart;
  $('#pageTitle').textContent = TITLES[r] || 'Overview'; document.title = (TITLES[r] || 'Overview') + ' · UptoZishu Admin';
  buildNav(); $('#view').innerHTML = (VIEWS[r] || vOverview)();
  if (keepFocus && $('#' + keepFocus)) { const el = $('#' + keepFocus); el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { } }
  window.scrollTo(0, sc); bindView();
  if (UI.openId) { if (S.apps[UI.openId]) openApp(UI.openId); else closeOv(); }
}
function bindView() {
  const on = (id, fn) => { const el = $('#' + id); if (el) el.addEventListener('input', fn); };
  on('appQ', e => { UI.appQ = e.target.value; UI.appLimit = 40; rerender(); }); on('revQ', e => { UI.revQ = e.target.value; UI.revLimit = 30; rerender(); }); on('userQ', e => { UI.userQ = e.target.value; rerender(); });
  const s = $('#appSort'); if (s) s.onchange = e => { UI.appSort = e.target.value; rerender(); };
  const bt = $('#bcText'); if (bt) bt.addEventListener('input', () => { $('#bcLen').textContent = bt.value.length + ' / 280'; $('#bcPrev').textContent = bt.value || 'Your message appears here…'; });
}
window.addEventListener('hashchange', () => { closeOv(); navOpen(false); rerender(); window.scrollTo(0, 0); });

/* ---------- command palette ---------- */
function openPalette() {
  ov.className = 'overlay top'; ov.hidden = false;
  ov.innerHTML = `<div class="pal"><input id="palIn" placeholder="Jump to a page, app or person…" autocomplete="off"><div class="pal-l" id="palL"></div></div>`;
  const inp = $('#palIn'); let sel = 0, items = [];
  const draw = () => {
    const q = inp.value.trim().toLowerCase(); items = [];
    NAV.filter(n => n[0] !== 'h' && (!q || n[1].toLowerCase().includes(q))).forEach(n => items.push({ g: 'Pages', t: n[1], ic: n[2], go: () => { location.hash = '#/' + n[0]; } }));
    if (q) {
      appList().filter(a => [a.name, a.package, a.developerName].join(' ').toLowerCase().includes(q)).slice(0, 6).forEach(a => items.push({ g: 'Apps', t: a.name, s: a.package, ic: 'apps', go: () => openApp(a.id) }));
      Object.keys(S.users).filter(u => [S.users[u].name, S.users[u].username].join(' ').toLowerCase().includes(q)).slice(0, 4).forEach(u => items.push({ g: 'People', t: S.users[u].name || u, s: '@' + (S.users[u].username || ''), ic: 'users', go: () => { UI.userQ = S.users[u].username || ''; location.hash = '#/users'; rerender(); } }));
    }
    sel = Math.min(sel, Math.max(0, items.length - 1)); let last = '';
    $('#palL').innerHTML = items.length ? items.map((it, i) => (it.g !== last ? (last = it.g, `<div class="pal-g">${it.g}</div>`) : '') + `<div class="pal-i ${i === sel ? 'on' : ''}" data-i="${i}">${ico(it.ic)}<span>${esc(it.t)}</span><small>${esc(it.s || '')}</small></div>`).join('') : '<div class="empty" style="padding:30px">No results</div>';
  };
  const run = i => { const it = items[i]; if (it) { closeOv(); it.go(); } };
  inp.oninput = () => { sel = 0; draw(); }; draw(); setTimeout(() => inp.focus(), 20);
  $('#palL').onclick = e => { const el = e.target.closest('.pal-i'); if (el) run(+el.dataset.i); };
  document.onkeydown = e => { if (e.key === 'Escape') closeOv(); else if (e.key === 'ArrowDown') { sel = Math.min(items.length - 1, sel + 1); draw(); e.preventDefault(); } else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); } else if (e.key === 'Enter') run(sel); };
}
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && S.user) { e.preventDefault(); openPalette(); } });
$('#cmdBtn').onclick = openPalette;

/* ---------- shell controls ---------- */
const navOpen = o => { $('#side').classList.toggle('open', o); $('#scrim').classList.toggle('on', o); document.body.classList.toggle('nav-open', o); };
$('#burger').onclick = () => navOpen(true);
$('#scrim').onclick = () => navOpen(false);
$('#logoutBtn').onclick = () => auth.signOut();
$('#deniedOut').onclick = () => auth.signOut();
const themeIcon = () => { $('#themeBtn').innerHTML = ico(document.documentElement.getAttribute('data-theme') === 'light' ? 'sun' : 'moon'); }; window.__zaIcon = themeIcon; themeIcon();
$('#themeBtn').onclick = () => { const l = document.documentElement.getAttribute('data-theme') === 'light'; try { localStorage.setItem('za_theme', l ? 'dark' : 'light'); } catch (e) { } if (window.__zaApply) window.__zaApply(); else document.documentElement.setAttribute('data-theme', l ? 'dark' : 'light'); themeIcon(); };
$('#refreshBtn').onclick = async () => { const b = $('#refreshBtn'); b.style.opacity = .5; await loadAll(); b.style.opacity = 1; rerender(); toast('Data refreshed'); };

/* ---------- auth ---------- */
const AUTHERR = { 'auth/invalid-credential': 'Wrong email or password.', 'auth/wrong-password': 'Wrong email or password.', 'auth/user-not-found': 'No account with this email.', 'auth/too-many-requests': 'Too many attempts. Try again later.', 'auth/popup-closed-by-user': '', 'auth/network-request-failed': 'No internet connection.' };
const setErr = m => { $('#authErr').textContent = m || ''; };
$('#loginForm').onsubmit = e => { e.preventDefault(); setErr(''); const b = $('#loginBtn'); b.disabled = true; b.textContent = 'Signing in…'; auth.signInWithEmailAndPassword($('#fEmail').value.trim(), $('#fPass').value).catch(x => setErr(AUTHERR[x.code] != null ? AUTHERR[x.code] : 'Could not sign in.')).then(() => { b.disabled = false; b.textContent = 'Sign in'; }); };
$('#googleBtn').onclick = () => { setErr(''); auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(x => setErr(AUTHERR[x.code] != null ? AUTHERR[x.code] : 'Google sign-in failed. Is this domain added in Firebase Authentication → Authorized domains?')); };
function show(v) { $('#authView').hidden = v !== 'auth'; $('#appView').hidden = v !== 'app'; $('#splash').classList.add('off'); }
auth.onAuthStateChanged(async user => {
  if (!user) { S.user = null; show('auth'); $('#loginForm').hidden = false; $('#denied').hidden = true; return; }
  let ok = false;
  try { ok = (await db.ref('admins/' + user.uid).once('value')).val() === true; } catch (e) { ok = false; }
  if (!ok) { S.user = null; show('auth'); $('#loginForm').hidden = true; $('#denied').hidden = false; $('#deniedUid').textContent = user.uid; return; }
  S.user = user; show('app');
  $('#meName').textContent = user.displayName || 'Admin'; $('#meMail').textContent = user.email || ''; $('#meAv').textContent = ((user.displayName || user.email || 'A')[0] || 'A').toUpperCase(); $('#meAv').className = 'avatar ' + avc(user.displayName || user.email);
  $('#view').innerHTML = '<div class="grid g-kpi"><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>';
  await loadAll(); rerender();
  db.ref('claims').on('value', s => { S.claims = s.val() || {}; if (S.loaded) { buildNav(); if (['claims', ''].includes(route()) && !document.activeElement.matches('input,textarea,select')) rerender(); } }, () => { });
});
})();
