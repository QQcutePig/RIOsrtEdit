// word-mode/word-advanced.js
const WordAdvanced = {
  init() {
    this.bindFontSizeControls();
    this.bindFontFamilyControls();
    this.bindZoomControls();
    this.bindMarginControls();
    console.log('✅ Word 進階功能已初始化');
  },

// 字體大小
bindFontSizeControls() {
  const sel = document.getElementById('wordFontSizeSelect');
  if (!sel) return;
  sel.onchange = () => {
    this.setFontSizePx(`${parseInt(sel.value, 10)}px`);
  };
},

// 字體
bindFontFamilyControls() {
  const sel = document.getElementById('wordFontFamilySelect');
  if (!sel) return;
  sel.onchange = () => {
    this.setFontFamily(sel.value || 'inherit');
  };
},applyStyleToSelection(styleObj) {
  const editor = document.getElementById('wordEditor');
  const sel = window.getSelection();
  if (!editor || !sel || sel.rangeCount === 0) return false;

  const range = sel.getRangeAt(0);
  if (range.collapsed) return false; // 無選取

  // 確保選取範圍喺 editor 入面
  const common = range.commonAncestorContainer;
  if (common !== editor && !editor.contains(common)) return false;

  const span = document.createElement('span');
  Object.assign(span.style, styleObj);

  const frag = range.extractContents();
  span.appendChild(frag);
  range.insertNode(span);

  // 將游標放到 span 後面
  range.setStartAfter(span);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  return true;
},

setFontSizePx(px) {
  const editor = document.getElementById('wordEditor');
  if (!editor) return;
  const ok = this.applyStyleToSelection({ fontSize: px });
  if (!ok) editor.style.fontSize = px; // 無選取 -> 全篇預設
},

setFontFamily(font) {
  const editor = document.getElementById('wordEditor');
  if (!editor) return;
  const ok = this.applyStyleToSelection({ fontFamily: font || 'inherit' });
  if (!ok) editor.style.fontFamily = font || 'inherit';
},

  // 縮放
  setZoom(scale) {
    const pages = document.querySelector('.word-pages');
    if (!pages) return;
    pages.style.transform = `scale(${scale})`;
    pages.style.transformOrigin = 'top center';
  },

  bindZoomControls() {
    const zoomSelect = document.getElementById('wordZoomSelect');
    const btnIn = document.getElementById('wordBtnZoomIn');
    const btnOut = document.getElementById('wordBtnZoomOut');
    if (!zoomSelect) return;

    const vals = () => Array.from(zoomSelect.options).map(o => o.value);
    const apply = (v) => {
      zoomSelect.value = String(v);
      this.setZoom(parseFloat(zoomSelect.value));
    };

    zoomSelect.onchange = () => this.setZoom(parseFloat(zoomSelect.value));

    if (btnIn) btnIn.onclick = () => {
      const a = vals();
      const i = Math.max(0, a.indexOf(zoomSelect.value));
      apply(a[Math.min(i + 1, a.length - 1)]);
    };

    if (btnOut) btnOut.onclick = () => {
      const a = vals();
      const i = Math.max(0, a.indexOf(zoomSelect.value));
      apply(a[Math.max(i - 1, 0)]);
    };
  },

  // A4 白紙內邊距：改 .word-page padding
  setMarginsCm(top, right, bottom, left) {
    const CM_TO_PX = 37.795275591;
    const page = document.querySelector('.word-page');
    if (!page) return;
    page.style.padding = `${top * CM_TO_PX}px ${right * CM_TO_PX}px ${bottom * CM_TO_PX}px ${left * CM_TO_PX}px`;
  },

  bindMarginControls() {
    const btn = document.getElementById('wordBtnApplyMargin');
    if (!btn) return;

    btn.onclick = () => {
      const top = parseFloat(document.getElementById('wordMarginTop')?.value) || 1.5;
      const right = parseFloat(document.getElementById('wordMarginRight')?.value) || 1.5;
      const bottom = parseFloat(document.getElementById('wordMarginBottom')?.value) || 1.5;
      const left = parseFloat(document.getElementById('wordMarginLeft')?.value) || 1.5;
      this.setMarginsCm(top, right, bottom, left);
    };
  }
};
