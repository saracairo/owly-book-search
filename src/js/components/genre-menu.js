// ================================================
//    GENRE MENU COMPONENT
// =================================================
// - Estrae il testo del genere (es: "Fantasy" → "fantasy")
// - Chiama l'API searchBooksBySubject(genre)
// - Mostra i risultati con renderBookList(books)
// - Gestisce loading ed errori
// - Supporta navigazione con frecce su/giù

import { searchBooksBySubject } from '../api/open-library.js';
import { renderBookList } from './book-list.js';
import { showLoading, hideLoading, showError } from '../utils/helpers.js';
import { renderFavorites } from './book-list.js';
import { getFavoritesCount } from '../utils/storage.js';
import { pagination } from '../utils/pagination.js';

/**
 * Inizializza il menu dei generi con event listeners
 */
export function initGenreMenu() {
  const genreMenu = document.getElementById('genre-menu');
  const menuItems = genreMenu?.querySelectorAll('li[role="menuitem"]');
  
  if (!menuItems) return;
  
  // array per gestire la navigazione con frecce
  const menuItemsArray = Array.from(menuItems);
  
  menuItems.forEach((item, index) => {
    // click handler
    item.addEventListener('click', async () => {
			// verifico se mi trovo sul pulsante "Favorites"
      if (item.dataset.action === 'show-favorites') {
        showFavoritesSection();
        return;
      }
      
      const genre = item.textContent.trim().toLowerCase();
      await handleGenreSearch(genre);
    });
		
    // supporto per navigazione con tastiera (Enter, Space, Frecce)
    item.addEventListener('keydown', (e) => {
      let targetIndex;
      
      switch(e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          item.click();
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + 1) % menuItemsArray.length;
          menuItemsArray[targetIndex].focus();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - 1 + menuItemsArray.length) % menuItemsArray.length;
          menuItemsArray[targetIndex].focus();
          break;
          
        case 'Home':
          e.preventDefault();
          menuItemsArray[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          menuItemsArray[menuItemsArray.length - 1].focus();
          break;
      }
    });
  });

	// aggiorno badge count all'avvio
	updateFavoritesCount();
}

/**
 * Gestisce ricerca per genere
 * @param {string} genre - Nome del genere
 * @param {number} offset - Offset per paginazione
 */
async function handleGenreSearch(genre, offset = 0) {
  try {
    // mostra loading con messaggio specifico per il genere
    showLoading('search-result', `Loading ${genre} books...`);
    
    // chiama API con paginazione
    const result = await searchBooksBySubject(genre, 20, offset);
    
    // nascondi e rimuovi loading
    hideLoading(true);
    
    // renderizzazione risultati
    if (result.books.length === 0) {
      showError(`No books found for genre: ${genre}`);
      pagination.reset();
    } else {
      renderBookList(result.books);
      
      // inizializza paginazione se ci sono più risultati
      if (result.totalCount > 20) {
        pagination.init(genre, result.totalCount, async (page, newOffset) => {
          // scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          await handleGenreSearch(genre, newOffset);
        });
      } else {
        pagination.hide();
      }
    }
    
  } catch (error) {
    hideLoading(true);
    console.error('Genre search error:', error);
    showError(error.message || 'Error loading books');
		pagination.reset();
  }
}

/**
 * Mostra sezione preferiti
 */
function showFavoritesSection() {
  renderFavorites();
}

/**
 * Aggiorna contatore preferiti nel menu
 */
function updateFavoritesCount() {
  const badge = document.getElementById('favorites-count');
  if (badge) {
    const count = getFavoritesCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}