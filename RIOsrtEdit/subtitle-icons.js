// subtitle-icons.js
(function () {
  const map = {
    btnNewFile: "note_add",
    btnOpenProj: "folder_open",
    btnSaveProj: "save",
    btnSaveProjAs: "save_as",
    btnWordMode: "description",

    btnOpen: "folder_open",
    btnExportSrt: "download",

    btnVideo: "movie",

    btnUndo: "undo",
    btnRedo: "redo",

    btnInsLine: "add",
    btnDelLine: "delete",

    btnConvert: "sync_alt",

    btnFontSizeDown: "text_decrease",
    btnFontSizeUp: "text_increase",

    btnSearch: "search",
    btnMagicWand: "auto_fix_high",
    btnKeepZh: "g_translate",

    btnBatch: "inventory_2",
    btnStars: "star",
    btnTheme: "dark_mode",

    btnNote: "edit_note",
    timeCalcIcon: "calculate",
    snapshotIcon: "photo_camera"
  };

  function apply() {
    for (const [id, icon] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (!el) continue;
      // 避免重複塞（如果你之後又改咗 HTML）
      if (el.querySelector(".material-icons")) continue;
      el.innerHTML = `<span class="material-icons">${icon}</span>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
