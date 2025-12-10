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
