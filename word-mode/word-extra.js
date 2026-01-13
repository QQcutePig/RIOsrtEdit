// ===== Word 模式額外功能 =====
// 包含：插入圖片、編號清單、列印、插入表格

const WordExtra = {
  init() {
    this.initImageInsert();
    this.initLists();
    this.initPrint();
    this.initTable();
    console.log('✅ Word 額外功能已初始化');
  },

  // ===== 插入圖片功能 =====
  initImageInsert() {
    const btn = document.getElementById('wordBtnInsertImage');
    if (!btn) {
      console.warn('找不到 wordBtnInsertImage 按鈕');
      return;
    }

    btn.onclick = () => {
      console.log('點擊了插入圖片按鈕');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('選擇了圖片:', file.name);
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.insertImage(ev.target.result);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };
    
    console.log('✅ 插入圖片按鈕已綁定');
  },

  insertImage(src) {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;

    // 先聚焦編輯器
    editor.focus();

    // 創建圖片容器
    const wrapper = document.createElement('div');
    wrapper.className = 'word-image-wrapper';
    wrapper.setAttribute('data-word-image', 'true');
    wrapper.style.cssText = `
      display: inline-block;
      position: relative;
      resize: both;
      overflow: hidden;
      max-width: 100%;
      min-width: 100px;
      min-height: 100px;
      border: 2px dashed transparent;
      margin: 10px 0;
      cursor: pointer;
    `;

    // 創建圖片
    const img = document.createElement('img');
    img.src = src;
    img.className = 'word-inserted-image';
    img.setAttribute('data-word-image', 'true');
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      pointer-events: none;
    `;
    wrapper.appendChild(img);

    // 創建控制列
    const toolbar = document.createElement('div');
    toolbar.className = 'word-image-toolbar';
    toolbar.style.cssText = `
      position: absolute;
      top: -35px;
      left: 0;
      background: rgba(0, 0, 0, 0.85);
      border-radius: 6px;
      padding: 6px;
      display: none;
      gap: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    // 靠左按鈕
    const btnLeft = this.createImageToolbarBtn('format_align_left', '靠左', () => {
      wrapper.style.display = 'block';
      wrapper.style.marginLeft = '0';
      wrapper.style.marginRight = 'auto';
    });

    // 置中按鈕
    const btnCenter = this.createImageToolbarBtn('format_align_center', '置中', () => {
      wrapper.style.display = 'block';
      wrapper.style.marginLeft = 'auto';
      wrapper.style.marginRight = 'auto';
    });

    // 靠右按鈕
    const btnRight = this.createImageToolbarBtn('format_align_right', '靠右', () => {
      wrapper.style.display = 'block';
      wrapper.style.marginLeft = 'auto';
      wrapper.style.marginRight = '0';
    });

    // 刪除按鈕
    const btnDelete = this.createImageToolbarBtn('delete', '刪除', () => {
      const newPara = document.createElement('p');
      newPara.innerHTML = '<br>';
      wrapper.parentNode.insertBefore(newPara, wrapper.nextSibling);
      
      wrapper.remove();
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(newPara, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      console.log('✅ 圖片已刪除');
    });

    toolbar.appendChild(btnLeft);
    toolbar.appendChild(btnCenter);
    toolbar.appendChild(btnRight);
    toolbar.appendChild(btnDelete);
    wrapper.appendChild(toolbar);

    // 點擊顯示控制列
    wrapper.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      document.querySelectorAll('.word-image-wrapper').forEach(w => {
        w.style.border = '2px dashed transparent';
        const tb = w.querySelector('.word-image-toolbar');
        if (tb) tb.style.display = 'none';
      });
      
      wrapper.style.border = '2px dashed #5aa7ff';
      toolbar.style.display = 'flex';
      wrapper.classList.add('selected');
    };

    // 鍵盤事件：支援 DEL / Backspace 刪除
    wrapper.setAttribute('tabindex', '0');
    
    wrapper.onkeydown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('確定要刪除此圖片？')) {
          const newPara = document.createElement('p');
          newPara.innerHTML = '<br>';
          wrapper.parentNode.insertBefore(newPara, wrapper.nextSibling);
          
          wrapper.remove();
          
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(newPara, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          
          console.log('✅ 圖片已刪除（按鍵）');
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextEl = wrapper.nextElementSibling;
        if (nextEl) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(nextEl, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    };

    // 在圖片後面自動加一個空段落
    const afterPara = document.createElement('p');
    afterPara.innerHTML = '<br>';

    // 插入到編輯器
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(afterPara);
      range.insertNode(wrapper);
      
      range.setStart(afterPara, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(wrapper);
      editor.appendChild(afterPara);
    }

    // 點擊編輯器其他地方時隱藏控制列
    const hideToolbar = (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.style.border = '2px dashed transparent';
        toolbar.style.display = 'none';
        wrapper.classList.remove('selected');
      }
    };
    
    editor.addEventListener('click', hideToolbar);

    console.log('✅ 圖片已插入（帶刪除功能）');
  },

  createImageToolbarBtn(icon, title, onClick) {
    const btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.title = title;
    btn.style.cssText = `
      padding: 4px 6px;
      background: transparent;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      border-radius: 4px;
    `;
    btn.innerHTML = `<span class="material-icons" style="font-size: 16px;">${icon}</span>`;
    btn.onclick = (e) => {
      e.stopPropagation();
      onClick();
    };
    btn.onmouseover = () => btn.style.background = 'rgba(255, 255, 255, 0.2)';
    btn.onmouseout = () => btn.style.background = 'transparent';
    return btn;
  },

  // ===== 編號清單功能 =====
  initLists() {
    const btn = document.getElementById('wordBtnOrderedList');
    if (!btn) {
      console.warn('找不到 wordBtnOrderedList 按鈕');
      return;
    }

    btn.onclick = () => {
      console.log('點擊了編號清單按鈕');
      this.showListMenu(btn);
    };
    
    console.log('✅ 編號清單按鈕已綁定');
  },

  showListMenu(btnElement) {
    const oldMenu = document.getElementById('wordListMenu');
    if (oldMenu) {
      oldMenu.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.id = 'wordListMenu';
    menu.style.cssText = `
      position: fixed;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      min-width: 180px;
    `;

    const rect = btnElement.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;

    const items = [
      { icon: 'format_list_numbered', text: '編號清單 (1,2,3)', cmd: 'insertOrderedList', style: 'decimal' },
      { icon: 'format_list_bulleted', text: '項目清單 (•)', cmd: 'insertUnorderedList', style: '' },
      { icon: 'format_list_numbered', text: '字母清單 (a,b,c)', cmd: 'insertOrderedList', style: 'lower-alpha' },
      { icon: 'format_list_numbered', text: '羅馬數字 (i,ii,iii)', cmd: 'insertOrderedList', style: 'lower-roman' },
      { icon: 'format_list_numbered', text: '中文數字 (一,二,三)', cmd: 'insertOrderedList', style: 'cjk-ideographic' }
    ];

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        background: transparent;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        color: var(--text);
      `;
      btn.innerHTML = `
        <span class="material-icons" style="font-size: 18px;">${item.icon}</span>
        ${item.text}
      `;
      btn.onclick = () => {
        document.execCommand(item.cmd, false, null);
        
        if (item.style) {
          const editor = document.getElementById('wordEditor');
          const lists = editor.querySelectorAll('ol');
          if (lists.length > 0) {
            lists[lists.length - 1].style.listStyleType = item.style;
          }
        }
        
        menu.remove();
        console.log(`✅ 已套用：${item.text}`);
      };
      btn.onmouseover = () => btn.style.background = 'var(--hover)';
      btn.onmouseout = () => btn.style.background = 'transparent';
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);

    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== btnElement) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  },

  // ===== 列印功能 =====
  initPrint() {
    const btn = document.getElementById('wordBtnPrint');
    if (!btn) {
      console.warn('找不到 wordBtnPrint 按鈕');
      return;
    }

    btn.onclick = () => {
      console.log('點擊了列印按鈕');
      
      const zoomSelect = document.getElementById('wordZoomSelect');
      const currentZoom = zoomSelect ? zoomSelect.value : '1';
      
      if (zoomSelect) {
        zoomSelect.value = '1';
        const page = document.querySelector('.word-page');
        if (page) {
          page.style.transform = 'scale(1)';
        }
      }
      
      window.print();
      
      setTimeout(() => {
        if (zoomSelect) {
          zoomSelect.value = currentZoom;
          const page = document.querySelector('.word-page');
          if (page) {
            page.style.transform = `scale(${currentZoom})`;
          }
        }
      }, 500);
      
      console.log('✅ 列印對話框已開啟');
    };
    
    console.log('✅ 列印按鈕已綁定');
  },

  // ===== 插入表格功能 =====
  initTable() {
    const btn = document.getElementById('wordBtnInsertTable');
    if (!btn) {
      console.warn('找不到 wordBtnInsertTable 按鈕');
      return;
    }

    btn.onclick = () => {
      console.log('點擊了插入表格按鈕');
      this.showTableMenu(btn);
    };
    
    console.log('✅ 插入表格按鈕已綁定');
  },

  showTableMenu(btnElement) {
    const oldMenu = document.getElementById('wordTableMenu');
    if (oldMenu) {
      oldMenu.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.id = 'wordTableMenu';
    menu.style.cssText = `
      position: fixed;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
    `;

    const rect = btnElement.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;

    const title = document.createElement('div');
    title.textContent = '選擇表格大小';
    title.style.cssText = `
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 8px;
    `;
    menu.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(8, 20px);
      gap: 2px;
      margin-bottom: 8px;
    `;

    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.style.cssText = `
        width: 20px;
        height: 20px;
        border: 1px solid var(--border);
        cursor: pointer;
        border-radius: 2px;
      `;
      
      cell.onmouseover = () => {
        const row = Math.floor(i / 8) + 1;
        const col = (i % 8) + 1;
        
        for (let j = 0; j < 64; j++) {
          const r = Math.floor(j / 8) + 1;
          const c = (j % 8) + 1;
          if (r <= row && c <= col) {
            grid.children[j].style.background = 'var(--primary)';
          } else {
            grid.children[j].style.background = 'transparent';
          }
        }
        
        info.textContent = `${row} × ${col}`;
      };
      
      cell.onclick = () => {
        const row = Math.floor(i / 8) + 1;
        const col = (i % 8) + 1;
        this.insertTable(row, col);
        menu.remove();
      };
      
      grid.appendChild(cell);
    }
    menu.appendChild(grid);

    const info = document.createElement('div');
    info.textContent = '1 × 1';
    info.style.cssText = `
      font-size: 12px;
      color: var(--text);
      text-align: center;
    `;
    menu.appendChild(info);

    document.body.appendChild(menu);

    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== btnElement) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  },

  insertTable(rows, cols) {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;

    editor.focus();

    const table = document.createElement('table');
    table.contentEditable = 'true';
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      background: var(--bg);
    `;

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.style.cssText = `
          border: 1px solid var(--border);
          padding: 8px;
          min-width: 80px;
          min-height: 30px;
        `;
        td.innerHTML = '<br>';
        tr.appendChild(td);
      }
      
      table.appendChild(tr);
    }

    const afterPara = document.createElement('p');
    afterPara.innerHTML = '<br>';

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      range.insertNode(afterPara);
      range.insertNode(table);
      
      setTimeout(() => {
        const firstCell = table.querySelector('td');
        if (firstCell) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(firstCell, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          firstCell.focus();
        }
      }, 50);
    } else {
      editor.appendChild(table);
      editor.appendChild(afterPara);
      
      setTimeout(() => {
        const firstCell = table.querySelector('td');
        if (firstCell) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.setStart(firstCell, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          firstCell.focus();
        }
      }, 50);
    }

    console.log(`✅ 已插入 ${rows}×${cols} 表格`);
  }
};
