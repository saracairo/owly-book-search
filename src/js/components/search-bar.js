// ===============================
// 	MODULO SEARCH BAR
// ===============================
// - Funzione per inizializzare la search bar
// - Event listener sul button di ricerca
// - Event listener su Enter key nell'input
// - Validazione input (non vuoto, trim whitespace, min 2 caratteri)
// - Mostrare loading durante la ricerca
// - Chiamare API e gestire risultati
// - Gestione errori completa
// - Auto-hide errori dopo 5 secondi
// - Annunci accessibilità per screen readers

// importo funzione API necessaria da modulo open-library.js
import { searchBooksBySubject } from '../api/open-library.js';
import { renderBookList, clearBookList } from './book-list.js';
import { showLoading, hideLoading, showError, hideError, validateInput } from '../utils/helpers.js';
import { saveSearchToHistory, getSearchHistory, removeFromHistory, clearSearchHistory } from '../utils/storage.js';

/**
 * Inizializza la search bar con tutti gli event listeners
 */
export function initSearchBar() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');

  // Event listener sul form submit
  searchForm.addEventListener('submit', handleSearch);

  // Event listener su Enter key
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch(event);
    }
  });

  // Event listener sul button
  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    handleSearch(event);
  });

  // mostro cronologia al focus
  searchInput.addEventListener('focus', showSearchHistory);
  
  // nascondo cronologia al blur (con delay per permettere click)
  searchInput.addEventListener('blur', () => {
    setTimeout(hideSearchHistory, 200);
  });
}

/**
 * Mostra dropdown cronologia ricerche
 */
function showSearchHistory() {
  const searchInput = document.getElementById('search-bar');
  const history = getSearchHistory();
  
  if (history.length === 0) return;

  // rimozione dropdown esistente
  hideSearchHistory();

  // creazione dropdown
  const dropdown = document.createElement('div');
  dropdown.id = 'search-history-dropdown';
  dropdown.className = 'search-history-dropdown';
  dropdown.setAttribute('role', 'listbox');

  // header con pulsante clear
  const header = document.createElement('div');
  header.className = 'history-header';
  header.innerHTML = `
    <span><i class="fas fa-history"></i> Recent Searches</span>
    <button class="clear-history-btn" aria-label="Clear history">
      <i class="fas fa-trash"></i>
    </button>
  `;
  dropdown.appendChild(header);

  // lista ricerche
  const list = document.createElement('ul');
  list.setAttribute('role', 'list');
  
  history.forEach(query => {
    const item = document.createElement('li');
    item.className = 'history-item';
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', '0');
    
    item.innerHTML = `
      <i class="fas fa-search"></i>
      <span class="history-query">${query}</span>
      <button class="remove-history-btn" data-query="${query}" aria-label="Remove from history">
        <i class="fas fa-times"></i>
      </button>
    `;

    // click su ricerca
    item.querySelector('.history-query').addEventListener('click', () => {
      searchInput.value = query;
      hideSearchHistory();
      handleSearch(new Event('submit'));
    });

    // click su rimuovi
    item.querySelector('.remove-history-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromHistory(query);
      showSearchHistory(); // refresh
    });

    list.appendChild(item);
  });

  dropdown.appendChild(list);

  // click su clear all
  header.querySelector('.clear-history-btn').addEventListener('click', () => {
    clearSearchHistory();
    hideSearchHistory();
  });

  // posizionamento sotto l'input
  const searchForm = document.getElementById('search-form');
  searchForm.style.position = 'relative';
  searchForm.appendChild(dropdown);
}

/**
 * Nascondi dropdown cronologia
 */
function hideSearchHistory() {
  const dropdown = document.getElementById('search-history-dropdown');
  if (dropdown) {
    dropdown.remove();
  }
}

/**
 * Gestisce la ricerca
 * @param {Event} event - Event object
 */
async function handleSearch(event) {
  event.preventDefault();

  const searchInput = document.getElementById('search-bar');
  const searchValue = searchInput.value;

  // nascondo eventuali errori precedenti
  hideError();
  hideSearchHistory(); // Nascondi cronologia

  // validazione input
  const validation = validateInput(searchValue);
  
  if (!validation.isValid) {
    showError(validation.error);
    return;
  }

  // salvo in cronologia
  saveSearchToHistory(validation.cleanedInput);

  try {
    // disabilito pulsante e aggiungo aria-busy
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      searchButton.disabled = true;
      searchButton.setAttribute('aria-busy', 'true');
    }

    // mostro spinner caricamento con messaggio personalizzato
    showLoading('search-result', 'Searching for books...');
    
    // pulizia risultati precedenti
    clearBookList();

    // chiamata API
    const books = await searchBooksBySubject(validation.cleanedInput);
    
    // riabilito pulsante
    if (searchButton) {
      searchButton.disabled = false;
      searchButton.removeAttribute('aria-busy');
    }

    // nascondo e rimuovo spinner caricamento
    hideLoading(true);

    // gestione risultati
    if (books.length === 0) {
      showError(`No books found for "${validation.cleanedInput}"`);
      return;
    }

    // renderizzazione risultati
    renderBookList(books);

    // annuncio per gli screen reader
    announceResults(books.length);

  } catch (error) {
    // riabilito pulsante
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      searchButton.disabled = false;
      searchButton.removeAttribute('aria-busy');
    }

    // nascondo loading
    hideLoading(true);
    
    // mostro errore
    console.error('Search error:', error);
    showError(error.message || 'An error occurred while searching. Please try again.');
  }
}

/**
 * Annuncia i risultati per screen readers
 * @param {number} count - Numero di risultati
 */
function announceResults(count) {
  const resultsContainer = document.getElementById('search-result');
  if (resultsContainer) {
    resultsContainer.setAttribute('aria-live', 'polite');
    resultsContainer.setAttribute('aria-label', `Found ${count} book${count !== 1 ? 's' : ''}`);
  }
}

/**
 * Chiude il messaggio di errore
 */
function setupErrorClose() {
  const closeErrorBtn = document.getElementById('close-error');
  
  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', hideError);
  }
}

// quando il DOM è pronto, inizializzo la chiusura errori
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupErrorClose);
} else {
  setupErrorClose();
}