// timeCalc.js - 時間計算器模組（完全獨立版本）
// 不依賴 app.js

// ========== 工具函數 ==========

// ========== DOM 選擇器 ==========
const timeCalcIcon = sel("#timeCalcIcon");
const timeCalcPanel = sel("#timeCalcPanel");
const timeCalcHeader = sel("#timeCalcHeader");
const timeCalcConvert = sel("#timeCalcConvert");
const timeCalcHistory = sel("#timeCalcHistory");
const tcRow1 = sel("#tcRow1");
const tcRow2 = sel("#tcRow2");
const tcRow3 = sel("#tcRow3");
const tcRow4 = sel("#tcRow4");
const tcConversion = sel("#tcConversion");
const tcHours = sel("#tcHours");
const tcMinutes = sel("#tcMinutes");
const tcSeconds = sel("#tcSeconds");
const tcMs = sel("#tcMs");
const tcHistoryPanel = sel("#tcHistoryPanel");
const tcHistoryList = sel("#tcHistoryList");
const tcHistoryClear = sel("#tcHistoryClear");
const tcHistoryClose = sel("#tcHistoryClose");

// ========== 狀態變量 ==========
let tcCurrentInput = "";
let tcOperator = "";
let tcFirstValue = 0;
let tcSecondValue = 0;
let tcResult = 0;
let tcHistory = [];
const TC_HISTORY_MAX = 20;

// ========== 格式化函數 ==========
function tcFormatTimeUnits(ms) {
  const sign = ms < 0 ? "-" : "";
  const absMs = Math.abs(ms);
  
  const h = Math.floor(absMs / 3600000);
  const m = Math.floor((absMs % 3600000) / 60000);
  const s = Math.floor((absMs % 60000) / 1000);
  const mss = absMs % 1000;
  
  return `${sign}${h}h ${m}min ${s}sec ${mss}ms`;
}

function tcParseInput(input, unit) {
  const num = parseFloat(input);
  if (isNaN(num)) return 0;
  
  switch(unit) {
    case "h": return num * 3600000;
    case "m": return num * 60000;
    case "s": return num * 1000;
    case "ms": return num;
    default: return 0;
  }
}

// ========== 顯示更新 ==========
function tcUpdateDisplay() {
  if (tcRow1) {
    let display = tcFormatTimeUnits(tcFirstValue);
    if (!tcOperator && tcCurrentInput) {
      display = tcCurrentInput;
    }
    tcRow1.textContent = display;
  }
  
  if (tcRow2) {
    tcRow2.textContent = tcOperator || "+";
  }
  
  if (tcRow3) {
    let display = tcFormatTimeUnits(tcSecondValue);
    if (tcOperator && tcCurrentInput) {
      display = tcCurrentInput;
    }
    tcRow3.textContent = display;
  }
  
  if (tcRow4) {
    tcRow4.textContent = tcFormatTimeUnits(tcResult);
  }
}

// ========== 按鍵處理 ==========
function tcHandleKey(val) {
  tcCurrentInput += val;
  tcUpdateDisplay();
}

function tcHandleUnit(unit) {
  if (!tcCurrentInput) return;
  
  const ms = tcParseInput(tcCurrentInput, unit);
  
  if (!tcOperator) {
    tcFirstValue += ms;
  } else {
    tcSecondValue += ms;
  }
  
  tcCurrentInput = "";
  tcUpdateDisplay();
}

function tcHandleOperator(op) {
  if (op === "clear") {
    tcCurrentInput = "";
    tcFirstValue = 0;
    tcSecondValue = 0;
    tcResult = 0;
    tcOperator = "";
    tcUpdateDisplay();
    tcHideConversion();
    return;
  }
  
  if (op === "back") {
    tcCurrentInput = tcCurrentInput.slice(0, -1);
    tcUpdateDisplay();
    return;
  }
  
  if (op === "+" || op === "-") {
    tcOperator = op;
    tcSecondValue = 0;
    tcCurrentInput = "";
    tcUpdateDisplay();
    return;
  }
  
  if (op === "=") {
    if (!tcOperator) {
      tcResult = tcFirstValue;
      tcUpdateDisplay();
      return;
    }
    
    if (tcOperator === "+") {
      tcResult = tcFirstValue + tcSecondValue;
    } else if (tcOperator === "-") {
      tcResult = tcFirstValue - tcSecondValue;
    }
    
    tcUpdateDisplay();
    tcAddHistory();
    
    tcFirstValue = tcResult;
    tcSecondValue = 0;
    tcOperator = "";
  }
}

// ========== 歷史記錄 ==========
function tcAddHistory() {
  const record = {
    first: tcFirstValue,
    op: tcOperator,
    second: tcSecondValue,
    result: tcResult,
    timestamp: new Date().toLocaleString('zh-HK', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  tcHistory.unshift(record);
  if (tcHistory.length > TC_HISTORY_MAX) {
    tcHistory = tcHistory.slice(0, TC_HISTORY_MAX);
  }
}

function tcShowHistory() {
  if (!tcHistoryPanel || !timeCalcPanel) return;
  
  const isHidden = tcHistoryPanel.classList.contains("hidden");
  
  if (isHidden) {
    const calcRect = timeCalcPanel.getBoundingClientRect();
    const gap = 10;
    tcHistoryPanel.style.left = `${calcRect.right + gap}px`;
    tcHistoryPanel.style.top = `${calcRect.top}px`;
    tcHistoryPanel.classList.remove("hidden");
    tcUpdateHistoryList();
  } else {
    tcHistoryPanel.classList.add("hidden");
  }
}

function tcHideHistory() {
  if (tcHistoryPanel) {
    tcHistoryPanel.classList.add("hidden");
  }
}

function tcUpdateHistoryList() {
  if (!tcHistoryList) return;
  
  if (tcHistory.length === 0) {
    tcHistoryList.innerHTML = '<div class="tcHistoryEmpty">無記錄</div>';
    return;
  }
  
  tcHistoryList.innerHTML = '';
  
  tcHistory.forEach(record => {
    const item = document.createElement('div');
    item.className = 'tcHistoryItem';
    item.innerHTML = `
      <div>${tcFormatTimeUnits(record.first)} ${record.op} ${tcFormatTimeUnits(record.second)}</div>
      <div style="color:#5aa7ff; margin-top:4px">${tcFormatTimeUnits(record.result)}</div>
      <div class="tcHistoryTime">${record.timestamp}</div>
    `;
    
    item.addEventListener('click', () => {
      tcFirstValue = record.result;
      tcSecondValue = 0;
      tcResult = 0;
      tcOperator = "";
      tcCurrentInput = "";
      tcUpdateDisplay();
      tcHideHistory();
    });
    
    tcHistoryList.appendChild(item);
  });
}

function tcClearHistory() {
  if (!confirm('確定要清除所有歷史記錄？')) return;
  tcHistory = [];
  tcUpdateHistoryList();
}

// ========== 轉換顯示 ==========
function tcShowConversion() {
  if (!tcConversion) return;
  
  const isHidden = tcConversion.classList.contains("hidden");
  tcConversion.classList.toggle("hidden", !isHidden);
  
  if (!isHidden) return;
  
  const ms = tcResult || tcFirstValue;
  const absMs = Math.abs(ms);
  
  if (tcHours) tcHours.textContent = (absMs / 3600000).toFixed(3);
  if (tcMinutes) tcMinutes.textContent = (absMs / 60000).toFixed(3);
  if (tcSeconds) tcSeconds.textContent = (absMs / 1000).toFixed(3);
  if (tcMs) tcMs.textContent = absMs.toFixed(0);
}

function tcHideConversion() {
  if (tcConversion) {
    tcConversion.classList.add("hidden");
  }
}

// ========== 面板控制 ==========
function tcTogglePanel() {
  if (!timeCalcPanel) return;
  
  const isHidden = timeCalcPanel.classList.contains("hidden");
  
  if (isHidden) {
    timeCalcPanel.classList.remove("hidden");
  } else {
    timeCalcPanel.classList.add("hidden");
    tcHideHistory();
    tcHideConversion();
  }
}

// ========== 初始化 ==========
function initTimeCalc() {
  if (!timeCalcIcon || !timeCalcPanel) {
    console.warn('[TimeCalc] DOM elements not found');
    return;
  }
  
  // ICON 點擊
  timeCalcIcon.addEventListener('click', tcTogglePanel);
  
  // 轉換按鈕
  if (timeCalcConvert) {
    timeCalcConvert.addEventListener('click', tcShowConversion);
  }
  
  // 歷史按鈕
  if (timeCalcHistory) {
    timeCalcHistory.addEventListener('click', tcShowHistory);
  }
  
  // 清除歷史
  if (tcHistoryClear) {
    tcHistoryClear.addEventListener('click', tcClearHistory);
  }
  
  // 關閉歷史
  if (tcHistoryClose) {
    tcHistoryClose.addEventListener('click', tcHideHistory);
  }
  
  // 數字鍵
  document.querySelectorAll('.tcKey').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (val) tcHandleKey(val);
    });
  });
  
  // 單位鍵
  document.querySelectorAll('.tcUnit').forEach(btn => {
    btn.addEventListener('click', () => {
      const unit = btn.getAttribute('data-unit');
      if (unit) tcHandleUnit(unit);
    });
  });
  
  // 運算符
  document.querySelectorAll('.tcOp').forEach(btn => {
    btn.addEventListener('click', () => {
      const op = btn.getAttribute('data-op');
      if (op) tcHandleOperator(op);
    });
  });
  
  // 可拖曳
  if (typeof window.makeDraggable === 'function' && timeCalcHeader) {
    window.makeDraggable(timeCalcPanel, timeCalcHeader);
  }
  
  console.log('[TimeCalc] Initialized ✓');
}

// ========== 啟動 ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeCalc);
} else {
  initTimeCalc();
}
