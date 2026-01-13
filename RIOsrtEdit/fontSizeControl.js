// fontSizeControl.js - 字幕字體大小控制模組
// 依賴：app.js 提供 sel() 函數

// ========== DOM 選擇器 ==========
const btnFontSizeDown = document.querySelector('#btnFontSizeDown');
const btnFontSizeUp = document.querySelector('#btnFontSizeUp');

// ========== 設定 ==========
const FONT_SIZE_KEY = 'subtitle_fontSize_level';
const FONT_SIZE_LEVELS = ['xs', 'sm', 'md', 'lg', 'xl'];
const DEFAULT_LEVEL = 2; // 'md'

let currentLevelIndex = DEFAULT_LEVEL;

// ========== 核心功能 ==========

/**
 * 載入已儲存的字體大小設定
 */
function loadFontSizePreference() {
  try {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    if (saved && FONT_SIZE_LEVELS.includes(saved)) {
      currentLevelIndex = FONT_SIZE_LEVELS.indexOf(saved);
    }
  } catch (e) {
    console.warn('loadFontSizePreference error:', e);
  }
  applyFontSize();
}

/**
 * 儲存字體大小設定
 */
function saveFontSizePreference() {
  try {
    localStorage.setItem(FONT_SIZE_KEY, FONT_SIZE_LEVELS[currentLevelIndex]);
  } catch (e) {
    console.warn('saveFontSizePreference error:', e);
  }
}

/**
 * 應用當前字體大小到 <body>
 */
function applyFontSize() {
  const level = FONT_SIZE_LEVELS[currentLevelIndex];
  
  // 移除所有字體大小 class
  FONT_SIZE_LEVELS.forEach(l => {
    document.body.classList.remove(`fontSize-${l}`);
  });
  
  // 加入當前級別的 class
  document.body.classList.add(`fontSize-${level}`);
  
  updateButtonStates();
}

/**
 * 更新按鈕的可用狀態
 */
function updateButtonStates() {
  if (btnFontSizeDown) {
    btnFontSizeDown.disabled = (currentLevelIndex <= 0);
  }
  if (btnFontSizeUp) {
    btnFontSizeUp.disabled = (currentLevelIndex >= FONT_SIZE_LEVELS.length - 1);
  }
}

/**
 * 縮小字體 (A-)
 */
function decreaseFontSize() {
  if (currentLevelIndex > 0) {
    currentLevelIndex--;
    applyFontSize();
    saveFontSizePreference();
  }
}

/**
 * 放大字體 (A+)
 */
function increaseFontSize() {
  if (currentLevelIndex < FONT_SIZE_LEVELS.length - 1) {
    currentLevelIndex++;
    applyFontSize();
    saveFontSizePreference();
  }
}

// ========== 初始化 ==========
function initFontSizeControl() {
  if (!btnFontSizeDown || !btnFontSizeUp) {
    console.warn('FontSizeControl: 按鈕未找到，請檢查 HTML');
    return;
  }
  
  // 綁定事件
  btnFontSizeDown.addEventListener('click', decreaseFontSize);
  btnFontSizeUp.addEventListener('click', increaseFontSize);
  
  // 載入已儲存的設定
  loadFontSizePreference();
  
  console.log('✅ FontSizeControl 模組已初始化');
}

// ========== 啟動 ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFontSizeControl);
} else {
  initFontSizeControl();
}
