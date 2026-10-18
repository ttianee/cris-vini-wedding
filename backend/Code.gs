/** Private guest-response storage for Cris & Vini. Keep the resulting Google Sheet private. */
const SHEET_NAME = "Early responses";
function doPost(e) {
  try {
    const p = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const name = clean(p.fullName,120), email = clean(p.email,200), attendance = clean(p.attendance,30);
    const partySize = Math.max(1, Math.min(20, parseInt(p.partySize || "1", 10) || 1));
    if (!name || !email || !email.includes("@") || !attendance || p.privacyConsent !== true || !["likely_yes","unsure","likely_no"].includes(attendance)) return output({ok:false});
    const sheet = getSheet();
    sheet.appendRow([new Date(),clean(p.language,5),name,email,attendance,partySize,clean(p.guestNames,300),clean(p.message,1000),p.privacyConsent === true ? "yes":"no"]);
    return output({ok:true});
  } catch(err) { return output({ok:false}); }
}
function doGet(){ return output({ok:true,service:"Cris & Vini wedding response endpoint"}); }
function getSheet(){
  const props=PropertiesService.getScriptProperties(); let id=props.getProperty("SPREADSHEET_ID"),ss;
  if(id){ss=SpreadsheetApp.openById(id);}else{ss=SpreadsheetApp.create("Cris & Vini — Private Wedding Responses");props.setProperty("SPREADSHEET_ID",ss.getId());}
  let sh=ss.getSheetByName(SHEET_NAME);
  if(!sh){sh=ss.getSheets()[0];sh.setName(SHEET_NAME);sh.appendRow(["Submitted at","Language","Full name","Email","Early attendance","Party size","Accompanying guests","Message","Privacy consent"]);sh.setFrozenRows(1);}
  return sh;
}
function clean(v,n){return String(v==null?"":v).replace(/[\u0000-\u001F\u007F]/g," ").trim().slice(0,n);}
function output(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
