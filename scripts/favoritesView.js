/*
  scripts/favoritesView.js
  Renders the user's favorites as a grid of cards and wires up remove
  actions. Uses `getFavorites()` from `favorites.js` to read stored data.
  Clicking a favorite navigates to the appropriate detail view.
*/
// scripts/favoritesView.js
import { getFavorites, removeFavorite } from "./favorites.js";
import { TMDB_IMG } from "./api.js";

export function renderFavorites(container) {
  const favs = getFavorites();
  if (!favs || favs.length === 0) {
    container.innerHTML = `<div class="empty">You have no favorites yet.</div>`;
    return;
  }

  container.innerHTML = `
    <h2>Your Favorites</h2>
    <div class="grid">
      ${favs
        .map(
          (f) => `
        <article class="card fav-card" data-id="${f.id}" data-type="${f.type}">
          <img src="${
            f.poster
              ? TMDB_IMG(f.poster, "w300")
              : "assets/icons/poster-placeholder.png"
          }" alt="${f.name}">
          <h3>${escapeHtml(f.name)}</h3>
          <div class="row"><button data-remove="${
            f.id
          }" class="btn">Remove</button></div>
        </article>
      `
        )
        .join("")}
    </div>
  `;

  container.querySelectorAll(".fav-card").forEach((el) => {
    el.addEventListener("click", (e) => {
      // click on remove shouldn't route
      if (e.target.dataset.remove) return;
      const id = el.dataset.id;
      const type = el.dataset.type;
      if (type === "series")
        location.hash = `#/series/${id.replace("series-", "")}`;
      else if (type === "collection")
        location.hash = `#/series/${id.replace("collection-", "")}`;
      else if (type === "movie")
        location.hash = `#/movie/${id.replace("movie-", "")}`;
    });
  });

  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.remove;
      removeFavorite(id);
      renderFavorites(container);
    });
  });
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
