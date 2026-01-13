// ===== Word 模式數據交換 =====

const WordData = {
  // 從字幕匯入到 Word（三種模式）
  importFromSubtitles(mode) {
    const editor = document.getElementById('wordEditor');
    
    if (mode === 'blank') {
      // 模式 3：建立空白文件
      editor.innerHTML = '<p><br></p>';
      WordCore.updateStats();
      return;
    }
    
    // 獲取字幕數據（從 app.js）
    const subtitles = this.getSubtitleData();
    
    if (subtitles.length === 0) {
      editor.innerHTML = '<p style="color: var(--muted);">（目前沒有字幕數據）</p>';
      WordCore.updateStats();
      return;
    }
    
    if (mode === 'withTime') {
      // 模式 1：含時間
      let html = '';
      subtitles.forEach(sub => {
        const startTime = sub.start || '00:00:00,000';
        const endTime = sub.end || '00:00:00,000';
        html += `<p data-start="${startTime}" data-end="${endTime}">[${startTime}]<br>${sub.text}</p>`;
      });
      editor.innerHTML = html;
    } else if (mode === 'textOnly') {
      // 模式 2：純文字
      let html = '';
      subtitles.forEach(sub => {
        html += `<p>${sub.text}</p>`;
      });
      editor.innerHTML = html;
    }
    
    WordCore.updateStats();
  },
  
  // 從 Word 回傳到字幕
  exportToSubtitles() {
    const editor = document.getElementById('wordEditor');
    const paragraphs = editor.querySelectorAll('p, h1, h2, h3');
    
    const result = [];
    paragraphs.forEach(p => {
      const text = p.innerText.trim();
      if (!text) return;
      
      // 檢查有冇時間數據
      const start = p.dataset.start || '00:00:00,000';
      const end = p.dataset.end || '00:00:00,000';
      
      // 移除時間標記（如果有）
      const cleanText = text.replace(/^\[\d{2}:\d{2}:\d{2},\d{3}\]\s*/g, '');
      
      result.push({
        start: start,
        end: end,
        text: cleanText
      });
    });
    
    return result;
  },
  
  // 獲取字幕數據（從 app.js 的全域變數）
  getSubtitleData() {
    // app.js 有 subtitleItems 陣列
    if (typeof subtitleItems !== 'undefined' && Array.isArray(subtitleItems)) {
      return subtitleItems.map(sub => ({
        start: sub.start || '00:00:00,000',
        end: sub.end || '00:00:00,000',
        text: sub.text || ''
      }));
    }
    return [];
  },
  
  // 更新字幕數據（回傳到 app.js）
  updateSubtitleData(newData) {
    if (typeof subtitleItems !== 'undefined' && Array.isArray(subtitleItems)) {
      // 清空原本字幕
      subtitleItems.length = 0;
      
      // 插入新數據
      newData.forEach((item, index) => {
        subtitleItems.push({
          index: index + 1,
          start: item.start,
          end: item.end,
          text: item.text
        });
      });
      
      // 重新渲染 grid（如果 app.js 有 renderGrid 函數）
      if (typeof renderGrid === 'function') {
        renderGrid();
      }
      
      console.log(`✅ 已更新 ${newData.length} 行字幕`);
    }
  }
};
