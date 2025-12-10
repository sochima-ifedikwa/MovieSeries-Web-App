/*
  scripts/storage.js
  Small helpers for saving and loading JSON to/from localStorage.
  Functions handle JSON.parse/stringify and provide a fallback value.
*/
// scripts/storage.js
export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
