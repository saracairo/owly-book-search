// ========================================
//  UI HELPER FUNCTIONS
// ========================================
// Funzioni utility per gestire elementi UI comuni
// - Loading spinner
// - Messaggi di errore
// - Notifiche
// - Utilities varie


// ========================================
//  SPINNER FUNCTIONS
// ========================================
/**
 * Crea dinamicamente un loading spinner
 * @param {string} containerId - ID del container dove inserire lo spinner
 * @param {string} message - Messaggio da mostrare (default: 'Loading...')
 * @returns {HTMLElement} - Elemento spinner creato
 */
export function createLoadingSpinner(containerId = 'search-result', message = 'Loading books...') {
  // individuo il container tramite id
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }

  // creazione elemento spinner
  const spinnerDiv = document.createElement('div');
  spinnerDiv.id = 'loading-spinner';
  spinnerDiv.className = 'loading-spinner active';
  spinnerDiv.setAttribute('role', 'status');
  spinnerDiv.setAttribute('aria-live', 'polite');
  spinnerDiv.setAttribute('aria-label', 'Loading');

  // creazione dinamica HTML spinner
  spinnerDiv.innerHTML = `
    <div class="spinner" aria-hidden="true"></div>
    <p>${message}</p>
  `;

  // inserimento spinner nel container
  container.appendChild(spinnerDiv);

  return spinnerDiv;
}

/**
 * Mostra il loading spinner
 * @param {string} containerId - ID del container
 * @param {string} message - Messaggio personalizzato
 */
export function showLoading(containerId = 'search-result', message = 'Loading books...') {
  // individuo spinner esistente
  let spinner = document.getElementById('loading-spinner');

  // se non esiste, lo creo
  if (!spinner) {
    spinner = createLoadingSpinner(containerId, message);
  } else {
    // se esiste, lo mostro e aggiorno il messaggio con quello passato
    spinner.classList.add('active');
    const messageElement = spinner.querySelector('p');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }

  return spinner;
}


// ========================================
//  ERROR HANDLING FUNCTIONS
// ========================================
/**
 * Nasconde il loading spinner
 * @param {boolean} remove - Se true, rimuove l'elemento dal DOM
 */
export function hideLoading(remove = false) {
  const spinner = document.getElementById('loading-spinner');
  
  if (spinner) {
    spinner.classList.remove('active');
    
    // rimozione dal DOM se richiesto
    if (remove) {
      setTimeout(() => {
        spinner.remove();
      }, 300); // attesa fine animazione
    }
  }
}

/**
 * Mostra messaggio di errore
 * @param {string} message - Messaggio di errore
 * @param {number} duration - Durata in millisecondi (0 = permanente)
 * @param {string} containerId - ID container dove inserire l'errore
 */
export function showError(message, duration = 5000, containerId = 'search-result') {
  // individuo elemento errore esistente
  let errorElement = document.getElementById('error-message');

  // se non esiste, lo  creo
  if (!errorElement) {
    errorElement = createErrorElement(message, containerId);
  } else {
    // se esiste, lo mostro e aggiorno il messaggio
    errorElement.classList.add('active');
    const errorText = errorElement.querySelector('.error-text');
    if (errorText) {
      errorText.textContent = message;
    }
  }

  // auto-hide dopo duration (se > 0)
  if (duration > 0) {
    setTimeout(() => {
      hideError();
    }, duration);
  }

  return errorElement;
}

/**
 * Crea dinamicamente un elemento errore
 * @param {string} message - Messaggio di errore
 * @param {string} containerId - ID container
 * @returns {HTMLElement} - Elemento errore creato
 */
function createErrorElement(message, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }

  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.className = 'error-message active';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'assertive');

  errorDiv.innerHTML = `
    <i class="fa-solid fa-circle-exclamation fa-2x" aria-hidden="true"></i>
    <p class="error-text">${message}</p>
    <button class="close-error-btn" aria-label="Close error message">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  `;

  // Event listener di chiusura
  const closeBtn = errorDiv.querySelector('.close-error-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideError);
  }

  container.appendChild(errorDiv);

  return errorDiv;
}

/**
 * Nasconde messaggio di errore
 */
export function hideError() {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.classList.remove('active');
  }
}


// ========================================
//  CLEAN FUNCTIONS
// ========================================
/**
 * Pulisce un container specifico
 * @param {string} containerId - ID del container da pulire
 */
export function clearContainer(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}

// ========================================
//  FORMATTING FUNCTIONS
// ========================================
/**
 * Formatta l'array di autori in stringa leggibile
 * @param {Array} authors - Array di nomi autori
 * @returns {string} - Stringa formattata
 */
export function formatAuthors(authors) {
  if (!authors || authors.length === 0) {
    return 'Unknown Author';
  }
  
  if (authors.length === 1) {
    return authors[0];
  }
  
  if (authors.length === 2) {
    return `${authors[0]} and ${authors[1]}`;
  }
  
  // se + di 2 autori
  return `${authors[0]} and ${authors.length - 1} other${authors.length > 2 ? 's' : ''}`;
}

// ========================================
//  VALIDATION FUNCTIONS
// ========================================
/**
 * Valida input di ricerca
 * @param {string} input - Testo da validare
 * @returns {Object} - { isValid: boolean, cleanedInput: string, error: string }
 */
export function validateInput(input) {
  // trim whitespace
  const cleanedInput = input.trim();

  // verifica che l'input non sia vuoto
  if (!cleanedInput) {
    return {
      isValid: false,
      cleanedInput: '',
      error: 'Please enter a search term'
    };
  }

  // verifica lunghezza minima
  if (cleanedInput.length < 2) {
    return {
      isValid: false,
      cleanedInput: '',
      error: 'Search term must be at least 2 characters'
    };
  }

  return {
    isValid: true,
    cleanedInput: cleanedInput,
    error: null
  };
}

// ========================================
//  NOTIFICATION FUNCTIONS
// ========================================
/**
 * Mostra notifica toast
 * @param {string} message - Messaggio della notifica
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Durata in millisecondi
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // creazione elemento notifica
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');

  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close" aria-label="Close notification">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  `;

  // aggiungo al body
  document.body.appendChild(notification);

  // animazione di entrata
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // event listener di chiusura manuale
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });

  // auto-remove dopo duration
  setTimeout(() => {
    removeNotification(notification);
  }, duration);
}

/**
 * Rimuove notifica con animazione
 * @param {HTMLElement} notification - Elemento notifica
 */
function removeNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    notification.remove();
  }, 300);
}

// ========================================
//  EXECUTION FUNCTIONS
// ========================================
/**
 * Debounce function - limita la frequenza di esecuzione
 * @param {Function} func - Funzione da eseguire
 * @param {number} wait - Tempo di attesa in ms
 * @returns {Function} - Funzione debounced
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limita la frequenza di esecuzione
 * @param {Function} func - Funzione da eseguire
 * @param {number} limit - Tempo limite in ms
 * @returns {Function} - Funzione throttled
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
//  FORMATTING FUNCTIONS
// ========================================
/**
 * Formatta data in formato leggibile
 * @param {string|Date} date - Data da formattare
 * @returns {string} - Data formattata
 */
export function formatDate(date) {
  if (!date) return 'Date unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Tronca testo a lunghezza specifica
 * @param {string} text - Testo da troncare
 * @param {number} maxLength - Lunghezza massima
 * @param {string} suffix - Suffisso da aggiungere (default: '...')
 * @returns {string} - Testo troncato
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + suffix;
}

/**
 * Sanitizza HTML per prevenire XSS
 * @param {string} html - HTML da sanitizzare
 * @returns {string} - HTML sanitizzato
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// ========================================
//  VALIDATION FUNCTIONS
// ========================================
/**
 * Valida email
 * @param {string} email - Email da validare
 * @returns {boolean} - True se valida
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Genera ID univoco
 * @returns {string} - ID univoco
 */
export function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}