// ── Article correctness ───────────────────────────────────────────────────────

const CORRECT = {
  nominativ: { der:['der','ein'],   die:['die','eine'],   das:['das','ein']   },
  akkusativ: { der:['den','einen'], die:['die','eine'],   das:['das','ein']   },
  dativ:     { der:['dem','einem'], die:['der','einer'],  das:['dem','einem'] },
  genitiv:   { der:['des','eines'], die:['der','einer'],  das:['des','eines'] }
};

const ARTICLE_LABEL = {
  der:'der',die:'die',das:'das',ein:'ein',eine:'eine',
  den:'den',einen:'einen',dem:'dem',einem:'einem',einer:'einer',
  des:'des',eines:'eines'
};

const SUFFIX_LABELS = { n:'-n', en:'-en', s:'-s', es:'-es', ns:'-ns', ens:'-ens' };

function isMono(word) { return (word.match(/[aeiouäöüAEIOUÄÖÜ]+/g)||[]).length === 1; }
function endsSibilant(word) { return /[sßzx]$/i.test(word) || /sch$/i.test(word); }
function correctSuffix(noun, caseType) {
  const gender = noun.a, text = noun.n, decl = noun.decl || 'strong';
  if (decl === 'weak') {
    return caseType === 'nominativ' ? null : (/e$/i.test(text) ? 'n' : 'en');
  }
  if (decl === 'mixed') {
    if (caseType === 'nominativ') return null;
    const weak = /e$/i.test(text) ? 'n' : 'en';
    return caseType === 'genitiv' ? weak + 's' : weak;
  }
  if (caseType !== 'genitiv') return null;
  if (gender === 'die') return null;
  return (isMono(text) || endsSibilant(text)) ? 'es' : 's';
}

// Which gender(s) each article string can represent, derived from CORRECT
// (e.g. "der" is nominativ-masculine AND dativ/genitiv-feminine).
const ARTICLE_GENDERS = {};
for (const caseTable of Object.values(CORRECT)) {
  for (const [genderKey, forms] of Object.entries(caseTable)) {
    const g = { der:'m', die:'f', das:'n' }[genderKey];
    forms.forEach(form => {
      (ARTICLE_GENDERS[form] ||= new Set()).add(g);
    });
  }
}
const GENDER_ORDER = ['m','f','n'];
for (const k in ARTICLE_GENDERS) {
  ARTICLE_GENDERS[k] = GENDER_ORDER.filter(g => ARTICLE_GENDERS[k].has(g)).join('-');
}

// ── Nouns ─────────────────────────────────────────────────────────────────────
const NOUNS = [
  {n:"Hund",a:"der",e:"dog"},{n:"Katze",a:"die",e:"cat"},{n:"Haus",a:"das",e:"house"},
  {n:"Buch",a:"das",e:"book"},{n:"Frau",a:"die",e:"woman"},{n:"Mann",a:"der",e:"man"},
  {n:"Kind",a:"das",e:"child"},{n:"Stadt",a:"die",e:"city"},{n:"Land",a:"das",e:"country"},
  {n:"Wasser",a:"das",e:"water"},{n:"Brot",a:"das",e:"bread"},{n:"Milch",a:"die",e:"milk"},
  {n:"Apfel",a:"der",e:"apple"},{n:"Baum",a:"der",e:"tree"},{n:"Blume",a:"die",e:"flower"},
  {n:"Tür",a:"die",e:"door"},{n:"Fenster",a:"das",e:"window"},{n:"Tisch",a:"der",e:"table"},
  {n:"Stuhl",a:"der",e:"chair"},{n:"Bett",a:"das",e:"bed"},{n:"Küche",a:"die",e:"kitchen"},
  {n:"Auto",a:"das",e:"car"},{n:"Straße",a:"die",e:"street"},{n:"Brücke",a:"die",e:"bridge"},
  {n:"Berg",a:"der",e:"mountain"},{n:"Fluss",a:"der",e:"river"},{n:"See",a:"der",e:"lake"},
  {n:"Meer",a:"das",e:"sea"},{n:"Sonne",a:"die",e:"sun"},{n:"Mond",a:"der",e:"moon"},
  {n:"Stern",a:"der",e:"star"},{n:"Himmel",a:"der",e:"sky"},{n:"Wolke",a:"die",e:"cloud"},
  {n:"Regen",a:"der",e:"rain"},{n:"Schnee",a:"der",e:"snow"},{n:"Wind",a:"der",e:"wind"},
  {n:"Feuer",a:"das",e:"fire"},{n:"Erde",a:"die",e:"earth"},{n:"Luft",a:"die",e:"air"},
  {n:"Herz",a:"das",e:"heart",decl:"mixed"},{n:"Hand",a:"die",e:"hand"},{n:"Kopf",a:"der",e:"head"},
  {n:"Auge",a:"das",e:"eye"},{n:"Ohr",a:"das",e:"ear"},{n:"Mund",a:"der",e:"mouth"},
  {n:"Nase",a:"die",e:"nose"},{n:"Haar",a:"das",e:"hair"},{n:"Stimme",a:"die",e:"voice"},
  {n:"Name",a:"der",e:"name",decl:"mixed"},{n:"Zeit",a:"die",e:"time"},{n:"Tag",a:"der",e:"day"},
  {n:"Nacht",a:"die",e:"night"},{n:"Jahr",a:"das",e:"year"},{n:"Stunde",a:"die",e:"hour"},
  {n:"Minute",a:"die",e:"minute"},{n:"Woche",a:"die",e:"week"},{n:"Monat",a:"der",e:"month"},
  {n:"Schule",a:"die",e:"school"},{n:"Universität",a:"die",e:"university"},{n:"Lehrer",a:"der",e:"teacher"},
  {n:"Schüler",a:"der",e:"student"},{n:"Freund",a:"der",e:"friend"},{n:"Freundin",a:"die",e:"girlfriend"},
  {n:"Familie",a:"die",e:"family"},{n:"Mutter",a:"die",e:"mother"},{n:"Vater",a:"der",e:"father"},
  {n:"Bruder",a:"der",e:"brother"},{n:"Schwester",a:"die",e:"sister"},{n:"Baby",a:"das",e:"baby"},
  {n:"Tier",a:"das",e:"animal"},{n:"Vogel",a:"der",e:"bird"},{n:"Fisch",a:"der",e:"fish"},
  {n:"Pferd",a:"das",e:"horse"},{n:"Kuh",a:"die",e:"cow"},{n:"Schwein",a:"das",e:"pig"},
  {n:"Schaf",a:"das",e:"sheep"},{n:"Maus",a:"die",e:"mouse"},{n:"Bär",a:"der",e:"bear",decl:"weak"},
  {n:"Wolf",a:"der",e:"wolf"},{n:"Fuchs",a:"der",e:"fox"},{n:"Löwe",a:"der",e:"lion"},
  {n:"Tiger",a:"der",e:"tiger"},{n:"Elefant",a:"der",e:"elephant"},{n:"Affe",a:"der",e:"monkey"},
  {n:"Schlange",a:"die",e:"snake"},{n:"Frosch",a:"der",e:"frog"},{n:"Fleisch",a:"das",e:"meat"},
  {n:"Käse",a:"der",e:"cheese"},{n:"Ei",a:"das",e:"egg"},{n:"Suppe",a:"die",e:"soup"},
  {n:"Kuchen",a:"der",e:"cake"},{n:"Zucker",a:"der",e:"sugar"},{n:"Salz",a:"das",e:"salt"},
  {n:"Pfeffer",a:"der",e:"pepper"},{n:"Öl",a:"das",e:"oil"},{n:"Wein",a:"der",e:"wine"},
  {n:"Bier",a:"das",e:"beer"},{n:"Kaffee",a:"der",e:"coffee"},{n:"Tee",a:"der",e:"tea"},
  {n:"Saft",a:"der",e:"juice"},{n:"Glas",a:"das",e:"glass"},{n:"Tasse",a:"die",e:"cup"},
  {n:"Teller",a:"der",e:"plate"},{n:"Messer",a:"das",e:"knife"},{n:"Gabel",a:"die",e:"fork"},
  {n:"Löffel",a:"der",e:"spoon"},{n:"Kleid",a:"das",e:"dress"},{n:"Hemd",a:"das",e:"shirt"},
  {n:"Hose",a:"die",e:"trousers"},{n:"Jacke",a:"die",e:"jacket"},{n:"Hut",a:"der",e:"hat"},
  {n:"Tasche",a:"die",e:"bag"},{n:"Schlüssel",a:"der",e:"key"},{n:"Lampe",a:"die",e:"lamp"},
  {n:"Uhr",a:"die",e:"clock"},{n:"Handy",a:"das",e:"mobile phone"},{n:"Computer",a:"der",e:"computer"},
  {n:"Bildschirm",a:"der",e:"screen"},{n:"Tastatur",a:"die",e:"keyboard"},{n:"Drucker",a:"der",e:"printer"},
  {n:"Telefon",a:"das",e:"telephone"},{n:"Radio",a:"das",e:"radio"},{n:"Fernseher",a:"der",e:"television"},
  {n:"Film",a:"der",e:"film"},{n:"Musik",a:"die",e:"music"},{n:"Lied",a:"das",e:"song"},
  {n:"Gitarre",a:"die",e:"guitar"},{n:"Klavier",a:"das",e:"piano"},{n:"Sport",a:"der",e:"sport"},
  {n:"Ball",a:"der",e:"ball"},{n:"Spiel",a:"das",e:"game"},{n:"Mannschaft",a:"die",e:"team"},
  {n:"Arbeit",a:"die",e:"work"},{n:"Beruf",a:"der",e:"profession"},{n:"Büro",a:"das",e:"office"},
  {n:"Geld",a:"das",e:"money"},{n:"Bank",a:"die",e:"bank"},{n:"Markt",a:"der",e:"market"},
  {n:"Laden",a:"der",e:"shop"},{n:"Rechnung",a:"die",e:"bill"},{n:"Zeitung",a:"die",e:"newspaper"},
  {n:"Brief",a:"der",e:"letter"},{n:"Paket",a:"das",e:"package"},{n:"Reise",a:"die",e:"journey"},
  {n:"Hotel",a:"das",e:"hotel"},{n:"Zimmer",a:"das",e:"room"},{n:"Garten",a:"der",e:"garden"},
  {n:"Park",a:"der",e:"park"},{n:"Wald",a:"der",e:"forest"},{n:"Dorf",a:"das",e:"village"},
  {n:"Kirche",a:"die",e:"church"},{n:"Krankenhaus",a:"das",e:"hospital"},{n:"Arzt",a:"der",e:"doctor"},
  {n:"Medizin",a:"die",e:"medicine"},{n:"Geschichte",a:"die",e:"history"},{n:"Welt",a:"die",e:"world"},
  {n:"Licht",a:"das",e:"light"},{n:"Farbe",a:"die",e:"color"},{n:"Leben",a:"das",e:"life"},
  {n:"Tod",a:"der",e:"death"},{n:"Traum",a:"der",e:"dream"},{n:"Idee",a:"die",e:"idea"},
  {n:"Frage",a:"die",e:"question"},{n:"Antwort",a:"die",e:"answer"},{n:"Problem",a:"das",e:"problem"},
  {n:"Fehler",a:"der",e:"mistake"},{n:"Erfolg",a:"der",e:"success"},{n:"Gefühl",a:"das",e:"feeling"},
  {n:"Wort",a:"das",e:"word"},{n:"Sprache",a:"die",e:"language"},{n:"Zahl",a:"die",e:"number"},
  {n:"Ziel",a:"das",e:"goal"},{n:"Weg",a:"der",e:"way"},{n:"Entscheidung",a:"die",e:"decision"},
  {n:"Geschenk",a:"das",e:"gift"},{n:"Erinnerung",a:"die",e:"memory"},{n:"Zukunft",a:"die",e:"future"},
  {n:"Anfang",a:"der",e:"beginning"},{n:"Ende",a:"das",e:"end"},{n:"Stück",a:"das",e:"piece"}
];

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas          = document.getElementById('canvas');
const searchInput     = document.getElementById('search-input');
const searchResultsEl = document.getElementById('search-results');
const bin             = document.getElementById('bin');
const uploadBtn       = document.getElementById('upload-btn');
const fileInput       = document.getElementById('file-input');
const loadingOverlay  = document.getElementById('loading-overlay');
const toast           = document.getElementById('toast');
const drawGhost       = document.getElementById('draw-ghost');
const selectGhost     = document.getElementById('select-ghost');
const btnAkkusativ    = document.getElementById('btn-akkusativ');
const btnDativ        = document.getElementById('btn-dativ');
const btnGenitiv      = document.getElementById('btn-genitiv');
const btnUndo         = document.getElementById('btn-undo');
const btnRedo         = document.getElementById('btn-redo');
const saveExerciseBtn = document.getElementById('save-exercise-btn');

// ── State ─────────────────────────────────────────────────────────────────────
let dragState      = null;
let allBlocks      = [];
let zones          = [];
let drawingCase    = null;
let drawStart      = null;
let selectedBlocks = new Set();
let selectedZones  = new Set();
let selectStart    = null;
let groupDragState = null;
let _blockIdSeq    = 0;
let _clipboard     = null;
let _pasteOffset   = 0;
let _ctxCursor     = { x: 0, y: 0 };
let _showCorrect   = true;

// ── History ───────────────────────────────────────────────────────────────────
let _history    = [];
let _histIdx    = -1;
let _noRecord   = false;  // suppress pushHistory during applySnapshot

function _snapshot() {
  return {
    blocks: allBlocks.map(b => ({
      id:            b._id,
      type:          b._meta.type,
      article:       b.dataset.article,
      suffix:        b._meta.type === 'suffix' ? b.dataset.suffix : null,
      nounData:      b._meta.type === 'noun' ? b._meta.data : null,
      left:          b.style.left,
      top:           b.style.top,
      className:     b.className,
      locked:        b.classList.contains('locked'),
      pairedId:      b._meta.paired ? b._meta.paired._id : null,
      suffixPairedId:b._meta.type === 'noun' ? (b._meta.suffixPaired ? b._meta.suffixPaired._id : null) : null
    })),
    zones: zones.map(z => ({ case: z.case, x: z.x, y: z.y, w: z.w, h: z.h, locked: z.el.classList.contains('locked') }))
  };
}

function pushHistory() {
  if (_noRecord) return;
  _history = _history.slice(0, _histIdx + 1);
  _history.push(_snapshot());
  if (_history.length > 60) _history.shift();
  _histIdx = _history.length - 1;
  _updateUndoRedo();
}

function _updateUndoRedo() {
  btnUndo.disabled = _histIdx <= 0;
  btnRedo.disabled = _histIdx >= _history.length - 1;
}

function _applySnapshot(snap) {
  _noRecord = true;
  // clear canvas
  allBlocks.forEach(b => { b.removeEventListener('mousedown', onBlockMouseDown); b.remove(); });
  allBlocks = [];
  zones.forEach(z => z.el.remove());
  zones = [];
  clearSelection();

  // rebuild blocks (no history push)
  const idMap = {};
  snap.blocks.forEach(bd => {
    const el = bd.type === 'noun'
      ? _makeNounBlock(bd.nounData, parseInt(bd.left), parseInt(bd.top), bd.locked)
      : bd.type === 'suffix'
        ? _makeSuffixBlock(bd.suffix, parseInt(bd.left), parseInt(bd.top))
        : _makeArticleBlock(bd.article, parseInt(bd.left), parseInt(bd.top));
    el._id = bd.id;
    el.className = bd.className;
    idMap[bd.id] = el;
  });
  // restore pairs
  snap.blocks.forEach(bd => {
    if (bd.pairedId && idMap[bd.pairedId]) {
      idMap[bd.id]._meta.paired = idMap[bd.pairedId];
    }
    if (bd.suffixPairedId && idMap[bd.suffixPairedId]) {
      idMap[bd.id]._meta.suffixPaired = idMap[bd.suffixPairedId];
    }
  });
  // rebuild zones
  snap.zones.forEach(zd => _makeZone(zd.case, zd.x, zd.y, zd.w, zd.h, zd.locked));
  _noRecord = false;
  _updateUndoRedo();
}

function doUndo() {
  if (_histIdx <= 0) return;
  _histIdx--;
  _applySnapshot(_history[_histIdx]);
}
function doRedo() {
  if (_histIdx >= _history.length - 1) return;
  _histIdx++;
  _applySnapshot(_history[_histIdx]);
}

btnUndo.addEventListener('click', doUndo);
btnRedo.addEventListener('click', doRedo);

// ── Toast ─────────────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, isError = false) {
  clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.className = isError ? 'error show' : 'show';
  _toastTimer = setTimeout(() => { toast.className = ''; }, 3500);
}

// ── Bin helper ────────────────────────────────────────────────────────────────
function isOverBin(el) {
  const er = el.getBoundingClientRect(), br = bin.getBoundingClientRect();
  return Math.hypot((er.left+er.width/2)-(br.left+br.width/2),(er.top+er.height/2)-(br.top+br.height/2)) < 44;
}

// ── Block factories (internal — no history push) ──────────────────────────────
function _makeNounBlock(noun, x, y, locked = false) {
  const el = document.createElement('div');
  el.className = 'block noun-block' + (locked ? ' locked' : '');
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.textContent = noun.n;
  el.dataset.type = 'noun'; el.dataset.article = noun.a;
  el._meta = { type: 'noun', data: noun, paired: null, suffixPaired: null };
  el._id = ++_blockIdSeq;
  if (!locked) el.addEventListener('mousedown', onBlockMouseDown);
  canvas.appendChild(el); allBlocks.push(el);
  return el;
}
function _makeArticleBlock(article, x, y) {
  const el = document.createElement('div');
  el.className = 'block article-block type-' + article;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  const label = document.createElement('span');
  label.className = 'art-label';
  label.textContent = ARTICLE_LABEL[article] || article;
  el.appendChild(label);
  el.dataset.type = 'article'; el.dataset.article = article; el.dataset.canvas = '1';
  el.dataset.genders = ARTICLE_GENDERS[article];
  el._meta = { type: 'article', data: { article }, paired: null };
  el._id = ++_blockIdSeq;
  el.addEventListener('mousedown', onBlockMouseDown);
  canvas.appendChild(el); allBlocks.push(el);
  return el;
}

// ── Public block creators (push history) ─────────────────────────────────────
function createNounBlock(noun, x, y) {
  const el = _makeNounBlock(noun, x, y);
  pushHistory();
  return el;
}
function createArticleBlock(article, x, y) {
  return _makeArticleBlock(article, x, y); // history pushed after drag ends
}
function _makeSuffixBlock(suffix, x, y) {
  const el = document.createElement('div');
  el.className = 'block suffix-block type-' + suffix;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  const label = document.createElement('span');
  label.className = 'suffix-label';
  label.textContent = SUFFIX_LABELS[suffix] || '-' + suffix;
  el.appendChild(label);
  el.dataset.type = 'suffix'; el.dataset.suffix = suffix; el.dataset.canvas = '1';
  el._meta = { type: 'suffix', data: { suffix }, paired: null };
  el._id = ++_blockIdSeq;
  el.addEventListener('mousedown', onBlockMouseDown);
  canvas.appendChild(el); allBlocks.push(el);
  return el;
}
function createSuffixBlock(suffix, x, y) {
  return _makeSuffixBlock(suffix, x, y);
}

// ── Delete helpers ────────────────────────────────────────────────────────────
function deleteBlock(el) {
  if (el._meta.type === 'suffix' && el._meta.paired) unpairSuffix(el);
  else if (el._meta.type === 'noun' && el._meta.suffixPaired) unpairSuffix(el._meta.suffixPaired);
  if (el._meta.paired) unpair(el);
  el.removeEventListener('mousedown', onBlockMouseDown);
  el.remove();
  allBlocks = allBlocks.filter(b => b !== el);
}
function deleteSelected() {
  selectedZones.forEach(z => { zones = zones.filter(zz => zz !== z); z.el.remove(); });
  selectedZones.clear();
  const toDelete = [...selectedBlocks];
  toDelete.forEach(b => {
    if (b._meta && b._meta.type === 'suffix' && b._meta.paired && !selectedBlocks.has(b._meta.paired)) unpairSuffix(b);
    else if (b._meta && b._meta.type === 'noun' && b._meta.suffixPaired && !selectedBlocks.has(b._meta.suffixPaired)) unpairSuffix(b._meta.suffixPaired);
    if (b._meta && b._meta.paired && !selectedBlocks.has(b._meta.paired)) unpair(b);
  });
  toDelete.forEach(b => {
    if (b.parentNode) { b.removeEventListener('mousedown', onBlockMouseDown); b.remove(); allBlocks = allBlocks.filter(x => x !== b); }
  });
  selectedBlocks.clear();
  reEvaluateAllPairs();
}

// ── Selection helpers ─────────────────────────────────────────────────────────
function clearSelection() {
  selectedBlocks.forEach(b => b.classList.remove('selected'));
  selectedBlocks.clear();
  selectedZones.forEach(z => z.el.classList.remove('zone-selected'));
  selectedZones.clear();
}
function isAnySelected() { return selectedBlocks.size > 0 || selectedZones.size > 0; }

function applyMarqueeSelection(sx, sy, ex, ey) {
  const minX = Math.min(sx,ex), maxX = Math.max(sx,ex);
  const minY = Math.min(sy,ey), maxY = Math.max(sy,ey);
  clearSelection();
  const cr = canvas.getBoundingClientRect();
  for (const b of allBlocks) {
    if (b.classList.contains('locked')) continue;
    const br = b.getBoundingClientRect();
    const bx = br.left - cr.left + br.width/2, by = br.top - cr.top + br.height/2;
    if (bx >= minX && bx <= maxX && by >= minY && by <= maxY) {
      selectedBlocks.add(b); b.classList.add('selected');
      if (b._meta.paired && !b._meta.paired.classList.contains('locked') && !selectedBlocks.has(b._meta.paired)) {
        selectedBlocks.add(b._meta.paired); b._meta.paired.classList.add('selected');
      }
      if (b._meta.suffixPaired && !b._meta.suffixPaired.classList.contains('locked') && !selectedBlocks.has(b._meta.suffixPaired)) {
        selectedBlocks.add(b._meta.suffixPaired); b._meta.suffixPaired.classList.add('selected');
      }
    }
  }
  for (const z of zones) {
    const handle = z.el.querySelector('.zone-handle');
    if (!handle) continue;
    const hr = handle.getBoundingClientRect();
    const hx = hr.left - cr.left + hr.width/2, hy = hr.top - cr.top + hr.height/2;
    if (hx >= minX && hx <= maxX && hy >= minY && hy <= maxY) {
      selectedZones.add(z); z.el.classList.add('zone-selected');
    }
  }
}

// ── Zone drawing activation ───────────────────────────────────────────────────
function activateDrawing(caseType) {
  drawingCase = drawingCase === caseType ? null : caseType;
  if (btnAkkusativ) btnAkkusativ.classList.toggle('active', drawingCase === 'akkusativ');
  if (btnDativ)     btnDativ.classList.toggle('active',     drawingCase === 'dativ');
  if (btnGenitiv)   btnGenitiv.classList.toggle('active',   drawingCase === 'genitiv');
  canvas.className = drawingCase ? 'drawing-' + drawingCase : '';
}
if (btnAkkusativ && btnDativ && btnGenitiv) {
  btnAkkusativ.addEventListener('click', () => activateDrawing('akkusativ'));
  btnDativ.addEventListener('click',     () => activateDrawing('dativ'));
  btnGenitiv.addEventListener('click',   () => activateDrawing('genitiv'));
}

// ── Zone factory (internal — used by both user drawing and applySnapshot) ─────
function _makeZone(caseType, x, y, w, h, locked = false) {
  const el = document.createElement('div');
  el.className = 'zone ' + caseType + (locked ? ' locked' : '');
  el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  const label = document.createElement('div');
  label.className = 'zone-label';
  label.textContent = { akkusativ:'Akkusativ', dativ:'Dativ', genitiv:'Genitiv' }[caseType] || caseType;
  el.appendChild(label);

  if (locked) {
    canvas.insertBefore(el, canvas.firstChild);
    zones.push({ el, case: caseType, x, y, w, h });
    reEvaluateAllPairs();
    return;
  }

  const handle = document.createElement('div');
  handle.className = 'zone-handle';
  handle.innerHTML = `<svg viewBox="0 0 12 12" fill="currentColor"><circle cx="3.5" cy="2" r="1"/><circle cx="8.5" cy="2" r="1"/><circle cx="3.5" cy="6" r="1"/><circle cx="8.5" cy="6" r="1"/><circle cx="3.5" cy="10" r="1"/><circle cx="8.5" cy="10" r="1"/></svg>`;
  el.appendChild(handle);

  const RESIZE_DIRS = [
    { cls:'rn',  top:true },
    { cls:'rne', top:true,  right:true },
    { cls:'re',             right:true },
    { cls:'rse', bottom:true, right:true },
    { cls:'rs',  bottom:true },
    { cls:'rsw', bottom:true, left:true },
    { cls:'rw',             left:true },
    { cls:'rnw', top:true,  left:true },
  ];
  const MIN_SIZE = 60;
  RESIZE_DIRS.forEach(({ cls, top: resizeTop, right: resizeRight, bottom: resizeBottom, left: resizeLeft }) => {
    const rh = document.createElement('div');
    rh.className = 'resize-handle ' + cls;
    rh.addEventListener('mousedown', ev => {
      ev.preventDefault(); ev.stopPropagation();
      clearSelection();
      const zd = zones.find(z => z.el === el);
      if (!zd) return;
      const startMX = ev.clientX, startMY = ev.clientY;
      const startX = zd.x, startY = zd.y, startW = zd.w, startH = zd.h;
      function onMove(mv) {
        const dx = mv.clientX - startMX, dy = mv.clientY - startMY;
        let nx = startX, ny = startY, nw = startW, nh = startH;
        if (resizeRight)  { nw = Math.max(MIN_SIZE, startW + dx); }
        if (resizeBottom) { nh = Math.max(MIN_SIZE, startH + dy); }
        if (resizeLeft)   { nw = Math.max(MIN_SIZE, startW - dx); nx = startX + startW - nw; }
        if (resizeTop)    { nh = Math.max(MIN_SIZE, startH - dy); ny = startY + startH - nh; }
        zd.x=nx; zd.y=ny; zd.w=nw; zd.h=nh;
        el.style.left=nx+'px'; el.style.top=ny+'px';
        el.style.width=nw+'px'; el.style.height=nh+'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        reEvaluateAllPairs();
        pushHistory();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
    el.appendChild(rh);
  });

  handle.addEventListener('contextmenu', ev => {
    ev.preventDefault(); ev.stopPropagation();
    const zd = zones.find(z => z.el === el);
    if (zd && !selectedZones.has(zd)) {
      clearSelection();
      selectedZones.add(zd); el.classList.add('zone-selected');
    }
    const cr = canvas.getBoundingClientRect();
    _ctxCursor = { x: ev.clientX - cr.left, y: ev.clientY - cr.top };
    _openCtxMenu(ev.clientX, ev.clientY);
  });

  handle.addEventListener('mousedown', ev => {
    ev.preventDefault(); ev.stopPropagation();
    // group drag if zone is selected
    const zd = zones.find(z => z.el === el);
    if (zd && selectedZones.has(zd) && isAnySelected()) {
      const snapshots  = [...selectedBlocks].map(b => ({ el:b, ox:parseInt(b.style.left), oy:parseInt(b.style.top) }));
      const zoneSnaps  = [...selectedZones].map(z => ({ zd:z, el:z.el, ox:parseInt(z.el.style.left), oy:parseInt(z.el.style.top) }));
      groupDragState = { startX:ev.clientX, startY:ev.clientY, snapshots, zoneSnaps };
      return;
    }
    // individual zone drag
    clearSelection();
    el.classList.add('dragging-zone');
    const cr = canvas.getBoundingClientRect();
    const offX = ev.clientX - cr.left - parseInt(el.style.left);
    const offY = ev.clientY - cr.top  - parseInt(el.style.top);
    function onMove(mv) {
      const nx = mv.clientX - cr.left - offX;
      const ny = mv.clientY - cr.top  - offY;
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
      const zd = zones.find(z => z.el === el);
      if (zd) { zd.x = nx; zd.y = ny; }
      const br = bin.getBoundingClientRect();
      const over = Math.hypot(mv.clientX-(br.left+br.width/2), mv.clientY-(br.top+br.height/2)) < 50;
      bin.classList.toggle('hover', over);
      el.classList.toggle('bin-hover', over);
    }
    function onUp(uv) {
      el.classList.remove('dragging-zone','bin-hover');
      bin.classList.remove('hover');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const br = bin.getBoundingClientRect();
      if (Math.hypot(uv.clientX-(br.left+br.width/2), uv.clientY-(br.top+br.height/2)) < 50) {
        zones = zones.filter(z => z.el !== el); el.remove();
      }
      reEvaluateAllPairs();
      pushHistory();
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  canvas.insertBefore(el, canvas.firstChild);
  zones.push({ el, case: caseType, x, y, w, h });
  reEvaluateAllPairs();
}

// ── Canvas mousedown — marquee OR zone-draw ───────────────────────────────────
canvas.addEventListener('mousedown', e => {
  if (e.target.closest('#sidebar') || e.target.closest('.block') || e.target.closest('.zone-handle') || e.target.closest('.resize-handle')) return;
  const cr = canvas.getBoundingClientRect();
  if (drawingCase) {
    e.preventDefault();
    const x = e.clientX - cr.left, y = e.clientY - cr.top;
    drawStart = { x, y, cr };
    drawGhost.className = drawingCase;
    drawGhost.style.display = 'block';
    drawGhost.style.left = x+'px'; drawGhost.style.top = y+'px';
    drawGhost.style.width = '0px'; drawGhost.style.height = '0px';
    return;
  }
  if (e.button !== 0) return;
  e.preventDefault();
  clearSelection();
  const x = e.clientX - cr.left, y = e.clientY - cr.top;
  selectStart = { x, y, cr };
  selectGhost.style.display = 'block';
  selectGhost.style.left = x+'px'; selectGhost.style.top = y+'px';
  selectGhost.style.width = '0px'; selectGhost.style.height = '0px';
  canvas.classList.add('selecting');
});

// ── Global mousemove ──────────────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  if (drawStart) {
    const cr = drawStart.cr;
    const cx = e.clientX - cr.left, cy = e.clientY - cr.top;
    drawGhost.style.left   = Math.min(cx, drawStart.x) + 'px';
    drawGhost.style.top    = Math.min(cy, drawStart.y) + 'px';
    drawGhost.style.width  = Math.abs(cx - drawStart.x) + 'px';
    drawGhost.style.height = Math.abs(cy - drawStart.y) + 'px';
    return;
  }
  if (selectStart) {
    const cr = selectStart.cr;
    const cx = e.clientX - cr.left, cy = e.clientY - cr.top;
    selectGhost.style.left   = Math.min(cx, selectStart.x) + 'px';
    selectGhost.style.top    = Math.min(cy, selectStart.y) + 'px';
    selectGhost.style.width  = Math.abs(cx - selectStart.x) + 'px';
    selectGhost.style.height = Math.abs(cy - selectStart.y) + 'px';
    return;
  }
  if (groupDragState) {
    const dx = e.clientX - groupDragState.startX;
    const dy = e.clientY - groupDragState.startY;
    groupDragState.snapshots.forEach(({ el, ox, oy }) => {
      el.style.left = (ox+dx)+'px'; el.style.top = (oy+dy)+'px';
    });
    groupDragState.zoneSnaps.forEach(({ zd, el: zel, ox, oy }) => {
      zd.x = ox+dx; zd.y = oy+dy;
      zel.style.left = zd.x+'px'; zel.style.top = zd.y+'px';
    });
    let over = false;
    groupDragState.snapshots.forEach(({ el }) => { if (isOverBin(el)) over = true; });
    // also check cursor directly — covers selections that contain only zones
    if (!over) {
      const br = bin.getBoundingClientRect();
      over = Math.hypot(e.clientX-(br.left+br.width/2), e.clientY-(br.top+br.height/2)) < 50;
    }
    bin.classList.toggle('hover', over);
    return;
  }
  if (!dragState) return;
  const { el, offX, offY, canvasRect, companion, companionOffX, companionOffY, companion2, companion2OffX, companion2OffY } = dragState;
  const nl = e.clientX - canvasRect.left - offX;
  const nt = e.clientY - canvasRect.top  - offY;
  el.style.left = nl+'px'; el.style.top = nt+'px';
  if (companion) { companion.style.left=(nl+companionOffX)+'px'; companion.style.top=(nt+companionOffY)+'px'; }
  if (companion2) { companion2.style.left=(nl+companion2OffX)+'px'; companion2.style.top=(nt+companion2OffY)+'px'; }
  bin.classList.toggle('hover', isOverBin(el));
});

// ── Global mouseup ────────────────────────────────────────────────────────────
document.addEventListener('mouseup', e => {
  if (drawStart) {
    const cr = drawStart.cr;
    const cx = e.clientX - cr.left, cy = e.clientY - cr.top;
    const x = Math.min(cx,drawStart.x), y = Math.min(cy,drawStart.y);
    const w = Math.abs(cx-drawStart.x), h = Math.abs(cy-drawStart.y);
    drawGhost.style.display = 'none';
    drawStart = null;
    if (w > 30 && h > 30) {
      _makeZone(drawingCase, x, y, w, h);
      pushHistory();
      activateDrawing(drawingCase); // deselect — toggles off since same case
    }
    return;
  }
  if (selectStart) {
    const cr = selectStart.cr;
    const cx = e.clientX - cr.left, cy = e.clientY - cr.top;
    applyMarqueeSelection(Math.min(cx,selectStart.x), Math.min(cy,selectStart.y), Math.max(cx,selectStart.x), Math.max(cy,selectStart.y));
    selectGhost.style.display = 'none';
    selectStart = null;
    canvas.classList.remove('selecting');
    return;
  }
  if (groupDragState) {
    bin.classList.remove('hover');
    let over = false;
    groupDragState.snapshots.forEach(({ el }) => { if (isOverBin(el)) over = true; });
    if (!over) {
      const br = bin.getBoundingClientRect();
      over = Math.hypot(e.clientX-(br.left+br.width/2), e.clientY-(br.top+br.height/2)) < 50;
    }
    if (over) deleteSelected(); else reEvaluateAllPairs();
    pushHistory();
    groupDragState = null;
    return;
  }
  if (!dragState) return;
  const { el, companion, companion2 } = dragState;
  el.classList.remove('dragging');
  if (companion) companion.classList.remove('dragging');
  if (companion2) companion2.classList.remove('dragging');
  bin.classList.remove('hover');
  if (isOverBin(el)) {
    if (companion) { el._meta.paired=null; companion._meta.paired=null; companion.remove(); allBlocks=allBlocks.filter(b=>b!==companion); }
    if (companion2) { el._meta.suffixPaired=null; companion2._meta.paired=null; companion2.remove(); allBlocks=allBlocks.filter(b=>b!==companion2); }
    deleteBlock(el);
  } else {
    if (companion || companion2) reEvaluateAllPairs(); else tryPair(el);
  }
  pushHistory();
  dragState = null;
});

// ── Drag logic ────────────────────────────────────────────────────────────────
function onBlockMouseDown(e) {
  if (drawingCase) return;
  e.preventDefault(); e.stopPropagation();
  const el = e.currentTarget;
  if (selectedBlocks.has(el) && isAnySelected()) {
    const snapshots = [...selectedBlocks].map(b => ({ el:b, ox:parseInt(b.style.left), oy:parseInt(b.style.top) }));
    const zoneSnaps = [...selectedZones].map(z => ({ zd:z, el:z.el, ox:parseInt(z.el.style.left), oy:parseInt(z.el.style.top) }));
    groupDragState = { startX:e.clientX, startY:e.clientY, snapshots, zoneSnaps };
    return;
  }
  clearSelection();
  let companion = null, companionOffX = 0, companionOffY = 0;
  let companion2 = null, companion2OffX = 0, companion2OffY = 0;
  if (el._meta.type === 'noun') {
    if (el._meta.paired) {
      companion = el._meta.paired;
      const nr = el.getBoundingClientRect(), cr2 = companion.getBoundingClientRect();
      companionOffX = cr2.left - nr.left; companionOffY = cr2.top - nr.top;
      companion.classList.add('dragging');
    }
    if (el._meta.suffixPaired) {
      companion2 = el._meta.suffixPaired;
      const nr = el.getBoundingClientRect(), sr = companion2.getBoundingClientRect();
      companion2OffX = sr.left - nr.left; companion2OffY = sr.top - nr.top;
      companion2.classList.add('dragging');
    }
  } else if (el._meta.type === 'suffix') {
    if (el._meta.paired) unpairSuffix(el);
  } else if (el._meta.paired) {
    unpair(el);
  }
  el.classList.add('dragging');
  const rect = el.getBoundingClientRect(), canvasRect = canvas.getBoundingClientRect();
  dragState = { el, offX:e.clientX-rect.left, offY:e.clientY-rect.top, canvasRect, companion, companionOffX, companionOffY, companion2, companion2OffX, companion2OffY };
}

// ── Pairing logic ─────────────────────────────────────────────────────────────
function reEvaluateNounMatch(nounEl) {
  const caseType = caseForNoun(nounEl);
  let anyWrong = false, anyCorrect = false;
  if (nounEl._meta.paired) {
    const artEl = nounEl._meta.paired;
    const c = (CORRECT[caseType][nounEl.dataset.article]||[]).includes(artEl.dataset.article);
    artEl.classList.remove('matched-correct','matched-wrong');
    artEl.classList.add(c ? 'matched-correct' : 'matched-wrong');
    c ? anyCorrect = true : anyWrong = true;
  }
  if (nounEl._meta.suffixPaired) {
    const sfxEl = nounEl._meta.suffixPaired;
    const c = correctSuffix(nounEl._meta.data, caseType) === sfxEl.dataset.suffix;
    sfxEl.classList.remove('matched-correct','matched-wrong');
    sfxEl.classList.add(c ? 'matched-correct' : 'matched-wrong');
    c ? anyCorrect = true : anyWrong = true;
  }
  const requiredSuffix = correctSuffix(nounEl._meta.data, caseType);
  if (requiredSuffix !== null && !nounEl._meta.suffixPaired) anyWrong = true;
  nounEl.classList.remove('matched-correct','matched-wrong');
  if (!_showCorrect) return;
  if (anyWrong) nounEl.classList.add('matched-wrong');
  else if (anyCorrect) nounEl.classList.add('matched-correct');
}

function tryPair(dropped) {
  const dr = dropped.getBoundingClientRect();
  for (const other of allBlocks) {
    if (other === dropped) continue;
    const types = [dropped._meta.type, other._meta.type].sort().join('-');
    const or = other.getBoundingClientRect();
    if (types === 'noun-suffix') {
      const suffixEl = dropped._meta.type === 'suffix' ? dropped : other;
      const nounEl   = dropped._meta.type === 'noun'   ? dropped : other;
      if (suffixEl._meta.paired || nounEl._meta.suffixPaired) continue;
      if (Math.hypot((dr.left+dr.width/2)-(or.left+or.width/2),(dr.top+dr.height/2)-(or.top+or.height/2)) < 90) {
        applyMatchSuffix(suffixEl, nounEl);
        return;
      }
    } else if (types === 'article-noun') {
      const articleEl = dropped._meta.type === 'article' ? dropped : other;
      const nounEl    = dropped._meta.type === 'noun'    ? dropped : other;
      if (articleEl._meta.paired || nounEl._meta.paired) continue;
      if (Math.hypot((dr.left+dr.width/2)-(or.left+or.width/2),(dr.top+dr.height/2)-(or.top+or.height/2)) < 90) {
        applyMatch(articleEl, nounEl);
        return;
      }
    }
  }
}
function applyMatch(articleEl, nounEl) {
  articleEl._meta.paired = nounEl; nounEl._meta.paired = articleEl;
  articleEl.style.left = (parseInt(nounEl.style.left)-88)+'px'; articleEl.style.top = nounEl.style.top;
  if (_showCorrect) reEvaluateNounMatch(nounEl);
}
function applyMatchSuffix(suffixEl, nounEl) {
  suffixEl._meta.paired = nounEl; nounEl._meta.suffixPaired = suffixEl;
  suffixEl.style.left = (parseInt(nounEl.style.left) + nounEl.offsetWidth + 4)+'px';
  suffixEl.style.top  = nounEl.style.top;
  if (_showCorrect) reEvaluateNounMatch(nounEl);
}
function unpair(el) {
  const p = el._meta.paired;
  if (p) {
    p._meta.paired = null;
    p.classList.remove('matched-correct','matched-wrong');
    if (p._meta.type !== 'noun') p.className = 'block article-block type-'+p.dataset.article;
    else reEvaluateNounMatch(p);
  }
  el._meta.paired = null;
  el.classList.remove('matched-correct','matched-wrong');
  if (el._meta.type !== 'noun') el.className = 'block article-block type-'+el.dataset.article;
  else reEvaluateNounMatch(el);
}
function unpairSuffix(suffixEl) {
  const nounEl = suffixEl._meta.paired;
  suffixEl._meta.paired = null;
  suffixEl.className = 'block suffix-block type-'+suffixEl.dataset.suffix;
  suffixEl.classList.remove('matched-correct','matched-wrong');
  if (nounEl) { nounEl._meta.suffixPaired = null; reEvaluateNounMatch(nounEl); }
}

// ── Zone hit-test ─────────────────────────────────────────────────────────────
function caseForNoun(nounEl) {
  const nr = nounEl.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
  const nx = nr.left-cr.left+nr.width/2, ny = nr.top-cr.top+nr.height/2;
  for (let i = zones.length-1; i >= 0; i--) {
    const z = zones[i];
    if (nx>=z.x && nx<=z.x+z.w && ny>=z.y && ny<=z.y+z.h) return z.case;
  }
  return 'nominativ';
}
function reEvaluateAllPairs() {
  for (const b of allBlocks) {
    if (b._meta.type === 'noun') {
      if (b._meta.paired || b._meta.suffixPaired) reEvaluateNounMatch(b);
      else b.classList.remove('matched-correct','matched-wrong');
    }
  }
}

// ── Sidebar drag sources ──────────────────────────────────────────────────────
document.querySelectorAll('.article-source').forEach(src => {
  src.addEventListener('mousedown', e => {
    if (drawingCase) return;
    for (const b of allBlocks) {
      const br = b.getBoundingClientRect();
      if (e.clientX>=br.left && e.clientX<=br.right && e.clientY>=br.top && e.clientY<=br.bottom) return;
    }
    e.preventDefault();
    const article = src.dataset.article;
    const sr = src.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    const el = createArticleBlock(article, sr.left-cr.left, sr.top-cr.top);
    el.classList.add('dragging');
    dragState = { el, offX:e.clientX-sr.left, offY:e.clientY-sr.top, canvasRect:cr, companion:null, companionOffX:0, companionOffY:0 };
  });
});

document.querySelectorAll('.suffix-source').forEach(src => {
  src.addEventListener('mousedown', e => {
    if (drawingCase) return;
    for (const b of allBlocks) {
      const br = b.getBoundingClientRect();
      if (e.clientX>=br.left && e.clientX<=br.right && e.clientY>=br.top && e.clientY<=br.bottom) return;
    }
    e.preventDefault();
    const suffix = src.dataset.suffix;
    const sr = src.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    const el = createSuffixBlock(suffix, sr.left-cr.left, sr.top-cr.top);
    el.classList.add('dragging');
    dragState = { el, offX:e.clientX-sr.left, offY:e.clientY-sr.top, canvasRect:cr, companion:null, companionOffX:0, companionOffY:0, companion2:null, companion2OffX:0, companion2OffY:0 };
  });
});

// ── Search ────────────────────────────────────────────────────────────────────
// (absent in solve mode — no search bar there)
if (searchInput && searchResultsEl) {
  function renderResults(results) {
    if (!results.length) {
      searchResultsEl.classList.remove('open');
      searchResultsEl.innerHTML = '';
      return;
    }
    searchResultsEl.innerHTML = results.map(r =>
      `<div class="result-item"
          data-word="${r.word}"
          data-article="${r.article}"
          data-type="noun"
          data-english="${r.english}">
        <span class="res-badge res-noun">noun</span>
        <span class="result-noun">${r.word}</span>
        <span class="result-meaning">${r.english}</span>
      </div>`
    ).join('');
    searchResultsEl.classList.add('open');
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) { searchResultsEl.classList.remove('open'); searchResultsEl.innerHTML = ''; return; }
    const lq = q.toLowerCase();
    const results = NOUNS
      .filter(n => n.n.toLowerCase().includes(lq) || n.e.toLowerCase().includes(lq))
      .slice(0, 12)
      .map(n => ({ word: n.n, article: n.a, english: n.e }));
    renderResults(results);
  });

  searchResultsEl.addEventListener('mousedown', e => {
    const item = e.target.closest('.result-item');
    if (!item) return;
    e.preventDefault();
    // only nouns can be placed as blocks for now
    if (item.dataset.type !== 'noun') {
      showToast(`"${item.dataset.word}" is a ${item.dataset.type} — only nouns can be placed as blocks for now.`);
      searchResultsEl.classList.remove('open');
      searchInput.value = '';
      return;
    }
    const noun = NOUNS.find(n => n.n === item.dataset.word && n.a === item.dataset.article)
              || { n: item.dataset.word, a: item.dataset.article, e: item.dataset.english };
    searchResultsEl.classList.remove('open'); searchInput.value = '';
    const cr = canvas.getBoundingClientRect();
    createNounBlock(noun, 130+Math.random()*Math.max(100,cr.width-350), 40+Math.random()*Math.max(60,cr.height-160));
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const item = searchResultsEl.querySelector('.result-item');
    if (!item) return;
    const noun = NOUNS.find(n => n.n === item.dataset.word && n.a === item.dataset.article)
              || { n: item.dataset.word, a: item.dataset.article, e: item.dataset.english };
    searchResultsEl.classList.remove('open'); searchInput.value = '';
    const cr = canvas.getBoundingClientRect();
    createNounBlock(noun, 130+Math.random()*Math.max(100,cr.width-350), 40+Math.random()*Math.max(60,cr.height-160));
  });

  document.addEventListener('mousedown', e => {
    if (!searchResultsEl.contains(e.target) && e.target !== searchInput) searchResultsEl.classList.remove('open');
  });
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key==='Escape') { clearSelection(); _closeCtxMenu(); }
  if ((e.key==='Delete'||e.key==='Backspace') && isAnySelected() && document.activeElement!==searchInput) {
    deleteSelected(); pushHistory();
  }
  if ((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key==='z') { e.preventDefault(); doUndo(); }
  if ((e.ctrlKey||e.metaKey) && (e.key==='y'||(e.shiftKey&&e.key==='z'))) { e.preventDefault(); doRedo(); }
});

// ── Upload ────────────────────────────────────────────────────────────────────
// (absent in solve mode — no way to add extra nouns to a fixed exercise)
if (uploadBtn && fileInput) {
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0]; if (!file) return; fileInput.value='';
    loadingOverlay.classList.add('show');
    try {
      const text = await file.text();
      if (!text.trim()) { showToast('Das Dokument scheint leer zu sein.', true); return; }
      const nouns = extractNounsFromText(text);
      if (!nouns||!nouns.length) { showToast('Keine Nomen im Dokument gefunden.', true); return; }
      scatterNounBlocks(nouns);
      showToast(`${nouns.length} Nomen gefunden!`);
    } catch(err) { console.error(err); showToast('Fehler beim Verarbeiten.', true); }
    finally { loadingOverlay.classList.remove('show'); }
  });
}
function extractNounsFromText(text) {
  const tokens = text.split(/[^a-zA-ZäöüÄÖÜß]+/).filter(Boolean);
  const seen = new Set();
  const results = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (seen.has(lower)) continue;
    const match = NOUNS.find(n => n.n.toLowerCase() === lower);
    if (match) { seen.add(lower); results.push(match); }
  }
  return results;
}
function scatterNounBlocks(nouns) {
  const cr = canvas.getBoundingClientRect();
  const cols = Math.ceil(Math.sqrt(nouns.length));
  const cellW = Math.max(160,(cr.width-130)/cols);
  const cellH = Math.max(80,(cr.height-40)/Math.ceil(nouns.length/cols));
  _noRecord = true;
  nouns.forEach((noun,i) => {
    const col=i%cols, row=Math.floor(i/cols);
    _makeNounBlock(noun, Math.min(130+col*cellW+Math.random()*cellW*0.4,cr.width-140), Math.min(20+row*cellH+Math.random()*cellH*0.4,cr.height-60));
  });
  _noRecord = false;
  pushHistory();
}

// ── Save exercise (editor only — publishes the current layout to /solve) ──────
if (saveExerciseBtn) {
  saveExerciseBtn.addEventListener('click', async () => {
    const nouns = allBlocks
      .filter(b => b._meta.type === 'noun')
      .map(b => ({ ...b._meta.data, x: parseInt(b.style.left), y: parseInt(b.style.top) }));
    const zonesPayload = zones.map(z => ({ case: z.case, x: z.x, y: z.y, w: z.w, h: z.h }));
    try {
      const res = await fetch('/api/puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nouns, zones: zonesPayload })
      });
      if (!res.ok) throw new Error('save failed: ' + res.status);
      showToast('Übung gespeichert! Erreichbar unter /solve.');
    } catch (err) {
      console.error(err);
      showToast('Fehler beim Speichern der Übung.', true);
    }
  });
}

// ── Sidebar zoom ──────────────────────────────────────────────────────────────
const sidebar        = document.getElementById('sidebar');
const sidebarZoomIn  = document.getElementById('sidebar-zoom-in');
const sidebarZoomOut = document.getElementById('sidebar-zoom-out');
const SB_SCALE_STEP = 0.025, SB_SCALE_MIN = 0.6, SB_SCALE_MAX = 2.2;
const SB_GAP_STEP = 1.25, SB_GAP_MIN = 0, SB_GAP_MAX = 40;
let sbScale = 1, sbGap = 6;

function applySidebarZoom() {
  sidebar.style.setProperty('--sb-scale', sbScale);
  sidebar.style.setProperty('--sb-gap', sbGap + 'px');
}
sidebarZoomIn.addEventListener('click', () => {
  sbScale = Math.min(SB_SCALE_MAX, +(sbScale + SB_SCALE_STEP).toFixed(3));
  sbGap   = Math.min(SB_GAP_MAX, +(sbGap + SB_GAP_STEP).toFixed(2));
  applySidebarZoom();
});
sidebarZoomOut.addEventListener('click', () => {
  sbScale = Math.max(SB_SCALE_MIN, +(sbScale - SB_SCALE_STEP).toFixed(3));
  sbGap   = Math.max(SB_GAP_MIN, +(sbGap - SB_GAP_STEP).toFixed(2));
  applySidebarZoom();
});

// ── Settings panel ───────────────────────────────────────────────────────────
document.querySelectorAll('.article-source').forEach(src => {
  src.dataset.genders = ARTICLE_GENDERS[src.dataset.article];
});
const settingsBtn   = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const toggleGender      = document.getElementById('toggle-gender-hints');
const toggleShowCorrect = document.getElementById('toggle-show-correct');

settingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  const wasOpen = settingsPanel.classList.contains('open');
  settingsPanel.classList.toggle('open');
  if (wasOpen) onSettingsPanelClosed();
});
document.addEventListener('mousedown', e => {
  if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
    const wasOpen = settingsPanel.classList.contains('open');
    settingsPanel.classList.remove('open');
    if (wasOpen) onSettingsPanelClosed();
  }
});
function onSettingsPanelClosed() {
  if (toggleGender.checked && !legendDismissed) showGenderLegend();
}
const genderLegend      = document.getElementById('gender-legend');
const genderLegendClose = document.getElementById('gender-legend-close');
const sidebarLegendBtn  = document.getElementById('sidebar-legend-btn');
let legendDismissed = false;

function showGenderLegend() {
  const sidebarRect = document.getElementById('sidebar').getBoundingClientRect();
  const derRect = document.querySelector('.article-source[data-article="der"]').getBoundingClientRect();
  genderLegend.style.left = (sidebarRect.right + 16) + 'px';
  genderLegend.style.top = derRect.top + 'px';
  genderLegend.classList.remove('fade-out');
  genderLegend.classList.add('show');
}
function updateLegendBtnVisibility() {
  sidebarLegendBtn.classList.toggle('visible', toggleGender.checked && legendDismissed);
}
genderLegendClose.addEventListener('click', () => {
  legendDismissed = true;
  genderLegend.classList.add('fade-out');
  setTimeout(() => genderLegend.classList.remove('show'), 250);
  updateLegendBtnVisibility();
});
sidebarLegendBtn.addEventListener('click', showGenderLegend);

toggleGender.addEventListener('change', () => {
  document.body.classList.toggle('gender-hints', toggleGender.checked);
  if (!toggleGender.checked) genderLegend.classList.remove('show');
  updateLegendBtnVisibility();
});
toggleShowCorrect.addEventListener('change', () => {
  _showCorrect = toggleShowCorrect.checked;
  reEvaluateAllPairs();
});

// ── Context menu ─────────────────────────────────────────────────────────────
const ctxMenu  = document.getElementById('ctx-menu');
const ctxCopy  = document.getElementById('ctx-copy');
const ctxCut   = document.getElementById('ctx-cut');
const ctxPaste  = document.getElementById('ctx-paste');
const ctxDelete = document.getElementById('ctx-delete');
const ctxAlign  = document.getElementById('ctx-align');

function _closeCtxMenu() { ctxMenu.classList.remove('open'); }

function _openCtxMenu(x, y) {
  const hasSel = isAnySelected();
  ctxCopy.classList.toggle('disabled',   !hasSel);
  ctxCut.classList.toggle('disabled',    !hasSel);
  ctxPaste.classList.toggle('disabled',  _clipboard === null);
  ctxDelete.classList.toggle('disabled', !hasSel);
  ctxAlign.classList.toggle('disabled',  selectedBlocks.size < 2);
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top  = y + 'px';
  ctxMenu.classList.add('open');
}

function _copySelection() {
  if (!isAnySelected()) return;
  const bArr = [...selectedBlocks];
  const zArr = [...selectedZones];
  let minX = Infinity, minY = Infinity;
  bArr.forEach(b => { minX = Math.min(minX, parseInt(b.style.left)); minY = Math.min(minY, parseInt(b.style.top)); });
  zArr.forEach(z => { minX = Math.min(minX, z.x); minY = Math.min(minY, z.y); });
  if (!isFinite(minX)) { minX = 0; minY = 0; }
  _clipboard = {
    blocks: bArr.map(b => ({
      type: b._meta.type,
      article: b.dataset.article,
      suffix: b._meta.type === 'suffix' ? b.dataset.suffix : null,
      nounData: b._meta.type === 'noun' ? { ...b._meta.data } : null,
      relX: parseInt(b.style.left) - minX,
      relY: parseInt(b.style.top) - minY,
      pairedIdx: b._meta.paired ? bArr.indexOf(b._meta.paired) : -1,
      suffixPairedIdx: b._meta.type === 'noun' && b._meta.suffixPaired ? bArr.indexOf(b._meta.suffixPaired) : -1
    })),
    zones: zArr.map(z => ({ case: z.case, w: z.w, h: z.h, relX: z.x - minX, relY: z.y - minY }))
  };
  _pasteOffset = 0;
}

function doCtxCopy() { _copySelection(); _closeCtxMenu(); }

function doCtxCut() {
  _copySelection();
  deleteSelected();
  pushHistory();
  _closeCtxMenu();
}

function doCtxPaste() {
  if (!_clipboard) return;
  _noRecord = true;
  clearSelection();
  const ox = _ctxCursor.x + _pasteOffset;
  const oy = _ctxCursor.y + _pasteOffset;
  _pasteOffset += 20;

  const newBlocks = _clipboard.blocks.map(bd => {
    const el = bd.type === 'noun'
      ? _makeNounBlock(bd.nounData, ox + bd.relX, oy + bd.relY)
      : bd.type === 'suffix'
        ? _makeSuffixBlock(bd.suffix, ox + bd.relX, oy + bd.relY)
        : _makeArticleBlock(bd.article, ox + bd.relX, oy + bd.relY);
    return el;
  });

  // Restore pairs
  _clipboard.blocks.forEach((bd, i) => {
    if (bd.pairedIdx > i) {
      const a = newBlocks[i], b = newBlocks[bd.pairedIdx];
      const articleEl = a._meta.type === 'article' ? a : b;
      const nounEl    = a._meta.type === 'noun'    ? a : b;
      articleEl._meta.paired = nounEl;
      nounEl._meta.paired = articleEl;
    }
    if (bd.suffixPairedIdx > i) {
      const a = newBlocks[i], b = newBlocks[bd.suffixPairedIdx];
      const suffixEl = a._meta.type === 'suffix' ? a : b;
      const nounEl   = a._meta.type === 'noun'   ? a : b;
      suffixEl._meta.paired = nounEl;
      nounEl._meta.suffixPaired = suffixEl;
    }
  });

  // Paste zones
  const newZones = _clipboard.zones.map(zd => {
    _makeZone(zd.case, ox + zd.relX, oy + zd.relY, zd.w, zd.h);
    return zones[zones.length - 1];
  });

  // Select all pasted items
  newBlocks.forEach(b => { selectedBlocks.add(b); b.classList.add('selected'); });
  newZones.forEach(z => { selectedZones.add(z); z.el.classList.add('zone-selected'); });

  _noRecord = false;
  reEvaluateAllPairs();
  pushHistory();
  _closeCtxMenu();
}

function doCtxAlign() {
  if (selectedBlocks.size < 2) return;

  // Primaries: nouns + article blocks that are NOT paired with a selected noun
  const primaries = [...selectedBlocks].filter(b =>
    b._meta.type === 'noun' || !b._meta.paired || !selectedBlocks.has(b._meta.paired)
  );
  primaries.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));

  const alignX = Math.min(...primaries.map(b => parseInt(b.style.left)));

  // Record zone containment for nouns BEFORE any movement
  const cr = canvas.getBoundingClientRect();
  const nounZoneMap = new Map();
  primaries.forEach(b => {
    if (b._meta.type !== 'noun') return;
    const nr = b.getBoundingClientRect();
    const nx = nr.left - cr.left + nr.width / 2;
    const ny = nr.top  - cr.top  + nr.height / 2;
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i];
      if (nx >= z.x && nx <= z.x + z.w && ny >= z.y && ny <= z.y + z.h) {
        nounZoneMap.set(b, z); break;
      }
    }
  });

  const BLOCK_H = 42, GAP = 24;
  let currentY = parseInt(primaries[0].style.top);
  const movedZones = new Set();

  primaries.forEach(b => {
    const oldLeft = parseInt(b.style.left);
    const oldTop  = parseInt(b.style.top);

    b.style.left = alignX + 'px';
    b.style.top  = currentY + 'px';

    if (b._meta.type === 'noun' && b._meta.paired) {
      b._meta.paired.style.left = (alignX - 88) + 'px';
      b._meta.paired.style.top  = currentY + 'px';
    }
    if (b._meta.type === 'noun' && b._meta.suffixPaired) {
      b._meta.suffixPaired.style.left = (alignX + b.offsetWidth + 4) + 'px';
      b._meta.suffixPaired.style.top  = currentY + 'px';
    }

    if (b._meta.type === 'noun' && nounZoneMap.has(b) && !movedZones.has(nounZoneMap.get(b))) {
      const z = nounZoneMap.get(b);
      movedZones.add(z);
      z.x += alignX - oldLeft;
      z.y += currentY - oldTop;
      z.el.style.left = z.x + 'px';
      z.el.style.top  = z.y + 'px';
    }

    currentY += BLOCK_H + GAP;
  });

  reEvaluateAllPairs();
  pushHistory();
  _closeCtxMenu();
}

ctxCopy.addEventListener('click',   doCtxCopy);
ctxCut.addEventListener('click',    doCtxCut);
ctxPaste.addEventListener('click',  doCtxPaste);
ctxDelete.addEventListener('click', () => { deleteSelected(); pushHistory(); _closeCtxMenu(); });
ctxAlign.addEventListener('click',  doCtxAlign);

canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (drawingCase) return;
  const cr = canvas.getBoundingClientRect();
  _ctxCursor = { x: e.clientX - cr.left, y: e.clientY - cr.top };

  const blockEl = e.target.closest('.block');
  if (blockEl && allBlocks.includes(blockEl) && !blockEl.classList.contains('locked')) {
    if (!selectedBlocks.has(blockEl)) {
      clearSelection();
      selectedBlocks.add(blockEl); blockEl.classList.add('selected');
      if (blockEl._meta.paired && !blockEl._meta.paired.classList.contains('locked')) {
        selectedBlocks.add(blockEl._meta.paired);
        blockEl._meta.paired.classList.add('selected');
      }
      if (blockEl._meta.suffixPaired && !blockEl._meta.suffixPaired.classList.contains('locked')) {
        selectedBlocks.add(blockEl._meta.suffixPaired);
        blockEl._meta.suffixPaired.classList.add('selected');
      }
    }
  }
  _openCtxMenu(e.clientX, e.clientY);
});

document.addEventListener('mousedown', e => {
  if (!ctxMenu.contains(e.target)) _closeCtxMenu();
});

// ── Initial state ─────────────────────────────────────────────────────────────
if (window.SOLVE_MODE) {
  // Load the exercise saved from the editor: fixed noun blocks + case zones,
  // stripped of any article/suffix pairing so the solver starts from scratch.
  fetch('/api/puzzle')
    .then(res => res.json())
    .then(puzzle => {
      _noRecord = true;
      (puzzle.nouns || []).forEach(nd => {
        const { x, y, ...noun } = nd;
        _makeNounBlock(noun, x, y, true);
      });
      (puzzle.zones || []).forEach(zd => _makeZone(zd.case, zd.x, zd.y, zd.w, zd.h, true));
      _noRecord = false;
      pushHistory();
    })
    .catch(err => { console.error(err); showToast('Konnte Übung nicht laden.', true); });
} else {
  pushHistory();
}