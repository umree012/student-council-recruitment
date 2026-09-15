# Student Council Recruitment Portal

A static recruitment application portal. Frontend is hosted on GitHub Pages.
Submissions are stored in a Google Sheet via a Google Apps Script Web App.

## Architecture

Student → GitHub Pages (index.html + style.css + script.js)
       → Google Apps Script Web App (doPost)
       → Google Sheet "Applications" tab

## Configuration

The only configurable value is in `script.js`:

    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";

Change this to your own Apps Script Web App URL if you redeploy the backend.

## Accessing Responses

Open the Google Sheet named "Student Council Recruitment 2026".
Every submission appears as a new row in the "Applications" tab.

You can filter/sort by team, semester, or department using Sheet's
Data → Create a filter, or use Explore → Filter views.

## Editing Teams, Departments, or Semesters

- Teams: edit the `<label class="team-card">` blocks in `index.html`.
- Departments and semesters: edit the `<option>` lists in `index.html`.

No other changes needed — the backend stores whatever value is submitted.

## Privacy

Submitted information is used only for Student Council recruitment,
shortlisting, interviews, and selection. The Google Sheet is private and
accessible only to the account that owns the Apps Script deployment.
