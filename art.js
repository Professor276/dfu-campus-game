/* ==========================================================
   DFU CAMPUS ART (PLACEHOLDER DRAWINGS)
   Every picture in the game is drawn here with simple shapes so the
   game works with zero image files. When you have real art, you can
   replace these. See README.md ("Adding your real art").
   ========================================================== */
window.DFU_ART = (function () {
  'use strict';

  var BONE = '#eadfc8', OUT = '#2b1a10', GOLD = '#c9a24b', CRIMSON = '#6d0f24', BURG = '#4a0d1c', WOOD = '#7a5233';

  function svg(viewBox, inner, label, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '"' + (extra || '') +
      (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + inner + '</svg>';
  }

  /* ---------- Bones ---------- */
  var BONES = {
    skull: ['0 0 120 80',
      '<path d="M64 30C70 4 112 2 116 36C118 60 96 74 68 58Z" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5"/>' +
      '<path d="M64 30L30 36Q10 44 12 54L22 62L64 60Z" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M58 30L40 6L52 32Z" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M68 28L52 2L64 30Z" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M22 40L16 22L30 38Z" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="48" cy="42" r="3.5" fill="' + OUT + '"/>'],
    rib: ['0 0 60 120',
      '<path d="M42 6C10 30 8 90 34 114" fill="none" stroke="' + OUT + '" stroke-width="15" stroke-linecap="round"/>' +
      '<path d="M42 6C10 30 8 90 34 114" fill="none" stroke="' + BONE + '" stroke-width="9" stroke-linecap="round"/>'],
    femur: ['0 0 60 130',
      '<rect x="22" y="26" width="16" height="78" rx="6" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5"/>' +
      '<circle cx="38" cy="20" r="13" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5"/>' +
      '<circle cx="23" cy="110" r="11" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5"/>' +
      '<circle cx="38" cy="112" r="11" fill="' + BONE + '" stroke="' + OUT + '" stroke-width="2.5"/>' +
      '<rect x="22" y="94" width="16" height="12" fill="' + BONE + '"/>'],
    // Rougher, darker, cracked look: this is the "fragile original" piece
    specimen: ['0 0 130 70',
      '<path d="M10 35C8 20 22 12 34 18L50 16L66 22L84 14L104 20C122 20 126 40 112 48L96 46L84 54L62 50L44 56L26 52C12 54 8 44 10 35Z" fill="#8a6f55" stroke="#3b2a1c" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M44 18L50 30L46 40M84 16L78 30L86 44" fill="none" stroke="#3b2a1c" stroke-width="2"/>']
  };

  function bone(name, label) {
    var b = BONES[name];
    return b ? svg(b[0], b[1], label) : '';
  }

  /* ---------- Cartoon people (placeholder look) ---------- */
  function worker(awake) {
    var eyes = awake
      ? '<circle cx="90" cy="70" r="3.5" fill="#1a0a0a"/><circle cx="110" cy="70" r="3.5" fill="#1a0a0a"/><ellipse cx="100" cy="85" rx="6" ry="5" fill="#1a0a0a"/>'
      : '<path d="M84 71q6 5 12 0M104 71q6 5 12 0" fill="none" stroke="#1a0a0a" stroke-width="2.5" stroke-linecap="round"/><path d="M94 86q6 3 12 0" fill="none" stroke="#1a0a0a" stroke-width="2.5" stroke-linecap="round"/>';
    var head = '<g' + (awake ? '' : ' transform="rotate(14 100 94)"') + '>' +
      '<circle cx="100" cy="68" r="26" fill="#b98560"/>' + eyes +
      '<path d="M72 62C74 38 126 38 128 62Z" fill="' + CRIMSON + '" stroke="' + GOLD + '" stroke-width="2"/>' +
      '<rect x="98" y="58" width="42" height="8" rx="4" fill="' + BURG + '"/>' +
      '<text x="100" y="54" font-size="12" font-weight="700" fill="' + GOLD + '" text-anchor="middle" font-family="Georgia,serif">PPS</text></g>';
    var arms = awake
      ? '<rect x="40" y="70" width="20" height="58" rx="10" fill="#e08a1e" transform="rotate(-25 50 128)"/><rect x="140" y="70" width="20" height="58" rx="10" fill="#e08a1e" transform="rotate(25 150 128)"/>'
      : '<rect x="46" y="100" width="20" height="56" rx="10" fill="#e08a1e"/><rect x="134" y="100" width="20" height="56" rx="10" fill="#e08a1e"/>';
    var zzz = awake ? '' : '<text x="136" y="40" font-size="20" font-weight="700" fill="#f3e9d8" font-family="Georgia,serif">Z</text><text x="150" y="26" font-size="15" font-weight="700" fill="#f3e9d8" font-family="Georgia,serif">z</text>';
    return svg('0 0 200 220',
      '<rect x="78" y="176" width="100" height="26" rx="8" fill="#35405a"/>' +
      '<rect x="168" y="172" width="22" height="34" rx="6" fill="#1a0a0a"/>' +
      '<rect x="62" y="90" width="76" height="92" rx="12" fill="#e08a1e"/>' +
      '<rect x="62" y="122" width="76" height="9" fill="#f3e9d8" opacity=".85"/>' + arms + head + zzz,
      awake ? 'Construction worker, awake' : 'Construction worker, asleep');
  }

  function boss() {
    return svg('0 0 200 220',
      '<rect x="74" y="170" width="20" height="44" rx="5" fill="#1a1a22"/><rect x="106" y="170" width="20" height="44" rx="5" fill="#1a1a22"/>' +
      '<rect x="60" y="86" width="80" height="96" rx="12" fill="#262633"/>' +
      '<path d="M88 86L100 112L112 86Z" fill="#f3e9d8"/><path d="M97 94h6l3 40l-6 8l-6-8Z" fill="' + CRIMSON + '"/>' +
      '<rect x="40" y="96" width="20" height="62" rx="10" fill="#262633"/><rect x="140" y="96" width="20" height="62" rx="10" fill="#262633"/>' +
      '<rect x="146" y="120" width="30" height="40" rx="3" fill="#c8b48a" stroke="' + OUT + '" stroke-width="2"/>' +
      '<circle cx="100" cy="62" r="26" fill="#d9a679"/>' +
      '<path d="M76 52C80 34 120 34 124 52C112 44 88 44 76 52Z" fill="#2b2b2b"/>' +
      '<path d="M84 64h10M106 64h10" stroke="#1a0a0a" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M90 80q10-5 20 0" fill="none" stroke="#1a0a0a" stroke-width="2.5" stroke-linecap="round"/>',
      'The boss');
  }

  function character(id, mood) {
    if (id === 'worker') return worker(mood !== 'asleep');
    if (id === 'boss') return boss();
    return '';
  }

  /* ---------- Props ---------- */
  function crestInner() {
    return '<circle cx="0" cy="0" r="16" fill="' + BURG + '" stroke="' + GOLD + '" stroke-width="2.5"/>' +
      '<text x="0" y="5" font-size="12" font-weight="700" fill="' + GOLD + '" text-anchor="middle" font-family="Georgia,serif">DFU</text>';
  }

  function crate(covered) {
    return svg('0 0 110 80',
      '<rect x="4" y="8" width="102" height="68" rx="3" fill="' + WOOD + '" stroke="' + OUT + '" stroke-width="3"/>' +
      '<path d="M4 30H106M4 54H106" stroke="' + OUT + '" stroke-width="2"/>' +
      '<path d="M4 8L106 76M106 8L4 76" stroke="#5a3a22" stroke-width="3"/>' +
      (covered
        ? '<path d="M0 12C20 2 90 2 110 12L104 70H6Z" fill="#8c8578" stroke="' + OUT + '" stroke-width="2.5"/><text x="55" y="48" font-size="22" font-weight="700" fill="#2a2620" text-anchor="middle" font-family="Georgia,serif">?</text>'
        : '<g transform="translate(55 42)">' + crestInner() + '</g>'),
      covered ? 'Covered crate for next month' : 'Wooden fossil crate with the DFU crest');
  }

  function crest() {
    return svg('-20 -20 40 40', crestInner(), 'DFU crest');
  }

  /* ---------- The exhibit frame (board background) ---------- */
  function frame() {
    return svg('0 0 160 90',
      '<rect x="0" y="80" width="160" height="10" fill="#2a1a14"/>' +
      '<rect x="8" y="76" width="144" height="6" rx="2" fill="' + WOOD + '"/>' +
      '<path d="M40 60V76M100 60V76M124 52V76" stroke="#bdb5a6" stroke-width="2"/>' +
      '<path d="M12 46C12 34 24 28 38 30L58 28C80 24 106 26 114 38L146 54L116 52C112 62 112 70 108 72L98 72L98 58L66 58L62 72L50 72L48 56L36 58C20 60 12 54 12 46Z" fill="rgba(201,162,75,.07)" stroke="' + GOLD + '" stroke-width="0.9" stroke-dasharray="3 3"/>' +
      '<circle cx="112" cy="46" r="2.4" fill="' + GOLD + '"/>',
      null, ' class="frame-art" preserveAspectRatio="xMidYMid meet"');
  }

  /* ---------- Entrance scene (the Easter egg) ---------- */
  function entrance(opts) {
    var sign = (opts && opts.sign) || 'DFU CAMPUS — UNDER CONSTRUCTION';
    return svg('0 0 400 260',
      '<defs><pattern id="tape" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="16" fill="' + GOLD + '"/><rect x="8" width="8" height="16" fill="#1a0a0a"/></pattern></defs>' +
      '<rect width="400" height="260" fill="' + BURG + '"/>' +
      '<rect y="200" width="400" height="60" fill="#3a2a22"/><path d="M0 222H400M0 244H400" stroke="#2a1c16" stroke-width="2"/>' +
      '<path d="M26 40V200M374 40V200M26 90H374M26 150H374" stroke="#6b5a4a" stroke-width="4" opacity=".6"/>' +
      '<path d="M120 50V30M280 50V30" stroke="#bdb5a6" stroke-width="2"/>' +
      '<rect x="60" y="48" width="280" height="16" fill="url(#tape)"/>' +
      '<rect x="60" y="64" width="280" height="44" rx="3" fill="#1a0a0a" stroke="' + GOLD + '" stroke-width="3"/>' +
      '<text x="200" y="92" font-size="17" font-weight="700" fill="' + GOLD + '" text-anchor="middle" font-family="Georgia,serif" textLength="256" lengthAdjust="spacingAndGlyphs">' + sign + '</text>' +
      '<svg x="24" y="146" width="118" height="86" viewBox="0 0 110 80">' + BONES_FREE_CRATE() + '</svg>' +
      '<svg x="130" y="108" width="132" height="146" viewBox="0 0 200 220">' + inner(worker(false)) + '</svg>' +
      '<g transform="translate(268 210)" stroke="' + GOLD + '" stroke-width="1.6" fill="none" opacity=".9">' +
        '<path d="M0 0H110M10 0V-24M96 0V-24"/><path d="M20 -22C40 -50 62 -50 80 -22" stroke="#eadfc8" stroke-width="5" stroke-linecap="round"/><path d="M30 -20C46 -40 62 -40 74 -20" stroke="#eadfc8" stroke-width="5" stroke-linecap="round"/></g>' +
      '<rect y="236" width="400" height="14" fill="url(#tape)" opacity=".9"/>',
      'Sign reads: ' + sign + '. A construction worker sleeps beside a fossil crate.');
  }
  function inner(s) { return s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); }
  function BONES_FREE_CRATE() { return inner(crate(false)); }

  return {
    bone: bone, character: character, crate: crate, crest: crest, frame: frame, entrance: entrance
  };
})();
