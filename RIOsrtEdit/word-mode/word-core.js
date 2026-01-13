// ===== Word 模式核心控制器 =====

const WordCore = {
  // 狀態
  initialized: false,
  active: false,
  
  // DOM 元素
  editor: null,
  statsLeft: null,
  statsRight: null,
  
  // 初始化
  init() {
    if (this.initialized) return;
    
    // 獲取 DOM
    this.editor = document.getElementById('wordEditor');
    this.statsLeft = document.getElementById('wordStatsLeft');
    this.statsRight = document.getElementById('wordStatsRight');
    
    // 綁定事件
    this.bindEvents();
    
    // 初始化其他模組
if (typeof WordSearch !== 'undefined') WordSearch.init();
if (typeof WordExport !== 'undefined') WordExport.init();
if (typeof WordFormat !== 'undefined') WordFormat.init();
    if (typeof WordBasic !== 'undefined') {
      WordBasic.init();
    }
    if (typeof WordStyleMarkers !== 'undefined') {
      WordStyleMarkers.init();
    }
    if (typeof WordPagination !== 'undefined') {
  WordPagination.init();
}
if (typeof WordHistory !== 'undefined') {
  WordHistory.init();
}
if (typeof WordAdvanced !== 'undefined') WordAdvanced.init();
 // 🆕 加入呢行
  if (typeof WordExtra !== 'undefined') {
    WordExtra.init();
  }
    this.initialized = true;
    console.log('✅ Word 模式已初始化');
  },
  
  // 綁定事件
// 綁定事件
bindEvents() {
  // 編輯器輸入事件（更新統計）
  this.editor.addEventListener('input', () => {
    this.updateStats();
  });

  this.editor.addEventListener('paste', (e) => {
    if (typeof WordFormat !== 'undefined' && typeof WordFormat.handlePasteClean === 'function') {
      WordFormat.handlePasteClean(e);
    }
  });

  // 🆕 快捷鍵 + Undo/Redo 支援
  this.editor.addEventListener('keydown', (e) => {
    this.handleShortcuts(e);
  });

  // 綁定主題按鈕
  this.bindThemeButton();

  // 🆕 修復：Del 鍵刪除圖片卡頓問題
  this.editor.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      requestAnimationFrame(() => {
        this.updateStats();
      });
    }
  });
},
// 綁定主題按鈕
bindThemeButton() {
  const btnThemeWord = document.getElementById('btnThemeWord');
  if (btnThemeWord) {
    btnThemeWord.onclick = () => {
      document.body.classList.toggle('light');
      const isLight = document.body.classList.contains('light');
      btnThemeWord.textContent = isLight ? '🌙' : '☀️';
      console.log('✅ 主題已切換');
    };
  }
},
  
  // 處理快捷鍵
// 處理快捷鍵
handleShortcuts(e) {
  const ctrl = e.ctrlKey || e.metaKey;

  // 🆕 Undo/Redo 支援
  if (ctrl && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    document.execCommand('undo');
    console.log('↩️ Undo');
    return;
  }

  if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault();
    document.execCommand('redo');
    console.log('↪️ Redo');
    return;
  }

  // 原有格式化快捷鍵
  if (ctrl && e.key === 'b') {
    e.preventDefault();
    WordFormat.toggleBold();
  } else if (ctrl && e.key === 'i') {
    e.preventDefault();
    WordFormat.toggleItalic();
  } else if (ctrl && e.key === 'u') {
    e.preventDefault();
    WordFormat.toggleUnderline();
  }
},
  
  // 更新統計
  updateStats() {
    const text = this.editor.innerText || '';
    const charCount = text.length;
    const paraCount = this.editor.querySelectorAll('p, div, br').length || 1;
    this.statsLeft.textContent = `字數: ${charCount} | 段落: ${paraCount}`;
    
    // 頁數計算（簡化版）
    const pageCount = Math.ceil(this.editor.scrollHeight / 1100) || 1;
    this.statsRight.textContent = `頁數: 1/${pageCount}`;
  },
  
  // 檢查是否啟動
  isActive() {
    return this.active;
  },
  
  // 匯出數據（存檔用）
  exportData() {
    const whiteModeOn = typeof WordBasic !== 'undefined' ? WordBasic.whiteModeOn : false;
    return {
      html: this.editor.innerHTML,
      zoom: 100,
      whiteMode: whiteModeOn
    };
  },
  
  // 匯入數據（開檔用）
  importData(data) {
    if (data.html) {
      this.editor.innerHTML = data.html;
    }
    
    if (data.whiteMode !== undefined && typeof WordBasic !== 'undefined') {
      WordBasic.whiteModeOn = data.whiteMode;
      document.body.classList.toggle('wordWhiteModeOn', data.whiteMode);
      WordBasic.updateWhiteModeButton();
    }
    
    this.updateStats();
  },
  
  // 清空編輯器
  clear() {
    this.editor.innerHTML = '';
    this.updateStats();
  }
};
