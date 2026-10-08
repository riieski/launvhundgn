// Tempel di Google Sheets: Extensions > Apps Script. Deploy > New deployment > Web app,
// "Execute as: Me", "Who has access: Anyone". Salin URL /exec ke kolom RSVP di editor.
const NAMA_SHEET = "RSVP";
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(NAMA_SHEET);
  if (!s) { s = ss.insertSheet(NAMA_SHEET); s.appendRow(["waktu", "klien", "nama", "hadir", "jumlah", "ucapan"]); }
  return s;
}
function aman_(v, maks) { // potong dan cegah rumus (=, +, -, @) di Sheets
  v = String(v == null ? "" : v).slice(0, maks);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (!d.klien || !d.nama) return ContentService.createTextOutput("ditolak");
  const lock = LockService.getScriptLock(); lock.waitLock(5000);
  sheet_().appendRow([new Date(), aman_(d.klien, 60), aman_(d.nama, 60), aman_(d.hadir, 30), aman_(d.jumlah, 5), aman_(d.ucapan, 400)]);
  lock.releaseLock();
  return ContentService.createTextOutput("ok");
}
function doGet(e) { // hanya nama dan ucapan yang dibuka ke publik
  const k = (e.parameter || {}).klien || "";
  const rows = sheet_().getDataRange().getValues().slice(1)
    .filter(r => r[1] == k && String(r[5]).trim()).reverse().slice(0, 50)
    .map(r => ({ nama: String(r[2]), ucapan: String(r[5]) }));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
