// ===== Word 模式分頁功能 =====

const WordPagination = {
  currentPage: 1,
  pageHeight: 1123, // A4 高度 (約 297mm @ 96 DPI)
  
  // 初始化
  init() {
    const btnPrevPage = document.getElementById('wordBtnPrevPage');
    const btnNextPage = document.getElementById('wordBtnNextPage');
    const btnInsertPageBreak = document.getElementById('wordBtnInsertPageBreak');
    const currentPageInput = document.getElementById('wordCurrentPage');
    
    if (btnPrevPage) {
      btnPrevPage.onclick = () => {
        console.log('上一頁');
        this.prevPage();
      };
    }
    
    if (btnNextPage) {
      btnNextPage.onclick = () => {
        console.log('下一頁');
        this.nextPage();
      };
    }
    
    if (btnInsertPageBreak) {
      btnInsertPageBreak.onclick = () => {
        console.log('插入分頁符號');
        this.insertPageBreak();
      };
    }
    
    if (currentPageInput) {
      currentPageInput.onchange = () => {
        const page = parseInt(currentPageInput.value) || 1;
        this.goToPage(page);
      };
    }
    
    // 監聽滾動事件（更新當前頁數）
    const editorContainer = document.querySelector('.word-editor-container');
    if (editorContainer) {
      editorContainer.addEventListener('scroll', () => {
        this.updateCurrentPage();
      });
    }
    
    // 定期更新分頁標記和頁數
    setInterval(() => {
      this.updatePageMarkers();
      this.updatePageCount();
    }, 2000);
    
    // 初始化
    this.updatePageMarkers();
    this.updatePageCount();
    
    // 監聽編輯器輸入（自動分頁）
    const editor = document.getElementById('wordEditor');
    if (editor) {
      const originalInputHandler = () => {
        this.checkAutoPageBreak();
      };
      
      editor.addEventListener('input', originalInputHandler);
      editor.addEventListener('paste', () => {
        setTimeout(() => this.checkAutoPageBreak(), 100);
      });
      
      // 🆕 已移除邊距區域限制 - 允許在任何位置點擊和打字
      // 藍色邊距框只作為視覺提示，不阻擋輸入
      /*
      // 防止在邊距區域輸入 - 安全版
      editor.addEventListener('click', () => {
        setTimeout(() => {
          if (!this.isInEditableArea()) {
            this.moveCursorToEditableArea();
          }
        }, 50);
      });
      
      editor.addEventListener('keydown', () => {
        setTimeout(() => {
          if (!this.isInEditableArea()) {
            this.moveCursorToEditableArea();
          }
        }, 10);
      });
      */
    }

    console.log('✅ Word 分頁功能已初始化');
  },
  
  // 🆕 讀取縮放等級
  getZoomLevel() {
    const zoomSelect = document.getElementById('wordZoomSelect');
    return zoomSelect ? parseFloat(zoomSelect.value) || 1 : 1;
  },
  
  // 更新總頁數（支援縮放）
  updatePageCount() {
    const editor = document.getElementById('wordEditor');
    const totalPagesSpan = document.getElementById('wordTotalPages');
    const statusRight = document.getElementById('wordStatsRight');
    
    if (!editor) return;
    
    // 🆕 根據縮放計算總頁數
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const contentHeight = editor.scrollHeight;
    const totalPages = Math.max(1, Math.ceil(contentHeight / adjustedPageHeight));
    
    if (totalPagesSpan) {
      totalPagesSpan.textContent = totalPages;
    }
    
    // 更新狀態列
    if (statusRight) {
      statusRight.textContent = `頁數: ${this.currentPage}/${totalPages}`;
    }
  },
  
  // 更新當前頁數（支援縮放）
  updateCurrentPage() {
    const editorContainer = document.querySelector('.word-editor-container');
    const currentPageInput = document.getElementById('wordCurrentPage');
    
    if (!editorContainer) return;
    
    // 🆕 根據縮放計算當前頁
    const scrollTop = editorContainer.scrollTop;
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const page = Math.floor(scrollTop / adjustedPageHeight) + 1;
    
    if (page !== this.currentPage) {
      this.currentPage = page;
      if (currentPageInput) {
        currentPageInput.value = page;
      }
      this.updatePageCount();
    }
  },
  
  // 更新分頁標記（支援縮放）
  updatePageMarkers() {
    const editor = document.getElementById('wordEditor');
    const container = document.querySelector('.word-editor-container');
    
    if (!editor || !container) return;
    
    // 移除容器上的舊標記
    const oldMarkers = container.querySelectorAll('.word-page-marker-overlay');
    oldMarkers.forEach(m => m.remove());
    
    // 🆕 根據縮放計算頁數和高度
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const contentHeight = editor.scrollHeight;
    const pageCount = Math.floor(contentHeight / adjustedPageHeight);
    
    // 🆕 讀取邊距（已包含縮放）
    const margins = this.getMargins();
    
    // ===== 第一頁的頂部邊距區 =====
    const topShade = document.createElement('div');
    topShade.className = 'word-page-marker-overlay word-margin-shade';
    topShade.style.cssText = `
      position: absolute;
      left: 40px;
      right: 40px;
      top: 40px;
      height: ${margins.top}px;
      background: rgba(90, 167, 255, 0.08);
      pointer-events: none;
      z-index: 9;
      border: 1px dashed rgba(90, 167, 255, 0.3);
    `;
    container.appendChild(topShade);
    
    // ===== 第一頁的底部邊距 =====
    const bottomShadeTop = 40 + adjustedPageHeight - margins.bottom;
    const bottomShade = document.createElement('div');
    bottomShade.className = 'word-page-marker-overlay word-margin-shade';
    bottomShade.style.cssText = `
      position: absolute;
      left: 40px;
      right: 40px;
      top: ${bottomShadeTop}px;
      height: ${margins.bottom}px;
      background: rgba(90, 167, 255, 0.08);
      pointer-events: none;
      z-index: 9;
      border: 1px dashed rgba(90, 167, 255, 0.3);
    `;
    container.appendChild(bottomShade);
    
    // ===== 加入其他頁的標記 =====
    for (let i = 1; i <= pageCount; i++) {
      // 分頁線
      const marker = document.createElement('div');
      marker.className = 'word-page-marker-overlay';
      marker.style.cssText = `
        position: absolute;
        left: 40px;
        right: 40px;
        top: ${40 + (i * adjustedPageHeight)}px;
        height: 1px;
        border-top: 2px dashed var(--muted);
        pointer-events: none;
        z-index: 10;
      `;
      
      const label = document.createElement('span');
      label.textContent = '--- 分頁符號 ---';
      label.style.cssText = `
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg);
        padding: 2px 8px;
        font-size: 11px;
        color: var(--muted);
        user-select: none;
      `;
      marker.appendChild(label);
      container.appendChild(marker);
      
      // 這一頁的「頂部邊距區」
      const topShadeTop = 40 + (i * adjustedPageHeight);
      const topShade2 = document.createElement('div');
      topShade2.className = 'word-page-marker-overlay word-margin-shade';
      topShade2.style.cssText = `
        position: absolute;
        left: 40px;
        right: 40px;
        top: ${topShadeTop}px;
        height: ${margins.top}px;
        background: rgba(90, 167, 255, 0.08);
        pointer-events: none;
        z-index: 9;
        border: 1px dashed rgba(90, 167, 255, 0.3);
      `;
      container.appendChild(topShade2);

      // 這一頁的「底部邊距區」
      const bottomShadeTop2 = 40 + (i * adjustedPageHeight) + adjustedPageHeight - margins.bottom;
      const bottomShade2 = document.createElement('div');
      bottomShade2.className = 'word-page-marker-overlay word-margin-shade';
      bottomShade2.style.cssText = `
        position: absolute;
        left: 40px;
        right: 40px;
        top: ${bottomShadeTop2}px;
        height: ${margins.bottom}px;
        background: rgba(90, 167, 255, 0.08);
        pointer-events: none;
        z-index: 9;
        border: 1px dashed rgba(90, 167, 255, 0.3);
      `;
      container.appendChild(bottomShade2);
    }
  },
  
  // 上一頁
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToPage(this.currentPage);
    }
  },
  
  // 下一頁
  nextPage() {
    const totalPages = parseInt(document.getElementById('wordTotalPages')?.textContent) || 1;
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.scrollToPage(this.currentPage);
    }
  },
  
  // 跳到指定頁
  goToPage(page) {
    const totalPages = parseInt(document.getElementById('wordTotalPages')?.textContent) || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    this.currentPage = page;
    this.scrollToPage(page);
  },
  
  // 滾動到指定頁（支援縮放）
  scrollToPage(page) {
    const editorContainer = document.querySelector('.word-editor-container');
    const currentPageInput = document.getElementById('wordCurrentPage');
    
    if (!editorContainer) {
      console.warn('找不到編輯器容器');
      return;
    }
    
    // 🆕 根據縮放計算滾動位置
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const scrollTop = (page - 1) * adjustedPageHeight;
    
    editorContainer.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
    
    if (currentPageInput) {
      currentPageInput.value = page;
    }
    
    this.updatePageCount();
  },
  
  // 插入分頁符號
  insertPageBreak() {
    const editor = document.getElementById('wordEditor');
    if (!editor) {
      console.warn('找不到編輯器');
      return;
    }
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert('請先點擊編輯器內的位置');
      return;
    }
    
    const range = selection.getRangeAt(0);
    
    // 建立分頁符號元素
    const pageBreak = document.createElement('div');
    pageBreak.className = 'word-page-break';
    pageBreak.contentEditable = 'false';
    pageBreak.style.cssText = `
      height: 20px;
      background: transparent;
      margin: 20px 0;
      position: relative;
      page-break-after: always;
      border-top: 2px dashed var(--muted);
      cursor: default;
    `;
    
    const label = document.createElement('span');
    label.textContent = '--- 分頁符號 ---';
    label.style.cssText = `
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg);
      padding: 2px 8px;
      font-size: 11px;
      color: var(--muted);
      user-select: none;
    `;
    pageBreak.appendChild(label);
    
    // 插入分頁符號
    try {
      range.insertNode(pageBreak);
      
      // 在分頁符號後插入新段落
      const newPara = document.createElement('p');
      newPara.innerHTML = '<br>';
      pageBreak.parentNode.insertBefore(newPara, pageBreak.nextSibling);
      
      // 移動光標到新段落
      range.setStart(newPara, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      console.log('✅ 分頁符號已插入');
    } catch (e) {
      console.error('插入分頁符號失敗:', e);
      alert('插入分頁符號失敗');
    }
  },

  // 自動分頁檢查
  checkAutoPageBreak() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;

    const margins = this.getMargins();
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const availableHeight = adjustedPageHeight - margins.top - margins.bottom;

    const paragraphs = Array.from(editor.querySelectorAll('p, h1, h2, h3, div.word-page-break'));
    if (paragraphs.length === 0) return;

    let currentPageHeight = 0;
    let needPageBreak = false;

    paragraphs.forEach((para) => {
      if (para.classList.contains('word-page-break')) {
        currentPageHeight = 0;
        return;
      }

      const paraHeight = para.offsetHeight;
      
      if (currentPageHeight + paraHeight > availableHeight) {
        if (!para.previousElementSibling || !para.previousElementSibling.classList.contains('word-page-break')) {
          needPageBreak = true;
          this.insertAutoPageBreak(para);
          currentPageHeight = paraHeight;
        }
      } else {
        currentPageHeight += paraHeight;
      }
    });

    if (needPageBreak) {
      setTimeout(() => {
        this.updatePageMarkers();
        this.updatePageCount();
      }, 50);
    }
  },

  // 自動插入分頁符號（在指定元素之前）
  insertAutoPageBreak(beforeElement) {
    if (!beforeElement || !beforeElement.parentNode) return;

    if (beforeElement.previousElementSibling && 
        beforeElement.previousElementSibling.classList.contains('word-page-break')) {
      return;
    }

    const pageBreak = document.createElement('div');
    pageBreak.className = 'word-page-break word-auto-page-break';
    pageBreak.contentEditable = 'false';
    pageBreak.style.cssText = `
      height: 20px;
      background: transparent;
      margin: 20px 0;
      position: relative;
      page-break-after: always;
      border-top: 2px dashed var(--muted);
      cursor: default;
    `;

    const label = document.createElement('span');
    label.textContent = '--- 自動分頁 ---';
    label.style.cssText = `
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg);
      padding: 2px 8px;
      font-size: 11px;
      color: var(--muted);
      user-select: none;
      font-style: italic;
      opacity: 0.7;
    `;
    pageBreak.appendChild(label);

    beforeElement.parentNode.insertBefore(pageBreak, beforeElement);
  },

  // 🆕 讀取頁面邊距（自動考慮縮放）
  getMargins() {
    const topInput = document.getElementById('wordMarginTop');
    const bottomInput = document.getElementById('wordMarginBottom');
    const leftInput = document.getElementById('wordMarginLeft');
    const rightInput = document.getElementById('wordMarginRight');
    const cmToPx = 37.8;
    
    // 讀取縮放等級
    const zoomLevel = this.getZoomLevel();
    
    const top = (topInput ? parseFloat(topInput.value) : 1.5) * cmToPx * zoomLevel;
    const bottom = (bottomInput ? parseFloat(bottomInput.value) : 1.5) * cmToPx * zoomLevel;
    const left = (leftInput ? parseFloat(leftInput.value) : 1.5) * cmToPx * zoomLevel;
    const right = (rightInput ? parseFloat(rightInput.value) : 1.5) * cmToPx * zoomLevel;
    
    return { top, right, bottom, left };
  },
  
  // 檢查點擊/光標是否在可編輯區域（保留但不使用）
  isInEditableArea(event) {
    const editor = document.getElementById('wordEditor');
    if (!editor) return true;

    const margins = this.getMargins();
    const editorContainer = document.querySelector('.word-editor-container');
    if (!editorContainer) return true;

    const selection = window.getSelection();
    if (!selection.rangeCount) return true;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = editorContainer.getBoundingClientRect();
    
    // 計算相對於編輯器的 Y 位置
    const scrollTop = editorContainer.scrollTop;
    const relativeY = rect.top - containerRect.top + scrollTop - 40;
    
    // 🆕 根據縮放計算頁碼
    const zoomLevel = this.getZoomLevel();
    const adjustedPageHeight = this.pageHeight * zoomLevel;
    const pageNum = Math.floor(relativeY / adjustedPageHeight);
    const posInPage = relativeY - (pageNum * adjustedPageHeight);

    // 檢查是否在邊距區域
    if (posInPage < margins.top || posInPage > (adjustedPageHeight - margins.bottom)) {
      return false;
    }

    return true;
  },

  // 將光標移到可編輯區域（保留但不使用）
  moveCursorToEditableArea() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;

    const firstPara = editor.querySelector('p, h1, h2, h3');
    
    if (firstPara) {
      const range = document.createRange();
      const selection = window.getSelection();
      
      try {
        range.setStart(firstPara.firstChild || firstPara, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        console.warn('無法移動光標:', e);
      }
    }
  }
};
