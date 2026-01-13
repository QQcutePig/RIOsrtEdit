// ===== Word 模式撤銷/重做功能 =====

const WordHistory = {
  history: [],
  currentIndex: -1,
  maxHistory: 50,
  isRestoring: false,
  lastSavedState: '',
  
  // 初始化
  init() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    // 延遲綁定，避免衝突
    setTimeout(() => {
      this.bindEvents();
    }, 500);
    
    console.log('✅ Word 撤銷/重做功能已初始化');
  },
  
  // 綁定事件
  bindEvents() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    // 監聽編輯器變化（使用 MutationObserver，更穩定）
    const observer = new MutationObserver(() => {
      if (this.isRestoring) return;
      
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.saveState();
      }, 800); // 增加延遲，避免頻繁儲存
    });
    
    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // 快捷鍵（使用 document 而不是 editor，避免衝突）
    document.addEventListener('keydown', (e) => {
      // 只在 Word 模式且編輯器 focus 時才執行
      const wordMode = document.getElementById('wordMode');
      if (!wordMode || wordMode.style.display === 'none') return;
      if (document.activeElement !== editor) return;
      
      const ctrl = e.ctrlKey || e.metaKey;
      
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.undo();
      } else if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        e.stopPropagation();
        this.redo();
      }
    }, true); // 使用 capture phase
    
    // 初始狀態
    this.saveState();
  },
  
  // 儲存當前狀態
  saveState() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    const state = editor.innerHTML;
    
    // 如果與上一個狀態完全相同，則不儲存
    if (state === this.lastSavedState) return;
    
    this.lastSavedState = state;
    
    // 刪除當前位置之後的歷史
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // 加入新狀態
    this.history.push(state);
    this.currentIndex++;
    
    // 限制歷史記錄數量
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  },
  
  // 撤銷
  undo() {
    if (this.currentIndex <= 0) return;
    
    this.currentIndex--;
    this.restoreState();
  },
  
  // 重做
  redo() {
    if (this.currentIndex >= this.history.length - 1) return;
    
    this.currentIndex++;
    this.restoreState();
  },
  
  // 恢復狀態
  restoreState() {
    const editor = document.getElementById('wordEditor');
    if (!editor || this.currentIndex < 0) return;
    
    this.isRestoring = true;
    
    const state = this.history[this.currentIndex];
    
    // 保存光標位置
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
    // 恢復內容
    editor.innerHTML = state;
    this.lastSavedState = state;
    
    // 嘗試恢復光標（可選）
    if (range) {
      try {
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        // 忽略錯誤
      }
    }
    
    setTimeout(() => {
      this.isRestoring = false;
    }, 200);
  },
  
  // 清空歷史
  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.lastSavedState = '';
  }
};
