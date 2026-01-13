// ===== Word 模式搜尋功能 =====

const WordSearch = {
  currentIndex: -1,
  matches: [],
  highlightClass: 'word-search-highlight',
  
  // 初始化
  init() {
    const input = document.getElementById('wordFindInput');
    const replaceInput = document.getElementById('wordReplaceInput');
    const btnPrev = document.getElementById('wordBtnFindPrev');
    const btnNext = document.getElementById('wordBtnFindNext');
    const btnReplaceOne = document.getElementById('wordBtnReplaceOne');
    const btnReplaceAll = document.getElementById('wordBtnReplaceAll');
    
    // 搜尋輸入
    if (input) {
      input.addEventListener('input', () => {
        this.search(input.value);
      });
      
      // Enter 鍵搜尋下一個
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.findNext();
        }
      });
    }
    
    // 按鈕綁定
    if (btnPrev) btnPrev.onclick = () => this.findPrev();
    if (btnNext) btnNext.onclick = () => this.findNext();
    if (btnReplaceOne) btnReplaceOne.onclick = () => this.replaceOne();
    if (btnReplaceAll) btnReplaceAll.onclick = () => this.replaceAll();
    
    console.log('✅ Word 搜尋功能已初始化');
  },
  
  // 搜尋文字
  search(query) {
    const editor = document.getElementById('wordEditor');
    const info = document.getElementById('wordSearchInfo');
    
    // 清除舊高亮
    this.clearHighlights();
    this.matches = [];
    this.currentIndex = -1;
    
    if (!query.trim()) {
      if (info) info.textContent = '0/0';
      return;
    }
    
    // 搜尋並高亮
    const text = editor.innerText;
    const regex = new RegExp(this.escapeRegex(query), 'gi');
    let match;
    
    // 計算匹配數量
    while ((match = regex.exec(text)) !== null) {
      this.matches.push(match.index);
    }
    
    // 更新顯示
    if (info) info.textContent = `0/${this.matches.length}`;
    
    if (this.matches.length > 0) {
      this.highlightAll(query);
      this.findNext();
    }
  },
  
  // 高亮所有匹配
  highlightAll(query) {
    const editor = document.getElementById('wordEditor');
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToReplace = [];
    let node;
    
    while (node = walker.nextNode()) {
      const text = node.nodeValue;
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      
      if (regex.test(text)) {
        nodesToReplace.push(node);
      }
    }
    
    nodesToReplace.forEach(node => {
      const text = node.nodeValue;
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      
      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        // 添加匹配前的文字
        if (match.index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex, match.index))
          );
        }
        
        // 添加高亮的匹配文字
        const mark = document.createElement('mark');
        mark.className = this.highlightClass;
        mark.textContent = match[0];
        fragment.appendChild(mark);
        
        lastIndex = match.index + match[0].length;
      }
      
      // 添加剩餘文字
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      
      node.parentNode.replaceChild(fragment, node);
    });
  },
  
  // 清除高亮
  clearHighlights() {
    const editor = document.getElementById('wordEditor');
    const marks = editor.querySelectorAll(`.${this.highlightClass}`);
    
    marks.forEach(mark => {
      const text = mark.textContent;
      const textNode = document.createTextNode(text);
      mark.parentNode.replaceChild(textNode, mark);
    });
    
    // 合併相鄰的文字節點
    editor.normalize();
  },
  
  // 下一個
  findNext() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.matches.length;
    this.scrollToMatch();
    this.updateInfo();
  },
  
  // 上一個
  findPrev() {
    if (this.matches.length === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.matches.length) % this.matches.length;
    this.scrollToMatch();
    this.updateInfo();
  },
  
  // 取代一個
  replaceOne() {
    const editor = document.getElementById('wordEditor');
    const findInput = document.getElementById('wordFindInput');
    const replaceInput = document.getElementById('wordReplaceInput');
    
    if (!findInput || !replaceInput) return;
    
    const query = findInput.value.trim();
    const replacement = replaceInput.value;
    
    if (!query || this.matches.length === 0) return;
    
    const marks = editor.querySelectorAll(`.${this.highlightClass}`);
    if (marks[this.currentIndex]) {
      const mark = marks[this.currentIndex];
      const textNode = document.createTextNode(replacement);
      mark.parentNode.replaceChild(textNode, mark);
      
      // 重新搜尋
      setTimeout(() => {
        this.search(query);
      }, 10);
    }
  },
  
  // 全部取代
  replaceAll() {
    const editor = document.getElementById('wordEditor');
    const findInput = document.getElementById('wordFindInput');
    const replaceInput = document.getElementById('wordReplaceInput');
    
    if (!findInput || !replaceInput) return;
    
    const query = findInput.value.trim();
    const replacement = replaceInput.value;
    
    if (!query || this.matches.length === 0) return;
    
    const marks = editor.querySelectorAll(`.${this.highlightClass}`);
    let count = 0;
    
    marks.forEach(mark => {
      const textNode = document.createTextNode(replacement);
      mark.parentNode.replaceChild(textNode, mark);
      count++;
    });
    
    // 清空搜尋
    this.clearHighlights();
    this.matches = [];
    this.currentIndex = -1;
    
    const info = document.getElementById('wordSearchInfo');
    if (info) info.textContent = `已取代 ${count} 個`;
    
    setTimeout(() => {
      if (info) info.textContent = '0/0';
    }, 2000);
  },
  
  // 滾動到匹配位置
  scrollToMatch() {
    const editor = document.getElementById('wordEditor');
    const marks = editor.querySelectorAll(`.${this.highlightClass}`);
    
    if (marks[this.currentIndex]) {
      // 移除舊的 active
      marks.forEach(m => m.classList.remove('active'));
      
      // 加 active 到當前
      marks[this.currentIndex].classList.add('active');
      
      // 滾動到可見
      marks[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  
  // 更新資訊
  updateInfo() {
    const info = document.getElementById('wordSearchInfo');
    if (info) {
      info.textContent = `${this.currentIndex + 1}/${this.matches.length}`;
    }
  },
  
  // 轉義正則字符
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
};
