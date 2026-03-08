const KEY = 'favorites';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setFavorites(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToFavorites(product) {
  const favs = getFavorites();
  if (favs.some((p) => p.id === product.id)) return;
  favs.push(product);
  setFavorites(favs);
}

export function removeFromFavorites(productId) {
  const favs = getFavorites().filter((p) => p.id !== productId);
  setFavorites(favs);
}

export function isFavorite(productId) {
  return getFavorites().some((p) => p.id === productId);
}
