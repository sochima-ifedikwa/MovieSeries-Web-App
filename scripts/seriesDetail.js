// scripts/seriesDetail.js
import { tmdbGetCollection, TMDB_IMG, omdbGetByTitle } from "./api.js";
import { showLoading } from "./ui.js";
import { addFavorite, removeFavorite, isFavorited } from "./favorites.js";
import { saveNoteFor, getNoteFor } from "./notes.js";

export async function renderSeriesDetail(container, id) {
  showLoading(container, "Loading series...");
  try {
    const data = await tmdbGetCollection(id);
    // data.parts = array of movies
    container.innerHTML = `
      <div class="detail">
        <aside class="panel">
          <img src="${TMDB_IMG(data.poster_path)}" alt="${
      data.name
    }" style="width:100%;border-radius:10px;">
          <h2>${escapeHtml(data.name)}</h2>
          <p>${escapeHtml(data.overview || "No description available.")}</p>
          <div class="row" style="margin-top:10px">
            <button id="favBtn" class="btn">${
              isFavorited({ id: "collection-" + data.id })
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
          <h3>Watch Order</h3>
          <ol id="watchList">
            ${data.parts
              .map(
                (p) =>
                  `<li data-movieid="${p.id}" class="watch-item">${escapeHtml(
                    p.title
                  )} (${
                    p.release_date ? p.release_date.slice(0, 4) : "—"
                  })</li>`
              )
              .join("")}
          </ol>
          <h3 style="margin-top:16px">Movies</h3>
          <div id="moviesList" class="grid">
            ${data.parts
              .map(
                (p) => `
              <article class="card" data-mid="${p.id}">
                <img src="${TMDB_IMG(p.poster_path, "w300")}" alt="${escapeHtml(
                  p.title
                )}"/>
                <h4>${escapeHtml(p.title)}</h4>
              </article>
            `
              )
              .join("")}
          </div>
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
        id: "collection-" + data.id,
        type: "collection",
        name: data.name,
        poster: data.poster_path,
      };
      if (isFavorited(favObj)) {
        removeFavorite("collection-" + data.id);
        favBtn.textContent = "Add to Favorites";
      } else {
        addFavorite(favObj);
        favBtn.textContent = "Unfavorite";
      }
    });

    // Click movie cards -> route to movie detail
    container.querySelectorAll("[data-mid]").forEach((el) => {
      el.addEventListener("click", () => {
        const mid = el.dataset.mid;
        location.hash = `#/movie/${mid}`;
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
