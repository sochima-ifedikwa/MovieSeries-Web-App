// scripts/movieDetail.js
import { tmdbGetMovie, TMDB_IMG, omdbGetByTitle } from "./api.js";
import { showLoading } from "./ui.js";
import { addFavorite, isFavorited, removeFavorite } from "./favorites.js";

export async function renderMovieDetail(container, id) {
  showLoading(container, "Loading movie...");
  try {
    const data = await tmdbGetMovie(id);
    // optionally fetch OMDb ratings by title
    let omdb = null;
    try {
      omdb = await omdbGetByTitle(data.title);
    } catch (e) {
      /* ignore */
    }

    container.innerHTML = `
      <div class="detail">
        <aside class="panel">
          <img src="${TMDB_IMG(data.poster_path)}" alt="${
      data.title
    }" style="width:100%;border-radius:10px"/>
          <h2>${escapeHtml(data.title)} (${(data.release_date || "").slice(
      0,
      4
    )})</h2>
          <div style="margin-top:8px">
            <button id="favMovie" class="btn">${
              isFavorited({ id: "movie-" + data.id })
                ? "Unfavorite"
                : "Add to Favorites"
            }</button>
          </div>
        </aside>

        <section class="panel">
          <div style="display:flex;gap:12px;align-items:center">
            <div>Rating: <strong>${
              omdb && omdb.imdbRating
                ? omdb.imdbRating
                : data.vote_average || "—"
            }</strong></div>
            <div>| Runtime: ${data.runtime ? data.runtime + " min" : "—"}</div>
            <div>| Genres: ${data.genres.map((g) => g.name).join(", ")}</div>
          </div>

          <h3 style="margin-top:12px">Overview</h3>
          <p>${escapeHtml(data.overview || "No overview available.")}</p>

          <h4 style="margin-top:12px">Cast</h4>
          <div class="row" style="flex-wrap:wrap;gap:12px">
            ${
              data.credits && data.credits.cast
                ? data.credits.cast
                    .slice(0, 8)
                    .map(
                      (c) =>
                        `<div style="min-width:120px"><img class="small-thumb" src="${TMDB_IMG(
                          c.profile_path,
                          "w200"
                        )}" alt="${escapeHtml(c.name)}"/><div>${escapeHtml(
                          c.name
                        )}</div><small>${escapeHtml(c.character)}</small></div>`
                    )
                    .join("")
                : '<div class="empty">No cast info</div>'
            }
          </div>
        </section>
      </div>
    `;

    const favMovieBtn = container.querySelector("#favMovie");
    favMovieBtn.addEventListener("click", () => {
      const favObj = {
        id: "movie-" + data.id,
        type: "movie",
        name: data.title,
        poster: data.poster_path,
      };
      if (isFavorited(favObj)) {
        removeFavorite("movie-" + data.id);
        favMovieBtn.textContent = "Add to Favorites";
      } else {
        addFavorite(favObj);
        favMovieBtn.textContent = "Unfavorite";
      }
    });
  } catch (err) {
    container.innerHTML = `<div class="empty">Failed to load movie: ${err.message}</div>`;
  }
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
