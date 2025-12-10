// scripts/api.js
const TMDB_KEY = "a18c34c74ad668a1725d7e315e646834";
const OMDB_KEY = "7c5fa0a3";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "assets/icons/poster-placeholder.png";

export async function tmdbGetPopularCollections() {
  // TMDB doesn't have a popular collections endpoint, so we'll search for well-known series
  const popularSeries = [
    "Marvel Cinematic Universe",
    "Star Wars",
    "Toy Story",
    "Fast & Furious",
    "Harry Potter",
  ];
  const results = [];

  for (const seriesName of popularSeries) {
    try {
      const q = encodeURIComponent(seriesName);
      const url = `${TMDB_BASE}/search/collection?api_key=${TMDB_KEY}&query=${q}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          results.push(json.results[0]);
        }
      }
    } catch (e) {
      // Skip failed searches
    }
  }

  return results;
}

export async function tmdbSearchCollection(query) {
  const q = encodeURIComponent(query);
  const url = `${TMDB_BASE}/search/collection?api_key=${TMDB_KEY}&query=${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB search failed");
  const json = await res.json();
  return json.results || [];
}

export async function tmdbGetCollection(collectionId) {
  const url = `${TMDB_BASE}/collection/${collectionId}?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB collection fetch failed");
  return res.json();
}

export async function tmdbGetMovie(movieId) {
  const url = `${TMDB_BASE}/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=credits`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB movie fetch failed");
  return res.json();
}

export async function omdbGetByTitle(title) {
  const q = encodeURIComponent(title);
  const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("OMDb fetch failed");
  return res.json();
}

export { TMDB_IMG };
