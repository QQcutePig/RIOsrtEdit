// 初始化所有模組
initModules() {
  // 等待 DOM 完全插入
  setTimeout(() => {
    if (typeof WordCore !== 'undefined') WordCore.init();
    if (typeof WordFormat !== 'undefined') WordFormat.init();
    if (typeof WordAdvanced !== 'undefined') WordAdvanced.init();
    if (typeof WordPagination !== 'undefined') WordPagination.init();
    if (typeof WordSearch !== 'undefined') WordSearch.init();
    if (typeof WordBasic !== 'undefined') WordBasic.init();
    
    console.log('✅ Word 模式所有模組已初始化');
  }, 100);
}
