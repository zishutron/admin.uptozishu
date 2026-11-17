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
  moon: '<path d="M21 12.800A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800Z"/>', send: '<path d="m22 2-11 11M22 2l-7 20-4-9-9-4Z"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', eyeoff: '<path d="M3 3l18 18M10.600 6.100A10 10 0 0 1 12 5c6.400 0 10 7 10 7a17 17 0 0 1-3.200 4M6.600 6.600A17 17 0 0 0 2 12s3.600 7 10 7c1.600 0 3-.4 4.300-1M9.900 9.900a3 3 0 0 0 4.200 4.200"/>'
};
const avc = s => { let h = 0; s = String(s || 'G').toLowerCase(); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997; return 'c' + (h % 8); };
const ico = n => '<svg viewBox="0 0 24 24">' + (I[n] || '') + '</svg>';
const NAV = [
  ['', 'Overview', 'home'], ['apps', 'Apps', 'apps'], ['reviews', 'Reviews', 'star'], ['h', 'Store'], ['storefront', 'Storefront', 'star'], ['h', 'Moderation'], ['approvals', 'Approvals', 'check'], ['feedback', 'Feedback', 'inbox'], ['ads', 'Advertisements', 'mega'], ['reports', 'Reports', 'flag'], ['claims', 'Claims', 'shield'], ['tickets', 'Support tickets', 'chat'],
  ['h', 'People'], ['users', 'Users & developers', 'users'], ['broadcast', 'Broadcast', 'mega'],
  ['h', 'You'], ['history', 'History', 'clock']
];
const TITLES = { '': 'Overview', apps: 'Apps', reviews: 'Reviews', approvals: 'Approvals', reports: 'Reports', claims: 'Claim requests', tickets: 'Support tickets', users: 'Users & developers', broadcast: 'Broadcast', history: 'History', storefront: 'Storefront', feedback: 'App feedback', ads: 'Advertisements' };
const S = { user: null, apps: {}, users: {}, devs: {}, profiles: {}, reports: {}, claims: {}, tickets: {}, pend: {}, upd: {}, logs: {}, susp: {}, sf: {}, ads: {}, fb: {}, fbc: {}, fbn: {}, reviews: {}, stats: {}, failed: [], loaded: false };
const UI = { tkTab: 'wait', reply: {}, appQ: '', appF: 'all', appSort: 'new', revQ: '', revF: 'all', claimTab: 'pending', userQ: '', userF: 'all', range: 14, appLimit: 40, revLimit: 30 };

/* ---------- helpers ---------- */
const nf = n => { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K' : n.toLocaleString('en-US'); };
const PUSH = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
function pushTime(id) { if (!id || id.length < 8) return 0; let t = 0; for (let i = 0; i < 8; i++) { const k = PUSH.indexOf(id[i]); if (k < 0) return 0; t = t * 64 + k; } return t > 1.2e12 && t < 4e12 ? t : 0; }
function appCreated(a) { const v = a.timestamp || a.createdAt || a.uploadDate; if (typeof v === 'number') return v < 1e11 ? v * 1000 : v; if (typeof v === 'string' && !isNaN(Date.parse(v))) return Date.parse(v); return pushTime(a.id) || 0; }
const dstr = t => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
function ago(t) { if (!t) return ''; const s = Math.max(1, (Date.now() - t) / 1000); if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; if (s < 2592000) return Math.floor(s / 86400) + 'd ago'; return dstr(t); }
const ICON = 'https://img.icons8.com/color/144/android-os.png';
const stat = a => ['suspended', 'draft', 'pending', 'rejected'].includes(a.status) ? a.status : 'live';
const pill = (k, t) => `<span class="pill ${k}">${esc(t)}</span>`;
const statPill = a => { const s = stat(a); return pill(s === 'live' ? 'ok' : s === 'draft' ? '' : s === 'pending' ? 'warn' : 'bad', { live: 'Live', draft: 'Draft', pending: 'In review', rejected: 'Rejected', suspended: 'Suspended' }[s]); };
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
  await Promise.all([get('apps', 'apps'), get('users', 'users'), get('developers', 'devs'), get('reports', 'reports'), get('claims', 'claims'), get('tickets', 'tickets'), get('devprofilePending', 'pend'), get('appUpdates', 'upd'), get('suspendedUsers', 'susp'), get('storefront', 'sf'), get('adCampaigns', 'ads'), get('feedback', 'fb'), get('feedbackContact', 'fbc'), get('feedbackNotes', 'fbn'), get('adminLogs/' + S.user.uid, 'logs'), get('reviews', 'reviews'), get('stats', 'stats'), get('devprofiles', 'profiles')]);
  S.loaded = true;
}
async function recount(appId) {
  const rs = Object.values(S.reviews[appId] || {}).filter(r => r && r.text && !r.hidden);
  const avg = rs.length ? Math.round(rs.reduce((s, r) => s + Math.min(5, Math.max(1, +r.rating || 5)), 0) / rs.length * 10) / 10 : 0;
  await db.ref('apps/' + appId).update({ rating: avg, reviewCount: rs.length });
  if (S.apps[appId]) { S.apps[appId].rating = avg; S.apps[appId].reviewCount = rs.length; }
}
function note(uid, key, text, appId) { return uid ? { path: `notifications/${uid}/${key}`, value: { type: 'admin', appId: appId || '', text: String(text).slice(0, 2000), timestamp: Date.now(), read: false } } : null; }
function logAct(kind, text, x) {
  try {
    const ref = db.ref('adminLogs/' + S.user.uid).push(), e = Object.assign({ kind, text: String(text).slice(0, 200), ts: Date.now() }, x || {});
    Object.keys(e).forEach(k => { if (e[k] == null || e[k] === '') delete e[k]; if (typeof e[k] === 'string') e[k] = e[k].slice(0, 300); });
    S.logs[ref.key] = e; ref.set(e).catch(() => { });
  } catch (err) { }
}
const fail = e => toast('Failed: ' + ((e && e.message) || 'error') + ' — check the Firebase rules', 'bad');

/* ---------- actions ---------- */
const ACT = {
  async suspend(d) {
    const a = S.apps[d.id]; if (!a) return;
    const why = await ask({ title: 'Suspend "' + a.name + '"?', text: 'It will disappear from the store after the next store rebuild. The developer gets a notification.', input: 'Reason (shown to developer)', value: 'Reported for breaking the store rules.', ok: 'Suspend', danger: true, required: true }); if (why === null) return;
    const up = {}; up[`apps/${d.id}/status`] = 'suspended'; up[`apps/${d.id}/suspendedReason`] = why.slice(0, 200); up[`apps/${d.id}/prevStatus`] = a.status === 'suspended' ? (a.prevStatus || 'live') : (a.status || 'live');
    const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was suspended. Reason: ${why}`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); a.prevStatus = up[`apps/${d.id}/prevStatus`]; a.status = 'suspended'; a.suspendedReason = why; logAct('suspend', 'Suspended "' + a.name + '"', { appId: d.id, appName: a.name, icon: a.icon, note: why }); toast('App suspended'); rerender(); } catch (e) { fail(e); }
  },
  async restore(d) {
    const a = S.apps[d.id]; if (!a) return;
    if (!(await ask({ title: 'Restore "' + a.name + '"?', text: 'It will be listed again after the next store rebuild.', ok: 'Restore' }))) return;
    const st = a.prevStatus && a.prevStatus !== 'suspended' ? a.prevStatus : 'live', up = {}; up[`apps/${d.id}/status`] = st; up[`apps/${d.id}/suspendedReason`] = null;
    const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was restored.`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); a.status = st; a.suspendedReason = null; logAct('restore', 'Restored "' + a.name + '"', { appId: d.id, appName: a.name, icon: a.icon }); toast('App restored'); rerender(); } catch (e) { fail(e); }
  },
  async del(d) {
    const a = S.apps[d.id]; if (!a) return;
    if ((await ask({ title: 'Delete "' + a.name + '" forever?', text: 'This removes the app from the database. It cannot be undone.', input: 'Type DELETE to confirm', must: 'DELETE', ok: 'Delete app', danger: true })) === null) return;
    const up = {}; up[`apps/${d.id}`] = null; const n = note(a.developerUid, 'adm_' + ckey(d.id) + '_' + Date.now(), `Your app "${a.name}" was removed from the store by the admin.`, d.id); if (n) up[n.path] = n.value;
    try { await db.ref().update(up); logAct('delete', 'Deleted app "' + a.name + '"', { appName: a.name, icon: a.icon }); delete S.apps[d.id]; closeOv(); toast('App deleted'); rerender(); } catch (e) { fail(e); }
  },
  async transfer(d) {
    const a = S.apps[d.id]; if (!a) return;
    const uid = await ask({ title: 'Transfer ownership', text: 'Paste the uid of the new owner. The app moves to their My Apps.', input: 'New owner uid', required: true, ok: 'Continue' }); if (!uid) return;
    const nm = userName(uid) || 'Developer';
    if (!userName(uid) && !(await ask({ title: 'Unknown uid', text: 'No user with this uid was found in the data. Transfer anyway?', ok: 'Transfer', danger: true }))) return;
    const up = {}; up[`apps/${d.id}/developerUid`] = uid; up[`apps/${d.id}/developerName`] = nm;
    const n1 = note(uid, 'adm_' + ckey(d.id) + '_' + Date.now(), `The app "${a.name}" was transferred to you.`, d.id), n2 = a.developerUid !== uid && note(a.developerUid, 'adm_' + ckey(d.id) + '_o' + Date.now(), `The app "${a.name}" was transferred to another developer.`, d.id);
    if (n1) up[n1.path] = n1.value; if (n2) up[n2.path] = n2.value;
    try { await db.ref().update(up); a.developerUid = uid; a.developerName = nm; logAct('transfer', 'Transferred "' + a.name + '" to ' + nm, { appId: d.id, appName: a.name, icon: a.icon }); toast('Ownership transferred'); rerender(); } catch (e) { fail(e); }
  },
  async hideRev(d) {
    const r = (S.reviews[d.a] || {})[d.r]; if (!r) return; const hide = !r.hidden;
    try { await db.ref(`reviews/${d.a}/${d.r}/hidden`).set(hide ? true : null); if (hide) r.hidden = true; else delete r.hidden; await recount(d.a); logAct('review', (hide ? 'Hid' : 'Unhid') + ' a review on "' + ((S.apps[d.a] || {}).name || 'app') + '"', { appId: d.a, appName: (S.apps[d.a] || {}).name, icon: (S.apps[d.a] || {}).icon }); toast(hide ? 'Review hidden' : 'Review visible again'); rerender(); } catch (e) { fail(e); }
  },
  async delRev(d) {
    const r = (S.reviews[d.a] || {})[d.r]; if (!r) return;
    if (!(await ask({ title: 'Delete this review?', text: '"' + String(r.text || '').slice(0, 120) + '"\n\nThis cannot be undone.', ok: 'Delete', danger: true }))) return;
    try { await db.ref(`reviews/${d.a}/${d.r}`).remove(); delete S.reviews[d.a][d.r]; await recount(d.a); logAct('delete', 'Deleted a review on "' + ((S.apps[d.a] || {}).name || 'app') + '"', { appId: d.a, appName: (S.apps[d.a] || {}).name, icon: (S.apps[d.a] || {}).icon }); toast('Review deleted'); rerender(); } catch (e) { fail(e); }
  },
  async verifyDev(d) {
    const p = S.profiles[d.u]; if (!p || !p.name) { toast('This developer has not finished their profile yet', 'bad'); return; } const on = p.verified !== true;
    if (!(await ask({ title: (on ? 'Verify ' : 'Remove verified badge from ') + (p.name || 'this developer') + '?', text: on ? 'A Verified badge shows on their store developer page and on all their apps.' : 'Their developer page and apps will show Unverified.', ok: on ? 'Verify' : 'Remove', danger: !on }))) return;
    try { const vn = note(d.u, 'vf_' + Date.now(), on ? 'Your developer profile is now verified. The Verified badge shows on your store page and apps.' : 'The Verified badge was removed from your developer profile.'); const vu = {}; vu[`devprofiles/${d.u}/verified`] = on ? true : null; if (vn) vu[vn.path] = vn.value; await db.ref().update(vu); if (on) p.verified = true; else delete p.verified; logAct('profile', (on ? 'Verified ' : 'Removed verified badge from ') + (p.name || 'a developer')); toast(on ? 'Developer verified' : 'Badge removed'); rerender(); } catch (e) { fail(e); }
  },
  async resolve(d) { try { const rp = S.reports[d.id] || {}; await db.ref('reports/' + d.id).remove(); delete S.reports[d.id]; logAct('report', 'Resolved a report on "' + (rp.appName || 'app') + '"' + (rp.reason ? ' (' + rp.reason + ')' : ''), { appId: rp.appId, appName: rp.appName }); toast('Report resolved'); rerender(); } catch (e) { fail(e); } },
  async approve(d) {
    const c = ((S.claims[d.u] || {})[d.a]); if (!c) return;
    if (!(await ask({ title: 'Approve this claim?', text: `"${c.appName}" moves to ${c.claimantName}. The previous owner loses access.`, ok: 'Approve' }))) return;
    const now = Date.now(), up = {}; up[`apps/${d.a}/developerUid`] = d.u; up[`apps/${d.a}/developerName`] = c.claimantName || 'Developer'; up[`apps/${d.a}/claimedAt`] = now;
    up[`claims/${d.u}/${d.a}/status`] = 'approved'; up[`claims/${d.u}/${d.a}/decidedAt`] = now;
    const n1 = { path: `notifications/${d.u}/claim_${ckey(d.a)}`, value: { type: 'claim', appId: d.a, text: `Your claim for "${c.appName}" was approved. It is now in your My Apps.`, timestamp: now, read: false } }; up[n1.path] = n1.value;
    if (c.currentOwner && c.currentOwner !== d.u) { up[`notifications/${c.currentOwner}/claimout_${ckey(d.a)}`] = { type: 'claim', appId: d.a, text: `"${c.appName}" was moved to its original developer after a claim.`, timestamp: now, read: false }; }
    try { await db.ref().update(up); Object.assign(c, { status: 'approved', decidedAt: now }); if (S.apps[d.a]) { S.apps[d.a].developerUid = d.u; S.apps[d.a].developerName = c.claimantName; } logAct('approve', 'Approved claim for "' + c.appName + '"', { appId: d.a, appName: c.appName }); toast('Claim approved'); rerender(); } catch (e) { fail(e); }
  },
  async reject(d) {
    const c = ((S.claims[d.u] || {})[d.a]); if (!c) return;
    const why = await ask({ title: 'Reject this claim?', text: 'Say why. The developer will see it.', input: 'Reason', value: 'We could not confirm that you own this app.', ok: 'Reject', danger: true, required: true }); if (why === null) return;
    const now = Date.now(), up = {}; up[`claims/${d.u}/${d.a}/status`] = 'rejected'; up[`claims/${d.u}/${d.a}/reason`] = why.slice(0, 200); up[`claims/${d.u}/${d.a}/decidedAt`] = now;
    up[`notifications/${d.u}/claim_${ckey(d.a)}`] = { type: 'claim', appId: d.a, text: `Your claim for "${c.appName}" was rejected. Reason: ${why.slice(0, 150)}`, timestamp: now, read: false };
    try { await db.ref().update(up); Object.assign(c, { status: 'rejected', reason: why, decidedAt: now }); logAct('reject', 'Rejected claim for "' + c.appName + '"', { appId: d.a, appName: c.appName, note: why }); toast('Claim rejected'); rerender(); } catch (e) { fail(e); }
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
  const pc = pendingClaims().length, rp = reportList().length, ap = pendingApps().length + pendingProfiles().length + pendingUpdates().length;
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
  <div class="grid g-kpi">${kpi('apps', '', nf(apps.length), 'Total apps', `${live} live · ${drafts} draft`, '#/apps')}${kpi('dl', 'ok', nf(dl), 'Downloads', 'all time')}${kpi('check', ap ? 'warn' : 'ok', nf(ap), 'Approvals', ap ? 'waiting for review' : 'all clear', '#/approvals')}${kpi('flag', rp ? 'bad' : 'ok', nf(rp), 'Reports', rp ? 'open reports' : 'all clear', '#/reports')}${kpi('users', 'vio', nf(Object.keys(S.users).length), 'Store users', nf(devIds.size) + ' developers', '#/users')}${kpi('pause', susp ? 'bad' : '', nf(susp), 'Suspended apps', '', '#/apps')}</div>
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
  <div class="chips" style="margin-bottom:16px">${[['all', 'All'], ['live', 'Live'], ['pending', 'In review'], ['rejected', 'Rejected'], ['draft', 'Draft'], ['suspended', 'Suspended']].map(([k, t]) => `<button class="chip ${UI.appF === k ? 'on' : ''}" data-act="appF" data-k="${k}">${t} · ${cnt(k)}</button>`).join('')}</div>
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
  <div class="dr-f">${stat(a) === 'pending' ? `<button class="btn good" data-act="apApprove" data-id="${esc(id)}">${ico('check')}Approve</button><button class="btn danger" data-act="apReject" data-id="${esc(id)}">${ico('x')}Reject</button>` : ''}${stat(a) === 'suspended' ? `<button class="btn good" data-act="restore" data-id="${esc(id)}">${ico('play')}Restore</button>` : `<button class="btn danger" data-act="suspend" data-id="${esc(id)}">${ico('pause')}Suspend</button>`}<button class="btn" data-act="transfer" data-id="${esc(id)}">${ico('swap')}Transfer</button><button class="btn danger" data-act="del" data-id="${esc(id)}" style="margin-left:auto">${ico('trash')}Delete</button></div></aside>`;
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

const reportImgs = r => { const l = (Array.isArray(r.images) ? r.images : (r.evidence ? [r.evidence] : [])).filter(isImg); return l.length ? `<div class="meta">Screenshots (${l.length})</div><div class="shots">${l.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"><span>${i + 1}</span><img src="${esc(u)}" alt=""></a>`).join('')}</div>` : (r.evidence ? `<p class="body"><a href="${esc(r.evidence)}" target="_blank" rel="noopener">${esc(r.evidence)}</a></p>` : ''); };
function vReports() {
  const list = reportList().sort((a, b) => (+b.ts || 0) - (+a.ts || 0));
  if (!list.length) return `<div class="empty card">${ico('flag')}<b>No open reports</b>Reports from store users show up here.</div>`;
  return '<div class="stack">' + list.map(r => { const ap = S.apps[r.appId]; return `<div class="item"><div class="item-h"><img class="ico" src="${esc((ap && ap.icon) || ICON)}" alt=""><div class="grow"><b>${esc(r.appName || r.appId)}</b><div class="meta">${ago(+r.ts)}${r.username ? ' · reported by @' + esc(r.username) : ''}</div></div>${pill('bad', r.reason || 'Report')}${ap && stat(ap) === 'suspended' ? pill('', 'Already suspended') : ''}</div>${r.details ? `<p class="body">${esc(r.details)}</p>` : ''}${reportImgs(r)}<div class="actions">${ap ? `<button class="btn sm" data-act="openApp" data-id="${esc(r.appId)}">Open app</button>${stat(ap) !== 'suspended' ? `<button class="btn sm danger" data-act="suspend" data-id="${esc(r.appId)}">${ico('pause')}Suspend app</button>` : ''}` : '<span class="muted">App no longer exists</span>'}<button class="btn sm good" data-act="resolve" data-id="${esc(r.id)}" style="margin-left:auto">${ico('check')}Resolve</button></div></div>`; }).join('') + '</div>';
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
  Object.keys(S.users).forEach(u => Object.assign(ensure(u), S.users[u])); Object.keys(S.susp || {}).forEach(u => ensure(u));
  Object.keys(S.devs).forEach(u => { const d = ensure(u); d.isDev = true; d.email = S.devs[u].email; d.name = d.name || S.devs[u].displayName; d.username = d.username || S.devs[u].username; });
  appList().forEach(a => { if (a.developerUid) { const d = ensure(a.developerUid); d.isDev = true; d.apps++; if (!d.name) d.name = a.developerName; } });
  allReviews().forEach(r => { ensure(r.revId).reviews++; });
  let list = Object.values(m); const q = UI.userQ.trim().toLowerCase();
  if (q) list = list.filter(u => [u.name, u.username, u.email, u.uid].join(' ').toLowerCase().includes(q));
  const cnt = f => Object.values(m).filter(u => f === 'all' || (f === 'dev' ? u.isDev : f === 'usr' ? !u.isDev : f === 'sus' ? S.susp[u.uid] : u.reviews)).length;
  if (UI.userF === 'dev') list = list.filter(u => u.isDev); else if (UI.userF === 'usr') list = list.filter(u => !u.isDev); else if (UI.userF === 'rev') list = list.filter(u => u.reviews); else if (UI.userF === 'sus') list = list.filter(u => S.susp[u.uid]);
  list.sort((a, b) => (b.apps - a.apps) || (b.reviews - a.reviews) || (+b.createdAt || 0) - (+a.createdAt || 0));
  const shown = list.slice(0, 80);
  return `<div class="toolbar"><div class="grow">${ico('search')}<input id="userQ" type="search" placeholder="Search name, username, email, uid…" value="${esc(UI.userQ)}"></div></div>
  <div class="chips" style="margin-bottom:16px">${[['all', 'Everyone'], ['dev', 'Developers'], ['usr', 'Users'], ['rev', 'Reviewers'], ['sus', 'Suspended']].map(([k, t]) => `<button class="chip ${UI.userF === k ? 'on' : ''}" data-act="userF" data-k="${k}">${t} · ${cnt(k)}</button>`).join('')}</div>
  <div class="table" style="--cols:minmax(0,2fr) minmax(0,1.4fr) 100px 90px 110px"><div class="tr-h"><div>Person</div><div>Email</div><div>Role</div><div>Reviews</div><div>Joined · Verify</div></div>
  ${shown.length ? shown.map(u => `<div class="tr-r" data-act="openUser" data-u="${esc(u.uid)}"><div class="cell who"><div class="avatar ${avc(u.username || u.name)}" style="width:36px;height:36px;border-radius:50%">${esc((u.name || '?')[0].toUpperCase())}</div><div><b>${esc(u.name || 'Unnamed')}</b><small>${u.username ? '@' + esc(u.username) : esc(u.uid)}</small></div></div><div class="cell hide-m"><span>${esc(u.email || '—')}</span></div><div class="cell">${u.isDev ? pill('vio', u.apps + (u.apps === 1 ? ' app' : ' apps')) + ((S.profiles[u.uid] || {}).verified ? ' ' + pill('ok', 'Verified') : ' ' + pill('warn', 'Unverified')) : pill('', 'User')}${S.susp[u.uid] ? ' ' + pill('bad', 'Suspended') : ''}</div><div class="cell hide-m">${u.reviews}</div><div class="cell hide-m">${u.isDev && S.profiles[u.uid] ? `<button class="btn sm ${S.profiles[u.uid].verified ? '' : 'good'}" data-act="verifyDev" data-u="${esc(u.uid)}">${S.profiles[u.uid].verified ? 'Unverify' : 'Verify'}</button>` : dstr(+u.createdAt)}</div></div>`).join('') : `<div class="empty">${ico('users')}<b>No people found</b></div>`}</div>
  <div class="card" style="margin-top:16px"><h3>Add another admin</h3><div class="sub">Open Firebase → Realtime Database → add <code>admins</code> → <code>&lt;uid&gt;</code> = <code>true</code>. Removing it removes admin access immediately.</div></div>`;
}
ACT.userF = d => { UI.userF = d.k; rerender(); };

function vBroadcast() {
  const targets = new Set([...Object.keys(S.devs), ...appList().map(a => a.developerUid).filter(Boolean)]);
  return `<div class="compose"><div class="card"><h3>Message all developers</h3><div class="sub">Appears in the Notifications screen of every developer's console. Reaches ${targets.size} developer${targets.size === 1 ? '' : 's'}.</div>
  <label class="field"><span>Message</span><textarea id="bcText" maxlength="2000" placeholder="e.g. We updated the store rules. Please review your app descriptions."></textarea></label>
  <div class="actions"><button class="btn primary" data-act="sendBc">${ico('send')}Send to ${targets.size}</button><span class="muted" id="bcLen" style="align-self:center">0 / 2000</span></div></div>
  <div class="phone"><div class="muted" style="margin-bottom:10px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Preview</div><div class="nt"><b>UptoZishu Admin</b><div id="bcPrev" class="muted">Your message appears here…</div></div></div></div>`;
}
ACT.sendBc = async () => {
  const el = $('#bcText'), text = el.value.trim(); if (text.length < 3) { el.style.borderColor = 'var(--bad)'; return; }
  const targets = [...new Set([...Object.keys(S.devs), ...appList().map(a => a.developerUid).filter(Boolean)])];
  if (!(await ask({ title: 'Send to ' + targets.length + ' developers?', text: '"' + text + '"', ok: 'Send' }))) return;
  const up = {}, now = Date.now(); targets.forEach(u => { up[`notifications/${u}/bc_${now}`] = { type: 'admin', appId: '', text: text.slice(0, 2000), timestamp: now, read: false }; });
  try { await db.ref().update(up); el.value = ''; toast('Sent to ' + targets.length + ' developers'); $('#bcPrev').textContent = 'Your message appears here…'; $('#bcLen').textContent = '0 / 2000'; } catch (e) { fail(e); }
};


/* ---------- support tickets ---------- */
// Paste your Google Apps Script web-app URL here to email developers when you reply (see mail-script/README.txt)
const MAIL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxnsa5QzCWtto5671_JcJlefPOV9YcGlZUHMW9CrH1VuG0Qa8cNe94RLYpkFMC7G6Ga4g/exec';
async function tkMail(type, ticketId) { return mailCall(type, ticketId); }
async function mailCall(type, ticketId) {
  if (!MAIL_ENDPOINT) return false;
  try {
    const token = await auth.currentUser.getIdToken();
    await Promise.race([fetch(MAIL_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ type, ticketId, appId: ticketId, token }) }), new Promise(r => setTimeout(r, 6000))]);
    return true;
  } catch (e) { return false; }
}
function sentAnim(msg, sub) {
  const o = document.createElement('div'); o.className = 'sent-anim';
  const dots = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, d = 70 + (i % 3) * 18; return `<i style="--x:${Math.round(Math.cos(a) * d)}px;--y:${Math.round(Math.sin(a) * d)}px;--c:${['#7c8cff', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][i % 5]};animation-delay:${.55 + (i % 4) * .04}s"></i>`; }).join('');
  o.innerHTML = `<div class="sa-card"><div class="sa-stage"><svg class="sa-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg><svg class="sa-check" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-17"/></svg>${dots}</div><b>${esc(msg)}</b><small>${esc(sub)}</small></div>`;
  document.body.appendChild(o);
  setTimeout(() => o.classList.add('out'), 1700); setTimeout(() => o.remove(), 2100);
}
const TKC = { account: 'Account and login', app: 'App upload or listing', review: 'Reviews and ratings', claim: 'Claim request', bug: 'Bug or technical problem', other: 'Something else' };
const tkList = () => Object.keys(S.tickets || {}).map(id => ({ id, ...S.tickets[id] })).filter(t => t && typeof t === 'object' && t.subject);
const tkMsgs = t => Object.keys(t.messages || {}).map(k => ({ id: k, ...t.messages[k] })).sort((a, b) => (a.at || 0) - (b.at || 0));
const tkStat = t => t.status === 'closed' ? pill('', 'Closed') : t.lastBy === 'admin' ? pill('ok', 'Answered') : pill('warn', 'Awaiting reply');
const tkPrio = t => t.priority === 'high' ? pill('bad', 'High') : t.priority === 'low' ? pill('nd', 'Low') : '';
const CANNED = ['Thanks for reporting this. We are looking into it and will update you here.', 'Could you share more details (app name, steps and any error message)?', 'This is fixed now. Please check again and let us know if it still happens.'];
function vTickets() {
  const id = routeId(); if (id) return vTicketOne(id);
  const all = tkList(), tabs = [['wait', 'Awaiting reply', t => t.status !== 'closed' && t.lastBy !== 'admin'], ['done', 'Answered', t => t.status !== 'closed' && t.lastBy === 'admin'], ['closed', 'Closed', t => t.status === 'closed'], ['all', 'All', () => true]];
  const cur = tabs.find(t => t[0] === UI.tkTab) || tabs[0];
  const list = all.filter(cur[2]).sort((a, b) => (+b.updatedAt || 0) - (+a.updatedAt || 0));
  const head = `<div class="toolbar"><div class="chips grow" style="flex:1">${tabs.map(t => `<button class="chip ${UI.tkTab === t[0] ? 'on' : ''}" data-act="tkTab" data-t="${t[0]}">${t[1]} · ${all.filter(t[2]).length}</button>`).join('')}</div><button class="btn sm" data-act="tkRefresh">${ico('swap')}Refresh</button></div>`;
  if (!list.length) return head + `<div class="empty card">${ico('chat')}<b>No tickets here</b>${S.failed.includes('tickets') ? '<p>Tickets could not be loaded. Publish the latest Firebase rules.</p>' : ''}</div>`;
  return head + '<div class="stack">' + list.map(t => `<a class="item tk-row" href="#/tickets/${esc(t.id)}"><div class="item-h" style="margin:0"><div class="avatar ${avc(t.devName)}" style="width:40px;height:40px;border-radius:50%">${esc((t.devName || '?')[0].toUpperCase())}</div><div class="grow"><b>${esc(t.subject)}</b><div class="meta">${esc(t.devName || 'Developer')} · ${esc(TKC[t.category] || 'General')}${t.appName ? ' · ' + esc(t.appName) : ''} · ${ago(t.updatedAt)}</div></div>${tkPrio(t)}${tkStat(t)}</div></a>`).join('') + '</div>';
}
function vTicketOne(id) {
  const t = S.tickets[id]; const back = `<a class="btn sm ghost" href="#/tickets" style="margin-bottom:14px">${ico('x')}Back to tickets</a>`;
  if (!t) return back + `<div class="empty card">${ico('chat')}<b>Ticket not found</b></div>`;
  const closed = t.status === 'closed';
  const msgs = tkMsgs(t).map(m => m.by === 'admin'
    ? `<div class="tkm adm"><div class="tkw">You (support) · ${ago(m.at)}</div><div class="tkb">${esc(m.text)}</div></div>`
    : `<div class="tkm dv"><div class="tkw">${esc(m.name || t.devName || 'Developer')} · ${ago(m.at)}</div><div class="tkb">${esc(m.text)}</div></div>`).join('');
  return back + `<div class="card"><div class="card-h"><div><h3 style="font-size:18px">${esc(t.subject)}</h3><div class="sub">#${esc(id.slice(-6).toUpperCase())} · opened ${dstr(t.createdAt)}</div></div><div style="display:flex;gap:8px;flex-wrap:wrap">${tkPrio(t)}${tkStat(t)}</div></div>
  <dl class="kv"><div><dt>Developer</dt><dd>${esc(t.devName || '—')}${S.users[t.uid] && S.users[t.uid].username ? ' (@' + esc(S.users[t.uid].username) + ')' : ''}</dd></div><div><dt>Email</dt><dd>${esc(t.email || '—')}</dd></div><div><dt>Topic</dt><dd>${esc(TKC[t.category] || 'General')}</dd></div><div><dt>Related app</dt><dd>${esc(t.appName || '—')}</dd></div></dl>
  <div class="tkt">${msgs}</div>
  ${closed ? `<div class="hint warn">${ico('flag')}This ticket is closed.</div><div class="actions"><button class="btn" data-act="tkReopen" data-id="${esc(id)}">${ico('play')}Reopen ticket</button></div>` : `
  <label class="field" style="margin-top:14px"><span>Your reply (the developer gets a notification)</span><textarea id="tkText" maxlength="2000" placeholder="Write your reply…">${esc(UI.reply[id] || '')}</textarea></label>
  <div class="chips" style="margin-bottom:12px">${CANNED.map((c, i) => `<button class="chip" data-act="tkCanned" data-i="${i}">${esc(c.slice(0, 34))}…</button>`).join('')}</div>
  <div class="actions"><button class="btn primary" data-act="tkSend" data-id="${esc(id)}">${ico('send')}Send reply</button><button class="btn danger" data-act="tkClose" data-id="${esc(id)}">${ico('check')}Close ticket</button></div>`}</div>`;
}
ACT.tkTab = d => { UI.tkTab = d.t; rerender(); };
ACT.tkCanned = d => { const el = $('#tkText'); if (el) { el.value = CANNED[+d.i]; UI.reply[routeId()] = el.value; el.focus(); } };
ACT.tkRefresh = async () => { try { S.tickets = (await db.ref('tickets').once('value')).val() || {}; toast('Tickets refreshed'); rerender(); } catch (e) { fail(e); } };
async function tkWrite(id, status, extra, text, note) {
  const t = S.tickets[id], now = Date.now(), up = {};
  up[`tickets/${id}/status`] = status; up[`tickets/${id}/updatedAt`] = now; up[`userTickets/${t.uid}/${id}/status`] = status; up[`userTickets/${t.uid}/${id}/updatedAt`] = now;
  if (extra) { up[`tickets/${id}/lastBy`] = 'admin'; up[`userTickets/${t.uid}/${id}/lastBy`] = 'admin'; up[`userTickets/${t.uid}/${id}/unread`] = true; }
  let mid = null;
  if (text) { mid = 'm' + now.toString(36) + Math.random().toString(36).slice(2, 6); up[`tickets/${id}/messages/${mid}`] = { by: 'admin', name: 'UptoZishu Support', text, at: now }; }
  if (note) up[`notifications/${t.uid}/tk_${id.slice(-8)}_${now}`] = { type: 'ticket', ticketId: id, text: note.slice(0, 280), snippet: (text || '').slice(0, 190), timestamp: now, read: false };
  await db.ref().update(up);
  t.status = status; t.updatedAt = now; if (extra) t.lastBy = 'admin';
  if (mid) { t.messages = t.messages || {}; t.messages[mid] = up[`tickets/${id}/messages/${mid}`]; }
}
ACT.tkSend = async d => {
  const el = $('#tkText'), text = el.value.trim(); if (text.length < 2) { el.style.borderColor = 'var(--bad)'; return; }
  const t = S.tickets[d.id];
  try { await tkWrite(d.id, 'answered', true, text, 'Support replied to your ticket: ' + t.subject); logAct('ticket', 'Replied to ticket "' + t.subject + '"'); UI.reply[d.id] = ''; rerender(); const lastB = document.querySelector('.tkt .tkm:last-child'); if (lastB) lastB.classList.add('pop');
    sentAnim('Reply sent', MAIL_ENDPOINT ? 'Developer notified in the console and by email' : 'Developer notified in the console');
    if (MAIL_ENDPOINT) { const mailed = await tkMail('reply', d.id); if (!mailed) toast('Email could not be sent, notification was delivered', 'bad'); } } catch (e) { fail(e); }
};
ACT.tkClose = async d => {
  if (!(await ask({ title: 'Close this ticket?', text: 'The developer is notified. A closed ticket cannot be replied to, they can open a new one.', ok: 'Close ticket' }))) return;
  try { await tkWrite(d.id, 'closed', false, '', 'Your ticket was closed: ' + S.tickets[d.id].subject); logAct('ticket', 'Closed ticket "' + S.tickets[d.id].subject + '"'); toast('Ticket closed'); rerender(); } catch (e) { fail(e); }
};
ACT.tkReopen = async d => { try { await tkWrite(d.id, 'open', false, '', ''); toast('Ticket reopened'); rerender(); } catch (e) { fail(e); } };
setInterval(() => { if (S.user && S.loaded && !document.hidden && route() === 'tickets' && !(document.activeElement && document.activeElement.id === 'tkText')) db.ref('tickets').once('value').then(x => { S.tickets = x.val() || {}; rerender(); }).catch(() => {}); }, 60000);


/* ---------- approvals (apps + profile changes) ---------- */
const pendingApps = () => appList().filter(a => a.status === 'pending').sort((a, b) => (+a.submittedAt || +a.timestamp || 0) - (+b.submittedAt || +b.timestamp || 0));
const pendingProfiles = () => Object.keys(S.pend || {}).map(uid => ({ uid, ...S.pend[uid] })).filter(p => p && typeof p === 'object' && p.status === 'pending').sort((a, b) => (+a.submittedAt || 0) - (+b.submittedAt || 0));
const PF_LABEL = { name: 'Name', tagline: 'Tagline', type: 'Type', about: 'About', location: 'Location', founded: 'Started', email: 'Contact email', website: 'Website', github: 'GitHub', twitter: 'X', instagram: 'Instagram', youtube: 'YouTube', telegram: 'Telegram', linkedin: 'LinkedIn', discord: 'Discord', logo: 'Logo', cover: 'Cover' };
UI.apTab = 'apps';
const pendingUpdates = () => { const o = []; Object.keys(S.upd || {}).forEach(u => Object.keys(S.upd[u] || {}).forEach(a => { const v = S.upd[u][a]; if (v && typeof v === 'object' && v.status === 'pending' && S.apps[a]) o.push({ ...v, uid: u, appId: a }); })); return o.sort((x, y) => (+x.submittedAt || 0) - (+y.submittedAt || 0)); };
const UF_LABEL = { name: 'Name', category: 'Category', package: 'Package', version: 'Version', shortDescription: 'Short description', description: 'Description', downloadUrl: 'Download link', size: 'Size', tags: 'Tags', supportEmail: 'Support email', privacyPolicy: 'Privacy policy', website: 'Website', youtube: 'YouTube', minAndroid: 'Min Android', permissions: 'Permissions', whatsNew: "What's new", icon: 'Icon', banner: 'Featured image', screenshot: 'Screenshots' };
const changedFields = (u, live) => Object.keys(UF_LABEL).filter(k => u[k] !== undefined && String(u[k] || '') !== String(live[k] || ''));
const splitList = v => String(v || '').split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
const isImg = u => /^https?:\/\//i.test(u || '');
function vApprovals() {
  const pa = pendingApps(), pp = pendingProfiles(), pu = pendingUpdates();
  const tabs = `<div class="chips" style="margin-bottom:16px"><button class="chip ${UI.apTab === 'apps' ? 'on' : ''}" data-act="apTab" data-t="apps">Apps · ${pa.length}</button><button class="chip ${UI.apTab === 'updates' ? 'on' : ''}" data-act="apTab" data-t="updates">App updates · ${pu.length}</button><button class="chip ${UI.apTab === 'profiles' ? 'on' : ''}" data-act="apTab" data-t="profiles">Profile changes · ${pp.length}</button></div>`;
  if (UI.apTab === 'apps') {
    if (!pa.length) return tabs + `<div class="empty card">${ico('check')}<b>No apps waiting</b>Apps that developers submit for review show up here.</div>`;
    return tabs + '<div class="stack">' + pa.map(a => {
      const shots = String(a.screenshot || '').split(',').map(x => x.trim()).filter(x => /^https?:\/\//i.test(x)).slice(0, 4);
      return `<div class="item"><div class="item-h"><img class="ico" src="${esc(a.icon || ICON)}" alt=""><div class="grow"><b>${esc(a.name || 'Untitled')} <span class="muted" style="font-weight:500">${esc(a.version || '')}</span></b><div class="meta">${esc(a.developerName || userName(a.developerUid) || 'Developer')} · ${esc(a.category || '')} · submitted ${ago(+a.submittedAt || +a.timestamp)}</div></div>${pill('warn', 'In review')}</div>
      ${a.shortDescription ? `<p class="body">${esc(a.shortDescription)}</p>` : ''}
      <dl class="kv"><div><dt>Package</dt><dd>${esc(a.package || '—')}</dd></div><div><dt>Download link</dt><dd>${a.downloadUrl ? `<a href="${esc(a.downloadUrl)}" target="_blank" rel="noopener">${esc(hostOf(a.downloadUrl) || 'open')}</a>` : '—'}</dd></div><div><dt>Size</dt><dd>${esc(a.size || '—')}</dd></div><div><dt>Permissions</dt><dd>${esc(String(a.permissions || '').split(',').filter(Boolean).length)} declared</dd></div></dl>
      ${shots.length ? `<div class="shots">${shots.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt=""></a>`).join('')}</div>` : ''}
      <div class="actions"><button class="btn sm" data-act="openReview" data-k="${esc(a.id)}">Full details</button><button class="btn sm good" data-act="apApprove" data-id="${esc(a.id)}">${ico('check')}Approve</button><button class="btn sm danger" data-act="apReject" data-id="${esc(a.id)}">${ico('x')}Reject</button></div></div>`;
    }).join('') + '</div>';
  }
  if (UI.apTab === 'updates') {
    if (!pu.length) return tabs + `<div class="empty card">${ico('check')}<b>No app updates waiting</b>When a developer updates a live app, the new version waits here. The old version stays on the store until you approve.</div>`;
    return tabs + '<div class="stack">' + pu.map(u => {
      const live = S.apps[u.appId], ch = changedFields(u, live), key = u.uid + '|' + u.appId;
      return `<div class="item"><div class="item-h"><img class="ico" src="${esc(u.icon || live.icon || ICON)}" alt=""><div class="grow"><b>${esc(u.name || live.name)} <span class="muted" style="font-weight:500">${esc(live.version || '')} → ${esc(u.version || live.version || '')}</span></b><div class="meta">${esc(live.developerName || userName(u.uid) || 'Developer')} · submitted ${ago(+u.submittedAt)}</div></div>${pill('warn', 'Update in review')}</div>
      ${u.whatsNew ? `<p class="body"><b>What's new:</b> ${esc(String(u.whatsNew).slice(0, 300))}</p>` : ''}
      <div class="chips" style="margin:8px 0 12px">${ch.length ? ch.map(k => pill('nd', UF_LABEL[k])).join('') : '<span class="muted">No visible changes</span>'}</div>
      <div class="actions"><button class="btn sm" data-act="openReview" data-k="${esc(key)}" data-u="1">Review changes</button><button class="btn sm good" data-act="upApprove" data-k="${esc(key)}">${ico('check')}Approve</button><button class="btn sm danger" data-act="upReject" data-k="${esc(key)}">${ico('x')}Reject</button></div></div>`;
    }).join('') + '</div>';
  }
  if (!pp.length) return tabs + `<div class="empty card">${ico('check')}<b>No profile changes waiting</b>Edits to developer profiles show up here for approval.</div>`;
  return tabs + '<div class="stack">' + pp.map(p => {
    const cur = S.profiles[p.uid] || {};
    const rows = Object.keys(PF_LABEL).filter(k => String(p[k] || '') !== String(cur[k] || '')).map(k => {
      const img = k === 'logo' || k === 'cover', f = v => v ? (img ? `<a href="${esc(v)}" target="_blank" rel="noopener"><img src="${esc(v)}" alt="" style="max-height:54px;border-radius:8px;vertical-align:middle"></a>` : esc(String(v).slice(0, 220))) : '<span class="muted">empty</span>';
      return `<tr><td class="muted">${PF_LABEL[k]}</td><td>${f(cur[k])}</td><td><b>${f(p[k])}</b></td></tr>`;
    }).join('');
    return `<div class="item"><div class="item-h"><div class="avatar ${avc(p.name)}" style="width:40px;height:40px;border-radius:50%">${esc((p.name || '?')[0].toUpperCase())}</div><div class="grow"><b>${esc(p.name || 'Developer')}</b><div class="meta">@${esc(p.username || '')} · submitted ${ago(+p.submittedAt)}${cur.name ? '' : ' · first public profile'}</div></div>${pill('warn', 'Awaiting approval')}</div>
    <div style="overflow-x:auto"><table class="difft"><thead><tr><th></th><th>Live now</th><th>Requested</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No visible differences</td></tr>'}</tbody></table></div>
    <div class="actions"><button class="btn sm good" data-act="pfApprove" data-id="${esc(p.uid)}">${ico('check')}Approve and publish</button><button class="btn sm danger" data-act="pfReject" data-id="${esc(p.uid)}">${ico('x')}Reject</button></div></div>`;
  }).join('') + '</div>';
}
ACT.apTab = d => { UI.apTab = d.t; rerender(); };
async function decideApp(id, ok) {
  const a = S.apps[id]; if (!a) return;
  let reason = '';
  if (!ok) {
    reason = await ask({ title: 'Reject this app?', text: 'The developer is notified and emailed with your reason, and can fix the app and submit it again.', input: 'Reason shown to the developer', area: true, required: true, ok: 'Reject app' });
    if (!reason) return;
  } else if (!(await ask({ title: 'Approve and publish?', text: `"${a.name}" goes live on the store after the next store update. The developer is notified and emailed.`, ok: 'Approve' }))) return;
  const now = Date.now(), up = {};
  up[`apps/${id}/status`] = ok ? 'live' : 'rejected'; up[`apps/${id}/reviewedAt`] = now; up[`apps/${id}/rejectReason`] = ok ? null : reason.slice(0, 400);
  if (ok) { up[`apps/${id}/approved`] = true; up[`apps/${id}/updatedDate`] = new Date().toISOString().split('T')[0]; }
  if (a.developerUid) up[`notifications/${a.developerUid}/ar_${id.slice(-8)}_${now}`] = { type: 'appreview', appId: id, appName: String(a.name || '').slice(0, 100), text: ok ? `Good news! Your app "${a.name}" was approved and is now live on UptoZishu.` : `Your app "${a.name}" was not approved. Please fix the issue and submit it again.`, ...(ok ? {} : { reason: reason.slice(0, 400) }), timestamp: now, read: false };
  try {
    await db.ref().update(up);
    a.status = ok ? 'live' : 'rejected'; a.reviewedAt = now; a.rejectReason = ok ? null : reason; if (ok) a.approved = true;
    logAct(ok ? 'approve' : 'reject', (ok ? 'Approved app "' : 'Rejected app "') + a.name + '"', { appId: id, appName: a.name, icon: a.icon, note: ok ? '' : reason });
    closeOv(); rerender();
    sentAnim(ok ? 'App approved' : 'App rejected', MAIL_ENDPOINT ? 'Developer notified in the console and by email' : 'Developer notified in the console');
    if (MAIL_ENDPOINT) { const m = await mailCall('appdecision', id); if (!m) toast('Email could not be sent, notification was delivered', 'bad'); }
  } catch (e) { fail(e); }
}
ACT.apApprove = d => decideApp(d.id, true);
ACT.apReject = d => decideApp(d.id, false);
ACT.pfApprove = async d => {
  const uid = d.id, p = S.pend[uid]; if (!p) return;
  if (!(await ask({ title: 'Approve profile changes?', text: 'The new profile goes live on the developer page after the next store update. The developer gets a notification.', ok: 'Approve and publish' }))) return;
  const now = Date.now(), up = {}, nv = v => (v === undefined || v === '' ? null : v);
  Object.keys(PF_LABEL).concat(['username', 'createdAt']).forEach(k => { up[`devprofiles/${uid}/${k}`] = nv(p[k]); });
  up[`devprofiles/${uid}/updatedAt`] = now; up[`devprofilePending/${uid}`] = null;
  up[`developers/${uid}/displayName`] = p.name || null; up[`developers/${uid}/bio`] = p.about || null; up[`developers/${uid}/supportEmail`] = p.email || null; up[`developers/${uid}/website`] = p.website || null; up[`developers/${uid}/github`] = p.github || null; up[`developers/${uid}/country`] = p.location || null;
  if (p.logo) up[`developers/${uid}/photoURL`] = p.logo;
  appList().forEach(a => { if (a.developerUid === uid && p.name && a.developerName !== p.name) up[`apps/${a.id}/developerName`] = p.name; });
  up[`notifications/${uid}/pf_${now}`] = { type: 'profile', text: 'Your profile changes were approved and are now live on your developer page.', timestamp: now, read: false };
  try {
    await db.ref().update(up);
    S.profiles[uid] = Object.assign({}, S.profiles[uid] || {}, p, { updatedAt: now }); delete S.profiles[uid].status; delete S.profiles[uid].submittedAt; delete S.profiles[uid].rejectReason;
    delete S.pend[uid]; appList().forEach(a => { if (a.developerUid === uid && p.name) S.apps[a.id].developerName = p.name; });
    logAct('approve', 'Approved profile of ' + (p.name || 'a developer')); rerender(); sentAnim('Profile approved', 'Developer notified in the console');
  } catch (e) { fail(e); }
};
ACT.pfReject = async d => {
  const uid = d.id, p = S.pend[uid]; if (!p) return;
  const reason = await ask({ title: 'Reject profile changes?', text: 'The live profile stays as it is. The developer gets a notification with your reason.', input: 'Reason shown to the developer', area: true, required: true, ok: 'Reject changes' });
  if (!reason) return;
  const now = Date.now(), up = {};
  up[`devprofilePending/${uid}/status`] = 'rejected'; up[`devprofilePending/${uid}/rejectReason`] = reason.slice(0, 400);
  up[`notifications/${uid}/pf_${now}`] = { type: 'profile', text: 'Your profile changes were not approved. Please update them and submit again.', reason: reason.slice(0, 400), timestamp: now, read: false };
  try { await db.ref().update(up); p.status = 'rejected'; p.rejectReason = reason; logAct('reject', 'Rejected profile of ' + (p.name || 'a developer'), { note: reason }); rerender(); toast('Rejected, developer notified'); } catch (e) { fail(e); }
};

/* ---------- full review drawer (new app or app update) ---------- */
function openReview(key, isUpd) {
  let a, live = null, uid = '', aid = key;
  if (isUpd) { [uid, aid] = key.split('|'); const u = (S.upd[uid] || {})[aid]; live = S.apps[aid]; if (!u || !live) return; a = Object.assign({}, live, u); }
  else { a = S.apps[key]; if (!a) return; a = Object.assign({ id: key }, a); }
  const ch = live ? changedFields(a, live) : [], mark = k => ch.includes(k) ? ' <span class="rv-new">changed</span>' : '';
  const kv = (k, v, f) => `<div><dt>${k}${f ? mark(f) : ''}</dt><dd>${v == null || v === '' ? '—' : v}</dd></div>`;
  const link = u => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostOf(u) || u)}</a>` : '';
  const perms = splitList(a.permissions), shots = splitList(a.screenshot).filter(isImg);
  const imgBox = (u, cls) => isImg(u) ? `<a href="${esc(u)}" target="_blank" rel="noopener"><img class="${cls}" src="${esc(u)}" alt=""></a>` : '<div class="muted">Not added</div>';
  const diff = live && ch.length ? `<div class="dr-sec"><h4>What changed</h4><table class="difft"><thead><tr><th></th><th>Live now</th><th>New</th></tr></thead><tbody>${ch.filter(k => !['icon', 'banner', 'screenshot'].includes(k)).map(k => `<tr><td class="muted">${UF_LABEL[k]}</td><td>${esc(String(live[k] || '—').slice(0, 160))}</td><td><b>${esc(String(a[k] || '—').slice(0, 160))}</b></td></tr>`).join('') || '<tr><td colspan="3" class="muted">Only images changed</td></tr>'}</tbody></table></div>` : '';
  const act = isUpd ? `<button class="btn good" data-act="upApprove" data-k="${esc(key)}">${ico('check')}Approve update</button><button class="btn danger" data-act="upReject" data-k="${esc(key)}">${ico('x')}Reject</button>` : (a.status === 'pending' ? `<button class="btn good" data-act="apApprove" data-id="${esc(key)}">${ico('check')}Approve</button><button class="btn danger" data-act="apReject" data-id="${esc(key)}">${ico('x')}Reject</button>` : '');
  UI.openId = null; ov.className = 'overlay'; ov.hidden = false;
  ov.innerHTML = `<aside class="drawer"><div class="dr-h"><img class="ico" style="width:44px;height:44px;border-radius:12px" src="${esc(a.icon || ICON)}" alt=""><div class="grow"><h3>${esc(a.name || 'Untitled')}</h3><div class="muted">${isUpd ? 'Update request' : 'New app'} · ${esc(a.package || '')}</div></div><button class="icon-btn" id="drClose" aria-label="Close">${ico('x')}</button></div>
  <div class="dr-b">
  ${diff}
  <div class="dr-sec"><h4>Featured image${mark('banner')}</h4>${imgBox(a.banner, 'rv-banner')}</div>
  <div class="dr-sec"><h4>Icon${mark('icon')}</h4>${imgBox(a.icon, 'rv-icon')}</div>
  <div class="dr-sec"><h4>Screenshots (${shots.length})${mark('screenshot')}</h4>${shots.length ? `<div class="shots">${shots.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"><span>${i + 1}</span><img src="${esc(u)}" alt=""></a>`).join('')}</div>` : '<div class="muted">No screenshots</div>'}</div>
  <div class="dr-sec"><h4>Overview</h4><dl class="kv">${kv('Version', esc(a.version), 'version')}${kv('Category', esc(a.category), 'category')}${kv('Size', esc(a.size), 'size')}${kv('Min Android', esc(a.minAndroid), 'minAndroid')}${kv('Package', esc(a.package), 'package')}${kv('Tags', esc(a.tags), 'tags')}</dl></div>
  <div class="dr-sec"><h4>Short description${mark('shortDescription')}</h4><p>${esc(a.shortDescription || '—')}</p></div>
  <div class="dr-sec"><h4>Full description${mark('description')}</h4><p class="rv-long">${esc(a.description || '—')}</p></div>
  ${a.whatsNew ? `<div class="dr-sec"><h4>What's new${mark('whatsNew')}</h4><p class="rv-long">${esc(a.whatsNew)}</p></div>` : ''}
  <div class="dr-sec"><h4>Permissions (${perms.length})${mark('permissions')}</h4>${perms.length ? `<div class="chips">${perms.map(p => `<span class="pill nd">${esc(p)}</span>`).join('')}</div>` : '<div class="muted">None declared</div>'}</div>
  <div class="dr-sec"><h4>Links</h4><dl class="kv">${kv('Download', link(a.downloadUrl), 'downloadUrl')}${kv('Website', link(a.website), 'website')}${kv('Privacy policy', link(a.privacyPolicy), 'privacyPolicy')}${kv('YouTube', link(a.youtube), 'youtube')}${kv('Support email', esc(a.supportEmail), 'supportEmail')}</dl></div>
  <div class="dr-sec"><h4>Developer</h4><dl class="kv">${kv('Name', esc(a.developerName || userName(a.developerUid)))}${kv('Uid', '<code>' + esc(a.developerUid || uid || '') + '</code>')}${kv('Submitted', ago(+a.submittedAt || +a.timestamp) || '—')}</dl></div>
  </div>
  <div class="dr-f">${act}<button class="btn" id="drClose2" style="margin-left:auto">Close</button></div></aside>`;
  $('#drClose').onclick = closeOv; $('#drClose2').onclick = closeOv; document.onkeydown = e => { if (e.key === 'Escape') closeOv(); };
}
ACT.openReview = d => openReview(d.k, !!d.u || String(d.k).includes('|'));

const UP_FIELDS = Object.keys(UF_LABEL).concat(['versionHistory', 'developerName']);
async function decideUpdate(key, ok) {
  const [uid, aid] = key.split('|'), u = (S.upd[uid] || {})[aid], a = S.apps[aid]; if (!u || !a) return;
  if (ok && a.status === 'suspended') { toast('This app is suspended. Restore it first.', 'bad'); return; }
  let reason = '';
  if (!ok) { reason = await ask({ title: 'Reject this update?', text: 'The live version stays on the store. The developer is notified and emailed with your reason, and can fix the update and submit it again.', input: 'Reason shown to the developer', area: true, required: true, ok: 'Reject update' }); if (!reason) return; }
  else if (!(await ask({ title: 'Approve this update?', text: `The new version of "${a.name}" replaces the live one after the next store update. The developer is notified and emailed.`, ok: 'Approve update' }))) return;
  const now = Date.now(), up = {}, nm = u.name || a.name;
  if (ok) {
    UP_FIELDS.forEach(f => { if (u[f] !== undefined) up[`apps/${aid}/${f}`] = u[f]; });
    up[`apps/${aid}/updatedDate`] = new Date().toISOString().split('T')[0]; up[`apps/${aid}/updateReviewedAt`] = now; up[`apps/${aid}/updateResult`] = 'approved'; up[`appUpdates/${uid}/${aid}`] = null;
  } else { up[`appUpdates/${uid}/${aid}/status`] = 'rejected'; up[`appUpdates/${uid}/${aid}/rejectReason`] = reason.slice(0, 400); up[`appUpdates/${uid}/${aid}/reviewedAt`] = now; }
  up[`notifications/${uid}/au_${aid.slice(-8)}_${now}`] = { type: 'appreview', appId: aid, appName: String(nm).slice(0, 100), text: ok ? `Your update for "${nm}" was approved and is now live on UptoZishu.` : `Your update for "${nm}" was not approved. The old version stays live. Please fix the issue and submit the update again.`, ...(ok ? {} : { reason: reason.slice(0, 400) }), timestamp: now, read: false };
  try {
    await db.ref().update(up);
    if (ok) { UP_FIELDS.forEach(f => { if (u[f] !== undefined) a[f] = u[f]; }); a.updateReviewedAt = now; a.updateResult = 'approved'; delete S.upd[uid][aid]; } else { u.status = 'rejected'; u.rejectReason = reason; u.reviewedAt = now; }
    logAct(ok ? 'approve' : 'reject', (ok ? 'Approved update of "' : 'Rejected update of "') + nm + '"' + (u.version ? ' (' + u.version + ')' : ''), { appId: aid, appName: nm, icon: u.icon || a.icon, note: ok ? '' : reason });
    closeOv(); rerender(); sentAnim(ok ? 'Update approved' : 'Update rejected', MAIL_ENDPOINT ? 'Developer notified in the console and by email' : 'Developer notified in the console');
    if (MAIL_ENDPOINT) { const m = await mailCall('updecision', aid); if (!m) toast('Email could not be sent, notification was delivered', 'bad'); }
  } catch (e) { fail(e); }
}
ACT.upApprove = d => decideUpdate(d.k, true);
ACT.upReject = d => decideUpdate(d.k, false);

/* ---------- history ---------- */
const LOG_ICO = { store: 'star', approve: 'check', reject: 'x', suspend: 'pause', restore: 'play', delete: 'trash', ticket: 'chat', review: 'star', claim: 'shield', profile: 'users', report: 'flag', transfer: 'swap' };
const LOG_TONE = { approve: 'ok', restore: 'ok', reject: 'bad', suspend: 'bad', delete: 'bad', report: 'warn', review: 'warn' };
function vHistory() {
  const list = Object.keys(S.logs || {}).map(id => ({ id, ...S.logs[id] })).filter(l => l && l.ts).sort((a, b) => b.ts - a.ts);
  if (!list.length) return `<div class="empty card">${ico('clock')}<b>No history yet</b>Everything you approve, reject, suspend or reply to is saved here.</div>`;
  const dayName = t => { const d = new Date(t), n = new Date(), y = new Date(Date.now() - 864e5); return d.toDateString() === n.toDateString() ? 'Today' : d.toDateString() === y.toDateString() ? 'Yesterday' : dstr(t); };
  let last = '', html = '';
  list.slice(0, UI.histLimit || 60).forEach(l => {
    const dn = dayName(l.ts); if (dn !== last) { html += `<div class="hs-day">${dn}</div>`; last = dn; }
    const tone = LOG_TONE[l.kind] || '';
    html += `<div class="hs-row" id="h_${esc(l.id)}"><div class="hs-ic ${tone}">${ico(LOG_ICO[l.kind] || 'clock')}</div><div class="hs-b"><b>${esc(l.text)}</b><div class="meta">${new Date(l.ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}${l.note ? ' · ' + esc(String(l.note).slice(0, 120)) : ''}</div></div><button class="hs-x" data-act="logDel" data-id="${esc(l.id)}" aria-label="Delete">${ico('x')}</button></div>`;
  });
  return `<div class="toolbar"><div class="grow muted" style="padding:0 6px">${list.length} saved ${list.length === 1 ? 'action' : 'actions'}</div><button class="btn sm danger" data-act="logClear">${ico('trash')}Clear all</button></div><div class="card hs">${html}</div>${list.length > (UI.histLimit || 60) ? `<div class="more"><button class="btn" data-act="logMore">Show more</button></div>` : ''}`;
}
ACT.logMore = () => { UI.histLimit = (UI.histLimit || 60) + 60; rerender(); };
ACT.logDel = async d => {
  const row = document.getElementById('h_' + d.id); if (row) row.classList.add('gone');
  try { await db.ref(`adminLogs/${S.user.uid}/${d.id}`).remove(); delete S.logs[d.id]; setTimeout(rerender, 220); } catch (e) { if (row) row.classList.remove('gone'); fail(e); }
};
ACT.logClear = async () => {
  if (!(await ask({ title: 'Clear all history?', text: 'All saved actions are deleted for good. This cannot be undone.', ok: 'Clear all', danger: true }))) return;
  try { await db.ref(`adminLogs/${S.user.uid}`).remove(); S.logs = {}; rerender(); toast('History cleared'); } catch (e) { fail(e); }
};


/* ---------- user / developer control ---------- */
function openUser(uid) {
  const u = S.users[uid] || {}, d = S.devs[uid] || {}, p = S.profiles[uid] || {}, sp = S.susp[uid];
  const apps = appList().filter(a => a.developerUid === uid), revs = allReviews().filter(r => r.revId === uid).length;
  const name = u.name || p.name || d.displayName || 'Unnamed', un = u.username || p.username || d.username || '';
  const isDev = !!(apps.length || S.devs[uid]), self = uid === S.user.uid;
  const kv = (k, v) => `<div><dt>${k}</dt><dd>${v == null || v === '' ? '—' : v}</dd></div>`;
  UI.openId = null; ov.className = 'overlay'; ov.hidden = false;
  ov.innerHTML = `<aside class="drawer"><div class="dr-h"><div class="avatar ${avc(un || name)}" style="width:44px;height:44px;border-radius:50%">${esc(name[0].toUpperCase())}</div><div class="grow"><h3>${esc(name)}</h3><div class="muted">${un ? '@' + esc(un) : esc(uid)}</div></div><button class="icon-btn" id="drClose" aria-label="Close">${ico('x')}</button></div>
  <div class="dr-b">
  <div class="dr-sec"><div class="chips">${isDev ? pill('vio', 'Developer') : pill('', 'User')}${isDev ? (p.verified ? pill('ok', 'Verified') : pill('warn', 'Unverified')) : ''}${sp ? pill('bad', 'Suspended') : pill('ok', 'Active')}${self ? pill('info', 'You') : ''}</div>${sp ? `<div class="meta" style="margin-top:10px">Suspended ${ago(+sp.at)}. Reason: ${esc(sp.reason || '—')}</div>` : ''}</div>
  <div class="dr-sec"><h4>Account</h4><dl class="kv">${kv('Email', esc(d.email || u.email || ''))}${kv('Uid', '<code>' + esc(uid) + '</code>')}${kv('Joined', dstr(+u.createdAt || +p.createdAt))}${kv('Apps', apps.length)}${kv('Reviews written', revs)}${kv('Country', esc(p.location || d.country || ''))}</dl></div>
  ${isDev ? `<div class="dr-sec"><h4>Developer badge</h4><p class="muted" style="margin-bottom:10px">${p.name ? 'The badge shows on their store developer page and on every app they publish.' : 'This developer has not finished their profile yet, so they cannot be verified.'}</p><button class="btn ${p.verified ? '' : 'good'}" ${p.name ? '' : 'disabled'} data-act="usVerify" data-u="${esc(uid)}">${ico('check')}${p.verified ? 'Remove verified badge' : 'Verify developer'}</button></div>
  <div class="dr-sec"><h4>Apps (${apps.length})</h4>${apps.length ? apps.slice(0, 12).map(a => `<div class="item-h" style="padding:8px 0"><img class="ico" src="${esc(a.icon || ICON)}" alt=""><div class="grow"><b>${esc(a.name)}</b><div class="meta">${esc(a.version || '')}</div></div>${statPill(a)}<button class="btn sm" data-act="openApp" data-id="${esc(a.id)}">Open</button></div>`).join('') : '<div class="muted">No apps</div>'}</div>` : ''}
  <div class="dr-sec"><h4>Account control</h4>${self ? '<p class="muted">This is your own account.</p>' : sp
    ? `<p class="muted" style="margin-bottom:10px">Unsuspending lets them use the console again${apps.some(a => String(a.suspendedReason || '').startsWith('Developer account suspended')) ? ' and puts their apps back on the store' : ''}.</p><button class="btn good" data-act="usUnsuspend" data-u="${esc(uid)}">${ico('check')}Unsuspend account</button>`
    : `<p class="muted" style="margin-bottom:10px">A suspended person cannot upload, update, review, report or open tickets${apps.length ? ', and all their live apps are hidden from the store' : ''}. They see the reason in the console.</p><button class="btn danger" data-act="usSuspend" data-u="${esc(uid)}">${ico('pause')}Suspend account</button>`}</div>
  </div><div class="dr-f"><button class="btn" id="drClose2" style="margin-left:auto">Close</button></div></aside>`;
  $('#drClose').onclick = closeOv; $('#drClose2').onclick = closeOv; document.onkeydown = e => { if (e.key === 'Escape') closeOv(); };
}
ACT.openUser = d => openUser(d.u);
ACT.usVerify = async d => { await ACT.verifyDev(d); openUser(d.u); };
ACT.usSuspend = async d => {
  const uid = d.u; if (uid === S.user.uid) return;
  const name = (S.users[uid] || {}).name || (S.profiles[uid] || {}).name || 'this account', apps = appList().filter(a => a.developerUid === uid && stat(a) === 'live');
  const why = await ask({ title: 'Suspend ' + name + '?', text: 'They cannot upload, update, review, report or open tickets until you unsuspend them.' + (apps.length ? ` Their ${apps.length} live app${apps.length === 1 ? '' : 's'} disappear from the store after the next rebuild.` : ''), input: 'Reason (shown to them)', value: 'Broke the store rules.', ok: 'Suspend account', danger: true, required: true }); if (why === null) return;
  const now = Date.now(), up = {}, tag = 'Developer account suspended: ' + why.slice(0, 150);
  up['suspendedUsers/' + uid] = { reason: why.slice(0, 300), at: now, by: S.user.uid };
  apps.forEach(a => { up[`apps/${a.id}/status`] = 'suspended'; up[`apps/${a.id}/prevStatus`] = a.status || 'live'; up[`apps/${a.id}/suspendedReason`] = tag.slice(0, 200); });
  const n = note(uid, 'sus_' + now, 'Your account was suspended. Reason: ' + why); if (n) up[n.path] = n.value;
  try {
    await db.ref().update(up); S.susp[uid] = up['suspendedUsers/' + uid];
    apps.forEach(a => { S.apps[a.id].status = 'suspended'; S.apps[a.id].prevStatus = a.status || 'live'; S.apps[a.id].suspendedReason = tag; });
    logAct('suspend', 'Suspended account of ' + name + (apps.length ? ' and ' + apps.length + ' app(s)' : ''), { note: why }); toast('Account suspended'); rerender(); openUser(uid);
  } catch (e) { fail(e); }
};
ACT.usUnsuspend = async d => {
  const uid = d.u, name = (S.users[uid] || {}).name || (S.profiles[uid] || {}).name || 'this account';
  const apps = appList().filter(a => a.developerUid === uid && a.status === 'suspended' && String(a.suspendedReason || '').startsWith('Developer account suspended'));
  if (!(await ask({ title: 'Unsuspend ' + name + '?', text: apps.length ? `Their ${apps.length} hidden app${apps.length === 1 ? '' : 's'} come back to the store after the next rebuild.` : 'They can use the console again.', ok: 'Unsuspend' }))) return;
  const now = Date.now(), up = {}; up['suspendedUsers/' + uid] = null;
  apps.forEach(a => { up[`apps/${a.id}/status`] = a.prevStatus && a.prevStatus !== 'suspended' ? a.prevStatus : 'live'; up[`apps/${a.id}/suspendedReason`] = null; });
  const n = note(uid, 'uns_' + now, 'Your account is active again. You can use the Developer Console as usual.'); if (n) up[n.path] = n.value;
  try {
    await db.ref().update(up); delete S.susp[uid]; apps.forEach(a => { S.apps[a.id].status = up[`apps/${a.id}/status`]; S.apps[a.id].suspendedReason = null; });
    logAct('restore', 'Unsuspended account of ' + name, {}); toast('Account is active again'); rerender(); openUser(uid);
  } catch (e) { fail(e); }
};

/* ---------- storefront: featured apps + editor's choice ---------- */
const SF_KINDS = { featured: { title: 'Featured apps', sub: 'Shown as the big banner slides at the top of the store home page.', max: 8, auto: 'Nothing picked, so the store shows the most downloaded apps that have a feature banner.' }, editors: { title: "Editor's Choice", sub: "Shown on the Editor's Choice page and in its pill on the home page. Add as many apps as you like.", max: Infinity, auto: 'Nothing picked, so the store shows verified apps, or the best rated apps with a banner.' }, sponsored: { title: 'Sponsored', sub: 'Shown as the Sponsored row at the top of the store home page and on the search screen (first 10). Apps added from an approved advertisement are removed automatically when their paid time ends.', max: Infinity, auto: 'Nothing picked, so no Sponsored row is shown on the store.' } };
const sfList = k => { const v = S.sf && S.sf[k]; return (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []).filter(id => typeof id === 'string'); };
async function sfSave(k, arr, msg) {
  try { const un = S.sf && S.sf[k + 'Until']; if (un && typeof un === 'object') { const up = {}; up['storefront/' + k] = arr.length ? arr : null; Object.keys(un).forEach(id => { if (!arr.includes(id)) { up['storefront/' + k + 'Until/' + id] = null; delete un[id]; } }); await db.ref().update(up); } else await db.ref('storefront/' + k).set(arr.length ? arr : null); S.sf = Object.assign({}, S.sf || {}); if (arr.length) S.sf[k] = arr; else delete S.sf[k]; rerender(); if (msg) toast(msg); } catch (e) { fail(e); }
}
function vStorefront() {
  const k = SF_KINDS[UI.sfTab] ? UI.sfTab : 'featured', m = SF_KINDS[k], ids = sfList(k), cap = m.max === Infinity ? '' : ' / ' + m.max;
  const tabs = `<div class="chips" style="margin-bottom:16px">${Object.keys(SF_KINDS).map(t => `<button class="chip ${k === t ? 'on' : ''}" data-act="sfTab" data-t="${t}">${SF_KINDS[t].title} · ${sfList(t).length}</button>`).join('')}</div>`;
  const rows = ids.map((id, i) => {
    const a = S.apps[id];
    const warn = !a ? pill('bad', 'App deleted') : stat(a) !== 'live' ? pill('warn', 'Not live, hidden') : (k === 'featured' && !a.banner ? pill('nd', 'No banner') : '');
    return `<div class="hs-row sf-c"><div class="sf-n">${i + 1}</div>${a ? `<img class="ico" style="width:38px;height:38px;border-radius:10px" src="${esc(a.icon || ICON)}" alt="">` : '<div class="ico" style="width:38px;height:38px"></div>'}<div class="hs-b"><b>${esc(a ? a.name : 'Unknown app')}</b><div class="meta">${esc(a ? (a.developerName || '') + (a.version ? ' · ' + a.version : '') : id)} ${warn}</div></div>
    <button class="hs-x" data-act="sfMove" data-k="${k}" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled style="opacity:.3"' : ''} aria-label="Move up">${ico('up')}</button><button class="hs-x" data-act="sfMove" data-k="${k}" data-i="${i}" data-dir="1" ${i === ids.length - 1 ? 'disabled style="opacity:.3"' : ''} aria-label="Move down">${ico('down')}</button><button class="hs-x" data-act="sfRemove" data-k="${k}" data-i="${i}" aria-label="Remove">${ico('x')}</button></div>`;
  }).join('');
  return `<div class="muted" style="margin-bottom:14px">Changes appear on the store after the next rebuild (about 10 minutes). Only live apps are shown, others are skipped automatically.</div>${tabs}
  <div class="card" style="padding:0"><div style="padding:18px 18px 8px;display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap"><div class="grow"><h3>${m.title} <span class="muted" style="font-weight:500">${ids.length}${cap}</span></h3><div class="sub">${m.sub}</div></div><button class="btn primary" data-act="sfAdd" data-k="${k}">${ico('plus')}Add apps</button></div>
  ${rows ? `<div class="hs">${rows}</div>` : `<div class="empty" style="padding:26px 18px">${ico('star')}<b>Automatic</b>${m.auto}</div>`}</div>`;
}
ACT.sfTab = d => { UI.sfTab = d.t; rerender(); };
ACT.sfRemove = async d => { const arr = sfList(d.k); const id = arr[+d.i]; if (id === undefined) return; arr.splice(+d.i, 1); logAct('store', 'Removed "' + ((S.apps[id] || {}).name || 'app') + '" from ' + SF_KINDS[d.k].title, { appId: id, appName: (S.apps[id] || {}).name, icon: (S.apps[id] || {}).icon }); await sfSave(d.k, arr, 'Removed'); };
ACT.sfMove = async d => { const arr = sfList(d.k), i = +d.i, j = i + (+d.dir); if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; await sfSave(d.k, arr); };
ACT.sfAdd = d => {
  const k = d.k, m = SF_KINDS[k], start = sfList(k), sel = new Set(start);
  const pool = appList().filter(a => stat(a) === 'live' || sel.has(a.id)).sort((x, y) => (x.name || '').localeCompare(y.name || ''));
  UI.openId = null; ov.className = 'overlay'; ov.hidden = false;
  ov.innerHTML = `<aside class="drawer"><div class="dr-h"><div class="grow"><h3>${esc(m.title)}</h3><div class="muted">Tap + to select apps. Tap the tick to remove.</div></div><button class="icon-btn" id="drClose" aria-label="Close">${ico('x')}</button></div><div class="dr-b"><div class="toolbar"><div class="grow">${ico('search')}<input id="sfQ" type="search" placeholder="Search apps" autocomplete="off"></div></div><div id="sfPool"></div></div><div class="dr-f"><span class="muted" id="sfCount"></span><button class="btn primary" id="sfDone" style="margin-left:auto">${ico('check')}Done</button></div></aside>`;
  const count = () => { $('#sfCount').textContent = sel.size + ' selected' + (m.max === Infinity ? '' : ' (max ' + m.max + ')'); };
  const draw = () => {
    const q = $('#sfQ').value.trim().toLowerCase(), l = pool.filter(a => !q || [a.name, a.developerName, a.category].join(' ').toLowerCase().includes(q));
    $('#sfPool').innerHTML = l.length ? l.map(a => `<button class="sf-pick ${sel.has(a.id) ? 'on' : ''}" data-id="${esc(a.id)}" aria-pressed="${sel.has(a.id)}"><img class="ico" style="width:42px;height:42px;border-radius:11px" src="${esc(a.icon || ICON)}" alt=""><span><b>${esc(a.name)}</b><small>${esc(a.developerName || '')}${k === 'featured' && !a.banner ? ' · no banner' : ''}${stat(a) !== 'live' ? ' · not live' : ''}</small></span><i class="sf-tg">${sel.has(a.id) ? ico('check') : ico('plus')}</i></button>`).join('') : '<div class="empty">' + ico('search') + '<b>No apps found</b></div>';
    count();
  };
  draw(); $('#sfQ').oninput = draw; setTimeout(() => $('#sfQ').focus(), 50);
  $('#sfPool').onclick = e => {
    const b = e.target.closest('.sf-pick'); if (!b) return; const id = b.dataset.id;
    if (sel.has(id)) sel.delete(id); else { if (sel.size >= m.max) { toast('You can pick up to ' + m.max + ' apps here', 'bad'); return; } sel.add(id); }
    const on = sel.has(id); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.querySelector('.sf-tg').innerHTML = on ? ico('check') : ico('plus'); count();
  };
  $('#sfDone').onclick = async () => {
    const next = start.filter(id => sel.has(id)).concat([...sel].filter(id => !start.includes(id)));
    closeOv();
    if (next.join() === start.join()) return;
    const added = next.filter(id => !start.includes(id)), removed = start.filter(id => !next.includes(id));
    if (added.length || removed.length) logAct('store', m.title + ': ' + (added.length ? 'added ' + added.length : '') + (added.length && removed.length ? ', ' : '') + (removed.length ? 'removed ' + removed.length : ''), { note: added.concat(removed).map(id => (S.apps[id] || {}).name).filter(Boolean).slice(0, 6).join(', ') });
    await sfSave(k, next, 'Saved');
  };
  $('#drClose').onclick = closeOv; document.onkeydown = e => { if (e.key === 'Escape') closeOv(); };
};


/* ---------- paid advertisements (Sponsored or Featured) ---------- */
const adList = () => Object.keys(S.ads || {}).map(id => ({ id, ...S.ads[id] })).filter(c => c && c.submittedAt).sort((a, b) => b.submittedAt - a.submittedAt);
const AD_NAME = { sponsored: 'Sponsored', featured: 'Featured' };
const inr = n => '₹' + (+n || 0).toLocaleString('en-IN');
const adDay = t => t ? new Date(+t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
function vAds() {
  const all = adList(), tab = UI.adTab || 'pending', cnt = t => all.filter(c => t === 'all' || c.status === t).length;
  const tabs = `<div class="chips" style="margin-bottom:14px">${[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([t, n]) => `<button class="chip ${tab === t ? 'on' : ''}" data-act="adTab" data-t="${t}">${n} · ${cnt(t)}</button>`).join('')}</div>`;
  const list = all.filter(c => tab === 'all' || c.status === tab);
  const intro = `<div class="muted" style="margin-bottom:14px">Check the payment screenshot, UTR and amount against your UPI app (7654613259@fam). Approving adds the app to the Sponsored or Featured list of the store for the paid months. Rejecting needs a reason.</div>`;
  if (!list.length) return intro + tabs + `<div class="empty card">${ico('mega')}<b>Nothing here</b>Advertisement requests from developers show up here.</div>`;
  return intro + tabs + '<div class="stack">' + list.map(c => {
    const a = S.apps[c.appId] || {}, st = c.status, tone = st === 'approved' ? 'ok' : st === 'rejected' ? 'bad' : 'warn';
    const warn = !S.apps[c.appId] ? pill('bad', 'App deleted') : stat(a) !== 'live' ? pill('warn', 'App not live') : (c.plan === 'featured' && !a.banner ? pill('nd', 'No banner') : '');
    return `<div class="item"><div class="item-h"><img class="ico" src="${esc(c.appIcon || a.icon || ICON)}" alt=""><div class="grow"><b>${esc(c.appName || a.name || 'App')}</b><div class="meta">${esc(AD_NAME[c.plan] || c.plan)} · ${c.months} month${c.months > 1 ? 's' : ''} · <b>${inr(c.amount)}</b> · ${ago(+c.submittedAt)} ${warn}</div></div>${pill(tone, st)}</div>
    <table class="difft" style="margin:10px 0"><tbody>
    <tr><td class="muted">Name</td><td>${esc(c.name)}</td></tr><tr><td class="muted">Phone</td><td>${esc(c.phone)}</td></tr><tr><td class="muted">Email</td><td>${esc(c.email)}</td></tr>
    <tr><td class="muted">UTR</td><td><b>${esc(c.utr)}</b></td></tr><tr><td class="muted">Paid on</td><td>${esc(c.paidOn)}</td></tr>${c.note ? `<tr><td class="muted">Note</td><td>${esc(c.note)}</td></tr>` : ''}
    ${st === 'approved' ? `<tr><td class="muted">Live</td><td>${adDay(c.startsAt)} → ${adDay(c.endsAt)}</td></tr>` : ''}${st === 'rejected' ? `<tr><td class="muted">Reason</td><td>${esc(c.rejectReason || '')}</td></tr>` : ''}</tbody></table>
    ${isImg(c.shot) ? `<div class="shots"><a href="${esc(c.shot)}" target="_blank" rel="noopener"><span>1</span><img src="${esc(c.shot)}" alt="Payment screenshot"></a></div>` : '<div class="meta">No screenshot</div>'}
    ${st === 'pending' ? `<div class="actions" style="margin-top:12px"><button class="btn sm good" data-act="adApprove" data-id="${esc(c.id)}">${ico('check')}Verify and approve</button><button class="btn sm danger" data-act="adReject" data-id="${esc(c.id)}">${ico('x')}Reject</button></div>` : ''}</div>`;
  }).join('') + '</div>';
}
ACT.adTab = d => { UI.adTab = d.t; rerender(); };
ACT.adApprove = async d => {
  const c = S.ads[d.id]; if (!c || c.status !== 'pending') return;
  const a = S.apps[c.appId]; if (!a) { toast('This app was deleted, reject the request instead', 'bad'); return; }
  const k = c.plan === 'featured' ? 'featured' : 'sponsored', list = sfList(k), until = Object.assign({}, (S.sf && S.sf[k + 'Until']) || {}), now = Date.now();
  const base = list.includes(c.appId) && +until[c.appId] > now ? +until[c.appId] : now, end = base + (+c.months || 1) * 30 * 864e5;
  if (!(await ask({ title: 'Approve this advertisement?', text: `${a.name} goes into the ${AD_NAME[k]} list until ${adDay(end)}. Make sure ${inr(c.amount)} with UTR ${c.utr} is in your UPI account.` + (k === 'featured' && list.length >= 8 ? ' The Featured list already has 8 or more apps, the store shows only the first 8.' : ''), ok: 'Approve' }))) return;
  if (!list.includes(c.appId)) list.push(c.appId); until[c.appId] = end;
  const up = {}; up['storefront/' + k] = list; up['storefront/' + k + 'Until/' + c.appId] = end;
  Object.assign(up, { [`adCampaigns/${d.id}/status`]: 'approved', [`adCampaigns/${d.id}/reviewedAt`]: now, [`adCampaigns/${d.id}/startsAt`]: base, [`adCampaigns/${d.id}/endsAt`]: end, [`adCampaigns/${d.id}/reviewedBy`]: S.user.uid });
  const n = note(c.uid, 'ad_' + now, `Your ${AD_NAME[k]} advertisement for "${a.name}" is approved. It is live in the store until ${adDay(end)} (the store updates within about 10 minutes).`, c.appId); if (n) up[n.path] = n.value;
  try {
    await db.ref().update(up); S.sf = Object.assign({}, S.sf || {}); S.sf[k] = list; S.sf[k + 'Until'] = until; Object.assign(S.ads[d.id], { status: 'approved', reviewedAt: now, startsAt: base, endsAt: end });
    logAct('store', `Approved ${AD_NAME[k]} ad for ${a.name}`, { appId: c.appId, appName: a.name, icon: a.icon }); rerender();
    sentAnim('Advertisement approved', MAIL_ENDPOINT ? 'Developer notified in the console and by email' : 'Developer notified in the console');
    if (MAIL_ENDPOINT) { const m = await mailCall('addecision', d.id); if (!m) toast('Email could not be sent, notification was delivered', 'bad'); }
  } catch (e) { fail(e); }
};
ACT.adReject = async d => {
  const c = S.ads[d.id]; if (!c || c.status !== 'pending') return;
  const why = await ask({ title: 'Reject this advertisement?', text: 'The developer is told the reason.', input: 'Reason (shown to the developer)', value: '', area: true, ok: 'Reject', danger: true, required: true }); if (why === null || !String(why).trim()) return;
  const now = Date.now(), up = { [`adCampaigns/${d.id}/status`]: 'rejected', [`adCampaigns/${d.id}/reviewedAt`]: now, [`adCampaigns/${d.id}/rejectReason`]: String(why).trim().slice(0, 400), [`adCampaigns/${d.id}/reviewedBy`]: S.user.uid };
  const n = note(c.uid, 'ad_' + now, `Your ${AD_NAME[c.plan] || ''} advertisement for "${c.appName}" was rejected. Reason: ${String(why).trim()}`, c.appId); if (n) up[n.path] = n.value;
  try {
    await db.ref().update(up); Object.assign(S.ads[d.id], { status: 'rejected', reviewedAt: now, rejectReason: String(why).trim().slice(0, 400) });
    logAct('reject', 'Rejected ad for ' + c.appName, { appId: c.appId, appName: c.appName, note: String(why).slice(0, 150) }); rerender();
    sentAnim('Advertisement rejected', MAIL_ENDPOINT ? 'Developer notified in the console and by email' : 'Developer notified in the console');
    if (MAIL_ENDPOINT) { const m = await mailCall('addecision', d.id); if (!m) toast('Email could not be sent, notification was delivered', 'bad'); }
  } catch (e) { fail(e); }
};

/* ---------- app feedback from store users ---------- */
const fbList = () => Object.keys(S.fb || {}).map(id => ({ id, ...S.fb[id] })).filter(f => f && f.ts).sort((a, b) => b.ts - a.ts);
const FB_TABS = [['new', 'New'], ['reviewed', 'Reviewed'], ['archived', 'Archived'], ['all', 'All']];
const fbStars = n => '<span class="fb-st">' + '★'.repeat(Math.max(0, Math.min(5, +n || 0))) + '<i>' + '★'.repeat(5 - Math.max(0, Math.min(5, +n || 0))) + '</i></span>';
function vFeedback() {
  const all = fbList(), tab = UI.fbTab || 'new', q = (UI.fbQ || '').trim().toLowerCase(), tf = UI.fbType || 'all';
  const types = [...new Set(all.map(f => f.type).filter(Boolean))];
  let list = all.filter(f => tab === 'all' || (f.status || 'new') === tab);
  if (tf !== 'all') list = list.filter(f => f.type === tf);
  if (q) list = list.filter(f => [f.appName, f.message, f.username, f.type, (f.topics || []).join(' ')].join(' ').toLowerCase().includes(q));
  const cnt = t => all.filter(f => t === 'all' || (f.status || 'new') === t).length;
  const tabs = `<div class="chips" style="margin-bottom:12px">${FB_TABS.map(([t, n]) => `<button class="chip ${tab === t ? 'on' : ''}" data-act="fbTab" data-t="${t}">${n} · ${cnt(t)}</button>`).join('')}</div>`;
  const bar = `<div class="toolbar"><div class="grow">${ico('search')}<input id="fbQ" type="search" placeholder="Search app, message, user…" value="${esc(UI.fbQ || '')}"></div><select id="fbType" class="sel"><option value="all">All types</option>${types.map(t => `<option ${tf === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
  if (!list.length) return tabs + bar + `<div class="empty card">${ico('inbox')}<b>${all.length ? 'Nothing here' : 'No feedback yet'}</b>${all.length ? 'Try another tab or filter.' : 'Feedback sent from the Feedback section of an app page lands here.'}</div>`;
  const toneT = { 'Bug or problem': 'bad', Suggestion: 'info', Compliment: 'ok', Question: 'warn' };
  return tabs + bar + '<div class="stack">' + list.slice(0, UI.fbLimit || 40).map(f => {
    const a = S.apps[f.appId] || {}, imgs = (Array.isArray(f.images) ? f.images : []).filter(isImg), st = f.status || 'new';
    return `<div class="item"><div class="item-h"><img class="ico" src="${esc(a.icon || ICON)}" alt=""><div class="grow"><b>${esc(f.appName || a.name || 'Unknown app')}</b><div class="meta">${fbStars(f.rating)} · @${esc(f.username || 'user')} · ${ago(+f.ts)}</div></div>${pill(toneT[f.type] || 'nd', f.type || 'Feedback')}${st === 'new' ? pill('info', 'New') : ''}</div>
    ${(f.topics || []).length ? `<div class="chips" style="margin:8px 0 0">${f.topics.map(t => pill('nd', t)).join('')}</div>` : ''}
    <p class="body" style="white-space:pre-wrap;word-break:break-word">${esc(f.message)}</p>
    ${f.device || f.appVersion ? `<div class="meta">${esc([f.device, f.appVersion ? 'App ' + f.appVersion : ''].filter(Boolean).join(' · '))}</div>` : ''}
    ${imgs.length ? `<div class="shots" style="margin-top:10px">${imgs.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener"><span>${i + 1}</span><img src="${esc(u)}" alt=""></a>`).join('')}</div>` : ''}
    ${S.fbn[f.id] ? `<div class="meta" style="margin-top:8px">Your note: ${esc(S.fbn[f.id])}</div>` : ''}
    <div class="actions" style="margin-top:12px">${st !== 'reviewed' ? `<button class="btn sm good" data-act="fbSet" data-id="${esc(f.id)}" data-st="reviewed">${ico('check')}Mark reviewed</button>` : ''}${st !== 'archived' ? `<button class="btn sm" data-act="fbSet" data-id="${esc(f.id)}" data-st="archived">${ico('inbox')}Archive</button>` : ''}${st !== 'new' ? `<button class="btn sm" data-act="fbSet" data-id="${esc(f.id)}" data-st="new">Mark new</button>` : ''}<button class="btn sm" data-act="fbNote" data-id="${esc(f.id)}">Note</button>${f.contactOk && (S.fbc[f.id] || {}).email ? `<a class="btn sm" href="mailto:${esc(S.fbc[f.id].email)}?subject=${encodeURIComponent('Your feedback about ' + (f.appName || 'an app'))}">${ico('send')}Email</a>` : ''}${a.name ? `<button class="btn sm" data-act="openApp" data-id="${esc(f.appId)}">Open app</button>` : ''}<button class="btn sm danger" data-act="fbDel" data-id="${esc(f.id)}">${ico('trash')}Delete</button></div></div>`;
  }).join('') + '</div>' + (list.length > (UI.fbLimit || 40) ? '<div class="more"><button class="btn" data-act="fbMore">Show more</button></div>' : '');
}
ACT.fbTab = d => { UI.fbTab = d.t; UI.fbLimit = 40; rerender(); };
ACT.fbMore = () => { UI.fbLimit = (UI.fbLimit || 40) + 40; rerender(); };
ACT.fbSet = async d => {
  const f = S.fb[d.id]; if (!f) return;
  try { await db.ref('feedback/' + d.id + '/status').set(d.st); f.status = d.st; logAct('review', (d.st === 'reviewed' ? 'Reviewed' : d.st === 'archived' ? 'Archived' : 'Reopened') + ' feedback on "' + (f.appName || 'app') + '"', { appId: f.appId, appName: f.appName }); rerender(); toast(d.st === 'reviewed' ? 'Marked reviewed' : d.st === 'archived' ? 'Archived' : 'Marked new'); } catch (e) { fail(e); }
};
ACT.fbNote = async d => {
  const f = S.fb[d.id]; if (!f) return;
  const v = await ask({ title: 'Private note', text: 'Only admins see this note.', input: 'Note', value: S.fbn[d.id] || '', area: true, ok: 'Save note' }); if (v === null) return;
  try { await db.ref('feedbackNotes/' + d.id).set(v.trim().slice(0, 500) || null); if (v.trim()) S.fbn[d.id] = v.trim().slice(0, 500); else delete S.fbn[d.id]; rerender(); toast('Note saved'); } catch (e) { fail(e); }
};
ACT.fbDel = async d => {
  const f = S.fb[d.id]; if (!f) return;
  if (!(await ask({ title: 'Delete this feedback?', text: 'It is removed for good. This cannot be undone.', ok: 'Delete', danger: true }))) return;
  try { const dl = {}; dl['feedback/' + d.id] = null; dl['feedbackContact/' + d.id] = null; dl['feedbackNotes/' + d.id] = null; if (f.appId) dl['appFeedback/' + f.appId + '/' + d.id] = null; await db.ref().update(dl); delete S.fb[d.id]; delete S.fbc[d.id]; delete S.fbn[d.id]; logAct('delete', 'Deleted feedback on "' + (f.appName || 'app') + '"', { appId: f.appId, appName: f.appName }); rerender(); toast('Feedback deleted'); } catch (e) { fail(e); }
};

/* ---------- router ---------- */
const VIEWS = { '': vOverview, apps: vApps, reviews: vReviews, reports: vReports, claims: vClaims, approvals: vApprovals, tickets: vTickets, users: vUsers, broadcast: vBroadcast, history: vHistory, storefront: vStorefront, feedback: vFeedback, ads: vAds };
function route() { return (location.hash.replace(/^#\/?/, '').split('/')[0]) || ''; }
function routeId() { return decodeURIComponent(location.hash.replace(/^#\/?/, '').split('/')[1] || ''); }
function buildNav() {
  const c = { approvals: pendingApps().length + pendingProfiles().length + pendingUpdates().length, reports: reportList().length, feedback: fbList().filter(f => f.status === 'new').length, claims: pendingClaims().length, ads: adList().filter(c => c.status === 'pending').length, tickets: tkList().filter(t => t.status !== 'closed' && t.lastBy !== 'admin').length };
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
  on('fbQ', e => { UI.fbQ = e.target.value; UI.fbLimit = 40; rerender(); }); on('fbType', e => { UI.fbType = e.target.value; rerender(); }); on('appQ', e => { UI.appQ = e.target.value; UI.appLimit = 40; rerender(); }); on('revQ', e => { UI.revQ = e.target.value; UI.revLimit = 30; rerender(); }); on('userQ', e => { UI.userQ = e.target.value; rerender(); });
  const s = $('#appSort'); if (s) s.onchange = e => { UI.appSort = e.target.value; rerender(); };
  const tt = $('#tkText'); if (tt) tt.addEventListener('input', () => { UI.reply[routeId()] = tt.value; });
  const bt = $('#bcText'); if (bt) bt.addEventListener('input', () => { $('#bcLen').textContent = bt.value.length + ' / 2000'; $('#bcPrev').textContent = bt.value || 'Your message appears here…'; });
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
