// ========================================
//  LOCAL STORAGE UTILITIES
// ========================================

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'owly_search_history',
  FAVORITES: 'owly_favorites',
  PREFERENCES: 'owly_preferences'
};

// ========================================
//  SEARCH HISTORY
// ========================================

/**
 * Salva ricerca nella cronologia
 * @param {string} query - Termine di ricerca
 * @param {number} maxItems - Numero massimo di elementi da mantenere
 */
export function saveSearchToHistory(query, maxItems = 5) {
  if (!query || query.trim().length < 2) return;

  const cleanQuery = query.trim().toLowerCase();
  let history = getSearchHistory();

  // rimozione duplicati
  history = history.filter(item => item.toLowerCase() !== cleanQuery);

  // aggiungo all'inizio
  history.unshift(cleanQuery);

  // mantengo numero massimo di elementi
  if (history.length > maxItems) {
    history = history.slice(0, maxItems);
  }

  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
}

/**
 * Ottiene la cronologia ricerche
 * @returns {Array<string>} - Array di ricerche
 */
export function getSearchHistory() {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

/**
 * Cancella la cronologia ricerche
 */
export function clearSearchHistory() {
  localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
}

/**
 * Rimuove una singola ricerca dalla cronologia
 * @param {string} query - Ricerca da rimuovere
 */
export function removeFromHistory(query) {
  let history = getSearchHistory();
  history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
}

// ========================================
//  FAVORITES
// ========================================

/**
 * Aggiunge libro ai preferiti
 * @param {Object} book - Dati del libro
 */
export function addToFavorites(book) {
  const favorites = getFavorites();
  
  // verifico che non sia già tra i preferiti
  const exists = favorites.some(fav => fav.key === book.key);
  if (exists) return false;

  favorites.unshift({
    key: book.key,
    title: book.title,
    authors: book.authors || [],
    coverId: book.coverId,
    addedAt: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  return true;
}

/**
 * Rimuove libro dai preferiti
 * @param {string} bookKey - Chiave del libro
 */
export function removeFromFavorites(bookKey) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.key !== bookKey);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

/**
 * Ottiene tutti i preferiti
 * @returns {Array<Object>} - Array di libri preferiti
 */
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

/**
 * Verifica se un libro è nei preferiti
 * @param {string} bookKey - Chiave del libro
 * @returns {boolean}
 */
export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.key === bookKey);
}

/**
 * Cancella tutti i preferiti
 */
export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
}

/**
 * Ottiene numero di preferiti
 * @returns {number}
 */
export function getFavoritesCount() {
  return getFavorites().length;
}