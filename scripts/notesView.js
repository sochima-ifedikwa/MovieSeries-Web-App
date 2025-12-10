/*
  scripts/notesView.js
  Renders a simple list of saved notes pulled from `notes.js`.
  Each entry shows the series ID and a short preview of the note text.
*/
// scripts/notesView.js
import { getAllNotes } from "./notes.js";

export function renderNotesView(container) {
  const notes = getAllNotes();
  const keys = Object.keys(notes);
  if (keys.length === 0) {
    container.innerHTML = `<div class="empty">No notes yet.</div>`;
    return;
  }

  container.innerHTML = `<h2>Notes</h2><div class="panel">${keys
    .map(
      (k) =>
        `<div style="margin-bottom:12px"><strong>Series ID: ${k}</strong><p>${escapeHtml(
          notes[k].slice(0, 300)
        )}</p></div>`
    )
    .join("")}</div>`;
}

function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}
