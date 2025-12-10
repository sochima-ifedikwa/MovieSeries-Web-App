// scripts/app.js
import { setupThemeToggle, showLoading } from "./ui.js";
import { doSearch } from "./search.js";
import { renderSeriesDetail } from "./seriesDetail.js";
import { renderMovieDetail } from "./movieDetail.js";
import { renderFavorites } from "./favoritesView.js";
import { renderNotesView } from "./notesView.js";
import { tmdbGetPopularCollections, TMDB_IMG } from "./api.js";
import { renderSeriesList } from "./series.js";

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");
const themeToggleBtn = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

import { setupThemeToggle as _setupThemeToggle } from "./ui.js";
_setupThemeToggle(themeToggleBtn);

// menu toggling for small screens
menuBtn.addEventListener("click", () => sidebar.classList.toggle("hidden"));

// search keystroke
searchInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim();
    location.hash = `#/search/${encodeURIComponent(q)}`;
  }
});

// simple hash router
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

function parseHash() {
  const hash = location.hash.slice(1) || "/";
  const parts = hash.split("/").filter((p) => p.length);
  return parts;
}

function router() {
  const parts = parseHash();
  // default
  if (parts.length === 0 || parts[0] === "") {
    renderHome();
    return;
  }

  const route = parts[0];

  if (route === "search") {
    const q = decodeURIComponent(parts[1] || "");
    renderSearch(q);
  } else if (route === "series") {
    const id = parts[1];
    renderSeries(id);
  } else if (route === "movie") {
    const id = parts[1];
    renderMovie(id);
  } else if (route === "favorites") {
    renderFavs();
  } else if (route === "notes") {
    renderNotes();
  } else {
    renderHome();
  }
}

/* Routes */
function renderHome() {
  app.innerHTML = `
    <section>
      <h2>Welcome to Movie Series Explorer</h2>
      <p class="panel">Search for a movie series using the search box above.</p>
      <h3 style="margin-top: 24px;">Popular Series</h3>
      <div id="featured"></div>
    </section>
  `;

  const featured = document.getElementById("featured");
  loadFeaturedSeries(featured);
}

async function loadFeaturedSeries(container) {
  try {
    showLoading(container, "Loading popular series...");
    const collections = await tmdbGetPopularCollections();
    renderSeriesList(container, collections);
  } catch (err) {
    container.innerHTML = `<div class="empty">Failed to load popular series: ${err.message}</div>`;
  }
}

function renderSearch(q) {
  app.innerHTML = `<section><div id="results"></div></section>`;
  const results = document.getElementById("results");
  doSearch(results, q);
}

function renderSeries(id) {
  app.innerHTML = `<div id="seriesContainer"></div>`;
  const container = document.getElementById("seriesContainer");
  renderSeriesDetail(container, id);
}

function renderMovie(id) {
  app.innerHTML = `<div id="movieContainer"></div>`;
  const container = document.getElementById("movieContainer");
  renderMovieDetail(container, id);
}

function renderFavs() {
  app.innerHTML = `<div id="favContainer"></div>`;
  renderFavorites(document.getElementById("favContainer"));
}

function renderNotes() {
  app.innerHTML = `<div id="notesContainer"></div>`;
  renderNotesView(document.getElementById("notesContainer"));
}
