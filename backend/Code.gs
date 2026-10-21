
/** Private guest-response storage for Cris & Vini.
 * Keep the resulting Google Sheet private.
 */

const SHEET_NAME = "Early responses";

const HEADERS = [
  "Submitted at",
  "Language",
  "Full name",
  "Email",
  "Early attendance",
  "Party size",
  "Accompanying guests",
  "Message",
  "Privacy consent",
  "Phone"
];

function doPost(e) {
  try {
    const p = JSON.parse(
      (e && e.postData && e.postData.contents) || "{}"
    );

    const name = clean(p.fullName, 120);
    const email = clean(p.email, 200);
    const phone = clean(p.phone, 30);
    const attendance = clean(p.attendance, 30);

    const partySize = Math.max(
      1,
      Math.min(20, parseInt(p.partySize || "1", 10) || 1)
    );

    const validAttendance = [
      "likely_yes",
      "unsure",
      "likely_no"
    ];

    if (
      !name ||
      !email ||
      !email.includes("@") ||
      !attendance ||
      p.privacyConsent !== true ||
      !validAttendance.includes(attendance)
    ) {
      return output({ ok: false });
    }

    const sheet = getSheet();

    sheet.appendRow([
      new Date(),
      clean(p.language, 5),
      name,
      email,
      attendance,
      partySize,
      clean(p.guestNames, 300),
      clean(p.message, 1000),
      "yes",
      phone
    ]);

    return output({ ok: true });

  } catch (err) {
    console.error("Could not save guest response:", err);
    return output({ ok: false });
  }
}

function doGet() {
  return output({
    ok: true,
    service: "Cris & Vini wedding response endpoint"
  });
}

function getSheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("SPREADSHEET_ID");
  let ss;

  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create(
      "Cris & Vini — Private Wedding Responses"
    );

    props.setProperty("SPREADSHEET_ID", ss.getId());
  }

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }

  // Create headers if the sheet is empty.
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS]);

    sheet.setFrozenRows(1);
    return sheet;
  }

  // Add any missing headers without deleting existing responses.
  const existingHeaders = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getValues()[0]
    .map(value => String(value).trim());

  HEADERS.forEach(header => {
    if (!existingHeaders.includes(header)) {
      const nextColumn = sheet.getLastColumn() + 1;

      sheet.getRange(1, nextColumn).setValue(header);
      existingHeaders.push(header);
    }
  });

  sheet.setFrozenRows(1);

  return sheet;
}

function clean(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function output(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
