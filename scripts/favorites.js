/*
  scripts/favorites.js
  Simple favorites manager using localStorage. Exposes CRUD-style helpers:
  - getFavorites(): return array of saved favorites
  - isFavorited(item): check membership
  - addFavorite(item): add an item (object with id, type, name, poster)
  - removeFavorite(itemId): remove by id
  Favorites are stored under the key `movieSeries_favorites`.
*/
// scripts/favorites.js
import { loadJSON, saveJSON } from "./storage.js";

const KEY = "movieSeries_favorites";

export function getFavorites() {
  return loadJSON(KEY, []);
}

export function isFavorited(item) {
  const fav = getFavorites();
  return fav.some((i) => i.id === item.id && i.type === item.type);
}

export function addFavorite(item) {
  const fav = getFavorites();
  fav.push(item);
  saveJSON(KEY, fav);
}

export function removeFavorite(itemId) {
  let fav = getFavorites();
  fav = fav.filter((i) => !(i.id === itemId));
  saveJSON(KEY, fav);
}
