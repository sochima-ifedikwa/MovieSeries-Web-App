// scripts/search.js
import { tmdbSearchCollection } from "./api.js";
import { renderSeriesList } from "./series.js";
import { showLoading } from "./ui.js";

export async function doSearch(container, query) {
  if (!query || query.trim().length === 0) {
    container.innerHTML = `<div class="empty">Type a series name and press Enter to search.</div>`;
    return;
  }
  showLoading(container, `Searching for "${query}"...`);
  try {
    const results = await tmdbSearchCollection(query);
    renderSeriesList(container, results);
  } catch (err) {
    container.innerHTML = `<div class="empty">Search failed: ${err.message}</div>`;
  }
}
