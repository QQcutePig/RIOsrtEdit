// ===== Word 模式基本功能 =====

const WordBasic = {
  whiteModeOn: false,
  
  // 初始化
  init() {
    // 綁定按鈕
    const btnSymbols = document.getElementById('wordBtnSymbols');
    const btnHighlight = document.getElementById('wordBtnHighlight');
    const btnTextColor = document.getElementById('wordBtnTextColor');
    const btnWhiteMode = document.getElementById('wordBtnWhiteMode');
    
    if (btnSymbols) btnSymbols.onclick = () => this.openSymbolsDialog();
    if (btnHighlight) btnHighlight.onclick = () => this.openHighlightDialog();
    if (btnTextColor) btnTextColor.onclick = () => this.openTextColorDialog();
    if (btnWhiteMode) btnWhiteMode.onclick = () => this.toggleWhiteMode();
    
    // 載入白底模式設定
    this.loadWhiteMode();
    
    console.log('✅ Word 基本功能已初始化');
  },
  
  // 載入白底模式設定
  loadWhiteMode() {
    const saved = localStorage.getItem('wordWhiteMode') === 'true';
    this.whiteModeOn = saved;
    document.body.classList.toggle('wordWhiteModeOn', saved);
    this.updateWhiteModeButton();
  },
  
  // 切換白底模式
  toggleWhiteMode() {
    this.whiteModeOn = !this.whiteModeOn;
    document.body.classList.toggle('wordWhiteModeOn', this.whiteModeOn);
    localStorage.setItem('wordWhiteMode', this.whiteModeOn);
    this.updateWhiteModeButton();
  },
  
  // 更新白底模式按鈕狀態
  updateWhiteModeButton() {
    const btn = document.getElementById('wordBtnWhiteMode');
    if (btn) btn.classList.toggle('active', this.whiteModeOn);
  },
  
  // 特殊符號對話框
  openSymbolsDialog() {
const symbolCategories = {
  // ===== 常用符號 =====
  '常用符號': ['…', '—', '－', '•', '·', '※', '§', '¶', '†', '‡', '©', '®', '™', '℃', '℉', '°', '′', '″', '‰', '‱'],
  
  // ===== 標點符號 =====
  '標點符號': ['、', '。', '，', '；', '：', '？', '！', '「', '」', '『', '』', '（', '）', '【', '】', '《', '》', '〈', '〉', '〔', '〕'],
  
  // ===== 括號類 =====
  '括號類': ['（', '）', '〔', '〕', '【', '】', '〈', '〉', '《', '》', '｛', '｝', '「', '」', '『', '』', '﹁', '﹂', '﹃', '﹄'],
  
  // ===== 數學符號 =====
  '數學符號': ['+', '−', '×', '÷', '=', '≠', '≈', '≡', '<', '>', '≤', '≥', '±', '∓', '∞', '∑', '∏', '∫', '√', '∛', '∜', '∝', '∠', '⊥', '∥', '∴', '∵'],
  
  // ===== 幾何圖形 =====
  '幾何圖形': ['○', '●', '◎', '◇', '◆', '□', '■', '△', '▲', '▽', '▼', '◁', '◀', '▷', '▶', '☆', '★', '◈', '◐', '◑'],
  
  // ===== 箭頭符號 =====
  '箭頭符號': ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '⇕', '↖', '↗', '↘', '↙', '⤴', '⤵', '➡', '⬅', '⬆', '⬇'],
  
  // ===== 序號符號 =====
  '序號符號': ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ'],
  
  // ===== 貨幣符號 =====
  '貨幣符號': ['$', '¢', '£', '¤', '¥', '€', '₹', '₽', '₩', '₪', '฿', '₫', '₱', '₴', '₦', '₡', '₵', '₸', '₺'],
  
  // ===== 單位符號 =====
  '單位符號': ['㎎', '㎏', '㎜', '㎝', '㎞', '㎡', '㏄', '㏎', '㏑', '㏒', '㏕', '℃', '℉', 'Å', 'Ω', 'μ', 'Ω', 'α', 'β', 'γ'],
  
  // ===== 希臘字母 =====
  '希臘字母': ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'],
  
  // ===== 表情符號 =====
  '表情符號': ['☺', '☻', '☹', '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐'],
  
  // ===== 天文氣象 =====
  '天文氣象': ['☀', '☁', '☂', '☃', '☄', '★', '☆', '☉', '☊', '☋', '☌', '☍', '☎', '☏', '☐', '☑', '☒', '☓', '☔', '⛅', '⛈', '🌙', '⭐'],
  
  // ===== 音樂符號 =====
  '音樂符號': ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢', '𝄡', '𝄪', '𝄫', '🎵', '🎶', '🎼'],
  
  // ===== 棋牌符號 =====
  '棋牌符號': ['♠', '♡', '♢', '♣', '♤', '♥', '♦', '♧', '♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'],
  
  // ===== 宗教符號 =====
  '宗教符號': ['✝', '☦', '☪', '☫', '☬', '☭', '卍', '卐', '✡', '☸', '☯', '㊉', '㊊'],
  
  // ===== 辦公符號 =====
  '辦公符號': ['✓', '✔', '✕', '✖', '✗', '✘', '☐', '☑', '☒', '✎', '✏', '✐', '✑', '✒', '📝', '📋', '📌', '📍', '📎'],
  
  // ===== 注音符號 =====
  '注音符號': ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ', 'ㄧ', 'ㄨ', 'ㄩ'],
  
  // ===== 日文假名 =====
  '日文假名': ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
  
  // ===== 特殊線條 =====
  '特殊線條': ['─', '━', '│', '┃', '┌', '┍', '┎', '┏', '┐', '┑', '┒', '┓', '└', '┕', '┖', '┗', '┘', '┙', '┚', '┛', '├', '┝', '┞', '┟', '┠', '┡', '┢', '┣'],
  
  // ===== 電腦符號 =====
  '電腦符號': ['⌘', '⌥', '⇧', '⌃', '⎋', '⌫', '⌦', '⏎', '↩', '↪', '⇥', '⇤', '␣', '⌧', '⎇', '⇪', '▲', '▼', '◀', '▶', '⏏'],
  
  // ===== 其他符號 =====
  '其他符號': ['＠', '＃', '＄', '％', '＆', '＊', '＋', '＝', '＜', '＞', '？', '￥', '〒', '〓', '〠', '々', '〆', '〇', '〡', '〢', '〣', '〤', '〥', '〦', '〧', '〨', '〩', '〸', '〹', '〺']
};
    
    // 建立對話框
    let html = '<div class="wordMask" id="symbolsMask"></div>';
    html += '<div class="wordDlg" id="symbolsDlg" style="max-width: 560px; max-height: 80vh;">';
    html += '<div class="wordDlgHeader"><span class="wordDlgTitle">插入特殊符號</span></div>';
    html += '<div class="wordDlgBody" style="max-height: 60vh; overflow-y: auto;">';
    
    // 建立分類選擇器
    html += '<select id="symbolCategorySelect" style="width: 100%; padding: 8px; margin-bottom: 12px; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: 8px; font-size: 14px;">';
    Object.keys(symbolCategories).forEach((cat, idx) => {
      html += `<option value="${cat}" ${idx === 0 ? 'selected' : ''}>${cat}</option>`;
    });
    html += '</select>';
    
    // 符號顯示區域 (固定高度 + 滾動)
    html += '<div id="symbolDisplay" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 6px; max-height: 320px; overflow-y: auto; padding: 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px;"></div>';
    
    html += '</div>';
    html += '<div class="wordDlgFooter">';
    html += '<button class="wordBtn wordBtnSecondary" id="symbolsClose">關閉</button>';
    html += '</div></div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    const displayArea = document.getElementById('symbolDisplay');
    const categorySelect = document.getElementById('symbolCategorySelect');
    
    // 顯示符號函數
    const showSymbols = (category) => {
      const symbols = symbolCategories[category] || [];
      displayArea.innerHTML = '';
      symbols.forEach(sym => {
        const btn = document.createElement('button');
        btn.className = 'word-tool-btn';
        btn.style.padding = '12px 4px';
        btn.style.fontSize = '20px';
        btn.textContent = sym;
        btn.onclick = () => {
          document.execCommand('insertText', false, sym);
          const editor = document.getElementById('wordEditor');
          if (editor) editor.focus();
        };
        displayArea.appendChild(btn);
      });
    };
    
    // 初始顯示第一個分類
    showSymbols(Object.keys(symbolCategories)[0]);
    
    // 切換分類
    if (categorySelect) {
      categorySelect.onchange = () => {
        showSymbols(categorySelect.value);
      };
    }
    
    // 綁定關閉事件
    const mask = document.getElementById('symbolsMask');
    const closeBtn = document.getElementById('symbolsClose');
    
    if (mask) {
      mask.onclick = () => this.closeSymbolsDialog();
    }
    if (closeBtn) {
      closeBtn.onclick = () => this.closeSymbolsDialog();
    }
  },
  
  closeSymbolsDialog() {
    const mask = document.getElementById('symbolsMask');
    const dlg = document.getElementById('symbolsDlg');
    if (mask) mask.remove();
    if (dlg) dlg.remove();
  },
  
  // 螢光筆對話框
  openHighlightDialog() {
    const colors = [
      { name: '黃色', value: 'rgba(255, 235, 59, 0.4)' },
      { name: '綠色', value: 'rgba(76, 175, 80, 0.3)' },
      { name: '藍色', value: 'rgba(33, 150, 243, 0.3)' },
      { name: '粉紅', value: 'rgba(233, 30, 99, 0.3)' },
      { name: '橙色', value: 'rgba(255, 152, 0, 0.3)' },
      { name: '紫色', value: 'rgba(156, 39, 176, 0.3)' },
      { name: '清除', value: 'transparent' }
    ];
    
    let html = '<div class="wordMask" id="highlightMask"></div>';
    html += '<div class="wordDlg" id="highlightDlg" style="max-width: 360px;">';
    html += '<div class="wordDlgHeader"><span class="wordDlgTitle">螢光筆顏色</span></div>';
    html += '<div class="wordDlgBody">';
    html += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">';
    
    colors.forEach(color => {
      const bgPreview = color.value === 'transparent' ? '#f0f0f0' : color.value;
      html += `<button class="wordBtn" data-color="${color.value}" style="padding: 16px; background: ${bgPreview}; border: 2px solid var(--border);">${color.name}</button>`;
    });
    
    html += '</div></div>';
    html += '<div class="wordDlgFooter">';
    html += '<button class="wordBtn wordBtnSecondary" id="highlightClose">關閉</button>';
    html += '</div></div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    const mask = document.getElementById('highlightMask');
    const closeBtn = document.getElementById('highlightClose');
    
    if (mask) mask.onclick = () => this.closeHighlightDialog();
    if (closeBtn) closeBtn.onclick = () => this.closeHighlightDialog();
    
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.onclick = () => {
        document.execCommand('backColor', false, btn.dataset.color);
        this.closeHighlightDialog();
      };
    });
  },
  
  closeHighlightDialog() {
    const mask = document.getElementById('highlightMask');
    const dlg = document.getElementById('highlightDlg');
    if (mask) mask.remove();
    if (dlg) dlg.remove();
  },
  
  // 文字顏色對話框
  openTextColorDialog() {
    const colors = [
      { name: '黑色', value: '#000000' },
      { name: '深灰', value: '#424242' },
      { name: '灰色', value: '#757575' },
      { name: '紅色', value: '#F44336' },
      { name: '橙色', value: '#FF9800' },
      { name: '黃色', value: '#FFC107' },
      { name: '綠色', value: '#4CAF50' },
      { name: '藍色', value: '#2196F3' },
      { name: '紫色', value: '#9C27B0' },
      { name: '粉紅', value: '#E91E63' },
      { name: '棕色', value: '#795548' },
      { name: '重設', value: 'inherit' }
    ];
    
    let html = '<div class="wordMask" id="colorMask"></div>';
    html += '<div class="wordDlg" id="colorDlg" style="max-width: 400px;">';
    html += '<div class="wordDlgHeader"><span class="wordDlgTitle">文字顏色</span></div>';
    html += '<div class="wordDlgBody">';
    html += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">';
    
    colors.forEach(color => {
      const isReset = color.value === 'inherit';
      const btnStyle = isReset ? 'background: var(--panel2);' : `background: ${color.value}; color: white;`;
      html += `<button class="wordBtn" data-textcolor="${color.value}" style="padding: 16px; ${btnStyle} border: 2px solid var(--border);">${color.name}</button>`;
    });
    
    html += '</div></div>';
    html += '<div class="wordDlgFooter">';
    html += '<button class="wordBtn wordBtnSecondary" id="colorClose">關閉</button>';
    html += '</div></div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    const mask = document.getElementById('colorMask');
    const closeBtn = document.getElementById('colorClose');
    
    if (mask) mask.onclick = () => this.closeTextColorDialog();
    if (closeBtn) closeBtn.onclick = () => this.closeTextColorDialog();
    
    document.querySelectorAll('[data-textcolor]').forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.textcolor === 'inherit') {
          document.execCommand('removeFormat', false, null);
        } else {
          document.execCommand('foreColor', false, btn.dataset.textcolor);
        }
        this.closeTextColorDialog();
      };
    });
  },
  
  closeTextColorDialog() {
    const mask = document.getElementById('colorMask');
    const dlg = document.getElementById('colorDlg');
    if (mask) mask.remove();
    if (dlg) dlg.remove();
  }
};

// ===== 縮放功能 =====
(function() {
  const btnZoomIn = document.getElementById('wordBtnZoomIn');
  const btnZoomOut = document.getElementById('wordBtnZoomOut');
  const zoomSelect = document.getElementById('wordZoomSelect');

  function applyZoom(zoomLevel) {
    const page = document.querySelector('.word-page');
    if (page) {
      page.style.transform = `scale(${zoomLevel})`;
      page.style.transformOrigin = 'top center';
    }
    
    // 🆕 重新計算邊距、分頁線、總頁數
    if (typeof WordPagination !== 'undefined') {
      setTimeout(() => {
        WordPagination.updatePageMarkers();
        WordPagination.updatePageCount();
        WordPagination.updateCurrentPage();
        console.log(`✅ 縮放 ${zoomLevel * 100}% - 已重新計算`);
      }, 100);
    }
  }

  if (btnZoomIn) {
    btnZoomIn.onclick = () => {
      const current = parseFloat(zoomSelect.value);
      const newZoom = Math.min(2, current + 0.25);
      zoomSelect.value = newZoom;
      applyZoom(newZoom);
    };
  }

  if (btnZoomOut) {
    btnZoomOut.onclick = () => {
      const current = parseFloat(zoomSelect.value);
      const newZoom = Math.max(0.5, current - 0.25);
      zoomSelect.value = newZoom;
      applyZoom(newZoom);
    };
  }

  if (zoomSelect) {
    zoomSelect.onchange = () => {
      const zoomLevel = parseFloat(zoomSelect.value);
      applyZoom(zoomLevel);
    };
  }
})();
