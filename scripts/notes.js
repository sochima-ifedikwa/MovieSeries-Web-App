/*
  scripts/notes.js
  Simple notes storage helper built on top of localStorage.
  - getAllNotes(): returns an object of saved notes keyed by series id
  - getNoteFor(id): return a single note text
  - saveNoteFor(id, text): persist note text for a series
  Notes are stored under the key `movieSeries_notes`.
*/
// scripts/notes.js
import { loadJSON, saveJSON } from "./storage.js";
const KEY = "movieSeries_notes";

export function getAllNotes() {
  return loadJSON(KEY, {}); // { seriesId: "note text" }
}

export function getNoteFor(id) {
  const all = getAllNotes();
  return all[id] || "";
}

export function saveNoteFor(id, text) {
  const all = getAllNotes();
  all[id] = text;
  saveJSON(KEY, all);
}
