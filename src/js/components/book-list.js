import { getCoverImageUrl } from '../api/open-library.js';
import { formatAuthors } from '../utils/helpers.js';
import { addToFavorites, removeFromFavorites, isFavorite, getFavorites } from '../utils/storage.js';
import { showNotification } from '../utils/helpers.js';

/**
 * Renderizza la lista di libri
 * @param {Array} books - Array di libri da renderizzare
 */
export function renderBookList(books) {
  const resultsContainer = document.getElementById('search-result');
  
  if (!resultsContainer) {
    console.error('Results container not found');
    return;
  }

  // pulisco risultati precedenti
  clearBookList();

  // gestione risultato vuoto
  if (!books || books.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-book-open" aria-hidden="true"></i>
        <p>No books found. Try a different search term.</p>
      </div>
    `;
    return;
  }

  // creazione card per ogni libro
  books.forEach((book, index) => {
    const bookCard = createBookCard(book, index);
    resultsContainer.appendChild(bookCard);
  });

  // annuncio risultato agli screen reader
  resultsContainer.setAttribute(
		'aria-label',
		`Found ${books.length} book${books.length !== 1 ? 's' : ''}`
	);
}

/**
 * Crea una card per un singolo libro
 * @param {Object} book - Dati del libro
 * @param {number} index - Indice del libro nell'array
 * @returns {HTMLElement} - Elemento DOM della card
 */
function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `Book ${index + 1}: ${book.title}`);
  card.setAttribute('tabindex', '0');
  
  // gestione array autori
  const authorsText = formatAuthors(book.authors);
  
  // ottengo URL immagine copertina
  const coverUrl = getCoverImageUrl(book.coverId, 'M');
  
  // anno di pubblicazione
  const yearText = book.firstPublishYear ? `(${book.firstPublishYear})` : '';

	// controllo se il libro è nei preferiti
	const isBookFavorite = isFavorite(book.key);

	// creo contenuto HTML della card
  card.innerHTML = `
    <button 
      class="favorite-btn ${isBookFavorite ? 'active' : ''}" 
      data-book-key="${book.key}"
      aria-label="${isBookFavorite ? 'Remove from favorites' : 'Add to favorites'}"
      aria-pressed="${isBookFavorite}"
    >
      <i class="${isBookFavorite ? 'fas' : 'far'} fa-heart"></i>
    </button>
    <div class="book-cover">
      <img 
        src="${coverUrl}" 
        alt="Cover of ${book.title}"
        onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'"
      >
    </div>
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-authors">
        <i class="fas fa-user" aria-hidden="true"></i>
        ${authorsText}
      </p>
      <p class="book-year">
        <i class="fas fa-calendar" aria-hidden="true"></i>
        ${yearText || 'Year unknown'}
      </p>
    </div>
  `;

  // Event listener per click sulla card
  card.addEventListener('click', () => {
    openBookDetails(book.key);
  });

	 // Event listener per favorite button
  const favoriteBtn = card.querySelector('.favorite-btn');
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(book, favoriteBtn);
  });

  // Event listener per navigazione da tastiera
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookDetails(book.key);
    }
  });
	
  return card;
}

/**
 * Pulisce i risultati precedenti
 */
export function clearBookList() {
  const resultsContainer = document.getElementById('search-result');
  if (resultsContainer) {
    resultsContainer.innerHTML = '';
  }
}

/**
 * Apre i dettagli del libro
 * @param {string} bookKey - Chiave del libro
 */
function openBookDetails(bookKey) {
  // importo dinamicamente il modulo per evitare circular dependency
  import('./book-details.js').then(module => {
    module.showBookDetails(bookKey);
  });
}

/**
 * Toggle favorito
 * @param {Object} book - Dati del libro
 * @param {HTMLElement} button - Bottone cuore
 */
function toggleFavorite(book, button) {
  const isCurrentlyFavorite = isFavorite(book.key);
  
  if (isCurrentlyFavorite) {
    removeFromFavorites(book.key);
    button.classList.remove('active');
    button.querySelector('i').classList.remove('fas');
    button.querySelector('i').classList.add('far');
    button.setAttribute('aria-label', 'Add to favorites');
    button.setAttribute('aria-pressed', 'false');
    showNotification('Removed from favorites', 'info', 2000);
  } else {
    const added = addToFavorites(book);
    if (added) {
      button.classList.add('active');
      button.querySelector('i').classList.remove('far');
      button.querySelector('i').classList.add('fas');
      button.setAttribute('aria-label', 'Remove from favorites');
      button.setAttribute('aria-pressed', 'true');
      showNotification('Added to favorites!', 'success', 2000);
    }
  }
}


/**
 * Renderizza i libri preferiti
 */
export function renderFavorites() {
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    const resultsContainer = document.getElementById('search-result');
    resultsContainer.innerHTML = `
      <div class="no-results">
        <i class="far fa-heart" aria-hidden="true"></i>
        <p>No favorites yet. Add books by clicking the heart icon!</p>
      </div>
    `;
    return;
  }
  
  // conversione formato storage in formato book per renderizzare
  const books = favorites.map(fav => ({
    key: fav.key,
    title: fav.title,
    authors: fav.authors,
    coverId: fav.coverId,
    firstPublishYear: null
  }));
  
  renderBookList(books);
}