// ===== snapshotCompare.js - 快照對比模組 (浮動面板版 + 智能 Diff) =====

(function() {

'use strict';

let savedSnapshot = null;
let currentSnapshot = null;
let isComparing = false;

// 將 savedSnapshot 暴露給全局，讓專案儲存可以讀取
window.getSavedSnapshot = function() {
  return savedSnapshot;
};

window.setSavedSnapshot = function(data) {
  savedSnapshot = data;
  const btnCompare = document.getElementById('btnCompare');
  if (btnCompare) {
    btnCompare.disabled = !data || data.length === 0;
  }
};

// ========== 初始化 ==========
function init() {
    console.log('🔧 初始化快照對比模組（浮動面板版）...');
    
    const snapshotIcon = document.querySelector('#snapshotIcon');
    const snapshotPanel = document.querySelector('#snapshotPanel');
    const snapshotPanelClose = document.querySelector('#snapshotPanelClose');
    const btnSnapshot = document.querySelector('#btnSnapshot');
    const btnCompare = document.querySelector('#btnCompare');
    const btnBackToEdit = document.querySelector('#btnBackToEdit');
    
    if (!snapshotIcon || !snapshotPanel) {
        console.error('❌ 找不到浮動面板元素！');
        return;
    }
    
    // 點擊圖標開關面板
    snapshotIcon.addEventListener('click', togglePanel);
    snapshotPanelClose.addEventListener('click', closePanel);
    
    // 綁定按鈕事件
    if (btnSnapshot) btnSnapshot.addEventListener('click', handleSnapshot);
    if (btnCompare) btnCompare.addEventListener('click', handleCompare);
    if (btnBackToEdit) btnBackToEdit.addEventListener('click', handleBackToEdit);
    
    // 讓面板可拖動
    if (typeof window.makeDraggable === 'function') {
        const header = document.querySelector('.snapshotPanelHeader');
        window.makeDraggable(snapshotPanel, header);
    }
    
    console.log('✅ 快照對比模組已啟動（浮動面板版）');
}

// ========== 開關面板 ==========
function togglePanel() {
    const panel = document.querySelector('#snapshotPanel');
    if (panel) {
        const isHidden = panel.classList.contains('hidden');
        
        // 如果即將打開,先重置位置到中間
        if (isHidden) {
            panel.style.position = 'fixed';
            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
        
        panel.classList.toggle('hidden');
    }
}

function closePanel() {
    const panel = document.querySelector('#snapshotPanel');
    if (panel) {
        panel.classList.add('hidden');
    }
}

// ========== 📸 拍快照 ==========
function handleSnapshot() {
    console.log('📸 開始拍快照...');
    const rows = document.querySelectorAll('.gridRow');
    if (rows.length === 0) {
        alert('❌ 未有字幕內容！請先載入字幕。');
        return;
    }
    
    savedSnapshot = [];
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('div');
        if (cells.length >= 4) {
            savedSnapshot.push({
                index: index,
                number: cells[0].textContent.trim(),
                time: cells[2].textContent.trim(),
                text: cells[3].textContent.trim()
            });
        }
    });
    
    console.log(`📸 快照已保存：${savedSnapshot.length} 行`);
    
    const btnCompare = document.querySelector('#btnCompare');
    btnCompare.disabled = false;
    
    alert(`✅ 已拍快照！\n記錄了 ${savedSnapshot.length} 行字幕\n\n現在可以修改字幕，然後按「👀 對比」查看差異。`);
    
    // 關閉面板 (可選)
    closePanel();
}

// ========== 👀 顯示對比 ==========
function handleCompare() {
    console.log('👀 開始對比...');
    if (!savedSnapshot || savedSnapshot.length === 0) {
        alert('❌ 未有快照！請先按「📸 拍快照」。');
        return;
    }
    
    const rows = document.querySelectorAll('.gridRow');
    currentSnapshot = [];
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('div');
        if (cells.length >= 4) {
            currentSnapshot.push({
                index: index,
                number: cells[0].textContent.trim(),
                time: cells[2].textContent.trim(),
                text: cells[3].textContent.trim()
            });
        }
    });
    
    console.log(`📊 當前狀態：${currentSnapshot.length} 行`);
    
    renderComparison();
    isComparing = true;
    
    const btnSnapshot = document.querySelector('#btnSnapshot');
    const btnCompare = document.querySelector('#btnCompare');
    const btnBackToEdit = document.querySelector('#btnBackToEdit');
    
    btnSnapshot.disabled = true;
    btnCompare.disabled = true;
    btnBackToEdit.disabled = false;
    
    console.log('✅ 對比模式已啟動');
    
    // 關閉面板 (可選)
    // closePanel();
}

// ========== 🧮 智能 Diff 算法 - 混合匹配策略 ==========
function computeDiff(oldArr, newArr) {
    const diff = [];
    const usedNew = new Set(); // 記錄已配對的新行
    const usedOld = new Set(); // 記錄已配對的舊行
    
    // 第一輪：尋找文字完全相同的行（可能時間不同）
    oldArr.forEach((oldItem, oldIdx) => {
        // 在新陣列中尋找文字相同的行
        const newIdx = newArr.findIndex((newItem, idx) => 
            !usedNew.has(idx) && newItem.text === oldItem.text
        );
        
        if (newIdx !== -1) {
            // 找到文字相同的行
            usedOld.add(oldIdx);
            usedNew.add(newIdx);
            
            const timeChanged = oldItem.time !== newArr[newIdx].time;
            
            if (timeChanged) {
                diff.push({
                    type: 'modify',
                    oldIndex: oldIdx,
                    newIndex: newIdx,
                    old: oldItem,
                    new: newArr[newIdx],
                    timeChanged: true,
                    textChanged: false
                });
            } else {
                diff.push({
                    type: 'same',
                    oldIndex: oldIdx,
                    newIndex: newIdx,
                    old: oldItem,
                    new: newArr[newIdx]
                });
            }
        }
    });
    
    // 第二輪：尋找時間相同但文字不同的行（修改文字）
    oldArr.forEach((oldItem, oldIdx) => {
        if (usedOld.has(oldIdx)) return; // 已配對過
        
        const newIdx = newArr.findIndex((newItem, idx) => 
            !usedNew.has(idx) && newItem.time === oldItem.time
        );
        
        if (newIdx !== -1) {
            // 找到時間相同的行
            usedOld.add(oldIdx);
            usedNew.add(newIdx);
            
            diff.push({
                type: 'modify',
                oldIndex: oldIdx,
                newIndex: newIdx,
                old: oldItem,
                new: newArr[newIdx],
                timeChanged: false,
                textChanged: true
            });
        }
    });
    

// 第四輪：處理真正的刪除和新增
oldArr.forEach((oldItem, oldIdx) => {
    if (!usedOld.has(oldIdx)) {
        diff.push({
            type: 'delete',
            oldIndex: oldIdx,
            old: oldItem
        });
    }
});

newArr.forEach((newItem, newIdx) => {
    if (!usedNew.has(newIdx)) {
        diff.push({
            type: 'add',
            newIndex: newIdx,
            new: newItem
        });
    }
});

// 按照行號排序 (oldIndex 優先,新增行用 newIndex)
diff.sort((a, b) => {
    // 使用 oldIndex,沒有就用 newIndex
    const aIdx = a.oldIndex !== undefined ? a.oldIndex : a.newIndex;
    const bIdx = b.oldIndex !== undefined ? b.oldIndex : b.newIndex;
    
    // 如果同一行號,按類型排序: same/modify < delete < add
    if (aIdx === bIdx) {
        const typeOrder = { 'same': 0, 'modify': 0, 'delete': 1, 'add': 2 };
        return typeOrder[a.type] - typeOrder[b.type];
    }
    
    return aIdx - bIdx;
});

console.log('🔍 Diff 結果:', diff);
return diff;
}

// ========== 🎨 渲染對比畫面 (使用 Diff) ==========
function renderComparison() {
    const gridBody = document.querySelector('#gridBody');
    if (!gridBody) return;
    
    gridBody.innerHTML = '';
    
    const diff = computeDiff(savedSnapshot, currentSnapshot);
    
diff.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'gridRow';
    row.style.background = 'var(--panel2)';
    
    const c1 = document.createElement('div');
    // ✅ 使用實際的行索引,而不是累加計數器
    let rowNumber;
    if (item.type === 'delete') {
        rowNumber = (item.oldIndex + 1); // 刪除行顯示舊位置
    } else {
        rowNumber = (item.newIndex !== undefined ? item.newIndex : item.oldIndex) + 1;
    }
    c1.textContent = String(rowNumber);
        
        const c2 = document.createElement('div');
        const c3 = document.createElement('div');
        const c4 = document.createElement('div');
        
        if (item.type === 'same') {
            // 相同 - 正常顯示
            c3.textContent = item.new.time;
            c4.textContent = item.new.text;
            
        } else if (item.type === 'add') {
            // 新增 - 綠色背景 (整行 + 時間格 + 文字格)
            row.style.background = 'rgba(0, 255, 0, 0.15)';
            c3.innerHTML = `<span style="background: rgba(0, 255, 0, 0.3); padding: 2px 4px; border-radius: 3px;">${escapeHtml(item.new.time)}</span>`;
            c3.title = '新增的行';
            c4.innerHTML = `<span style="background: rgba(0, 255, 0, 0.3); padding: 2px 4px; border-radius: 3px;">${escapeHtml(item.new.text)}</span>`;
            
        } else if (item.type === 'delete') {
            // 刪除 - 紅色背景 + 刪除線 (整行 + 時間格 + 文字格)
            row.style.background = 'rgba(255, 0, 0, 0.15)';
            c3.innerHTML = `<span style="background: rgba(255, 0, 0, 0.3); padding: 2px 4px; border-radius: 3px; text-decoration: line-through;">${escapeHtml(item.old.time)}</span>`;
            c3.title = '已刪除的行';
            c4.innerHTML = `<span style="background: rgba(255, 0, 0, 0.3); padding: 2px 4px; border-radius: 3px; text-decoration: line-through;">${escapeHtml(item.old.text)}</span>`;
            
} else if (item.type === 'modify') {
    const timeChanged = item.timeChanged;
    const textChanged = item.textChanged;
    
    if (timeChanged && textChanged) {
        row.style.background = 'rgba(255, 200, 0, 0.15)';
        c3.innerHTML = `<span style="background: rgba(255, 200, 0, 0.3); padding: 2px 4px; border-radius: 3px;">${escapeHtml(item.new.time)}</span>`;
        c3.title = `原時間：${item.old.time}`;
        c4.style.background = 'rgba(255, 200, 0, 0.2)';
        c4.innerHTML = `<del style="opacity: 0.65;">${escapeHtml(item.old.text)}</del> → ${escapeHtml(item.new.text)}`;
    }
    else if (timeChanged && !textChanged) {
        c3.innerHTML = `<span style="background: rgba(255, 200, 0, 0.4); padding: 2px 4px; border-radius: 3px;">${escapeHtml(item.new.time)}</span>`;
        c3.title = `原時間：${item.old.time}`;
        c4.textContent = item.new.text;
    }
    else if (!timeChanged && textChanged) {
        c3.textContent = item.new.time;
        c4.style.background = 'rgba(255, 200, 0, 0.2)';
        c4.innerHTML = `<del style="opacity: 0.65;">${escapeHtml(item.old.text)}</del> → ${escapeHtml(item.new.text)}`;
    }
}
        
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);
        row.appendChild(c4);
        gridBody.appendChild(row);
    });
}

// ========== ✏️ 返回編輯 ==========
function handleBackToEdit() {
    console.log('✏️ 返回編輯模式...');
    isComparing = false;
    
    const btnSnapshot = document.querySelector('#btnSnapshot');
    const btnCompare = document.querySelector('#btnCompare');
    const btnBackToEdit = document.querySelector('#btnBackToEdit');
    
    btnSnapshot.disabled = false;
    btnCompare.disabled = false;
    btnBackToEdit.disabled = true;
    
    if (typeof window.renderGrid === 'function') {
        console.log('🔄 調用 renderGrid()...');
        window.renderGrid();
    }
    
    console.log('✅ 已返回編輯模式');
    
    // 關閉面板 (可選)
    closePanel();
}

// ========== 工具函數 ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== 自動初始化 ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
