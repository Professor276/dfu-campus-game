/* ==========================================================
   DFU CAMPUS ENGINE
   Runs a month like this:
     entrance scene -> intro dialogue -> stages (identify, place,
     handle, inspect) -> ending dialogue -> results.
   You should rarely need to edit this file. To change content,
   edit config.js or a file in /months.
   ========================================================== */
(function () {
  'use strict';

  var CFG = window.DFU_CONFIG;
  var ART = window.DFU_ART;
  var months = [];
  var run = null; // everything about the game currently being played

  /* ---------- Small helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function shuffle(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }
  function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmtTime(ms) {
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /* ---------- Saved progress (stays in this browser only) ---------- */
  function loadSave() {
    try {
      var raw = localStorage.getItem(CFG.storageKey);
      if (raw) {
        var s = JSON.parse(raw);
        s.best = s.best || {};
        s.achievements = s.achievements || {};
        s.settings = s.settings || {};
        return s;
      }
    } catch (e) { /* storage blocked: the game still works, it just won't remember */ }
    return { best: {}, achievements: {}, settings: {} };
  }
  var save = loadSave();
  function writeSave() {
    try { localStorage.setItem(CFG.storageKey, JSON.stringify(save)); } catch (e) { }
  }

  /* ---------- Sound (optional, off with the Sound button) ---------- */
  var actx = null;
  function tone(freq, dur, type, delay, vol) {
    if (save.settings.muted) return;
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
      }
      var t = actx.currentTime + (delay || 0);
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.07, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + dur);
    } catch (e) { }
  }
  var SFX = {
    alarm: function () { for (var i = 0; i < 4; i++) tone(i % 2 ? 660 : 880, 0.18, 'square', i * 0.22, 0.05); },
    snap:  function () { tone(220, 0.08, 'square', 0, 0.08); tone(440, 0.1, 'triangle', 0.05, 0.06); },
    good:  function () { tone(523, 0.12, 'triangle', 0, 0.07); tone(784, 0.18, 'triangle', 0.1, 0.07); },
    bad:   function () { tone(180, 0.25, 'sawtooth', 0, 0.05); },
    win:   function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.22, 'triangle', i * 0.14, 0.07); }); }
  };
  function sfx(name) { if (SFX[name]) SFX[name](); }
  function renderMute() {
    var b = $('mute'), muted = !!save.settings.muted;
    b.textContent = 'Sound: ' + (muted ? 'off' : 'on');
    b.setAttribute('aria-pressed', muted ? 'true' : 'false');
  }

  /* ---------- Screens ---------- */
  var SCREENS = ['entrance', 'dialogue', 'game', 'results'];
  function showScreen(name) {
    SCREENS.forEach(function (s) { $('screen-' + s).classList.toggle('active', s === name); });
    window.scrollTo(0, 0);
  }
  function makeButton(text, onClick, cls) {
    var b = el('button', cls, text);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }
  // Lets dialogue say things like "You scored {score} points".
  function fill(text) {
    if (!run) return text;
    var vals = { score: fmtNum(run.score), accuracy: run.accuracy, time: fmtTime(clock.elapsed) };
    return String(text).replace(/\{(\w+)\}/g, function (m, k) { return vals[k] !== undefined ? vals[k] : m; });
  }

  /* ---------- The clock (pauses while the player reads) ---------- */
  var clock = { running: false, last: 0, elapsed: 0, timer: null };
  function remainingMs() { return Math.max(0, CFG.timeLimitSeconds * 1000 - clock.elapsed); }
  function tick() {
    if (!clock.running) return;
    var now = Date.now();
    clock.elapsed += now - clock.last;
    clock.last = now;
    renderClock();
  }
  function renderClock() {
    var left = remainingMs();
    $('clock').textContent = fmtTime(Math.ceil(left / 1000) * 1000);
    var late = left === 0;
    $('clock-label').textContent = late ? 'The boss is here. No more time bonus. Take your time.' : 'Boss returns in';
    $('clock').parentNode.classList.toggle('late', late);
  }
  function clockReset() {
    if (clock.timer) clearInterval(clock.timer);
    clock = { running: false, last: 0, elapsed: 0, timer: null };
  }
  function clockStart() {
    clockReset();
    clock.running = true;
    clock.last = Date.now();
    clock.timer = setInterval(tick, 250);
    renderClock();
  }
  function clockPause() { if (clock.running) { tick(); clock.running = false; } }
  function clockResume() { if (clock.timer && !clock.running) { clock.running = true; clock.last = Date.now(); } }
  function clockStop() { clockPause(); if (clock.timer) clearInterval(clock.timer); clock.timer = null; }

  /* ---------- Score ---------- */
  function updateScore() { $('hud-score').textContent = fmtNum(run.score); }
  function addScore(label, pts) {
    pts = Math.round(pts);
    if (!pts) return;
    var before = run.score;
    run.score = Math.max(0, run.score + pts);
    run.lines.push({ label: label, pts: run.score - before });
    updateScore();
  }
  // Records one scored decision. firstTry = got it right with no wrong guesses.
  function decide(firstTry) {
    run.decisions++;
    if (firstTry) run.firstTry++;
  }
  function pointsFor(base, firstTry) { return firstTry ? base : base * CFG.scoring.retryFraction; }

  /* ---------- Feedback panel (the clock waits while it is open) ---------- */
  function feedback(kind, title, text, onNext, btnText) {
    clockPause();
    var f = $('feedback');
    f.className = 'feedback ' + kind;
    f.hidden = false;
    $('fb-title').textContent = (kind === 'good' ? '✓ ' : kind === 'bad' ? '✗ ' : '') + title;
    $('fb-text').textContent = text;
    var b = $('fb-next');
    b.textContent = btnText || 'Continue';
    b.onclick = function () {
      f.hidden = true;
      clockResume();
      if (onNext) onNext();
    };
    b.focus();
  }
  function setPrompt(text) {
    var p = $('prompt');
    p.innerHTML = '';
    if (text) p.appendChild(el('p', null, text));
  }

  /* ---------- Entrance (the hidden Easter egg) ---------- */
  function currentMonth() { return months[months.length - 1]; }

  function renderEntrance() {
    var m = currentMonth();
    var ent = m.entrance || {};
    $('entrance-art').innerHTML = ART.entrance(ent);
    $('cue').textContent = ent.cue || '';
    var best = save.best[m.id];
    $('best').textContent = best ? 'Best score this month: ' + fmtNum(best.score) : '';
    showScreen('entrance');
  }

  /* ---------- Dialogue ---------- */
  function renderSpeaker(n) {
    var box = $('char');
    box.innerHTML = '';
    var ch = CFG.characters[n.speaker];
    if (!ch || n.speaker === 'narrator') return;
    var mood = n.mood || 'neutral';
    var src = ch.images && (ch.images[mood] || ch.images.neutral);
    if (src) {
      var img = new Image();
      img.alt = ch.name;
      img.onerror = function () { box.innerHTML = ART.character(n.speaker, mood); };
      img.src = src;
      box.appendChild(img);
    } else {
      box.innerHTML = ART.character(n.speaker, mood);
    }
  }

  // nodes: { start: {speaker, mood, text, caption, alert, scene, sound, choices:[{text,next}], next, button}, ... }
  // A node with no "next" and no "choices" ends the conversation.
  function runDialogue(nodes, done) {
    var id = 'start';
    function show() {
      var n = nodes && nodes[id];
      if (!n) {
        if (nodes) console.warn('DFU: dialogue node not found: ' + id);
        return done();
      }
      var ds = $('dscene');
      ds.innerHTML = '';
      if (n.scene === 'exhibit' || n.scene === 'exhibit-lit') renderExhibit(ds, run.month, run.placedAt, n.scene === 'exhibit-lit');
      renderSpeaker(n);
      var nm = (CFG.characters[n.speaker] || {}).name || '';
      $('speaker').textContent = nm;
      $('speaker').hidden = !nm;
      $('caption').textContent = n.caption || '';
      $('caption').hidden = !n.caption;
      $('alert').textContent = n.alert || '';
      $('alert').hidden = !n.alert;
      var t = $('dtext');
      t.textContent = fill(n.text || '');
      t.className = n.speaker === 'narrator' ? 'narration' : '';
      if (n.sound) sfx(n.sound);
      var box = $('choices');
      box.innerHTML = '';
      if (n.choices && n.choices.length) {
        n.choices.forEach(function (c) {
          box.appendChild(makeButton(fill(c.text), function () { go(c.next); }));
        });
      } else {
        box.appendChild(makeButton(n.button || 'Continue', function () { go(n.next); }));
      }
    }
    function go(next) {
      if (!next) return done();
      id = next;
      show();
    }
    showScreen('dialogue');
    show();
  }

  /* ---------- The exhibit (used while playing and in the ending) ---------- */
  function placeBox(node, t) {
    node.style.left = t.x + '%';
    node.style.top = t.y + '%';
    node.style.width = t.w + '%';
    node.style.height = t.h + '%';
  }
  function renderExhibit(container, month, placedAt, lit) {
    container.innerHTML = '';
    var board = el('div', 'board static' + (lit ? ' lit' : ''));
    board.innerHTML = ART.frame();
    month.exhibit.targets.forEach(function (t) {
      var pid = Object.keys(placedAt).filter(function (k) { return placedAt[k] === t.id; })[0];
      if (!pid) return;
      var z = el('div', 'zone filled static');
      placeBox(z, t);
      z.style.animation = 'none';
      var art = el('div', 'zart');
      art.innerHTML = ART.bone(month.pieces[pid].art);
      z.appendChild(art);
      board.appendChild(z);
    });
    container.appendChild(board);
  }

  /* ---------- STAGE TYPE: identify ----------
     Tap the right piece for each clue. */
  var STAGES = {};

  STAGES.identify = function (st, done) {
    var m = run.month, stage = $('stage'), ids = shuffle(st.choices), i = 0;
    $('actions').innerHTML = '';

    function round() {
      if (i >= st.rounds.length) return done();
      var r = st.rounds[i], first = true;
      stage.innerHTML = '';
      var row = el('div', 'choice-row');
      stage.appendChild(row);
      setPrompt(r.clue);

      function pick(id, btn, cap) {
        if (id === r.answer) {
          run.identified[id] = true;
          decide(first);
          addScore('Correct identification: ' + m.pieces[id].name, pointsFor(CFG.scoring.identify, first));
          sfx('good');
          feedback('good', first ? 'Correct!' : 'Got it.', r.explain, function () { i++; round(); });
        } else {
          first = false;
          btn.disabled = true;
          btn.classList.add('wrong');
          cap.textContent = '✗ Not this one';
          sfx('bad');
          feedback('bad', 'Not quite.', r.hint);
        }
      }

      ids.forEach(function (id, idx) {
        var p = m.pieces[id];
        var b = el('button', 'card');
        b.type = 'button';
        b.dataset.id = id;
        b.setAttribute('aria-label', run.identified[id] ? p.name + ', already identified' : 'Piece ' + (idx + 1));
        b.innerHTML = ART.bone(p.art);
        var cap = el('span', 'cap', run.identified[id] ? '✓ ' + p.name : 'Piece ' + (idx + 1));
        b.appendChild(cap);
        if (run.identified[id]) b.disabled = true;
        b.addEventListener('click', function () { pick(id, b, cap); });
        row.appendChild(b);
      });
    }
    round();
  };

  /* ---------- STAGE TYPE: place ----------
     Tap a bone then tap where it goes (or drag it there). */
  STAGES.place = function (st, done) {
    var m = run.month, stage = $('stage');
    var wrongs = {}, zoneEls = {}, pieceEls = {};
    var selected = null, lastDrop = 0, left = st.pieces.length, drag = null;
    $('actions').innerHTML = '';
    setPrompt(st.prompt);
    stage.innerHTML = '';

    var board = el('div', 'board');
    board.innerHTML = ART.frame();
    stage.appendChild(board);

    var used = {};
    st.pieces.forEach(function (p) { used[p.target] = true; });
    m.exhibit.targets.filter(function (t) { return used[t.id]; }).forEach(function (t) {
      var z = el('button', 'zone');
      z.type = 'button';
      z.dataset.id = t.id;
      placeBox(z, t);
      z.setAttribute('aria-label', 'Place here: ' + t.label);
      z.appendChild(el('div', 'zart'));
      z.appendChild(el('span', 'zl', t.label));
      z.addEventListener('click', function () {
        if (Date.now() - lastDrop < 400) return; // ignore the click that follows a drag
        if (selected) attempt(selected, t.id);
        else setPrompt('Tap a bone first, then tap where it goes.');
      });
      zoneEls[t.id] = z;
      board.appendChild(z);
    });

    var tray = el('div', 'tray');
    stage.appendChild(tray);
    shuffle(st.pieces).forEach(function (p) {
      var piece = m.pieces[p.piece];
      var b = el('button', 'piece');
      b.type = 'button';
      b.dataset.piece = p.piece;
      b.innerHTML = ART.bone(piece.art);
      b.appendChild(el('span', null, piece.name));
      b.addEventListener('click', function () { select(p.piece); });
      b.addEventListener('pointerdown', function (e) { startDrag(e, p.piece, b); });
      pieceEls[p.piece] = b;
      tray.appendChild(b);
    });

    function select(id) {
      if (run.placedAt[id]) return;
      selected = id;
      Object.keys(pieceEls).forEach(function (k) { pieceEls[k].classList.toggle('selected', k === id); });
      setPrompt(st.prompt);
    }

    function attempt(pieceId, targetId) {
      var spec = st.pieces.filter(function (p) { return p.piece === pieceId; })[0];
      if (!spec || run.placedAt[pieceId]) return;
      if (spec.target === targetId) {
        run.placedAt[pieceId] = targetId;
        var first = !wrongs[pieceId];
        var z = zoneEls[targetId];
        z.classList.add('filled');
        z.firstChild.innerHTML = ART.bone(m.pieces[pieceId].art);
        z.lastChild.textContent = m.pieces[pieceId].name;
        pieceEls[pieceId].remove();
        selected = null;
        decide(first);
        addScore('Correct placement: ' + m.pieces[pieceId].name, pointsFor(CFG.scoring.place, first));
        sfx('snap');
        left--;
        feedback('good', first ? 'Placed!' : 'Placed.', spec.correct, function () {
          if (left === 0) { cleanup(); done(); }
        });
      } else {
        wrongs[pieceId] = (wrongs[pieceId] || 0) + 1;
        sfx('bad');
        var pe = pieceEls[pieceId];
        pe.classList.remove('shake');
        void pe.offsetWidth; // restart the shake animation
        pe.classList.add('shake');
        feedback('bad', 'Not there.', spec.hint);
      }
    }

    // ----- Dragging (mouse and touch) -----
    function zoneAt(x, y) {
      var u = document.elementFromPoint(x, y);
      return u && u.closest ? u.closest('.zone') : null;
    }
    function startDrag(e, id, b) {
      if (run.placedAt[id]) return;
      select(id);
      drag = { id: id, el: b, x: e.clientX, y: e.clientY, ghost: null };
    }
    function onMove(e) {
      if (!drag) return;
      if (!drag.ghost) {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
        drag.ghost = drag.el.cloneNode(true);
        drag.ghost.classList.add('ghost');
        document.body.appendChild(drag.ghost);
      }
      drag.ghost.style.left = e.clientX + 'px';
      drag.ghost.style.top = e.clientY + 'px';
      Object.keys(zoneEls).forEach(function (k) { zoneEls[k].classList.remove('over'); });
      var z = zoneAt(e.clientX, e.clientY);
      if (z) z.classList.add('over');
    }
    function onUp(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      Object.keys(zoneEls).forEach(function (k) { zoneEls[k].classList.remove('over'); });
      if (d.ghost) {
        d.ghost.remove();
        lastDrop = Date.now();
        var z = zoneAt(e.clientX, e.clientY);
        if (z) attempt(d.id, z.dataset.id);
      }
    }
    function cleanup() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  };

  /* ---------- STAGE TYPE: handle ----------
     The fragile specimen. Tapping it triggers the warning, then a choice. */
  STAGES.handle = function (st, done) {
    var m = run.month, stage = $('stage'), actions = $('actions');
    var piece = m.pieces[st.piece];
    actions.innerHTML = '';
    stage.innerHTML = '';
    setPrompt(st.setup);

    var scene = el('div', 'handle-scene');
    var spec = el('button', 'specimen');
    spec.type = 'button';
    spec.setAttribute('aria-label', 'Specimen from the last crate. Tap to pick it up.');
    spec.innerHTML = ART.bone(piece.art);
    spec.appendChild(el('div', 'placard', st.placard));
    scene.appendChild(spec);
    stage.appendChild(scene);

    spec.addEventListener('click', function () {
      spec.disabled = true;
      spec.classList.add('rush');
      sfx('bad');
      clockPause();
      setTimeout(function () {
        runDialogue(st.warning, function () {
          showScreen('game');
          clockResume();
          showChoices();
        });
      }, 450);
    });

    function showChoices() {
      setPrompt(st.question);
      actions.innerHTML = '';
      st.choices.forEach(function (c) {
        actions.appendChild(makeButton(c.text, function () {
          if (c.careless) {
            run.careless++;
            addScore('Careless handling', CFG.scoring.carelessPenalty);
            sfx('bad');
            feedback('bad', 'Careless handling!', c.feedback, showChoices, 'Try again');
          } else {
            var first = run.careless === 0;
            decide(first);
            addScore('Careful handling of the real specimen', pointsFor(CFG.scoring.handling, first));
            run.placedAt[st.piece] = st.cradle;
            sfx('good');
            actions.innerHTML = '';
            feedback('good', 'Careful hands.', c.feedback, done);
          }
        }));
      });
    }
  };

  /* ---------- STAGE TYPE: inspect ----------
     Optional. Reveals a fact for bonus points. */
  STAGES.inspect = function (st, done) {
    var stage = $('stage'), actions = $('actions');
    renderExhibit(stage, run.month, run.placedAt, false);
    setPrompt(st.prompt);
    actions.innerHTML = '';
    actions.appendChild(makeButton('Inspect specimen', function () {
      actions.innerHTML = '';
      run.inspected = true;
      addScore('Inspection discovery', CFG.scoring.inspect);
      sfx('good');
      feedback('good', 'Good eye.', st.fact, done);
    }));
    actions.appendChild(makeButton('Finish the exhibit', function () { actions.innerHTML = ''; done(); }, 'secondary'));
  };

  /* ---------- Month flow ---------- */
  function startMonth(month) {
    run = {
      month: month, score: 0, lines: [], decisions: 0, firstTry: 0, careless: 0,
      placedAt: {}, identified: {}, inspected: false, accuracy: 0
    };
    clockReset();
    $('feedback').hidden = true;
    runDialogue(month.intro, beginGame);
  }

  function beginGame() {
    showScreen('game');
    updateScore();
    clockStart();
    runStages(0);
  }

  function runStages(i) {
    var st = run.month.stages[i];
    if (!st) return finishGame();
    $('hud-stage').textContent = st.label;
    STAGES[st.type](st, function () { runStages(i + 1); });
  }

  function finishGame() {
    clockStop();
    var S = CFG.scoring;
    addScore('Exhibit finished', S.finish);
    if (run.careless === 0) addScore('No careless handling', S.noCareless);
    var tb = Math.round((S.timeBonusMax * remainingMs() / (CFG.timeLimitSeconds * 1000)) / 10) * 10;
    addScore('Time bonus', tb);
    run.accuracy = run.decisions ? Math.round(run.firstTry / run.decisions * 100) : 0;
    sfx('win');
    runDialogue(run.month.ending, showResults);
  }

  /* ---------- Results ---------- */
  function rankFor(score) {
    for (var i = 0; i < CFG.ranks.length; i++) if (score >= CFG.ranks[i].min) return CFG.ranks[i].title;
    return '';
  }

  function showResults() {
    var m = run.month;
    var result = { monthId: m.id, score: run.score, accuracy: run.accuracy, careless: run.careless, elapsedMs: clock.elapsed, inspected: run.inspected };

    var prev = save.best[m.id];
    var newBest = !prev || result.score > prev.score;
    if (newBest) save.best[m.id] = { score: result.score, accuracy: result.accuracy, elapsedMs: result.elapsedMs };

    var all = (CFG.achievements || []).concat(m.achievements || []);
    var fresh = [];
    all.forEach(function (a) {
      if (save.achievements[a.id]) return;
      var ok = false;
      try { ok = a.test(result); } catch (e) { console.warn('DFU: achievement test failed: ' + a.id); }
      if (ok) { save.achievements[a.id] = true; fresh.push(a); }
    });
    writeSave();

    $('r-score').textContent = fmtNum(run.score);
    $('r-rank').textContent = rankFor(run.score) + (newBest && prev ? '  (new best!)' : '');
    var stats = $('r-stats');
    stats.innerHTML = '';
    [
      'Accuracy: ' + run.accuracy + '%',
      'Time: ' + fmtTime(clock.elapsed),
      'Campus section: ' + (m.campusSection || m.title)
    ].forEach(function (s) { stats.appendChild(el('li', null, s)); });

    var lines = $('r-lines');
    lines.innerHTML = '';
    run.lines.forEach(function (l) {
      var li = el('li');
      li.appendChild(el('span', null, l.label));
      li.appendChild(el('span', null, (l.pts > 0 ? '+' : '') + fmtNum(l.pts)));
      lines.appendChild(li);
    });
    if (!run.lines.length) lines.appendChild(el('li', null, 'No points this time.'));

    var prog = $('r-progress');
    prog.innerHTML = '';
    (m.progress || ['Before: crates and tape', 'During: bones installed', 'After: exhibit lit']).forEach(function (txt, i, arr) {
      prog.appendChild(el('div', 'step' + (i === arr.length - 1 ? ' on' : ''), (i === arr.length - 1 ? '✓ ' : '') + txt));
    });

    var teaser = $('r-teaser');
    teaser.innerHTML = ART.crate(true);
    teaser.appendChild(el('span', 'small', (m.teaser || 'Next campus section: coming soon.')));

    var list = $('r-ach');
    list.innerHTML = '';
    fresh.forEach(function (a) {
      var d = el('div', 'ach');
      d.appendChild(el('b', null, 'Achievement unlocked: ' + a.title));
      d.appendChild(el('div', 'small', a.desc));
      list.appendChild(d);
    });

    $('r-replay').onclick = function () { startMonth(m); };
    $('r-home').onclick = renderEntrance;
    showScreen('results');
  }

  /* ---------- Public API ---------- */
  window.DFU = {
    registerMonth: function (m) {
      months = months.filter(function (x) { return x.id !== m.id; });
      months.push(m);
      months.sort(function (a, b) { return a.id - b.id; });
    },
    start: function () {
      renderMute();
      $('mute').addEventListener('click', function () {
        save.settings.muted = !save.settings.muted;
        writeSave();
        renderMute();
      });
      $('scene-btn').addEventListener('click', function () { startMonth(currentMonth()); });

      // Two taps to reset (browser pop-up dialogs are blocked in some places)
      var resetBtn = $('reset-btn'), resetTimer = null;
      resetBtn.addEventListener('click', function () {
        if (!resetTimer) {
          resetBtn.textContent = 'Tap again to erase your progress';
          resetTimer = setTimeout(function () { resetBtn.textContent = 'Reset progress'; resetTimer = null; }, 4000);
          return;
        }
        clearTimeout(resetTimer);
        resetTimer = null;
        resetBtn.textContent = 'Reset progress';
        save = { best: {}, achievements: {}, settings: save.settings };
        writeSave();
        renderEntrance();
      });
      renderEntrance();
    },
    _debug: { state: function () { return run; }, months: function () { return months; } }
  };
})();
