/*
  scripts/seriesDetail.js
  Renders details for a TV series (seasons, basic metadata) and provides
  interactions for notes and favorites. Fetches series details from TMDB.
  Key function: renderSeriesDetail(container, id)
*/
// scripts/seriesDetail.js
import { tmdbGetTVSeries, TMDB_IMG, omdbGetByTitle } from "./api.js";
import { showLoading } from "./ui.js";
import { addFavorite, removeFavorite, isFavorited } from "./favorites.js";
import { saveNoteFor, getNoteFor } from "./notes.js";

export async function renderSeriesDetail(container, id) {
  showLoading(container, "Loading series...");
  try {
    const data = await tmdbGetTVSeries(id);
    // data.seasons = array of seasons, data.number_of_seasons = total seasons
    const seasons = data.seasons ? data.seasons.slice(0, 5) : []; // Show first 5 seasons

    container.innerHTML = `
      <div class="detail">
        <aside class="panel">
          <img src="${TMDB_IMG(data.poster_path)}" alt="${
      data.name
    }" style="width:100%;border-radius:10px;">
          <h2>${escapeHtml(data.name)}</h2>
          <p>${escapeHtml(data.overview || "No description available.")}</p>
          <div style="margin-top:8px;font-size:0.9rem;color:var(--muted)">
            <p><strong>Seasons:</strong> ${data.number_of_seasons || "—"}</p>
            <p><strong>Episodes:</strong> ${data.number_of_episodes || "—"}</p>
            ${
              data.first_air_date
                ? `<p><strong>Started:</strong> ${data.first_air_date.slice(
                    0,
                    4
                  )}</p>`
                : ""
            }
          </div>
          <div class="row" style="margin-top:10px">
            <button id="favBtn" class="btn">${
              isFavorited({ id: "series-" + data.id })
                ? "Unfavorite"
                : "Add to Favorites"
            }</button>
            <button id="notesToggle" class="btn">Notes</button>
          </div>
          <div id="notesPanel" style="margin-top:12px;display:none">
            <textarea id="seriesNote" rows="5" style="width:100%;border-radius:8px;padding:8px;"></textarea>
            <div style="margin-top:8px">
              <button id="saveNote" class="btn">Save Note</button>
            </div>
          </div>
        </aside>

        <section class="panel">
          <h3>Seasons</h3>
          <div id="seasonsList" class="grid">
            ${seasons
              .map(
                (s) => `
              <article class="card" data-season="${s.season_number}">
                <img src="${TMDB_IMG(s.poster_path, "w300")}" alt="Season ${
                  s.season_number
                }"/>
                <h4>Season ${s.season_number}</h4>
                <p style="font-size:0.85rem;color:var(--muted)">${
                  s.episode_count || 0
                } episodes</p>
              </article>
            `
              )
              .join("")}
          </div>
          <p style="color:var(--muted);margin-top:16px">
            <em>Showing first ${seasons.length} of ${
      data.number_of_seasons || 0
    } seasons</em>
          </p>
        </section>
      </div>
    `;

    // Notes setup
    const notesPanel = container.querySelector("#notesPanel");
    const notesToggle = container.querySelector("#notesToggle");
    const noteArea = container.querySelector("#seriesNote");
    const saveNoteBtn = container.querySelector("#saveNote");
    const saved = getNoteFor(data.id);
    noteArea.value = saved || "";

    notesToggle.addEventListener(
      "click",
      () =>
        (notesPanel.style.display =
          notesPanel.style.display === "none" ? "block" : "none")
    );
    saveNoteBtn.addEventListener("click", () => {
      saveNoteFor(data.id, noteArea.value);
      alert("Note saved");
    });

    // Favorites
    const favBtn = container.querySelector("#favBtn");
    favBtn.addEventListener("click", () => {
      const favObj = {
        id: "series-" + data.id,
        type: "series",
        name: data.name,
        poster: data.poster_path,
      };
      if (isFavorited(favObj)) {
        removeFavorite("series-" + data.id);
        favBtn.textContent = "Add to Favorites";
      } else {
        addFavorite(favObj);
        favBtn.textContent = "Unfavorite";
      }
    });

    // Season cards (currently just display, could add episode details in future)
    // Click season cards to show more info
    container.querySelectorAll("[data-season]").forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        alert(
          `Season ${el.dataset.season} selected. Full episode list coming soon!`
        );
      });
    });
  } catch (err) {
    container.innerHTML = `<div class="empty">Failed to load series: ${err.message}</div>`;
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
