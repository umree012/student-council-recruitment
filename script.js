const SHEET_NAME = "Applications";

function doPost(e) {
  try {
    // Accept both application/json and application/x-www-form-urlencoded
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        // Fallback: parse as form-urlencoded
        const raw = e.postData.contents;
        raw.split("&").forEach(function(pair){
          const parts = pair.split("=");
          const k = decodeURIComponent(parts[0] || "");
          const v = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));
          if (k) data[k] = v;
        });
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet tab '" + SHEET_NAME + "' not found.");
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Application ID",
        "Full Name",
        "Student ID",
        "Email",
        "Contact Number",
        "Program",
        "Semester",
        "Section",
        "Position",
        "Team",
        "Contribution",
        "Short Notice",
        "Other Society",
        "Other Society Details",
        "Active Participation",
        "Prior Experience"
      ]);
    }

    const applicationId = "SC-" + new Date().getTime().toString().slice(-8);

    sheet.appendRow([
      new Date(),
      applicationId,
      data.fullName || "",
      data.studentId || "",
      data.email || "",
      data.contactNumber || "",
      data.program || "",
      data.semester || "",
      data.section || "",
      data.position || "",
      data.team || "",
      data.contribution || "",
      data.shortNotice || "",
      data.otherSociety || "",
      data.otherSocietyDetails || "",
      data.activeParticipation || "",
      data.priorExperience || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        applicationId: applicationId,
        message: "Application submitted successfully."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Student Council Recruitment backend is live."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
