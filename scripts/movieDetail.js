/*
  scripts/movieDetail.js
  Renders detailed information for a single movie (overview, cast, ratings).
  Also detects if the movie belongs to a TMDB collection and renders a
  watch-order list of the collection parts (sorted by release date).
  Key function: renderMovieDetail(container, id)
*/
// scripts/movieDetail.js
import {
  tmdbGetMovie,
  tmdbGetCollection,
  TMDB_IMG,
  omdbGetByTitle,
} from "./api.js";
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

          <div id="watchOrder" style="margin-top:16px"></div>

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
                : "<div class=\"empty\">No cast info</div>"
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

    // If this movie belongs to a collection, show a watch order (collection parts)
    const watchOrderEl = container.querySelector("#watchOrder");
    if (data.belongs_to_collection && data.belongs_to_collection.id) {
      try {
        watchOrderEl.innerHTML = "<div class=\"loading\">Loading watch order...</div>";
        const coll = await tmdbGetCollection(data.belongs_to_collection.id);
        if (coll && coll.parts && coll.parts.length > 0) {
          // sort by release_date (oldest -> newest)
          const parts = coll.parts.slice().sort((a, b) => {
            const da = a.release_date || "";
            const db = b.release_date || "";
            return da.localeCompare(db);
          });

          watchOrderEl.innerHTML = `
            <h3 style="margin-top:12px">Watch Order — ${escapeHtml(
              coll.name
            )}</h3>
            <ol class="panel" style="padding:12px;border-radius:8px;list-style-position:inside">
              ${parts
                .map(
                  (p) => `
                <li style="margin-bottom:8px">
                  <a href="#/movie/${
                    p.id
                  }" style="display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit">
                    <img src="${TMDB_IMG(
                      p.poster_path,
                      "w92"
                    )}" alt="${escapeHtml(
                    p.title
                  )}" style="width:48px;height:72px;object-fit:cover;border-radius:6px"/>
                    <div>
                      <div style="font-weight:600">${escapeHtml(p.title)}</div>
                      <div style="font-size:0.85rem;color:var(--muted)">${
                        p.release_date ? p.release_date.slice(0, 4) : "—"
                      }</div>
                    </div>
                  </a>
                </li>
              `
                )
                .join("")}
            </ol>
          `;
        } else {
          watchOrderEl.innerHTML = "<div class=\"empty\">No watch order available for this collection.</div>";
        }
      } catch (e) {
        watchOrderEl.innerHTML = `<div class="empty">Failed to load watch order: ${e.message}</div>`;
      }
    } else {
      watchOrderEl.innerHTML = ""; // no collection
    }
  } catch (err) {
    container.innerHTML = `<div class="empty">Failed to load movie: ${err.message}</div>`;
  }
}

function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[
        c
      ])
  );
}
