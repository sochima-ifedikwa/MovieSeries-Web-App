// scripts/api.js
const TMDB_KEY = "a18c34c74ad668a1725d7e315e646834";
const OMDB_KEY = "7c5fa0a3";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "assets/icons/poster-placeholder.png";

export async function tmdbGetPopularCollections() {
  // Search for popular TV series instead of movie collections
  const popularSeries = [
    "Breaking Bad",
    "Game of Thrones",
    "The Office",
    "Stranger Things",
    "The Crown",
  ];
  const results = [];

  for (const seriesName of popularSeries) {
    try {
      const q = encodeURIComponent(seriesName);
      const url = `${TMDB_BASE}/search/tv?api_key=${TMDB_KEY}&query=${q}`;
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
  // Search for TV series by name
  const q = encodeURIComponent(query);
  const url = `${TMDB_BASE}/search/tv?api_key=${TMDB_KEY}&query=${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB search failed");
  const json = await res.json();
  return json.results || [];
}

export async function tmdbSearchMoviesAndSeries(query) {
  // Search for both movies and TV series
  const q = encodeURIComponent(query);
  const results = [];

  try {
    // Search TV series
    const tvUrl = `${TMDB_BASE}/search/tv?api_key=${TMDB_KEY}&query=${q}`;
    const tvRes = await fetch(tvUrl);
    if (tvRes.ok) {
      const tvJson = await tvRes.json();
      if (tvJson.results) {
        // Mark as TV series
        results.push(
          ...tvJson.results.map((r) => ({ ...r, media_type: "tv" }))
        );
      }
    }
  } catch (e) {
    // Skip if TV search fails
  }

  try {
    // Search movies
    const movieUrl = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${q}`;
    const movieRes = await fetch(movieUrl);
    if (movieRes.ok) {
      const movieJson = await movieRes.json();
      if (movieJson.results) {
        // Mark as movie
        results.push(
          ...movieJson.results.map((r) => ({ ...r, media_type: "movie" }))
        );
      }
    }
  } catch (e) {
    // Skip if movie search fails
  }

  return results;
}

export async function tmdbGetCollection(collectionId) {
  const url = `${TMDB_BASE}/collection/${collectionId}?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB collection fetch failed");
  return res.json();
}

export async function tmdbGetTVSeries(seriesId) {
  const url = `${TMDB_BASE}/tv/${seriesId}?api_key=${TMDB_KEY}&append_to_response=credits`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB TV series fetch failed");
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
