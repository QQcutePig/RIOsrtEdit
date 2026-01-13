// ===== Word 模式樣式標記功能 =====

const WordStyleMarkers = {
  enabled: false,
  markerClass: 'word-style-marker',
  isUpdating: false, // 防止無限循環
  
  // 初始化
  init() {
    const toggle = document.getElementById('wordToggleStyleMarkers');
    if (toggle) {
      toggle.onchange = () => {
        this.enabled = toggle.checked;
        this.updateMarkers();
      };
    }
    
    console.log('✅ Word 樣式標記已初始化');
  },
  
  // 更新標記
  updateMarkers() {
    if (this.isUpdating) return; // 防止重複執行
    this.isUpdating = true;
    
    const editor = document.getElementById('wordEditor');
    if (!editor) {
      this.isUpdating = false;
      return;
    }
    
    try {
      // 移除舊標記
      this.removeMarkers();
      
      if (!this.enabled) {
        this.isUpdating = false;
        return;
      }
      
      // 添加新標記
      const elements = editor.querySelectorAll('h1, h2, h3, p');
      
      elements.forEach(el => {
        // 檢查是否已有標記
        if (el.querySelector(`.${this.markerClass}`)) return;
        
        const tag = el.tagName.toLowerCase();
        let color, text;
        
        switch(tag) {
          case 'h1':
            color = '#FF5252';
            text = 'H1';
            break;
          case 'h2':
            color = '#FF9800';
            text = 'H2';
            break;
          case 'h3':
            color = '#FFC107';
            text = 'H3';
            break;
          case 'p':
            color = '#4CAF50';
            text = 'P';
            break;
          default:
            return;
        }
        
        const marker = document.createElement('span');
        marker.className = this.markerClass;
        marker.contentEditable = 'false'; // 防止編輯
        marker.textContent = text;
        marker.style.cssText = `
          display: inline-block;
          background: ${color};
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 3px;
          margin-right: 6px;
          user-select: none;
          vertical-align: middle;
          pointer-events: none;
        `;
        
        // 插入到元素開頭
        el.insertBefore(marker, el.firstChild);
      });
    } catch (e) {
      console.error('樣式標記錯誤:', e);
    } finally {
      this.isUpdating = false;
    }
  },
  
  // 移除標記
  removeMarkers() {
    const editor = document.getElementById('wordEditor');
    if (!editor) return;
    
    const markers = editor.querySelectorAll(`.${this.markerClass}`);
    markers.forEach(m => m.remove());
  }
};
