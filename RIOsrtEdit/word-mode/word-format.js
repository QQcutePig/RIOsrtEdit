// ===== Word 模式格式工具 =====

const WordFormat = {
  // 粗體
  toggleBold() {
    document.execCommand('bold', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 斜體
  toggleItalic() {
    document.execCommand('italic', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 底線
  toggleUnderline() {
    document.execCommand('underline', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 刪除線
  toggleStrike() {
    document.execCommand('strikeThrough', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 對齊：靠左
  alignLeft() {
    document.execCommand('justifyLeft', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 對齊：置中
  alignCenter() {
    document.execCommand('justifyCenter', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 對齊：靠右
  alignRight() {
    document.execCommand('justifyRight', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 對齊：齊行
  alignJustify() {
    document.execCommand('justifyFull', false, null);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 設定標題
  setHeading(level) {
    const tag = 'h' + level;
    document.execCommand('formatBlock', false, tag);
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 設定內文（段落）
  setParagraph() {
    document.execCommand('formatBlock', false, 'p');
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 清除格式
  clearFormat() {
    document.execCommand('removeFormat', false, null);
    document.execCommand('formatBlock', false, 'p');
    setTimeout(() => this.updateAllButtonStates(), 10);
  },

  // 設定行距
  setLineHeight(value) {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // 如果沒有選取，套用到整個編輯器
      editor.style.lineHeight = value;
      return;
    }
    
    // 有選取時，套用到選取的段落
    const range = selection.getRangeAt(0);
    let node = range.startContainer;
    
    // 找到父段落元素
    while (node && node !== editor && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    
    while (node && node !== editor && !['P', 'DIV', 'H1', 'H2', 'H3'].includes(node.tagName)) {
      node = node.parentNode;
    }
    
    if (node && node !== editor) {
      node.style.lineHeight = value;
    } else {
      editor.style.lineHeight = value;
    }
  },

  // 複製
  copy() {
    try {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        document.execCommand('copy');
      }
    } catch (e) {
      console.error('複製失敗:', e);
    }
  },

  // 貼上（保留格式）
  paste() {
    try {
      // 使用 execCommand 保留格式
      const success = document.execCommand('paste');
      if (!success) {
        alert('無法貼上，請使用 Ctrl+V 或 ⌘+V');
      }
    } catch (e) {
      alert('無法貼上，請使用 Ctrl+V 或 ⌘+V');
    }
  },

  // 貼上純文字（不保留格式）
  async pastePlain() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.execCommand('insertText', false, text);
      }
    } catch (e) {
      // 降級方案：提示用戶使用快捷鍵
      alert('無法讀取剪貼簿，請使用 Ctrl+Shift+V 貼上純文字');
    }
  },

  // 更新按鈕狀態（顯示當前格式）
  updateButtonState(btnId, command) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const isActive = document.queryCommandState(command);
    btn.classList.toggle('active', isActive);
  },

  // 初始化（綁定按鈕）
  init() {
    // 文字格式按鈕
    const btnBold = document.getElementById('wordBtnBold');
    const btnItalic = document.getElementById('wordBtnItalic');
    const btnUnderline = document.getElementById('wordBtnUnderline');
    const btnStrike = document.getElementById('wordBtnStrike');
    
    if (btnBold) btnBold.onclick = () => this.toggleBold();
    if (btnItalic) btnItalic.onclick = () => this.toggleItalic();
    if (btnUnderline) btnUnderline.onclick = () => this.toggleUnderline();
    if (btnStrike) btnStrike.onclick = () => this.toggleStrike();

    // 對齊按鈕
    const btnAlignLeft = document.getElementById('wordBtnAlignLeft');
    const btnAlignCenter = document.getElementById('wordBtnAlignCenter');
    const btnAlignRight = document.getElementById('wordBtnAlignRight');
    const btnAlignJustify = document.getElementById('wordBtnAlignJustify');
    
    if (btnAlignLeft) btnAlignLeft.onclick = () => this.alignLeft();
    if (btnAlignCenter) btnAlignCenter.onclick = () => this.alignCenter();
    if (btnAlignRight) btnAlignRight.onclick = () => this.alignRight();
    if (btnAlignJustify) btnAlignJustify.onclick = () => this.alignJustify();

    // 標題和內文按鈕
    const btnH1 = document.getElementById('wordBtnH1');
    const btnH2 = document.getElementById('wordBtnH2');
    const btnH3 = document.getElementById('wordBtnH3');
    const btnParagraph = document.getElementById('wordBtnParagraph');
    
    if (btnH1) btnH1.onclick = () => this.setHeading(1);
    if (btnH2) btnH2.onclick = () => this.setHeading(2);
    if (btnH3) btnH3.onclick = () => this.setHeading(3);
    if (btnParagraph) btnParagraph.onclick = () => this.setParagraph();

    // 剪貼簿按鈕
    const btnCopy = document.getElementById('wordBtnCopy');
    const btnPaste = document.getElementById('wordBtnPaste');
    const btnPastePlain = document.getElementById('wordBtnPastePlain');
    const btnClearFormat = document.getElementById('wordBtnClearFormat');
    
    if (btnCopy) btnCopy.onclick = () => this.copy();
    if (btnPaste) btnPaste.onclick = () => this.paste();
    if (btnPastePlain) btnPastePlain.onclick = () => this.pastePlain();
    if (btnClearFormat) btnClearFormat.onclick = () => this.clearFormat();

    // 行距按鈕（0.8, 1.0, 1.5, 2.0, 2.5, 3.0）
    const btnLineHeight08 = document.getElementById('wordBtnLineHeight08');
    const btnLineHeight1 = document.getElementById('wordBtnLineHeight1');
    const btnLineHeight15 = document.getElementById('wordBtnLineHeight15');
    const btnLineHeight2 = document.getElementById('wordBtnLineHeight2');
    const btnLineHeight25 = document.getElementById('wordBtnLineHeight25');
    const btnLineHeight3 = document.getElementById('wordBtnLineHeight3');
    
    if (btnLineHeight08) btnLineHeight08.onclick = () => this.setLineHeight('0.8');
    if (btnLineHeight1) btnLineHeight1.onclick = () => this.setLineHeight('1.0');
    if (btnLineHeight15) btnLineHeight15.onclick = () => this.setLineHeight('1.5');
    if (btnLineHeight2) btnLineHeight2.onclick = () => this.setLineHeight('2.0');
    if (btnLineHeight25) btnLineHeight25.onclick = () => this.setLineHeight('2.5');
    if (btnLineHeight3) btnLineHeight3.onclick = () => this.setLineHeight('3.0');

    // 監聽選取變化（更新按鈕狀態）
    const editor = document.getElementById('wordEditor');
    if (editor) {
      editor.addEventListener('mouseup', () => this.updateAllButtonStates());
      editor.addEventListener('keyup', () => this.updateAllButtonStates());
      editor.addEventListener('input', () => this.updateAllButtonStates());
      editor.addEventListener('focus', () => this.updateAllButtonStates());
    }

    // 啟動 MutationObserver 監控 DOM 變化
    this.startMutationObserver();
    
    console.log('✅ Word 格式工具已初始化');
  },

  // 啟動 DOM 監控
  startMutationObserver() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    const observer = new MutationObserver(() => {
      this.updateAllButtonStates();
    });
    
    observer.observe(editor, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  },

  // 更新所有按鈕狀態
  updateAllButtonStates() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    try {
      // 使用 document.queryCommandState 檢查格式狀態
      const isBold = document.queryCommandState('bold');
      const isItalic = document.queryCommandState('italic');
      const isUnderline = document.queryCommandState('underline');
      const isStrike = document.queryCommandState('strikeThrough');
      
      // 更新格式按鈕
      const boldBtn = document.getElementById('wordBtnBold');
      const italicBtn = document.getElementById('wordBtnItalic');
      const underlineBtn = document.getElementById('wordBtnUnderline');
      const strikeBtn = document.getElementById('wordBtnStrike');
      
      if (boldBtn) boldBtn.classList.toggle('active', isBold);
      if (italicBtn) italicBtn.classList.toggle('active', isItalic);
      if (underlineBtn) underlineBtn.classList.toggle('active', isUnderline);
      if (strikeBtn) strikeBtn.classList.toggle('active', isStrike);
      
      // 檢查對齊方式
      const isAlignLeft = document.queryCommandState('justifyLeft');
      const isAlignCenter = document.queryCommandState('justifyCenter');
      const isAlignRight = document.queryCommandState('justifyRight');
      const isAlignJustify = document.queryCommandState('justifyFull');
      
      // 更新對齊按鈕
      const alignLeftBtn = document.getElementById('wordBtnAlignLeft');
      const alignCenterBtn = document.getElementById('wordBtnAlignCenter');
      const alignRightBtn = document.getElementById('wordBtnAlignRight');
      const alignJustifyBtn = document.getElementById('wordBtnAlignJustify');
      
      if (alignLeftBtn) alignLeftBtn.classList.toggle('active', isAlignLeft);
      if (alignCenterBtn) alignCenterBtn.classList.toggle('active', isAlignCenter);
      if (alignRightBtn) alignRightBtn.classList.toggle('active', isAlignRight);
      if (alignJustifyBtn) alignJustifyBtn.classList.toggle('active', isAlignJustify);
      
      // 檢查標題和內文
      const range = selection.getRangeAt(0);
      let node = range.startContainer;
      
      // 向上查找父元素
      while (node && node !== editor && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentNode;
      }
      
      let headingLevel = 0;
      let isParagraph = false;
      
      while (node && node !== editor) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toUpperCase();
          if (tag === 'H1') headingLevel = 1;
          if (tag === 'H2') headingLevel = 2;
          if (tag === 'H3') headingLevel = 3;
          if (tag === 'P') isParagraph = true;
        }
        node = node.parentNode;
      }
      
      // 更新標題和內文按鈕
      const h1Btn = document.getElementById('wordBtnH1');
      const h2Btn = document.getElementById('wordBtnH2');
      const h3Btn = document.getElementById('wordBtnH3');
      const paragraphBtn = document.getElementById('wordBtnParagraph');
      
      if (h1Btn) h1Btn.classList.toggle('active', headingLevel === 1);
      if (h2Btn) h2Btn.classList.toggle('active', headingLevel === 2);
      if (h3Btn) h3Btn.classList.toggle('active', headingLevel === 3);
      if (paragraphBtn) paragraphBtn.classList.toggle('active', isParagraph && headingLevel === 0);
      
    } catch (e) {
      // 靜默忽略錯誤
      console.warn('更新按鈕狀態失敗:', e);
    }
  } // ← 這裡加上缺少的大括號！
};
