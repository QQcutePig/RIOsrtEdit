// Minimal SRT parser/writer for MVP.
// SRT time format: HH:MM:SS,mmm

function srtTimeToMs(t) {
  const m = String(t || "").trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!m) return null;
  const hh = Number(m[1]), mm = Number(m[2]), ss = Number(m[3]), ms = Number(m[4]);
  return (((hh * 60 + mm) * 60) + ss) * 1000 + ms;
}

function msToSrtTime(ms) {
  ms = Math.max(0, Math.round(Number(ms) || 0));
  let hh = Math.floor(ms / 3600000); ms %= 3600000;
  let mm = Math.floor(ms / 60000);   ms %= 60000;
  let ss = Math.floor(ms / 1000);    ms %= 1000;

  const pad2 = (n) => String(n).padStart(2, "0");
  const pad3 = (n) => String(n).padStart(3, "0");
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)},${pad3(ms)}`;
}

function parseSrt(text) {
  const blocks = String(text || "").replace(/\r\n/g, "\n").split(/\n{2,}/);
  const items = [];

  for (const b of blocks) {
    const lines = b.split("\n").map(s => s.replace(/\r$/, ""));
    const compact = lines.map(s => s.trim()).filter(s => s.length > 0);
    if (compact.length < 2) continue;

    let i = 0;
    if (/^\d+$/.test(compact[0])) i = 1;

    const timeLine = compact[i] || "";
    const m = timeLine.match(/^(.+?)\s*-->\s*(.+?)$/);
    if (!m) continue;

    const startMs = srtTimeToMs(m[1]);
    const endMs = srtTimeToMs(m[2]);
    if (startMs == null || endMs == null) continue;

    const body = compact.slice(i + 1).join("\n").trim();

    items.push({ startMs, endMs, text: body });
  }

  return items;
}

function writeSrt(items) {
  const out = [];
  (items || []).forEach((it, idx) => {
    out.push(String(idx + 1));
    out.push(`${msToSrtTime(it.startMs)} --> ${msToSrtTime(it.endMs)}`);
    out.push((it.text || "").trim());
    out.push("");
  });
  return out.join("\n");
}

