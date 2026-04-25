/**
 * Square mosaic grids: uniform s×s cells that tile the W×H area.
 *
 * 1) Prefer c·s = W and r·s = H (search integer c; r = round((H·c)/W)).
 * 2) If no fit within EPS, use s = W/c and r = ceil(H/s) so the rect is fully covered
 *    (overflow clipped). Choose c to minimize (r·s − H) — thinnest bottom overhang.
 */
(function () {
  /**
   * @param {number} W - target width (px)
   * @param {number} H - target height (px)
   * @param {number} cellTarget - desired approximate cell size (px)
   * @returns {{ cols: number, rows: number, s: number } | null}
   */
  function fitSquareMosaicGrid(W, H, cellTarget) {
    if (W < 4 || H < 4) return null;
    const t = Math.max(6, Math.min(256, Number(cellTarget) || 28));
    const EPS = 0.5;

    const cMax = Math.min(500, Math.max(1, Math.floor(W / 2.4)));

    let best = null;
    let bestErr = Infinity;

    // s = W/c → width exact; r·s = H when H/W = r/c (same s)
    for (let c = 1; c <= cMax; c++) {
      const s = W / c;
      if (s < 2.5) break;
      const r = Math.max(1, Math.round((H * c) / W));
      const err = Math.abs(H - r * s);
      if (err < bestErr) {
        bestErr = err;
        best = { cols: c, rows: r, s };
      }
    }

    // s = H/r → height exact; c·s = W when W/H = c/r
    for (let r = 1; r <= cMax; r++) {
      const s = H / r;
      if (s < 2.5) break;
      const c = Math.max(1, Math.round((W * r) / H));
      const sUse = W / c;
      if (sUse < 2.5) continue;
      const err = Math.abs(H - r * sUse) + Math.abs(W - c * sUse);
      if (err < bestErr) {
        bestErr = err;
        best = { cols: c, rows: r, s: sUse };
      }
    }

    if (best && bestErr < EPS) {
      return best;
    }

    // Full cover, uniform squares: c·s = W, r = ceil(H/s) → r·s ≥ H
    const cMid = Math.max(1, Math.round(W / t));
    let minOver = Infinity;
    let pick = null;
    for (let c = Math.max(1, cMid - 60); c <= cMid + 60; c++) {
      if (c > cMax) break;
      const s = W / c;
      if (s < 2.5) continue;
      const r = Math.max(1, Math.ceil((H - 1e-6) / s));
      const over = r * s - H;
      if (over < minOver) {
        minOver = over;
        pick = { cols: c, rows: r, s };
      }
    }

    if (pick) {
      return pick;
    }

    const c = Math.max(1, cMid);
    const s = W / c;
    const r = Math.max(1, Math.ceil((H - 1e-6) / s));
    return { cols: c, rows: r, s };
  }

  window.fitSquareMosaicGrid = fitSquareMosaicGrid;
})();
