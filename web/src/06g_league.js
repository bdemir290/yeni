// ================= GALAKSİ LİGİ (v5.1) =================
// A season table for one run: every sprint hands out points by finishing place (named rivals and Deniz only),
// duels give the winner 8 and the loser 3. At the end of each planet the leader of the table gets crystals.
const LEAGUE_PTS = [10, 7, 5, 4, 3, 2, 1, 0];
const LEAGUE_BONUS = [6, 3, 1];
function leagueAdd(id, n) { RUN.league = RUN.league || {}; RUN.league[id] = (RUN.league[id] || 0) + n; }
// standings: [{ id, name, pts, me }] best first; on equal points Deniz goes first (home crowd)
function leagueTable() {
  const L = (RUN && RUN.league) || {}, rows = [];
  for (const id in L) rows.push({ id, name: id === 'deniz' ? TX('DENİZ') : (RIVAL_BY_ID[id] ? RIVAL_BY_ID[id].name : id), pts: L[id], me: id === 'deniz' });
  if (!rows.some(r => r.me)) rows.push({ id: 'deniz', name: TX('DENİZ'), pts: 0, me: true });
  rows.sort((a, b) => b.pts - a.pts || (b.me ? 1 : 0) - (a.me ? 1 : 0));
  return rows;
}
function leagueRank() { return leagueTable().findIndex(r => r.me) + 1; }
function leagueLeader() { const t = leagueTable(); return t.length && !t[0].me && t[0].pts > 0 ? t[0].id : null; }
// at the end of a planet (after the champion): bonus crystals by league place
function leagueRegionBonus() {
  const me = (RUN.league || {}).deniz || 0;
  if (!me) return; // no sprint or duel points yet: no table to lead
  const rk = leagueRank(), n = LEAGUE_BONUS[rk - 1] || 0;
  if (!n) return;
  RUN.yonca += n; missionEvent('yonca', n);
  if (rk === 1) { missionEvent('league', 1); META.stats.leagueLeads = (META.stats.leagueLeads || 0) + 1; }
  toast(TX('LİG ') + rk + '.: +' + n + TX(' KRİSTAL'), C.gold, 'crown');
}
function drawLeague(onClose) {
  const rows = leagueTable().slice(0, 9);
  const w = Math.min(W - 16, 200), rh = 13, h = 34 + rows.length * rh + 18;
  const x = Math.round(W / 2 - w / 2), y = Math.round(SAFE.t + (H - SAFE.t - SAFE.b - h) / 2);
  UI.block(0, 0, W, H, onClose);
  g.globalAlpha = 0.55; rect(0, 0, W, H, C.ink); g.globalAlpha = 1;
  panel(x, y, w, h, TX('GALAKSİ LİGİ'));
  text(TX('SPRİNT VE DÜELLOLARDAN PUAN'), x + w / 2, y + 18, C.gray, 'center');
  rows.forEach((r, i) => {
    const yy = y + 30 + i * rh, def = RIVAL_BY_ID[r.id];
    if (r.me) { rrect(x + 4, yy - 2, w - 8, rh - 1, C.slate); }
    text((i + 1) + '.', x + 10, yy, i === 0 ? C.gold : C.lgray);
    text(r.name, x + 24, yy, r.me ? C.yellow : def ? (STYLE_COL[def.style] || C.white) : C.white);
    text(r.pts + ' P', x + w - 10, yy, r.me ? C.yellow : C.white, 'right');
  });
  text(TX('GEZEGEN SONU: 1. +') + LEAGUE_BONUS[0] + ' · 2. +' + LEAGUE_BONUS[1] + ' · 3. +' + LEAGUE_BONUS[2] + TX(' KRİSTAL'), x + w / 2, y + h - 13, C.cyan, 'center');
}
