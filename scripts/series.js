/*
  scripts/series.js
  UI renderer for lists of series and mixed search results.
  Exports:
  - renderSeriesList(container, seriesArray): render a list of TV series
  - renderSearchResults(container, resultsArray): render mixed movie/TV results
  Each item wires click handlers that update the location hash to navigate.
*/
// scripts/series.js
import { TMDB_IMG } from "./api.js";

export function renderSeriesList(container, seriesArray) {
  if (!seriesArray || seriesArray.length === 0) {
    container.innerHTML = "<div class=\"empty\">No series found.</div>";
    return;
  }

  container.innerHTML = `
    <h2>Results</h2>
    <div class="grid">
      ${seriesArray
        .map(
          (s) => `
        <article class="card" data-id="${s.id}" data-name="${escapeHtml(
            s.name || s.title
          )}">
          <img src="${TMDB_IMG(s.poster_path, "w300")}" alt="${escapeHtml(
            s.name || s.title
          )}" loading="lazy" />
          <h3>${escapeHtml(s.name || s.title)}</h3>
          ${
            s.first_air_date
              ? `<small>${s.first_air_date.slice(0, 4)}</small>`
              : ""
          }
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

export function renderSearchResults(container, resultsArray) {
  if (!resultsArray || resultsArray.length === 0) {
    container.innerHTML = "<div class=\"empty\">No movies or series found.</div>";
    return;
  }

  container.innerHTML = `
    <h2>Results</h2>
    <div class="grid">
      ${resultsArray
        .map(
          (item) => `
        <article class="card" data-id="${item.id}" data-type="${
            item.media_type
          }" data-name="${escapeHtml(item.name || item.title)}">
          <img src="${TMDB_IMG(item.poster_path, "w300")}" alt="${escapeHtml(
            item.name || item.title
          )}" loading="lazy" />
          <h3>${escapeHtml(item.name || item.title)}</h3>
          <small style="color:var(--accent);font-weight:bold">${
            item.media_type === "tv" ? "TV Series" : "Movie"
          }</small>
          ${
            item.first_air_date
              ? `<small>${item.first_air_date.slice(0, 4)}</small>`
              : item.release_date
              ? `<small>${item.release_date.slice(0, 4)}</small>`
              : ""
          }
        </article>
      `
        )
        .join("")}
    </div>
  `;

  // delegate click with smart routing
  container.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const type = card.dataset.type;
      if (type === "tv") {
        location.hash = `#/series/${id}`;
      } else if (type === "movie") {
        location.hash = `#/movie/${id}`;
      }
    });
  });
}

function escapeHtml(str = "") {
  return str.replace(
    /[&<>"']/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[
        s
      ])
  );
}
