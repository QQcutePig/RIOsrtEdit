// RIOsrtEdit MVP
const sel = (q) => document.querySelector(q);

// ---------- DOM ----------
const editor = sel("#editor");
const gridBody = sel("#gridBody");
const fileInput = sel("#fileInput");
const projInput = sel("#projInput");
const videoSeek = sel(".videoSeek");

const btnUndo = sel("#btnUndo");
const btnRedo = sel("#btnRedo");
const btnInsLine = sel("#btnInsLine");
const btnDelLine = sel("#btnDelLine");
const btnNewFile = sel("#btnNewFile");
const btnOpen = sel("#btnOpen");
const btnOpen2 = sel("#btnOpen2");
const btnExportSrt = sel("#btnExportSrt");

const btnSaveProj = sel("#btnSaveProj");
const btnOpenProj = sel("#btnOpenProj");
const btnConvert = sel("#btnConvert");
const btnRemoveFx = sel("#btnRemoveFx");
const btnTheme = sel("#btnTheme");
const btnClear = sel("#btnClear");
const btnFillTest = sel("#btnFillTest");
const btnKeepZh = sel("#btnKeepZh");
// 魔術筆相關
const btnMagicWand = sel("#btnMagicWand");  // ← 改名從 btnRemoveFx
const magicMask = sel("#magicMask");
const magicDlg = sel("#magicDlg");
const magicRemoveSpaces = sel("#magicRemoveSpaces");
const magicToFullPunc = sel("#magicToFullPunc");
const magicToHalfPunc = sel("#magicToHalfPunc");
const magicRemoveFullPunc = sel("#magicRemoveFullPunc");
const magicRemoveHalfPunc = sel("#magicRemoveHalfPunc");
const magicNumToFull = sel("#magicNumToFull");
const magicNumToHalf = sel("#magicNumToHalf");
const magicRemoveEmpty = sel('#magicRemoveEmpty');
const magicSortByTime = sel('#magicSortByTime');
const btnMagicCancel = sel("#btnMagicCancel");
const btnMagicApply = sel("#btnMagicApply");
const magicPreview = sel("#magicPreview");
const starsPanel = sel("#starsPanel");
const starsList = sel("#starsList");
const btnStarsRefresh = sel("#btnStarsRefresh");
const btnStars = sel("#btnStars");
const statusLeft = sel("#statusLeft");
const statusRight = sel("#statusRight");
// Export dialog
const exportMask = sel('#exportMask');
const exportDlg = sel('#exportDlg');
const btnExportCancel = sel('#btnExportCancel');
const btnExportConfirm = sel('#btnExportConfirm');

// Edit dialog
const dlgMask = sel("#dlgMask");
const dlg = sel("#dlg");
const dlgStart = sel("#dlgStart");
const dlgEnd = sel("#dlgEnd");
const dlgText = sel("#dlgText");
const dlgShiftSec = sel("#dlgShiftSec");
const dlgShiftMs = sel("#dlgShiftMs");
const dlgScope = sel("#dlgScope");
const dlgTimeMode = sel("#dlgTimeMode");
const dlgCancel = sel("#dlgCancel");
const dlgOk = sel("#dlgOk");
const dlgApply = sel('dlgApply');

// 時間快速調整按鈕
const btnStartMinus3 = sel("#btnStartMinus3");
const btnStartMinus2 = sel("#btnStartMinus2");
const btnStartMinus1 = sel("#btnStartMinus1");
const btnStartPlus1 = sel("#btnStartPlus1");
const btnStartPlus2 = sel("#btnStartPlus2");
const btnStartPlus3 = sel("#btnStartPlus3");
const dlgStartCustom = sel("#dlgStartCustom");
const btnStartCustom = sel("#btnStartCustom");

const btnEndMinus3 = sel("#btnEndMinus3");
const btnEndMinus2 = sel("#btnEndMinus2");
const btnEndMinus1 = sel("#btnEndMinus1");
const btnEndPlus1 = sel("#btnEndPlus1");
const btnEndPlus2 = sel("#btnEndPlus2");
const btnEndPlus3 = sel("#btnEndPlus3");
const dlgEndCustom = sel("#dlgEndCustom");
const btnEndCustom = sel("#btnEndCustom");

const dlgDuration = sel("#dlgDuration");
const btnDurationApply = sel("#btnDurationApply");

// Find dialog (non-modal)
const btnSearch = sel("#btnSearch");
const findMask = sel("#findMask"); // will be forced hidden
const findDlg = sel("#findDlg");
const findQ = sel("#findQ");
const findR = sel("#findR");
const btnFindPrev = sel("#btnFindPrev");
const btnFindNext = sel("#btnFindNext");
const btnReplaceOne = sel("#btnReplaceOne");
const btnReplaceAll = sel("#btnReplaceAll");
const btnFindClose = sel("#btnFindClose");
const findInfo = sel("#findInfo");

// Floating video player (from index.html)
const btnVideo = sel("#btnVideo");
const videoFloat = sel("#videoFloat");
const btnVideoToggle = sel("#btnVideoToggle");
const btnVideoPick = sel("#btnVideoPick");
const videoInput = sel("#videoInput");
const videoEl = sel("#videoEl");
const videoSubtitle = sel("#videoSubtitle");
const btnVPlay = sel("#btnVPlay");
const btnVBack3 = sel("#btnVBack3");
const btnVBack2 = sel("#btnVBack2");
const btnVBack1 = sel("#btnVBack1");
const btnVFwd1 = sel("#btnVFwd1");
const btnVFwd2 = sel("#btnVFwd2");
const btnVFwd3 = sel("#btnVFwd3");
// Note panel
const btnNote = sel("#btnNote");
const notePanel = sel("#notePanel");
const noteText = sel("#noteText");
const btnNoteToggle = sel("#btnNoteToggle");
const btnNoteImport = sel("#btnNoteImport");
const btnNoteExport = sel("#btnNoteExport");
const noteImportInput = sel("#noteImportInput");

// 快速編輯區
const quickEditToggle = sel("#quickEditToggle");
const quickEdit = sel("#quickEdit");
const qeStart = sel("#qeStart");
const qeStartMinus1 = sel("#qeStartMinus1");
const qeStartPlus1 = sel("#qeStartPlus1");
const qeDuration = sel("#qeDuration");
const qeDurMinus1 = sel("#qeDurMinus1");
const qeDurPlus1 = sel("#qeDurPlus1");
const qeEnd = sel("#qeEnd");
const qeEndMinus1 = sel("#qeEndMinus1");
const qeEndPlus1 = sel("#qeEndPlus1");
const qeText = sel("#qeText");
const qePrev = sel("#qePrev");
const qeNext = sel("#qeNext");
const qeApply = sel('qeApply');
  
  

// ---------- Data ----------
let currentFileName = "";
let openccConverter = null;
let subtitleItems = [];
let selectedIndex = -1;
let rangeAnchor = -1;
let rangeEnd = -1;
let lastProjectSaveHandle = null;

let findLastQuery = "";
let findLastIndex = -1;
// Video-sync options
let followVideo = false; // F8 toggle
let videoOffsetMs = 0;   // subtitleTimeMs = videoTimeMs + videoOffsetMs
// Note panel state
let savedNoteText = "";  // ← 改名避免衝突
const NOTE_STORAGE_KEY = "rioSrtEdit_noteText";

// ---------- UndoRedo ----------
const undoStack = [];
const redoStack = [];
const HISTORYMAX = 200;

function cloneItems(items) {
  return items.map((it) => ({
    startMs: Number(it.startMs || 0),
    endMs: Number(it.endMs || 0),
    text: String(it.text ?? ""),
    mark: !!it.mark,
  }));
}

function makeSnapshot() {
  return {
    items: cloneItems(subtitleItems),
    selectedIndex: Number.isFinite(selectedIndex) ? selectedIndex : -1,
    editorValue: String(editor?.value ?? ""),
    currentFileName: String(currentFileName ?? ""),
  };
}

function applySnapshot(snap) {
  subtitleItems = cloneItems(snap.items || []);
  selectedIndex = Number.isFinite(snap.selectedIndex) ? snap.selectedIndex : -1;
  currentFileName = String(snap.currentFileName ?? "");
  if (editor) editor.value = String(snap.editorValue ?? "");
  renderGrid();
  if (statusLeft) statusLeft.textContent = currentFileName;
}

function pushUndo(label) {
  undoStack.push({ label: String(label || ""), snap: makeSnapshot() });
  if (undoStack.length > HISTORYMAX) undoStack.shift();
  redoStack.length = 0;
  updateHistoryHint();
}

function doUndo() {
  const entry = undoStack.pop();
  if (!entry) return;
  redoStack.push({ label: entry.label, snap: makeSnapshot() });
  applySnapshot(entry.snap);
  updateHistoryHint();
}

function doRedo() {
  const entry = redoStack.pop();
  if (!entry) return;
  undoStack.push({ label: entry.label, snap: makeSnapshot() });
  applySnapshot(entry.snap);
  updateHistoryHint();
}

function updateHistoryHint() {
  if (!statusRight) return;
  const base = String(statusRight.textContent ?? "UTF-8").split(" U")[0];
  statusRight.textContent = `${base} U${undoStack.length} R${redoStack.length}`;
}
// ---------- Note Panel Storage ----------

function loadNoteFromStorage() {
  try {
    const saved = localStorage.getItem(NOTE_STORAGE_KEY);
    if (saved) {
      savedNoteText = saved;
      if (noteText) noteText.value = savedNoteText;
    }
  } catch (e) {
    console.warn("[loadNoteFromStorage]", e);
  }
}

function saveNoteToStorage() {
  try {
    if (noteText) {
      savedNoteText = noteText.value || "";
      localStorage.setItem(NOTE_STORAGE_KEY, savedNoteText);
    }
  } catch (e) {
    console.warn("[saveNoteToStorage]", e);
  }
}

function clearNoteText() {
  savedNoteText = "";
  if (noteText) noteText.value = "";
  try {
    localStorage.removeItem(NOTE_STORAGE_KEY);
  } catch (e) {
    console.warn("[clearNoteText]", e);
  }
}

// ---------- OpenCC ----------
async function initOpenCC() {
  try {
    // support both global names
    const OpenCC = window.OpenCCWasm || window.OpenCCWasm_;
    if (!OpenCC) throw new Error("OpenCC wasm not loaded");

    // support both ready styles
    if (typeof OpenCC.ready === "function") {
      // some builds: await OpenCCWasm.ready (a Promise)
      // some builds: OpenCCWasm_.ready() (a function returning Promise)
      const maybePromise = OpenCC.ready;
      if (typeof maybePromise?.then === "function") {
        await maybePromise;
      } else {
        await OpenCC.ready();
      }
    }

    const DictSource = OpenCC.DictSource || (OpenCCWasm?.DictSource);
    const Converter = OpenCC.Converter || (OpenCCWasm?.Converter);
    if (!DictSource || !Converter) throw new Error("OpenCC API missing DictSource/Converter");

    const dictSource = new DictSource("s2t.json");

    // IMPORTANT: point to your vendor/opencc folder
    dictSource.setDictProxy((name) =>
      fetch(`./vendor/opencc/${name}`).then((r) => {
        if (!r.ok) throw new Error(`failed to fetch: ${name} (${r.status})`);
        return r.text();
      })
    );

    const args = await dictSource.get();
    openccConverter = new Converter(...args);

    statusRight.textContent = "UTF-8 · OpenCC: ready";
    updateHistoryHint();
    if (btnConvert) btnConvert.disabled = false;
  } catch (e) {
    console.error("[initOpenCC]", e?.name, e?.message, e);
    statusRight.textContent = "UTF-8 · OpenCC: failed";
    updateHistoryHint();
    if (btnConvert) btnConvert.disabled = true;
  }
}

function convertS2T(text) {
  if (!openccConverter) return text;
  return openccConverter.convert(text);
}
// ---------- Find dialog ----------
function isFindDialogOpen() {
  return !!findDlg && !findDlg.classList.contains("hidden");
}

function showFindDialog(show) {
  if (findMask) findMask.classList.add("hidden"); // never block clicks
  if (!findDlg) return;
  findDlg.classList.toggle("hidden", !show);
  if (show) {
    updateFindInfo();
    findQ?.focus();
    findQ?.select?.();
  }
}

function countAllHits(q) {
  if (!q) return 0;
  const qq = String(q).toLowerCase();
  let n = 0;
  for (const it of subtitleItems) {
    const t = String(it.text ?? "").toLowerCase();
    let pos = 0;
    while (true) {
      const at = t.indexOf(qq, pos);
      if (at < 0) break;
      n++;
      pos = at + Math.max(1, qq.length);
    }
  }
  return n;
}

function updateFindInfo() {
  if (!findInfo) return;
  const q = String(findQ?.value ?? "").trim();
  if (!q) {
    findInfo.textContent = "";
    return;
  }
  findInfo.textContent = String(countAllHits(q));
}

function findNext() {
  if (!subtitleItems.length) return;
  const qRaw = String(findQ?.value ?? "").trim();
  if (!qRaw) { updateFindInfo(); return; }
  
  const q = qRaw.toLowerCase();
  const start = findLastQuery === q ? findLastIndex + 1 : Math.max(0, selectedIndex);
  
  // 合併兩個迴圈為一個 (wrap-around logic)
  for (let offset = 0; offset < subtitleItems.length; offset++) {
    const i = (start + offset) % subtitleItems.length;
    const t = String(subtitleItems[i].text ?? "").toLowerCase();
    if (t.includes(q)) {
      selectedIndex = i;
      findLastQuery = q;
      findLastIndex = i;
      renderGrid();
      document.querySelector(".gridRow.selected")?.scrollIntoView({ block: "center" });
      updateFindInfo();
      return;
    }
  }
  
  // 冇搵到
  findLastQuery = q;
  findLastIndex = -1;
  updateFindInfo();
}

function findPrev() {
  if (!subtitleItems.length) return;
  const qRaw = String(findQ?.value ?? "").trim();
  if (!qRaw) { updateFindInfo(); return; }
  const q = qRaw.toLowerCase();
  
  // 從當前位置往前找
  const start = findLastQuery === q ? findLastIndex - 1 : Math.max(0, selectedIndex);
  
  // 反向搜尋（wrap-around）
  for (let offset = 0; offset < subtitleItems.length; offset++) {
    const i = (start - offset + subtitleItems.length) % subtitleItems.length;
    const t = String(subtitleItems[i].text ?? "").toLowerCase();
    if (t.includes(q)) {
      selectedIndex = i;
      findLastQuery = q;
      findLastIndex = i;
      renderGrid();
      document.querySelector(".gridRow.selected")?.scrollIntoView({ block: "center" });
      updateFindInfo();
      return;
    }
  }
  
  // 冇搵到
  findLastQuery = q;
  findLastIndex = -1;
  updateFindInfo();
}

function replaceOne() {
  if (!subtitleItems.length) return;
  const qRaw = String(findQ?.value ?? "").trim();
  if (!qRaw) return;
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;

  const src = String(subtitleItems[selectedIndex].text ?? "");
  const at = src.toLowerCase().indexOf(qRaw.toLowerCase());
  if (at < 0) return;

  const rep = String(findR?.value ?? "");
  const out = src.slice(0, at) + rep + src.slice(at + qRaw.length);
  pushUndo("Replace one");
  subtitleItems[selectedIndex].text = out;
  renderGrid();
  updateFindInfo();
  findLastQuery = qRaw.toLowerCase();
  findLastIndex = selectedIndex;
  findNext();
}

function replaceAll() {
  if (!subtitleItems.length) return;
  const qRaw = String(findQ?.value ?? "").trim();
  if (!qRaw) return;

  const q = qRaw.toLowerCase();
  const rep = String(findR?.value ?? "");
  let changed = 0;

  const newItems = subtitleItems.map((it) => {
    const src = String(it.text ?? "");
    const lower = src.toLowerCase();
    if (!lower.includes(q)) return it;

    let out = "";
    let pos = 0;
    while (true) {
      const at = lower.indexOf(q, pos);
      if (at < 0) break;
      out += src.slice(pos, at) + rep;
      pos = at + qRaw.length;
      changed++;
    }
    out += src.slice(pos);
    return { ...it, text: out };
  });

  if (changed <= 0) return;
  pushUndo("Replace all");
  subtitleItems = newItems;
  renderGrid();
  updateFindInfo();
}
// ========== 魔術筆工具 ==========

function showMagicDialog() {
  if (!magicMask || !magicDlg) return;
  magicMask.classList.remove("hidden");
  magicDlg.classList.remove("hidden");
  // 清空所有勾選
  if (magicRemoveSpaces) magicRemoveSpaces.checked = false;
  if (magicToFullPunc) magicToFullPunc.checked = false;
  if (magicToHalfPunc) magicToHalfPunc.checked = false;
  if (magicRemoveFullPunc) magicRemoveFullPunc.checked = false;
  if (magicRemoveHalfPunc) magicRemoveHalfPunc.checked = false;
  if (magicNumToFull) magicNumToFull.checked = false;
  if (magicNumToHalf) magicNumToHalf.checked = false;
  if (magicRemoveEmpty) magicRemoveEmpty.checked = false;
  if (magicSortByTime) magicSortByTime.checked = false;
  if (magicPreview) magicPreview.style.display = "none";
}

function closeMagicDialog() {
  if (magicMask) magicMask.classList.add("hidden");
  if (magicDlg) magicDlg.classList.add("hidden");
}

function applyMagicWand() {
  if (!subtitleItems.length) return;
  
const opts = {
    removeSpaces: magicRemoveSpaces?.checked ?? false,
    toFullPunc: magicToFullPunc?.checked ?? false,
    toHalfPunc: magicToHalfPunc?.checked ?? false,
    removeFullPunc: magicRemoveFullPunc?.checked ?? false,
    removeHalfPunc: magicRemoveHalfPunc?.checked ?? false,
    numToFull: magicNumToFull?.checked ?? false,
    numToHalf: magicNumToHalf?.checked ?? false,
    removeEmpty: magicRemoveEmpty?.checked ?? false,
    sortByTime: magicSortByTime?.checked ?? false,
};
  
  // 檢查是否至少選擇一個功能
  if (!Object.values(opts).some(v => v)) {
    alert("請至少選擇一個功能！");
    return;
  }
  
  pushUndo("魔術筆處理");
  
  subtitleItems = subtitleItems.map(it => {
    let text = String(it.text ?? "");
    
    // a. 移除多餘空格
    if (opts.removeSpaces) {
      text = text.replace(/\s+/g, " ").trim();
    }
    
    // b. 標點轉全形（簡化版：不檢查前後文）
    if (opts.toFullPunc) {
      const map = {
        ',': '，', '.': '。', '!': '！', '?': '？',
        ':': '：', ';': '；', '(': '（', ')': '）',
        '[': '「', ']': '」', '{': '『', '}': '』',
        '"': '＂', "'": '＇', '-': '－'
      };
      for (const [half, full] of Object.entries(map)) {
        text = text.replaceAll(half, full);
      }
    }
    
    // c. 標點轉半形
    if (opts.toHalfPunc) {
      const map = {
        '，': ',', '。': '.', '！': '!', '？': '?',
        '：': ':', '；': ';', '（': '(', '）': ')',
        '「': '[', '」': ']', '『': '{', '』': '}',
        '＂': '"', '＇': "'", '－': '-'
      };
      for (const [full, half] of Object.entries(map)) {
        text = text.replaceAll(full, half);
      }
    }
    
    // d. 移除全形標點
    if (opts.removeFullPunc) {
      text = text.replace(/[，。！？：；（）「」『』＂＇－]/g, "");
    }
    
    // e. 移除半形標點
    if (opts.removeHalfPunc) {
      text = text.replace(/[,.!?:;()\[\]{}"'\-]/g, "");
    }
    
    // f. 數字轉全形
    if (opts.numToFull) {
      const numMap = {'0':'０','1':'１','2':'２','3':'３','4':'４','5':'５','6':'６','7':'７','8':'８','9':'９'};
      text = text.replace(/[0-9]/g, ch => numMap[ch] || ch);
    }
    
    // g. 數字轉半形
    if (opts.numToHalf) {
      const numMap = {'０':'0','１':'1','２':'2','３':'3','４':'4','５':'5','６':'6','７':'7','８':'8','９':'9'};
      text = text.replace(/[０-９]/g, ch => numMap[ch] || ch);
    }
    
    return { ...it, text };
  });
if (opts.removeEmpty) {
    subtitleItems = subtitleItems.filter(it => {
        const text = String(it.text ?? '').trim();
        return text.length > 0;
    });
}

// ⏰ 按時間排序
if (opts.sortByTime) {
    subtitleItems.sort((a, b) => a.startMs - b.startMs);
}

renderGrid();
closeMagicDialog();

renderGrid();
closeMagicDialog();}

// ---------- Note Panel ----------

function toggleNotePanel() {
  if (!notePanel) return;
  const isHidden = notePanel.classList.contains("hidden");
  notePanel.classList.toggle("hidden", !isHidden);
  if (!isHidden) {
    // 保存：當關閉時
    saveNoteToStorage();
  }
}
function doNoteExport() {
  if (!noteText) return;
  const content = noteText.value || "";
  if (!content.trim()) {
    alert("記事本內容為空！");
    return;
  }
  downloadText("note.txt", content, "text/plain;charset=utf-8");
}

function doNoteImport() {
  if (!noteImportInput) return;
  noteImportInput.value = "";
  noteImportInput.click();
}

function handleNoteImport(e) {
  const file = e.target?.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    const content = ev.target?.result || "";
    if (noteText) noteText.value = content;
    saveNoteToStorage();
  };
  reader.readAsText(file, "UTF-8");
}

function setNotePanelCollapsed(collapsed) {
  if (!notePanel) return;
  notePanel.classList.toggle("collapsed", collapsed);
  notePanel.classList.toggle("expanded", !collapsed);
}

// ---------- Draggable dialog ----------
window.makeDraggable = function(dlgEl, handleEl) {
  if (!dlgEl || !handleEl) return;
  handleEl.style.cursor = "move";
  handleEl.style.userSelect = "none";

  let dragging = false;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dlgEl.style.left = `${startLeft + dx}px`;
    dlgEl.style.top = `${startTop + dy}px`;
  };

  const onUp = () => {
    dragging = false;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };

  const onDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    e.preventDefault();
    const r = dlgEl.getBoundingClientRect();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = r.left;
    startTop = r.top;
    dlgEl.style.position = "fixed";
    dlgEl.style.left = `${startLeft}px`;
    dlgEl.style.top = `${startTop}px`;
    dlgEl.style.transform = "none";
    dlgEl.style.margin = "0";
    dlgEl.style.right = "auto";
    dlgEl.style.bottom = "auto";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  handleEl.addEventListener("mousedown", onDown);
}
function syncThemeIcon() {
  if (!btnTheme) return;
  const isLight = document.body.classList.contains('light');
  setMatIconOnly(btnTheme, isLight ? 'dark_mode' : 'light_mode');
}

// ---------- Helpers ----------
function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function countHanChars(s) {
  const m = String(s).match(/[\p{Script=Han}]/gu);
  return m ? m.length : 0;
}

function removeAssOverrideBlocks(text) {
  return String(text).replace(/\{\\.*?\}/g, "");
}

// ---------- Time helpers (SRT) ----------


// ---------- ASS parse helpers ----------
function assTimeToMs(t) {
  const m = String(t).trim().match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,2})$/);
  if (!m) return null;
  const h = Number(m[1]), mm = Number(m[2]), ss = Number(m[3]), cs = Number(m[4]);
  if (![h, mm, ss, cs].every(Number.isFinite)) return null;
  return ((h * 3600 + mm * 60 + ss) * 1000 + cs * 10);
}

function parseAss(text) {
  const lines = String(text).split(/\r?\n/);
  let inEvents = false;
  let formatCols = null;
  const items = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^\[events\]/i.test(line)) { inEvents = true; continue; }
    if (/^\[.*\]/.test(line) && !/^\[events\]/i.test(line)) { inEvents = false; continue; }
    if (!inEvents) continue;

    if (/^format\s*:/i.test(line)) {
      const cols = line.split(":")[1] || "";
      formatCols = cols.split(",").map((s) => s.trim());
      continue;
    }

    if (/^dialogue\s*:/i.test(line)) {
      const rest = rawLine.split(":").slice(1).join(":").trim();
      if (!formatCols || !formatCols.length) continue;

      const need = formatCols.length;
      const parts = [];
      let cur = "";
      let splits = 0;
      for (let i = 0; i < rest.length; i++) {
        const ch = rest[i];
        if (ch === "," && splits < need - 1) {
          parts.push(cur);
          cur = "";
          splits++;
        } else cur += ch;
      }
      parts.push(cur);

      const colMap = {};
      for (let i = 0; i < formatCols.length; i++) {
        colMap[formatCols[i].toLowerCase()] = parts[i] ?? "";
      }
      const startMs = assTimeToMs(colMap["start"]);
      const endMs = assTimeToMs(colMap["end"]);
      if (startMs == null || endMs == null) continue;

      let txt = String(colMap["text"] ?? "");
      txt = txt.replace(/\\N/g, "\n");
      txt = removeAssOverrideBlocks(txt);

      items.push({ startMs, endMs, text: txt, mark: false });
    }
  }
  return items;
}

function keepBestChineseLine(text) {
  const lines = String(text).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  if (!lines.length) return "";
  const conv = lines.map((ln) => convertS2T(ln));
  let best = conv[0];
  let bestScore = countHanChars(best);
  for (let i = 1; i < conv.length; i++) {
    const sc = countHanChars(conv[i]);
    if (sc > bestScore) {
      best = conv[i];
      bestScore = sc;
    }
  }
  return best;
}
function doNewFile() {
  // 確認要清空
  if (subtitleItems.length > 0) {
    if (!confirm("確定要新增空白檔案？現有內容會清空。")) {
      return;
    }
  }
  
  // 清空並加入第一行空白字幕
  currentFileName = "Untitled.srt";
  subtitleItems = [
    {
      startMs: 0,
      endMs: 1000,
      text: "",
      mark: false
    }
  ];
  selectedIndex = 0;  // ← 選中第一行
  rangeAnchor = -1;
  rangeEnd = -1;
  
  if (editor) editor.value = "";
  if (statusLeft) statusLeft.textContent = currentFileName;
  
  renderGrid();
}



function doOpenDialog() {
  if (!fileInput) return;
  fileInput.value = "";
  fileInput.click();
}

// ---------- Grid ----------
// 高亮显示搜索词（粉红色）
function highlightSearchText(text, query) {
  if (!query) return text;
  const lowerText = String(text).toLowerCase();
  const lowerQuery = query.toLowerCase();
  let pos = 0;
  const parts = [];
  
  while (true) {
    const at = lowerText.indexOf(lowerQuery, pos);
    if (at < 0) {
      parts.push(text.slice(pos));
      break;
    }
    if (at > pos) {
      parts.push(text.slice(pos, at));
    }
    const matchText = text.slice(at, at + query.length);
    const span = document.createElement('span');
    span.textContent = matchText;
    span.style.backgroundColor = 'hotpink';
    span.style.color = '#000';
    span.style.padding = '2px 4px';
    span.style.borderRadius = '3px';
    parts.push(span);
    
    pos = at + Math.max(1, query.length);
  }
  
  return parts;
}


function renderGrid() {
  if (!gridBody) return;

  gridBody.innerHTML = "";

  const items = Array.isArray(subtitleItems) ? subtitleItems : [];
  items.forEach((it, idx) => {
    const row = document.createElement("div");

    const inRange =
      rangeAnchor >= 0 &&
      rangeEnd >= 0 &&
      idx >= Math.min(rangeAnchor, rangeEnd) &&
      idx <= Math.max(rangeAnchor, rangeEnd);

    row.className =
      "gridRow" +
      (idx === selectedIndex ? " selected" : "") +
      (inRange ? " rangeSelected" : "");

    const c1 = document.createElement("div");
    c1.textContent = String(idx + 1);

    const cM = document.createElement("div");
    cM.textContent = it.mark ? "⭐" : "";
    cM.style.cursor = "pointer";
	cM.style.fontSize = "16px"; // ✅ 稍微大一點更易見
    cM.title = "Bookmark";
    cM.addEventListener("click", (ev) => {
      ev.stopPropagation();
      pushUndo("Toggle bookmark");
      it.mark = !it.mark;
      renderGrid();
    });

    const c2 = document.createElement("div");
    c2.textContent = `${msToSrtTime(it.startMs)} → ${msToSrtTime(it.endMs)}`;
    c2.style.cursor = "pointer";
    c2.title = c2.textContent;

    c2.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const v = document.querySelector("#videoEl");
      if (!v || !v.src) return;
      v.currentTime = Math.max(0, (Number(it.startMs || 0) - Number(videoOffsetMs || 0)) / 1000);
    });

    const badSelf = it.endMs < it.startMs;
    const next = items[idx + 1];
    const badOverlap = next ? it.endMs > next.startMs : false;
    if (badSelf || badOverlap) c2.classList.add("timeBad");
    if (badSelf || badOverlap) row.classList.add("badTime");
    if (badSelf || badOverlap) row.title = badSelf ? "End < Start" : "Overlap next line";

const c3 = document.createElement("div");
c3.style.cursor = "default";

// 如果有搜索查询，高亮显示匹配的文本
if (findLastQuery && String(it.text ?? '').toLowerCase().includes(findLastQuery)) {
  const parts = highlightSearchText(it.text, findLastQuery);
  parts.forEach(part => {
    if (typeof part === 'string') {
      c3.appendChild(document.createTextNode(part));
    } else {
      c3.appendChild(part);
    }
  });
} else {
  c3.textContent = it.text;
}

    row.appendChild(c1);
    row.appendChild(cM);
    row.appendChild(c2);
    row.appendChild(c3);

    row.addEventListener("click", (ev) => {
      if (ev.shiftKey) {
        if (rangeAnchor < 0) rangeAnchor = selectedIndex >= 0 ? selectedIndex : idx;
        rangeEnd = idx;
        selectedIndex = idx;
        renderGrid();
        return;
      }

      rangeAnchor = -1;
      rangeEnd = -1;
      selectedIndex = idx;
      renderGrid();
    });

    row.addEventListener("dblclick", () => openEditDialog(idx));

    gridBody.appendChild(row);
  });

  updateHistoryHint();
  if (starsPanel && !starsPanel.classList.contains("hidden")) updateStarsPanel();
  updateQuickEdit();
}
// 調試：檢查結束時間是否有值
if (selectedIndex >= 0 && selectedIndex < subtitleItems.length) {
  const it = subtitleItems[selectedIndex];
  console.log("當前選中:", {
    index: selectedIndex,
    startMs: it.startMs,
    endMs: it.endMs,
    qeStart_Value: qeStart?.value,
    qeEnd_Value: qeEnd?.value,
    qeDuration_Value: qeDuration?.value
  });
}
function updateQuickEdit() {
  if (!quickEdit || selectedIndex < 0 || selectedIndex >= subtitleItems.length) {
    return;
  }
  const it = subtitleItems[selectedIndex];
  
  // 起始時間
  if (qeStart) {
    qeStart.value = msToSrtTime(it.startMs);
  }
  
  // 結束時間
  if (qeEnd) {
    qeEnd.value = msToSrtTime(it.endMs);
  }
  
  // 持續時間
  if (qeDuration) {
    const durMs = Math.max(0, it.endMs - it.startMs);
    qeDuration.value = (durMs / 1000).toFixed(2);
  }
  
  // 字幕內容
  if (qeText) {
    qeText.value = it.text || "";
  }
}

function toggleQuickEdit() {
  if (!quickEdit) return;
  const isHidden = quickEdit.style.display === "none";
  quickEdit.style.display = isHidden ? "block" : "none";
  if (isHidden) updateQuickEdit();
}

function getMarkedItems() {
  return subtitleItems.map((it, idx) => ({ it, idx })).filter((x) => !!x.it.mark);
}

function updateQuickEdit() {
  if (!quickEdit || selectedIndex < 0 || selectedIndex >= subtitleItems.length) {
    return;
  }
  const it = subtitleItems[selectedIndex];
  if (qeStart) qeStart.value = msToSrtTime(it.startMs);
  if (qeEnd) qeEnd.value = msToSrtTime(it.endMs);
  if (qeDuration) {
    const durMs = Math.max(0, it.endMs - it.startMs);
    qeDuration.value = (durMs / 1000).toFixed(2);
  }
  if (qeText) {
    qeText.value = it.text || "";
  }
}

function updateStarsPanel() {
  if (!starsList) return;
  const marked = getMarkedItems();
  if (!marked.length) {
    starsList.innerHTML = "（未有書籤）";
    return;
  }
  starsList.innerHTML = "";
  marked.forEach(({ it, idx }, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const text10 = String(it.text).replace(/\s+/g, " ").trim().slice(0, 10);
    btn.textContent = `${i + 1} ${msToSrtTime(it.startMs)} ${text10}`;
    btn.title = btn.textContent;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.textAlign = "left";
    btn.style.margin = "6px 0";
    btn.addEventListener("click", () => {
      selectedIndex = idx;
      renderGrid();
      document.querySelector(".gridRow.selected")?.scrollIntoView({ block: "center" });
    });
    starsList.appendChild(btn);
  });
}

function toggleStarsPanel() {
  if (!starsPanel) return;
  const willShow = starsPanel.classList.contains("hidden");
  starsPanel.classList.toggle("hidden", !willShow);
  if (willShow) updateStarsPanel();
}

function insertNewLineAfterSelected() {
  if (!subtitleItems.length) return;
  if (selectedIndex < 0) selectedIndex = 0;
  pushUndo("Insert line");
  const cur = subtitleItems[selectedIndex];
  const next = subtitleItems[selectedIndex + 1];
  const startMs = Number(cur?.endMs ?? 0);
  let endMs = startMs + 1000;
  if (next && Number.isFinite(next.startMs)) endMs = Math.min(endMs, next.startMs);
  subtitleItems.splice(selectedIndex + 1, 0, { startMs, endMs, text: "", mark: false });
  selectedIndex = selectedIndex + 1;
  renderGrid();
}

function deleteSelectedLine() {
  if (!subtitleItems.length) return;
  
  // 檢查係咪有範圍選擇（SHIFT + Click）
  let fromIdx = selectedIndex;
  let toIdx = selectedIndex;
  
  if (rangeAnchor >= 0 && rangeEnd >= 0) {
    // 有多行選擇，計算範圍
    fromIdx = Math.min(rangeAnchor, rangeEnd);
    toIdx = Math.max(rangeAnchor, rangeEnd);
  }
  
  // 檢查索引有效性
  if (fromIdx < 0 || fromIdx >= subtitleItems.length) return;
  if (toIdx < 0 || toIdx >= subtitleItems.length) return;
  
  // 決定刪除多少行
  const deleteCount = toIdx - fromIdx + 1;
  
  pushUndo(`Delete ${deleteCount} line${deleteCount > 1 ? 's' : ''}`);
  
  // 刪除範圍內的所有行
  subtitleItems.splice(fromIdx, deleteCount);
  
  // 清空範圍選擇
  rangeAnchor = -1;
  rangeEnd = -1;
  
  // 調整 selectedIndex
  if (!subtitleItems.length) {
    selectedIndex = -1;
  } else {
    selectedIndex = Math.min(fromIdx, subtitleItems.length - 1);
  }
  
  renderGrid();
}

// ---------- SRT read/write (minimal) ----------
function parseSrt(text) {
  const lines = String(text).split(/\r?\n/);
  const items = [];
  let i = 0;

  while (i < lines.length) {
    while (i < lines.length && !String(lines[i]).trim()) i++;
    if (i >= lines.length) break;

    const idxLine = String(lines[i]).trim();
    if (/^\d+$/.test(idxLine)) i++;

    const timeLine = String(lines[i] ?? "").trim();
    const m = timeLine.match(/^(\d\d:\d\d:\d\d,\d\d\d)\s*-->\s*(\d\d:\d\d:\d\d,\d\d\d)/);
    if (!m) { i++; continue; }
    const startMs = srtTimeToMs(m[1]);
    const endMs = srtTimeToMs(m[2]);
    i++;

    const textLines = [];
    while (i < lines.length && String(lines[i]).trim() !== "") {
      textLines.push(lines[i]);
      i++;
    }
    items.push({ startMs: startMs ?? 0, endMs: endMs ?? 0, text: textLines.join("\n"), mark: false });
    i++;
  }

  return items;
}

function writeSrt(items) {
  return items.map((it, idx) => {
    const a = msToSrtTime(it.startMs);
    const b = msToSrtTime(it.endMs);
    return `${idx + 1}\n${a} --> ${b}\n${String(it.text ?? "")}\n`;
  }).join("\n");
}

// ---------- File load/export ----------
async function doLoadFile(file) {
  const text = await file.text();
  currentFileName = file.name;
  if (editor) editor.value = text;
  if (statusLeft) statusLeft.textContent = currentFileName;

  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "srt") {
    subtitleItems = parseSrt(text).map((it) => ({ ...it, mark: false }));
    selectedIndex = subtitleItems.length ? 0 : -1;
  } else if (ext === "ass" || ext === "ssa") {
    subtitleItems = parseAss(text);
    selectedIndex = subtitleItems.length ? 0 : -1;
    if (!subtitleItems.length) alert("ASS/SSA: missing Events/Format/Dialogue");
  } else {
    subtitleItems = [];
    selectedIndex = -1;
  }

  if (editor && subtitleItems.length) editor.value = writeSrt(subtitleItems);
  renderGrid();
}

// ---------- Export Dialog ----------
function showExportDialog() {
  if (!exportMask || !exportDlg) return;
  exportMask.classList.remove('hidden');
  exportDlg.classList.remove('hidden');
  
  // 預設選 SRT
  const radios = document.querySelectorAll('input[name="exportFormat"]');
  radios.forEach(r => {
    if (r.value === 'srt') r.checked = true;
  });
}

function closeExportDialog() {
  if (exportMask) exportMask.classList.add('hidden');
  if (exportDlg) exportDlg.classList.add('hidden');
}

function doExport() {
  if (!subtitleItems.length) {
    alert('沒有字幕內容！');
    return;
  }
  
  const selected = document.querySelector('input[name="exportFormat"]:checked');
  if (!selected) return;
  
  const format = selected.value;
  const base = currentFileName ? currentFileName.replace(/\.(srt|ass|txt)$/i, '') : 'subtitle';
  
  if (format === 'srt') {
    // SRT 格式
    const out = subtitleItems.length ? writeSrt(subtitleItems) : (editor?.value ?? '');
    downloadText(`${base}.srt`, out, 'text/plain;charset=utf-8');
    
  } else if (format === 'txtWithTime') {
    // TXT 含時間
    const lines = [];
    subtitleItems.forEach((it, idx) => {
      lines.push(`${idx + 1}`);
      lines.push(`${msToSrtTime(it.startMs)} --> ${msToSrtTime(it.endMs)}`);
      lines.push((it.text || '').trim());
      lines.push('');
    });
    const content = lines.join('\n');
    downloadText(`${base}.txt`, content, 'text/plain;charset=utf-8');
    
  } else if (format === 'txtPlain') {
    // TXT 純文字
    const lines = [];
    subtitleItems.forEach(it => {
      const text = (it.text || '').trim();
      if (text) lines.push(text);
    });
    const content = lines.join('\n');
    downloadText(`${base}.txt`, content, 'text/plain;charset=utf-8');
  }
  
  closeExportDialog();
}

// ---------- Edit Dialog ----------
function showDialog(show) {
  if (!dlgMask || !dlg) return;
  dlgMask.classList.toggle("hidden", !show);
  dlg.classList.toggle("hidden", !show);
}

function openEditDialog(idx) {
  if (idx < 0 || idx >= subtitleItems.length) return;
  selectedIndex = idx;
  renderGrid();

  const it = subtitleItems[idx];
  dlgStart.value = msToSrtTime(it.startMs);
  dlgEnd.value = msToSrtTime(it.endMs);
  dlgText.value = it.text;

  const h = document.getElementById("dlgShiftHour");
  const m = document.getElementById("dlgShiftMinute");
  if (h) h.value = "0";
  if (m) m.value = "0";
  if (dlgShiftSec) dlgShiftSec.value = "0";
  if (dlgShiftMs) dlgShiftMs.value = "0";
  if (dlgScope) dlgScope.value = "only";
  if (dlgTimeMode) dlgTimeMode.value = "absolute";
  // 計算並顯示持續時間
  const durationMs = it.endMs - it.startMs;
  if (dlgDuration) {
    dlgDuration.value = (durationMs / 1000).toFixed(2);
  }

  showDialog(true);
  dlgText.focus();
}

function parseShiftDeltaMs() {
  const hStr = document.getElementById("dlgShiftHour")?.value?.trim();
  const mStr = document.getElementById("dlgShiftMinute")?.value?.trim();
  const sStr = dlgShiftSec?.value?.trim();
  const msStr = dlgShiftMs?.value?.trim();
  const h = hStr ? Number(hStr) : 0;
  const m = mStr ? Number(mStr) : 0;
  const s = sStr ? Number(sStr) : 0;
  const ms = msStr ? Number(msStr) : 0;
  if (![h, m, s, ms].every(Number.isFinite)) return 0;
  return Math.round((h * 3600 + m * 60 + s) * 1000 + ms);
}

function applyShift(items, from, to, deltaMs) {
  if (from > to) return;
  for (let i = from; i <= to; i++) {
    items[i].startMs = Math.max(0, items[i].startMs + deltaMs);
    items[i].endMs = Math.max(0, items[i].endMs + deltaMs);
    if (items[i].endMs < items[i].startMs) items[i].endMs = items[i].startMs;
  }
}

function applyDialogOk() {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) {
    showDialog(false);
    return;
  }

  pushUndo("Edit item");

  const newStart = srtTimeToMs(dlgStart.value);
  const newEndInput = srtTimeToMs(dlgEnd.value);
  if (newStart == null || newEndInput == null) {
    alert("時間格式必須係 00:00:00,000");
    return;
  }

  const oldStart = subtitleItems[selectedIndex].startMs;
  const oldEnd = subtitleItems[selectedIndex].endMs;
  const oldDurMs = Math.max(0, oldEnd - oldStart);

  let newEnd = newEndInput;

  // 如果你只是改開始時間而無改結束，沿用原本長度
  if (newStart !== oldStart && newEndInput === oldEnd) {
    newEnd = newStart + oldDurMs;
  }

  const mode = dlgTimeMode?.value ?? "absolute"; // absolute / relative
  const scope = dlgScope?.value ?? "only";       // only / down / up

  // 先寫入本行新數值
  subtitleItems[selectedIndex].startMs = newStart;
  subtitleItems[selectedIndex].endMs = newEnd;
  subtitleItems[selectedIndex].text = dlgText.value;

  // 決定要唔要「帶動其他行」
  let deltaMs = 0;

  if (mode === "relative") {
    // 只用平移：用下面平移區（時 / 分 / 秒 / 毫秒）計出 deltaMs
    deltaMs = parseShiftDeltaMs();
  }

  // 如果係「改成指定時間」且選擇 down/up，就用 (newStart - oldStart) 做 delta
  if (mode === "absolute" && scope !== "only") {
    deltaMs = newStart - oldStart;
  }

  // 真正去平移其他行（只係 scope != only 先會郁其他行）
  if (deltaMs !== 0) {
    if (scope === "only") {
      applyShift(subtitleItems, selectedIndex, selectedIndex, deltaMs);
    } else if (scope === "down") {
      applyShift(subtitleItems, selectedIndex + 1, subtitleItems.length - 1, deltaMs);
    } else if (scope === "up") {
      applyShift(subtitleItems, 0, selectedIndex - 1, deltaMs);
    }
  }

  renderGrid();
  showDialog(false);
  if (statusLeft) statusLeft.textContent = currentFileName ? currentFileName : "";
}

function buildProjectJsonString() {
  // 檢查當前是否在 Word 模式
  const isWordMode = document.body.classList.contains('wordModeActive');
  
  // 收集 Word 內容
  let wordContent = '';
  const wordEditor = document.getElementById('wordEditor');
  if (wordEditor) {
    wordContent = wordEditor.innerHTML || '';
  }
  
  // 收集快照數據（從 snapshotCompare.js）
  let snapshotData = null;
  if (typeof window.getSavedSnapshot === 'function') {
    snapshotData = window.getSavedSnapshot();
  }
  
  return JSON.stringify({
    app: 'RIOsrtEdit',
    format: 'avrio',
    version: 1,
    savedAt: new Date().toISOString(),
    lastMode: isWordMode ? 'word' : 'subtitle',
    items: subtitleItems.map(it => ({
      startMs: Number(it.startMs) || 0,
      endMs: Number(it.endMs) || 0,
      text: String(it.text) ?? '',
      mark: !!it.mark,
    })),
    noteText: savedNoteText,
    wordContent: wordContent,
    snapshot: snapshotData  // 儲存快照
  }, null, 2);
}

function suggestedProjectFilename() {
  const base = currentFileName ? currentFileName.replace(/\.[^.]+$/, "") : "project";
  return `${base}.avrio.json`;
}

async function exportProject(saveAs = false) {
  saveNoteToStorage();
  const data = buildProjectJsonString();
  const filename = suggestedProjectFilename();

  if (!saveAs && lastProjectSaveHandle) {
    try {
      const writable = await lastProjectSaveHandle.createWritable();
      await writable.write(data);
      await writable.close();
      statusLeft.textContent = lastProjectSaveHandle.name;
      return;
    } catch (e) {
      console.error('exportProject (reuse-handle)', e?.name, e?.message, e);
      lastProjectSaveHandle = null;
    }
  }

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'AVRIO Project',
          accept: { 'application/json': ['.json', '.avrio.json'] },
        }],
      });
      lastProjectSaveHandle = handle;
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
      statusLeft.textContent = handle.name;
      return;
    } catch (e) {
      console.error('exportProject', e?.name, e?.message, e);
      if (e?.name === 'AbortError') return;
    }
  }

  downloadText(filename, data, 'application/json;charset=utf-8');
  statusLeft.textContent = `(fallback) ${filename}`;
}

async function importProjectFile(file) {
  const text = await file.text();
  const obj = JSON.parse(text);
  
  if (!obj || obj.format !== 'avrio' || !Array.isArray(obj.items)) {
    alert('Not avrio');
    return;
	
  }
  
  // 載入筆記
  if (obj.noteText) {
    savedNoteText = obj.noteText;
    if (noteText) noteText.value = obj.noteText;
  } else {
    clearNoteText();
  }
  
  // 載入字幕數據
  subtitleItems = obj.items.map(it => ({
    startMs: Number(it.startMs) || 0,
    endMs: Number(it.endMs) || 0,
    text: String(it.text) ?? '',
    mark: !!it.mark,
  }));
  
  selectedIndex = subtitleItems.length ? 0 : -1;
  currentFileName = file.name.replace(/\.avrio\.json$/i, '.srt');
  
  if (editor) {
    editor.value = writeSrt(subtitleItems);
  }
  if (statusLeft) {
    statusLeft.textContent = file.name;
  }
  
  // 必須先 renderGrid() 更新字幕列表
  renderGrid();
  
  // 取得 DOM 元素
  const subtitleMode = document.getElementById('subtitleMode');
  const wordMode = document.getElementById('wordMode');
  const wordEditor = document.getElementById('wordEditor');
  
  // 載入 Word 內容（如果有）
  if (obj.wordContent && typeof obj.wordContent === 'string' && wordEditor) {
    wordEditor.innerHTML = obj.wordContent;
    console.log('✅ Word 內容已載入');
  }
  
  // 根據 lastMode 決定進入哪個模式
  if (obj.lastMode === 'word' && subtitleMode && wordMode) {
    // 上次在 Word 模式，自動進入 Word 模式
    subtitleMode.style.display = 'none';
    wordMode.style.display = 'flex';
    document.body.classList.add('wordModeActive');
    console.log('✅ 已切換到 Word 模式');
  } else {
  // 預設保持在字幕模式
    if (subtitleMode) subtitleMode.style.display = 'block';
    if (wordMode) wordMode.style.display = 'none';
    document.body.classList.remove('wordModeActive');
    console.log('✅ 已切換到字幕模式');
  }
  
  // 載入快照（如果有）
  if (obj.snapshot && Array.isArray(obj.snapshot) && obj.snapshot.length > 0) {
    if (typeof window.setSavedSnapshot === 'function') {
      window.setSavedSnapshot(obj.snapshot);
      console.log('✅ 快照已載入:', obj.snapshot.length, '筆');
    }
  } else {
    if (typeof window.setSavedSnapshot === 'function') {
      window.setSavedSnapshot(null);
    }
  }
}

function suggestedProjectFilename() {
  const base = currentFileName ? currentFileName.replace(/\.[^.]+$/, "") : "project";
  return `${base}.avrio.json`;
}


// ---------- Floating video ----------
function setVideoCollapsed(collapsed) {
  if (!videoFloat) return;
  videoFloat.classList.toggle("videoCollapsed", !!collapsed);
  if (btnVideoToggle) btnVideoToggle.textContent = collapsed ? "◀" : "▶";
  if (collapsed && videoEl && !videoEl.paused) videoEl.pause();
}

function showVideoBar() {
  if (!videoFloat) return;
  videoFloat.classList.remove("hidden"); // bar always visible
  setVideoCollapsed(true);               // default collapsed
}

function loadVideoFile(file) {
  if (!file || !videoEl) return;
  const url = URL.createObjectURL(file);
  videoEl.src = url;
  videoEl.load();
  videoFloat?.classList.remove("hidden");
  setVideoCollapsed(false); // auto expand after load
}

function stepVideo(sec) {
  if (!videoEl || !videoEl.src) return;
  videoEl.currentTime = Math.max(0, (videoEl.currentTime || 0) + sec);
}

// ---------- Keyboard ----------
window.addEventListener("keydown", (e) => {
  const dialogOpen = dlg && !dlg.classList.contains("hidden");

  // Esc closes edit dialog
  if (e.key === "Escape" && dialogOpen) {
    e.preventDefault();
    showDialog(false);
    return;
  }

  // Ctrl/Cmd shortcuts
  if ((e.ctrlKey || e.metaKey) && !e.altKey) {
    const k = e.key.toLowerCase();
    if (k === "z") {
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
      return;
    }
    if (k === "y") {
      e.preventDefault();
      doRedo();
      return;
    }
    if (k === "f") {
      e.preventDefault();
      showFindDialog(true);
      return;
    }
  }

  // typing in inputs -> ignore single-key hotkeys
  const tag = document.activeElement?.tagName?.toLowerCase();
  const typing = tag === "input" || tag === "textarea" || tag === "select";
  if (typing) return;

  // B toggle bookmark/star
  if (e.key === "b" || e.key === "B") {
    if (!subtitleItems?.length) return;
    if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
    e.preventDefault();
    pushUndo("Toggle bookmark");
    subtitleItems[selectedIndex].mark = !subtitleItems[selectedIndex].mark;
    renderGrid();
    return;
  }
});
// ========== 快速編輯區事件 ==========
quickEditToggle?.addEventListener("click", toggleQuickEdit);

qeStartMinus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整起始時間");
  subtitleItems[selectedIndex].startMs = Math.max(0, subtitleItems[selectedIndex].startMs - 1000);
  renderGrid();
});

qeStartPlus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整起始時間");
  subtitleItems[selectedIndex].startMs += 1000;
  renderGrid();
});


qeDuration?.addEventListener("blur", () => {
  if (selectedIndex >= 0) pushUndo("快速編輯：修改持續時間");
});
// 持續時間 -1 秒
qeDurMinus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整持續時間");
  const it = subtitleItems[selectedIndex];
  const newDurMs = Math.max(100, (it.endMs - it.startMs) - 1000);
  it.endMs = it.startMs + newDurMs;
  renderGrid();
});

// 持續時間 +1 秒
qeDurPlus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整持續時間");
  const it = subtitleItems[selectedIndex];
  it.endMs = it.endMs + 1000;
  renderGrid();
});

// 結束時間 -1 秒
qeEndMinus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整結束時間");
  const it = subtitleItems[selectedIndex];
  it.endMs = Math.max(it.startMs + 100, it.endMs - 1000);
  renderGrid();
});

// 結束時間 +1 秒
qeEndPlus1?.addEventListener("click", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  pushUndo("快速編輯：調整結束時間");
  const it = subtitleItems[selectedIndex];
  it.endMs = it.endMs + 1000;
  renderGrid();
});

qeText?.addEventListener("input", () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  subtitleItems[selectedIndex].text = qeText.value;
});

qeText?.addEventListener("blur", () => {
  if (selectedIndex >= 0) {
    pushUndo("快速編輯：修改文字");
    renderGrid();
  }
});

qePrev?.addEventListener("click", () => {
  if (selectedIndex > 0) {
    selectedIndex--;
    rangeAnchor = -1;
    rangeEnd = -1;
    renderGrid();
    setTimeout(() => {
      const row = document.querySelector(".gridRow.selected");
      if (row) {
        row.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 50);
  }
});

qeNext?.addEventListener("click", () => {
  if (selectedIndex < subtitleItems.length - 1) {
    selectedIndex++;
    rangeAnchor = -1;
    rangeEnd = -1;
    renderGrid();
    setTimeout(() => {
      const row = document.querySelector(".gridRow.selected");
      if (row) {
        row.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 50);
  }
});
qeApply?.addEventListener('click', () => {
  if (selectedIndex < 0 || selectedIndex >= subtitleItems.length) return;
  
  pushUndo('快速編輯');
  
  const it = subtitleItems[selectedIndex];
  
  // 套用開始時間
  const newStartMs = srtTimeToMs(qeStart.value);
  if (newStartMs !== null) {
    it.startMs = newStartMs;
  }
  
  // 套用結束時間
  const newEndMs = srtTimeToMs(qeEnd.value);
  if (newEndMs !== null) {
    it.endMs = newEndMs;
  }
  
  // 套用文字
  it.text = qeText.value;
  
  renderGrid();
});

// ---------- Wire events ----------

btnNewFile?.addEventListener("click", doNewFile);
btnOpen?.addEventListener("click", doOpenDialog);
btnOpen2?.addEventListener("click", doOpenDialog);
btnUndo?.addEventListener("click", doUndo);
btnRedo?.addEventListener("click", doRedo);
btnInsLine?.addEventListener("click", insertNewLineAfterSelected);
btnDelLine?.addEventListener("click", deleteSelectedLine);

btnSearch?.addEventListener("click", () => showFindDialog(!isFindDialogOpen()));
btnFindClose?.addEventListener("click", () => showFindDialog(false));
btnFindNext?.addEventListener("click", findNext);
btnFindPrev?.addEventListener("click", findPrev);  // ← 加這行
btnReplaceOne?.addEventListener("click", replaceOne);
btnReplaceAll?.addEventListener("click", replaceAll);

findQ?.addEventListener("input", () => {
  findLastQuery = "";
  findLastIndex = -1;
  updateFindInfo();
});
findQ?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); findNext(); }
  if (e.key === "Escape") { e.preventDefault(); showFindDialog(false); }
});

fileInput?.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  await doLoadFile(file);
});

btnKeepZh?.addEventListener("click", () => {
  if (!openccConverter) return;
  if (!subtitleItems.length) return;
  pushUndo("Keep Chinese line");
  subtitleItems = subtitleItems.map((it) => ({ ...it, text: keepBestChineseLine(it.text) }));
  renderGrid();
});


btnConvert?.addEventListener("click", () => {
  if (subtitleItems.length) {
    subtitleItems = subtitleItems.map((it) => ({ ...it, text: convertS2T(it.text) }));
    renderGrid();
  } else if (editor) {
    editor.value = convertS2T(editor.value);
  }
});

btnRemoveFx?.addEventListener("click", () => {
  if (subtitleItems.length) {
    subtitleItems = subtitleItems.map((it) => ({ ...it, text: removeAssOverrideBlocks(it.text) }));
    renderGrid();
  } else if (editor) {
    editor.value = removeAssOverrideBlocks(editor.value);
  }
});
// 搜尋 - 加入上一個按鈕
if (btnFindPrev) btnFindPrev.addEventListener("click", findPrev);

// 魔術筆
if (btnMagicWand) btnMagicWand.addEventListener("click", showMagicDialog);
if (btnMagicCancel) btnMagicCancel.addEventListener("click", closeMagicDialog);
if (btnMagicApply) btnMagicApply.addEventListener("click", applyMagicWand);
if (magicMask) magicMask.addEventListener("click", closeMagicDialog);

// 統一匯出 - 彈出對話框選擇格式
btnExportSrt?.addEventListener('click', showExportDialog);

// Export dialog events
btnExportCancel?.addEventListener('click', closeExportDialog);
exportMask?.addEventListener('click', closeExportDialog);
btnExportConfirm?.addEventListener('click', doExport);

// 記事本匯入匯出
if (btnNoteExport) btnNoteExport.addEventListener("click", doNoteExport);
if (btnNoteImport) btnNoteImport.addEventListener("click", doNoteImport);
if (noteImportInput) noteImportInput.addEventListener("change", handleNoteImport);

// ===== 移除舊的 btnRemoveFx 監聽器 =====
// 如果有以下代碼，請刪除：
// if (btnRemoveFx) btnRemoveFx.addEventListener("click", ...);

function syncThemeIcon() {
  if (!btnTheme) return;
  const isLight = document.body.classList.contains("light");
  btnTheme.textContent = isLight ? "☀️" : "🌙";
}
btnTheme?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  syncThemeIcon();
});

btnClear?.addEventListener("click", () => {
  currentFileName = "";
  if (editor) editor.value = "";
  subtitleItems = [];
  selectedIndex = -1;
  rangeAnchor = -1;
  rangeEnd = -1;
  renderGrid();
});

btnFillTest?.addEventListener("click", () => {
  const srt = [
    "1",
    "00:00:01,000 --> 00:00:02,000",
    "你好 world",
    "",
    "2",
    "00:00:03,500 --> 00:00:05,000",
    "测试 简体",
    "",
  ].join("\n");
  if (editor) editor.value = srt;
  currentFileName = "test.srt";
  subtitleItems = parseSrt(srt).map((it) => ({ ...it, mark: false }));
  selectedIndex = subtitleItems.length ? 0 : -1;
  renderGrid();
});

btnStars?.addEventListener("click", toggleStarsPanel);
btnStarsRefresh?.addEventListener("click", updateStarsPanel);

dlgCancel?.addEventListener("click", () => showDialog(false));
dlgMask?.addEventListener("click", () => showDialog(false));
dlgOk?.addEventListener("click", applyDialogOk);
dlgApply?.addEventListener('click', () => {
  applyDialogOk();
  // 不關閉對話框，重新載入當前行數據
  if (selectedIndex >= 0 && selectedIndex < subtitleItems.length) {
    const it = subtitleItems[selectedIndex];
    dlgStart.value = msToSrtTime(it.startMs);
    dlgEnd.value = msToSrtTime(it.endMs);
    dlgText.value = it.text;
  }
});

// Note panel events
btnNote?.addEventListener("click", toggleNotePanel);

btnNoteToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleNotePanel();
});

noteText?.addEventListener("input", () => {
  // 每當使用者輸入時，自動保存
  saveNoteToStorage();
});

// 當頁面關閉前，確保儲存記事
window.addEventListener("beforeunload", () => {
  saveNoteToStorage();
});

// 時間快速調整功能
function adjustTime(field, deltaSec) {
  const input = field === 'start' ? dlgStart : dlgEnd;
  if (!input) return;
  
  const currentMs = srtTimeToMs(input.value);
  if (currentMs === null) return;
  
  const newMs = Math.max(0, currentMs + Math.round(deltaSec * 1000));
  input.value = msToSrtTime(newMs);
  
  // 更新持續時間顯示
  updateDurationDisplay();
}

function updateDurationDisplay() {
  if (!dlgDuration || !dlgStart || !dlgEnd) return;
  const startMs = srtTimeToMs(dlgStart.value);
  const endMs = srtTimeToMs(dlgEnd.value);
  if (startMs !== null && endMs !== null) {
    const durationMs = endMs - startMs;
    dlgDuration.value = (durationMs / 1000).toFixed(2);
  }
}

// 開始時間按鈕
btnStartMinus3?.addEventListener("click", () => adjustTime('start', -3));
btnStartMinus2?.addEventListener("click", () => adjustTime('start', -2));
btnStartMinus1?.addEventListener("click", () => adjustTime('start', -1));
btnStartPlus1?.addEventListener("click", () => adjustTime('start', 1));
btnStartPlus2?.addEventListener("click", () => adjustTime('start', 2));
btnStartPlus3?.addEventListener("click", () => adjustTime('start', 3));

btnStartCustom?.addEventListener("click", () => {
  const sec = parseFloat(dlgStartCustom?.value || 0);
  if (isNaN(sec)) return;
  adjustTime('start', sec);
});

// 結束時間按鈕
btnEndMinus3?.addEventListener("click", () => adjustTime('end', -3));
btnEndMinus2?.addEventListener("click", () => adjustTime('end', -2));
btnEndMinus1?.addEventListener("click", () => adjustTime('end', -1));
btnEndPlus1?.addEventListener("click", () => adjustTime('end', 1));
btnEndPlus2?.addEventListener("click", () => adjustTime('end', 2));
btnEndPlus3?.addEventListener("click", () => adjustTime('end', 3));

btnEndCustom?.addEventListener("click", () => {
  const sec = parseFloat(dlgEndCustom?.value || 0);
  if (isNaN(sec)) return;
  adjustTime('end', sec);
});

// 持續時間功能
btnDurationApply?.addEventListener("click", () => {
  if (!dlgStart || !dlgEnd || !dlgDuration) return;
  
  const startMs = srtTimeToMs(dlgStart.value);
  const durationSec = parseFloat(dlgDuration.value || 0);
  
  if (startMs === null || isNaN(durationSec)) return;
  
  const newEndMs = startMs + Math.round(durationSec * 1000);
  dlgEnd.value = msToSrtTime(Math.max(0, newEndMs));
  
  updateDurationDisplay();
});

// 當手動修改時間時，自動更新持續時間顯示
dlgStart?.addEventListener("input", updateDurationDisplay);
dlgEnd?.addEventListener("input", updateDurationDisplay);

btnSaveProj?.addEventListener("click", () => exportProject(false));
// 字幕模式：另存新檔
const btnSaveProjAs = document.querySelector('#btnSaveProjAs');
if (btnSaveProjAs) {
  btnSaveProjAs.addEventListener('click', () => {
    console.log('✅ 另存新檔按鈕已按下');  // 測試用
    lastProjectSaveHandle = null;
    exportProject(true);
  });
} else {
  console.error('❌ btnSaveProjAs 按鈕搵唔到');
}

btnOpenProj?.addEventListener("click", () => {
  if (!projInput) return;
  projInput.value = "";
  projInput.click();
});
projInput?.addEventListener("change", async () => {
  const file = projInput.files?.[0];
  if (!file) return;
  await importProjectFile(file);
});
// video events
btnVideo?.addEventListener("click", () => {
  showVideoBar();
  videoInput?.click();
});
btnVideoPick?.addEventListener("click", () => {
  showVideoBar();
  videoInput?.click();
});
videoInput?.addEventListener("change", () => {
  const f = videoInput.files?.[0];
  if (f) loadVideoFile(f);
});
btnVideoToggle?.addEventListener("click", () => {
  if (!videoFloat) return;
  const collapsed = videoFloat.classList.contains("videoCollapsed");
  setVideoCollapsed(!collapsed);
});
btnVPlay?.addEventListener("click", () => {
  if (!videoEl || !videoEl.src) return;
  if (videoEl.paused) videoEl.play();
  else videoEl.pause();
});
btnVBack3?.addEventListener("click", () => stepVideo(-3));
btnVBack2?.addEventListener("click", () => stepVideo(-2));
btnVBack1?.addEventListener("click", () => stepVideo(-1));
btnVFwd1?.addEventListener("click", () => stepVideo(1));
btnVFwd2?.addEventListener("click", () => stepVideo(2));
btnVFwd3?.addEventListener("click", () => stepVideo(3));

// ---------- Video sync (follow video -> select subtitle row) ----------
function findSubtitleIndexByVideoTimeMs(videoTimeSec){
  const items = Array.isArray(subtitleItems) ? subtitleItems : [];
  if (!items.length) return -1;
  
  const tMs = Math.floor(Number(videoTimeSec || 0) * 1000) + Number(videoOffsetMs || 0);
  
  // 1) Exact hit: start <= t < end (priority)
  for (const it of items) {
    if (tMs >= it.startMs && tMs < it.endMs) {
      return items.indexOf(it);
    }
  }
  
  // 2) Fallback: last start <= t (gap-friendly)
  let best = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i].startMs <= tMs) best = i;
    else break;
  }
  return best;
}

function syncSubtitleToVideo(){
  if (!followVideo) return;
  if (!videoEl || !videoEl.src) return;

  const idx = findSubtitleIndexByVideoTimeMs(videoEl.currentTime);
  if (idx < 0 || idx === selectedIndex) return;

  selectedIndex = idx;
  rangeAnchor = -1;
  rangeEnd = -1;

  renderGrid();
  document.querySelector(".gridRow.selected")?.scrollIntoView({ block: "center" });
}

// 更新影片上的字幕顯示
function updateVideoSubtitle() {
  if (!videoEl || !videoEl.src || !videoSubtitle) return;
  
  const currentTimeMs = Math.floor(videoEl.currentTime * 1000);
  const items = Array.isArray(subtitleItems) ? subtitleItems : [];
  
  // 尋找當前時間對應的字幕
  let currentSubtitle = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const adjustedTime = currentTimeMs + Number(videoOffsetMs || 0);
    if (adjustedTime >= item.startMs && adjustedTime < item.endMs) {
      currentSubtitle = item.text || "";
      break;
    }
  }
  
  // 更新字幕顯示
  videoSubtitle.textContent = currentSubtitle;
}

// Toggle follow mode (F8)
window.addEventListener("keydown", (e) => {
  if (e.key !== "F8") return;
  e.preventDefault();

  followVideo = !followVideo;

  // show state in statusRight (keep your original UTF-8 / OpenCC status text)
  if (statusRight){
    const base = String(statusRight.textContent ?? "").split(" | Follow ")[0];
    statusRight.textContent = base + " | Follow " + (followVideo ? "ON" : "OFF");
  }

  if (followVideo) syncSubtitleToVideo();
});

// Listen video events
let _lastSyncAt = 0;
videoEl?.addEventListener("timeupdate", () => {
  const now = performance.now();
  if (now - _lastSyncAt < 150) return;
  _lastSyncAt = now;
  syncSubtitleToVideo();
  updateVideoSubtitle();
});
videoEl?.addEventListener("seeked", () => syncSubtitleToVideo());

// 時間bar功能：同步影片時間到時間bar
videoEl?.addEventListener("timeupdate", () => {
  if (!videoSeek || !videoEl || !videoEl.duration) return;
  const percent = (videoEl.currentTime / videoEl.duration) * 100;
  videoSeek.value = percent;
});

// 時間bar功能：拉動時間bar更新影片時間
videoSeek?.addEventListener("input", () => {
  if (!videoSeek || !videoEl || !videoEl.duration) return;
  const newTime = (videoSeek.value / 100) * videoEl.duration;
  videoEl.currentTime = newTime;
});

// 時間bar功能：載入影片時重置時間bar
videoEl?.addEventListener("loadedmetadata", () => {
  if (!videoSeek) return;
  videoSeek.value = 0;
});

videoEl?.addEventListener("play", () => updateVideoSubtitle());
videoEl?.addEventListener("pause", () => updateVideoSubtitle());

// ---------- Batch (drag&drop -> SRT -> ZIP) ----------
const btnBatch = document.querySelector("#btnBatch");
const batchMask = document.querySelector("#batchMask");
const batchDlg = document.querySelector("#batchDlg");
const batchDrop = document.querySelector("#batchDrop");
const batchInfo = document.querySelector("#batchInfo");
const batchProg = document.querySelector("#batchProg");
const batchProgText = document.querySelector("#batchProgText");
const btnBatchPick = document.querySelector("#btnBatchPick");
const btnBatchRun = document.querySelector("#btnBatchRun");
const btnBatchClose = document.querySelector("#btnBatchClose");
const batchInput = document.querySelector("#batchInput");

let batchFiles = [];

function showBatch(show) {
  if (!batchMask || !batchDlg) return;
  batchMask.classList.toggle("hidden", !show);
  batchDlg.classList.toggle("hidden", !show);
}

function setBatchProgress(pct, msg) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  if (batchProg) batchProg.value = p;
  if (batchProgText) batchProgText.textContent = msg || `${p.toFixed(0)}%`;
}

function updateBatchInfo() {
  if (!batchInfo) return;
  batchInfo.textContent = batchFiles.length ? `已選擇 ${batchFiles.length} 個檔案` : "未選擇檔案";
  if (btnBatchRun) btnBatchRun.disabled = batchFiles.length === 0;
}

function outNameToSrt(fileName) {
  const base = String(fileName || "file").replace(/\.[^.]+$/, "");
  return `${base}.srt`;
}

async function fileToSrtText(file) {
  const name = String(file?.name || "").toLowerCase();
  const text = await file.text();

  // ASS/SSA -> parse -> remove effects -> (optional) s2t -> SRT
  if (name.endsWith(".ass") || name.endsWith(".ssa")) {
    let items = parseAss(text);
    items = items.map((it) => ({ ...it, text: removeAssOverrideBlocks(it.text) }));
    if (openccConverter) items = items.map((it) => ({ ...it, text: convertS2T(it.text) }));
    return writeSrt(items);
  }

  // SRT -> (optional) s2t -> normalized SRT
  if (name.endsWith(".srt")) {
    let items = parseSrt(text);
    if (openccConverter) items = items.map((it) => ({ ...it, text: convertS2T(it.text) }));
    return writeSrt(items);
  }

  // TXT fallback
  return openccConverter ? convertS2T(text) : text;
}

async function runBatchZip() {
  if (!batchFiles.length) return;

  if (!window.JSZip) {
    alert("JSZip 未載入：請確認 index.html 已加入 vendor/jszip/jszip.min.js，並放喺 app.js 前面。");
    return;
  }

  setBatchProgress(0, "準備中…");

  const zip = new JSZip();

  // convert stage (0-70)
  for (let i = 0; i < batchFiles.length; i++) {
    const f = batchFiles[i];
    setBatchProgress(Math.round((i / batchFiles.length) * 70), `轉換中… ${f.name}`);
    const srtText = await fileToSrtText(f);
    zip.file(outNameToSrt(f.name), srtText);
  }
async function doBatchProcess() {
  // ... 前面代碼保持不變 ...
  
  // 加入匯出格式選擇
  const format = prompt("選擇匯出格式：\n\n1 = SRT（含時間）\n2 = TXT（含時間）\n3 = TXT（純文字）\n\n請輸入 1、2 或 3：", "1");
  
  if (!format || !["1", "2", "3"].includes(format)) {
    alert("已取消批次處理");
    return;
  }
  
  const exportFormat = format === "1" ? "srt" : "txt";
  const includeTiming = format !== "3";
  
  // ... 處理每個檔案 ...
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // ... 解析 ASS/SRT ...
    
    let output = "";
    if (exportFormat === "srt") {
      output = writeSrt(items);
    } else {
      // TXT 格式
      const lines = [];
      items.forEach((it, idx) => {
        if (includeTiming) {
          lines.push(`${idx + 1}`);
          lines.push(`${msToSrtTime(it.startMs)} --> ${msToSrtTime(it.endMs)}`);
          lines.push((it.text || "").trim());
          lines.push("");
        } else {
          const text = (it.text || "").trim();
          if (text) lines.push(text);
        }
      });
      output = lines.join("\n");
    }
    
    const outName = file.name.replace(/\.(ass|srt)$/i, `.${exportFormat}`);
    zip.file(outName, output);
    
    // 更新進度
    const pct = Math.round(((i + 1) / files.length) * 100);
    if (batchProgress) batchProgress.textContent = `${pct}%`;
  }
  
  // ... 後面代碼保持不變 ...
}

  // zip stage (70-100)
  setBatchProgress(70, "打包 ZIP…");
  const blob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE" },
    (meta) => {
      const pct = 70 + meta.percent * 0.3;
      setBatchProgress(pct, `打包 ZIP… ${meta.percent.toFixed(0)}% ${meta.currentFile || ""}`);
    }
  );

  setBatchProgress(100, "完成，下載中…");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "batch_srt.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);

  setBatchProgress(0, "完成");
}

function stopDnd(e) { e.preventDefault(); e.stopPropagation(); }

// enable toolbar button (it is disabled in HTML)
if (btnBatch) btnBatch.disabled = false;

// open dialog
btnBatch?.addEventListener("click", () => {
  if (!batchMask || !batchDlg) {
    alert("找不到批次處理視窗：請先把 batchMask/batchDlg 那段 HTML 加到 index.html");
    return;
  }
  batchFiles = [];
  updateBatchInfo();
  setBatchProgress(0, "0%");
  showBatch(true);
});

btnBatchClose?.addEventListener("click", () => showBatch(false));
batchMask?.addEventListener("click", () => showBatch(false));

btnBatchPick?.addEventListener("click", () => {
  if (!batchInput) return;
  batchInput.value = "";
  batchInput.click();
});

batchInput?.addEventListener("change", () => {
  batchFiles = [...(batchInput.files || [])];
  updateBatchInfo();
});

btnBatchRun?.addEventListener("click", runBatchZip);

// drag & drop
batchDrop?.addEventListener("dragenter", stopDnd);
batchDrop?.addEventListener("dragover", stopDnd);
batchDrop?.addEventListener("drop", (e) => {
  stopDnd(e);
  batchFiles = [...(e.dataTransfer?.files || [])];
  updateBatchInfo();
});
if (btnConvert) btnConvert.disabled = true;
if (btnSearch) btnSearch.disabled = false;
if (findMask) findMask.classList.add("hidden");

if (findDlg) {
  findDlg.style.maxHeight = "240px";
  findDlg.style.overflow = "auto";
  makeDraggable(findDlg, findDlg.querySelector(".dlgTitle"));
  makeDraggable(dlg, dlg.querySelector('.dlgTitle')) 
}

loadNoteFromStorage();
renderGrid();
syncThemeIcon();
initOpenCC();
showVideoBar();
// ========== Word 模式專用按鈕綁定 ==========
const wordModeBtnSaveProj = document.getElementById('btnSaveProjWord');
const wordModeBtnOpenProj = document.getElementById('btnOpenProjWord');

// Word 模式：儲存專案
if (wordModeBtnSaveProj) {
  wordModeBtnSaveProj.addEventListener('click', () => {
    exportProject(false);
  });
  console.log('✅ Word 儲存按鈕已綁定');
}

// Word 模式：開啟專案
if (wordModeBtnOpenProj) {
  wordModeBtnOpenProj.addEventListener('click', () => {
    if (!projInput) return;
    projInput.value = '';
    projInput.click();
  });
  console.log('✅ Word 開啟按鈕已綁定');
}
// Word 模式：另存新檔
const btnSaveProjWordAs = document.getElementById('btnSaveProjWordAs');
if (btnSaveProjWordAs) {
  btnSaveProjWordAs.addEventListener('click', () => {
    lastProjectSaveHandle = null;  // 清除記憶
    exportProject(true);           // true = 強制另存
  });
}

// ========== 以下是原有的 Word 對話框代碼 ==========

// ===== Word 模式整合 =====

// Word 模式按鈕
const btnWordMode = sel('#btnWordMode');
const btnBackToSubtitle = sel('#btnBackToSubtitle');

// 匯入對話框
const wordImportMask = sel('#wordImportMask');
const wordImportDlg = sel('#wordImportDlg');
const wordImportCancel = sel('#wordImportCancel');
const wordImportConfirm = sel('#wordImportConfirm');

// 回傳對話框
const wordExportMask = sel('#wordExportMask');
const wordExportDlg = sel('#wordExportDlg');
const wordExportCancel = sel('#wordExportCancel');
const wordExportConfirm = sel('#wordExportConfirm');

// 切換到 Word 模式
function switchToWordMode() {
  // 隱藏字幕模式
  document.body.classList.add('wordModeActive');
  document.getElementById('subtitleMode').style.display = 'none';
  
  // 顯示 Word 模式
  document.getElementById('wordMode').style.display = 'flex';
  
  // 初始化 Word（第一次）
if (!WordCore.initialized) {
  try {
    WordCore.init();
    WordFormat.init();
  } catch (e) {
    console.error('Word init failed:', e);
  }
}
  
  WordCore.active = true;
  console.log('✅ 切換到 Word 模式');
}

// 返回字幕模式
function switchToSubtitleMode() {
  // 顯示字幕模式
  document.body.classList.remove('wordModeActive');
  document.getElementById('subtitleMode').style.display = 'block';
  
  // 隱藏 Word 模式
  document.getElementById('wordMode').style.display = 'none';
  
  WordCore.active = false;
  console.log('✅ 返回字幕模式');
}

// 顯示匯入對話框
function showWordImportDialog() {
  const mask = document.getElementById('wordImportMask');
  const dlg  = document.getElementById('wordImportDlg');
  if (!mask || !dlg) return;
  mask.style.display = 'flex';   // 原本 block
  dlg.style.display  = 'block';
}

function hideWordImportDialog() {
  const mask = document.getElementById('wordImportMask');
  const dlg  = document.getElementById('wordImportDlg');
  if (mask) mask.style.display = 'none';
  if (dlg)  dlg.style.display  = 'none';
}

function showWordExportDialog() {
  const mask = document.getElementById('wordExportMask');
  const dlg = document.getElementById('wordExportDlg');
  if (!mask || !dlg) return;
  mask.style.display = 'block';
  dlg.style.display = 'block';
}

function hideWordExportDialog() {
  const mask = document.getElementById('wordExportMask');
  const dlg = document.getElementById('wordExportDlg');
  if (mask) mask.style.display = 'none';
  if (dlg) dlg.style.display = 'none';
}

// 綁定按鈕：進入 Word 模式
if (btnWordMode) {
  btnWordMode.onclick = () => {
    switchToWordMode();
    showWordImportDialog();
  };
}

// 綁定按鈕：返回字幕模式
if (btnBackToSubtitle) {
  btnBackToSubtitle.onclick = () => {
    showWordExportDialog();
  };
}

// 匯入對話框：取消
if (wordImportCancel) {
  wordImportCancel.onclick = () => {
    hideWordImportDialog();
    switchToSubtitleMode(); // 返回字幕模式
  };
}

// 匯入對話框：確定
if (wordImportConfirm) {
  wordImportConfirm.onclick = () => {
    const mode = document.querySelector('input[name="wordImportMode"]:checked')?.value;
    hideWordImportDialog();
    
    // 如果選擇「完全不變更」，直接返回不做任何事
    if (mode === 'noChange') {
      return;
    }
    
    WordData.importFromSubtitles(mode);
  };
}

// 回傳對話框：取消
if (wordExportCancel) {
  wordExportCancel.onclick = () => {
    hideWordExportDialog();
  };
}

// 回傳對話框：確定
if (wordExportConfirm) {
  wordExportConfirm.onclick = () => {
    const mode = document.querySelector('input[name="wordExportMode"]:checked')?.value;
    hideWordExportDialog();
    
    // 新增：完全不變更模式
    if (mode === 'noChange') {
      // 直接返回字幕模式，不做任何改變
      switchToSubtitleMode();
      return;
    }
    
    // 原有邏輯：更新字幕
    if (mode === 'update') {
      const newData = WordData.exportToSubtitles();
      WordData.updateSubtitleData(newData);
    }
    
    // 返回字幕模式
    switchToSubtitleMode();
  };
}
