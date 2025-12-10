// scripts/series.js
import { TMDB_IMG } from "./api.js";

export function renderSeriesList(container, seriesArray) {
  if (!seriesArray || seriesArray.length === 0) {
    container.innerHTML = `<div class="empty">No series found.</div>`;
    return;
  }

  container.innerHTML = `
    <h2>Results</h2>
    <div class="grid">
      ${seriesArray
        .map(
          (s) => `
        <article class="card" data-id="${s.id}" data-name="${escapeHtml(
            s.name
          )}">
          <img src="${TMDB_IMG(s.poster_path, "w300")}" alt="${escapeHtml(
            s.name
          )}" loading="lazy" />
          <h3>${escapeHtml(s.name)}</h3>
        </article>
      `
        )
        .join("")}
    </div>
  `;

  // delegate click
  container.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      location.hash = `#/series/${id}`;
    });
  });
}

function escapeHtml(str = "") {
  return str.replace(
    /[&<>"']/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        s
      ])
  );
}
