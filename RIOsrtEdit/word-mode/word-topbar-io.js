// word-mode/word-topbar-io.js
(function () {
  function downloadBlob(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "export.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  }

  function getEditor() {
    return document.getElementById("wordEditor");
  }

  function editorSetPlainText(text) {
    const editor = getEditor();
    if (!editor) return;

    // 將純文字轉成簡單段落（保留換行）
    const lines = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    editor.innerHTML = lines.map(line => `<p>${escapeHtml(line)}</p>`).join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function exportDocxFromPlainText() {
    const editor = getEditor();
    if (!editor) return;

    if (!window.docx || !window.docx.Document) {
      alert("未載入 docx.js（vendor/docx/docx.umd.js）");
      return;
    }

    const text = editor.innerText || "";
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

    const { Document, Packer, Paragraph, TextRun } = window.docx;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map(line => new Paragraph({ children: [new TextRun(line || "")] })),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, "word-export.docx");
  }

  function bind() {
    const btnImport = document.getElementById("btnWordImportTxt");
    const btnExportTxtTop = document.getElementById("btnWordExportTxtTop");
    const btnExportDocx = document.getElementById("btnWordExportDocx");
    const fileInput = document.getElementById("wordTxtInput");

    if (btnExportTxtTop) {
      btnExportTxtTop.addEventListener("click", () => {
        const oldBtn = document.getElementById("wordBtnExportTxt"); // 你原本側邊欄匯出掣
        if (oldBtn) oldBtn.click();
        else {
          // 後備：直接匯出純文字
          const editor = getEditor();
          const text = editor ? (editor.innerText || "") : "";
          downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), "word-export.txt");
        }
      });
    }

    if (btnImport && fileInput) {
      btnImport.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", async () => {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        const text = await f.text();
        editorSetPlainText(text);
        fileInput.value = "";
      });
    }

    if (btnExportDocx) {
      btnExportDocx.addEventListener("click", exportDocxFromPlainText);
    }
  }

  // 等 DOM ready（你頁面係單檔 app，保險做法）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
