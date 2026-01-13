// ===== Word 模式匯出功能 =====

const WordExport = {

  // 初始化
  init() {
    const btnExportTxt = document.getElementById('wordBtnExportTxt');
    const btnExportDocx = document.getElementById('wordBtnExportDocx'); // 🆕 新增按鈕

    if (btnExportTxt) {
      btnExportTxt.onclick = () => this.exportTxt();
    }

    // 🆕 新增 DOCX 按鈕綁定
    if (btnExportDocx) {
      btnExportDocx.onclick = () => this.exportDocx();
    }

    console.log('✅ Word 匯出功能已初始化');
  },

  // 匯出純文字 TXT
  exportTxt() {
    const editor = document.getElementById('wordEditor');
    const text = editor.innerText;

    // 建立 Blob
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    // 產生檔名
    const date = new Date();
    const filename = `Word文件_${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}.txt`;

    // 下載
    this.downloadBlob(blob, filename);
  },

  // 🆕 匯出 DOCX
  async exportDocx() {
    const editor = document.getElementById('wordEditor');
    
    // 檢查 JSZip 是否已載入
    if (typeof JSZip === 'undefined') {
      alert('❌ JSZip 未載入！請在 index.html 中加入：\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>');
      return;
    }

    try {
      const htmlContent = editor.innerHTML;
      const docxBlob = await this.createDocx(htmlContent);
      
      // 產生檔名
      const date = new Date();
      const filename = `Word文件_${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}.docx`;
      
      this.downloadBlob(docxBlob, filename);
      console.log('✅ DOCX 匯出成功');
    } catch (err) {
      console.error('❌ DOCX 匯出失敗', err);
      alert('DOCX 匯出失敗：' + err.message);
    }
  },

  // 🆕 建立 DOCX 檔案
  async createDocx(htmlContent) {
    const zip = new JSZip();

    // 清理 HTML（移除不必要的樣式）
    const cleanHtml = this.sanitizeHtml(htmlContent);
    const wordXml = this.htmlToWordXml(cleanHtml);

    // [Content_Types].xml
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

    // _rels/.rels
    zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    // word/document.xml（主內容）
    zip.folder('word').file('document.xml', wordXml);

    // 生成 DOCX
    return await zip.generateAsync({ type: 'blob' });
  },

  // 🆕 清理 HTML
  sanitizeHtml(html) {
    // 移除 contenteditable 屬性
    let clean = html.replace(/\scontenteditable="[^"]*"/gi, '');
    
    // 移除 Word 編輯器專用 class
    clean = clean.replace(/class="[^"]*word-page-break[^"]*"/gi, '');
    
    return clean;
  },

  // 🆕 轉換 HTML → Word XML
  htmlToWordXml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let paragraphs = '';
    const children = Array.from(tempDiv.childNodes);

    children.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        let text = node.textContent || '';
        
        // 處理粗體/斜體/底線
        let isBold = node.style.fontWeight === 'bold' || tagName === 'strong' || tagName === 'b';
        let isItalic = node.style.fontStyle === 'italic' || tagName === 'em' || tagName === 'i';
        let isUnderline = node.style.textDecoration === 'underline' || tagName === 'u';

        // 標題處理
        let isHeading = /^h[1-6]$/.test(tagName);
        
        let rPr = '';
        if (isBold) rPr += '<w:b/>';
        if (isItalic) rPr += '<w:i/>';
        if (isUnderline) rPr += '<w:u w:val="single"/>';
        if (isHeading) rPr += '<w:sz w:val="32"/><w:szCs w:val="32"/>';

        if (rPr) rPr = `<w:rPr>${rPr}</w:rPr>`;

        // 跳過空段落
        if (!text.trim()) return;

        paragraphs += `
<w:p>
  <w:r>
    ${rPr}
    <w:t xml:space="preserve">${this.escapeXml(text)}</w:t>
  </w:r>
</w:p>`;
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim() || '';
        if (text) {
          paragraphs += `
<w:p>
  <w:r>
    <w:t xml:space="preserve">${this.escapeXml(text)}</w:t>
  </w:r>
</w:p>`;
        }
      }
    });

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
  </w:body>
</w:document>`;
  },

  // 🆕 XML 轉義
  escapeXml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  },

  // 下載 Blob
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

};
