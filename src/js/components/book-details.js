import { getBookDetails, getCoverImageUrl } from '../api/open-library.js';

// Variabile per salvare l'elemento che ha attivato il modal
let lastFocusedElement = null;

/**
 * Mostra i dettagli di un libro nel modal
 * @param {string} bookKey - Chiave del libro (es: '/works/OL45804W')
 */
export async function showBookDetails(bookKey) {
  const modal = document.querySelector('.modal');
  const modalContent = modal?.querySelector('.modal-body');
  
  if (!modal || !modalContent) {
    console.error('Modal elements not found');
    return;
  }

  // salvo elemento con focus corrente
  lastFocusedElement = document.activeElement;

  try {
    // mostro modal con spinner di caricamento
    modal.classList.add('active');
    showModalLoading(modalContent);

    // chiamata API per ottenere dettagli
    const bookDetails = await getBookDetails(bookKey);

    // nascondo loading e mostro contenuto
    hideModalLoading(modalContent);
    renderBookDetails(bookDetails, modalContent);

    // impostazione focus sul pulsante "chiudi" per miglior accessibilità
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }

	// gestione di eventuali errori
  } catch (error) {
    console.error('Error loading book details:', error);
    hideModalLoading(modalContent);
    showModalError(modalContent, error.message);
  }
}

/**
 * Mostra loading nel modal
 * @param {HTMLElement} container - Container del modal
 */
function showModalLoading(container) {
  container.innerHTML = `
    <div class="modal-loading">
      <div class="spinner"></div>
      <p>Loading book details...</p>
    </div>
  `;
}

/**
 * Nasconde loading dal modal
 * @param {HTMLElement} container - Container del modal
 */
function hideModalLoading(container) {
  const loading = container.querySelector('.modal-loading');
  if (loading) {
    loading.remove();
  }
}

/**
 * Mostra errore nel modal
 * @param {HTMLElement} container - Container del modal
 * @param {string} message - Messaggio di errore
 */
function showModalError(container, message) {
  container.innerHTML = `
    <div class="modal-error">
      <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
      <h3>Error Loading Book</h3>
      <p>${message}</p>
      <button class="btn-close-error" onclick="this.closest('#book-modal').classList.remove('active')">
        Close
      </button>
    </div>
  `;
}

/**
 * Renderizza i dettagli del libro nel modal
 * @param {Object} details - Dettagli del libro
 * @param {HTMLElement} container - Container del modal
 */
function renderBookDetails(details, container) {
  // ottengo URL copertina
  const coverId = details.covers && details.covers.length > 0 ? details.covers[0] : null;
  const coverUrl = getCoverImageUrl(coverId, 'L');

  // formattazione soggetti
  const subjectsText = formatSubjects(details.subjects);

  // gestione descrizione - può essere stringa o oggetto con proprietà 'value'
  let description = 'No description available for this book.';
  
  if (details.description) {
    if (typeof details.description === 'string') {
      description = details.description;
    } else if (typeof details.description === 'object' && details.description.value) {
      description = details.description.value;
    }
  }

	// creazione dinamica contenuto HTML
  container.innerHTML = `
    <div class="book-details-grid">
      <div class="book-cover-large">
        <img 
          src="${coverUrl}" 
          alt="Cover of ${details.title}"
          onerror="this.src='https://via.placeholder.com/400x600?text=No+Cover'"
        >
      </div>
      <div class="book-details-info">
        <h2 class="book-details-title">${details.title}</h2>
        
        ${details.firstPublishDate ? `
          <p class="book-meta">
            <i class="fas fa-calendar" aria-hidden="true"></i>
            <strong>First Published:</strong> ${details.firstPublishDate}
          </p>
        ` : ''}
        
        ${subjectsText ? `
          <div class="book-subjects">
            <p><strong>Subjects:</strong></p>
            <div class="subjects-tags">
              ${subjectsText}
            </div>
          </div>
        ` : ''}
        
        <div class="book-description">
          <h3>Description</h3>
          <p>${description}</p>
        </div>
        
        <div class="book-actions">
          <a 
            href="https://openlibrary.org${details.key || ''}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn-read-more"
            aria-label="Read more about ${details.title} on Open Library"
          >
            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
            View on Open Library
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Formatta i soggetti in tag HTML
 * @param {Array} subjects - Array di soggetti
 * @returns {string} - HTML dei tag
 */
function formatSubjects(subjects) {
  if (!subjects || subjects.length === 0) {
    return '';
  }
  
  // prendo i primi 8 soggetti e li separo con virgole
  return subjects.slice(0, 8)
    .map(subject => `<span class="subject-tag">${subject}</span>`)
    .join('<span class="subject-separator">, </span>');
}

/**
 * Nasconde il modal dei dettagli
 */
export function hideBookDetails() {
  const modal = document.getElementById('book-modal');
  
  if (modal) {
    modal.classList.remove('active');
    
    // riprisrino focus sull'elemento che ha aperto il modal
    if (lastFocusedElement) {
      setTimeout(() => {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }, 100);
    }
  }
}

/**
 * Inizializza gli event listeners per chiudere il modal
 */
export function initBookDetailsModal() {
  const modal = document.getElementById('book-modal');
  const closeBtn = document.querySelector('.close-modal');
  const overlay = document.querySelector('.modal-overlay');

  if (!modal || !closeBtn) {
    console.error('Modal elements not found');
    return;
  }

  // X
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideBookDetails();
  });

  // overlay
	overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) { // Solo se click diretto sull'overlay
      hideBookDetails();
    }
  });
	
  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      hideBookDetails();
    }
  });
}