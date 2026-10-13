/* ==================================================================
   ENQUIRY INBOX - Google Apps Script for the contact form.

   Every message the site sends lands here: it is saved as a row in the
   Google Sheet this script is attached to (so nothing is ever lost, even
   if an email goes astray), then emailed to the sheet owner's Gmail.

   Setup, once, in a browser signed in to your Google account:
   1. sheets.new -> name it "Portfolio enquiries".
   2. Extensions -> Apps Script. Replace everything with this file. Save.
   3. Deploy -> New deployment -> type "Web app".
      Execute as: Me.  Who has access: Anyone.  Deploy.
   4. Allow the permissions it asks for (Advanced -> Go to project, if
      Google warns the app is unverified: it's your own script).
   5. Copy the Web app URL into `enquiry.sheetUrl` in src/data/site.js.

   Instant notifications (optional): Project Settings -> Script Properties
   -> add NTFY_TOPIC = a long random name. Subscribe to the same topic at
   ntfy.sh/app (desktop) or in the ntfy phone app. No account needed.

   After editing this script, Deploy -> Manage deployments -> edit ->
   Version: New version, or the live URL keeps running the old code.
   ================================================================== */

const COLUMNS = [
  'Received', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Message',
  'Sent from', 'Their local time', 'Their time zone', 'Their language', 'Came from',
]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}')
    // Bots fill the hidden field humans never see.
    if (data._honey) return reply({ ok: true })

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS)
    const row = [new Date(), data.type, data.name, data.email, data.phone, data.company,
      data.message, data['Sent from'], data['Their local time'], data['Their time zone'],
      data['Their language'], data['Came from']].map((v) => (v == null ? '' : String(v).slice(0, 5000)))
    sheet.appendRow(row)

    // The row is already safe; a mail quota hiccup must not fail the send.
    try {
      const body = COLUMNS.slice(1).map((c, i) => `${c}: ${row[i + 1] || '-'}`).join('\n')
      MailApp.sendEmail({
        to: Session.getEffectiveUser().getEmail(),
        subject: data._subject || 'Portfolio enquiry',
        body: `${body}\n\nAll enquiries: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
        replyTo: /^\S+@\S+\.\S+$/.test(data.email || '') ? data.email : undefined,
      })
    } catch (err) {}

    // Instant push through ntfy.sh, if a topic is set. It lives in Project
    // Settings -> Script Properties as NTFY_TOPIC, not in this file, because
    // anyone who knows the topic can read it.
    try {
      const topic = PropertiesService.getScriptProperties().getProperty('NTFY_TOPIC')
      if (topic) {
        const who = data.name || data.company || data.email || 'Someone'
        UrlFetchApp.fetch(`https://ntfy.sh/${topic}`, {
          method: 'post',
          payload: `${who}: ${String(data.message || '(no message)').slice(0, 300)}`,
          headers: {
            Title: `New enquiry: ${data.type || 'Portfolio'}`,
            Tags: 'envelope',
            Priority: 'high',
            Click: SpreadsheetApp.getActiveSpreadsheet().getUrl(),
          },
          muteHttpExceptions: true,
        })
      }
    } catch (err) {}

    return reply({ ok: true })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
