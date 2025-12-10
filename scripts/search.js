/*
  scripts/search.js
  Handles user-initiated searches. Uses the API helpers to search both movies
  and TV series and delegates rendering of results to UI helper functions.
*/
// scripts/search.js
import { tmdbSearchMoviesAndSeries } from "./api.js";
import { renderSearchResults } from "./series.js";
import { showLoading } from "./ui.js";

export async function doSearch(container, query) {
  if (!query || query.trim().length === 0) {
    container.innerHTML = `<div class="empty">Type a movie or series name and press Enter to search.</div>`;
    return;
  }
  showLoading(container, `Searching for "${query}"...`);
  try {
    const results = await tmdbSearchMoviesAndSeries(query);
    renderSearchResults(container, results);
  } catch (err) {
    container.innerHTML = `<div class="empty">Search failed: ${err.message}</div>`;
  }
}
