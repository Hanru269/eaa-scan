// WCAG contrast maths, shared by the checker page and the tests.
(function (root, factory) { if (typeof module === 'object' && module.exports) module.exports = factory(); else root.Contrast = factory(); })(this, function () {
  const norm = (h) => { h = String(h).trim().replace(/^#/, ''); if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map((c) => c + c).join(''); return /^[0-9a-f]{6}$/i.test(h) ? '#' + h.toLowerCase() : null; };
  const hex2rgb = (h) => { h = norm(h).slice(1); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const rgb2hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  function fixColor(fg, bg, need) {
    const f = hex2rgb(fg), b = hex2rgb(bg), target = need + 0.05;
    const toward = lum(b) > 0.5 ? [0, 0, 0] : [255, 255, 255];
    for (let t = 0; t <= 1.0001; t += 0.01) { const c = f.map((v, i) => v + (toward[i] - v) * t); if (ratio(c, b) >= target) return { hex: rgb2hex(c), ratio: ratio(c.map(Math.round), b) }; }
    return { hex: rgb2hex(toward), ratio: ratio(toward, b) };
  }
  return { norm, hex2rgb, lum, ratio, rgb2hex, fixColor };
});
