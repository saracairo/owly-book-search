/**
 * Gestisce la paginazione dei risultati
 */
export class Pagination {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.totalItems = 0;
    this.totalPages = 0;
    this.currentSubject = '';
    this.onPageChange = null;
  }

  /**
   * Inizializza la paginazione
   * @param {string} subject - Soggetto corrente
   * @param {number} totalItems - Totale elementi
   * @param {Function} callback - Funzione da chiamare al cambio pagina
   */
  init(subject, totalItems, callback) {
    this.currentSubject = subject;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.onPageChange = callback;
    this.render();
  }

  /**
   * Calcola offset per API
   */
  getOffset() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  /**
   * Vai alla pagina successiva
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.render();
      if (this.onPageChange) {
        this.onPageChange(this.currentPage, this.getOffset());
      }
    }
  }

  /**
   * Vai alla pagina precedente
   */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
      if (this.onPageChange) {
        this.onPageChange(this.currentPage, this.getOffset());
      }
    }
  }

  /**
   * Vai a una pagina specifica
   * @param {number} page - Numero pagina
   */
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.render();
      if (this.onPageChange) {
        this.onPageChange(this.currentPage, this.getOffset());
      }
    }
  }

  /**
   * Renderizza i controlli di paginazione
   */
  render() {
    let paginationContainer = document.getElementById('pagination-controls');
    
    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'pagination-controls';
      paginationContainer.className = 'pagination-controls';
      paginationContainer.setAttribute('role', 'navigation');
      paginationContainer.setAttribute('aria-label', 'Pagination navigation');
      
      const resultsContainer = document.getElementById('search-result');
      resultsContainer.parentNode.insertBefore(
        paginationContainer,
        resultsContainer.nextSibling
      );
    }

    // genera numeri pagina da mostrare
    const pageNumbers = this.getPageNumbers();

    paginationContainer.innerHTML = `
      <div class="pagination-info">
        Showing ${this.getOffset() + 1}-${Math.min(this.getOffset() + this.itemsPerPage, this.totalItems)} of ${this.totalItems} results
      </div>
      <div class="pagination-buttons">
        <button 
          class="pagination-btn prev-btn" 
          ${this.currentPage === 1 ? 'disabled' : ''}
          aria-label="Previous page"
        >
          <i class="fas fa-chevron-left"></i>
          Previous
        </button>
        
        <div class="page-numbers">
          ${pageNumbers.map(num => {
            if (num === '...') {
              return `<span class="pagination-ellipsis">...</span>`;
            }
            return `
              <button 
                class="pagination-btn page-number ${num === this.currentPage ? 'active' : ''}"
                data-page="${num}"
                aria-label="Go to page ${num}"
                aria-current="${num === this.currentPage ? 'page' : 'false'}"
              >
                ${num}
              </button>
            `;
          }).join('')}
        </div>
        
        <button 
          class="pagination-btn next-btn" 
          ${this.currentPage === this.totalPages ? 'disabled' : ''}
          aria-label="Next page"
        >
          Next
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    // aggiungi event listeners
    this.attachEventListeners();
  }

  /**
   * Calcola i numeri di pagina da mostrare
   * @returns {Array} - Array di numeri/ellipsis
   */
  getPageNumbers() {
    const pages = [];
    const maxVisible = 7; // numero massimo di pagine visibili

    if (this.totalPages <= maxVisible) {
      // mostra tutte le pagine
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // logica per ellipsis
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  /**
   * Aggiunge event listeners ai bottoni
   */
  attachEventListeners() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageButtons = document.querySelectorAll('.page-number');

    prevBtn?.addEventListener('click', () => this.prevPage());
    nextBtn?.addEventListener('click', () => this.nextPage());

    pageButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.target.dataset.page);
        this.goToPage(page);
      });
    });
  }

  /**
   * Nasconde i controlli di paginazione
   */
  hide() {
    const paginationContainer = document.getElementById('pagination-controls');
    if (paginationContainer) {
      paginationContainer.remove();
    }
  }

  /**
   * Reset della paginazione
   */
  reset() {
    this.currentPage = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    this.hide();
  }
}

// istanza singleton
export const pagination = new Pagination();