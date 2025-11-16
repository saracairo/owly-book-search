import '../css/styles.css';
// importo funzioni API per test
import { searchBooksBySubject, getBookDetails } from './api/open-library.js';
import { initSearchBar } from './components/search-bar.js';
import { initGenreMenu } from './components/genre-menu.js';
import { initBookDetailsModal } from './components/book-details.js';
import { pagination } from './utils/pagination.js';


// ========================================
// 	API TESTING (rimuovere in produzione)
// ========================================
// test console funzioni API
async function testAPI() {
	try {
		const books = await searchBooksBySubject('science');
		console.log('Books found:', books);
		
		if (books.length > 0) {
			const bookDetails = await getBookDetails(books[0].key);
			console.log('Book details:', bookDetails);
		}
	} catch (error) {
		console.error('API test error:', error);
	}
}

testAPI(); // TODO: rimuovere test in produzione

console.log('Webpack configurato correttamente.');
console.log('API Key:', process.env.API_KEY); // Test dotenv


// ========================================
// 	APP INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Owly Book Search - App initialized');
  
  // inizializzazione componenti
  initSearchBar();
  initGenreMenu();
  initBookDetailsModal();
  initHamburgerMenu();
});


// ========================================
// 	HAMBURGER MENU FUNCTIONALITY
// ========================================
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const genreMenu = document.getElementById('genre-menu');
  
  if (!hamburgerBtn || !genreMenu) return;
  
  hamburgerBtn.addEventListener('click', () => {
    const isExpanded = genreMenu.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    
    const icon = hamburgerBtn.querySelector('i');
    if (isExpanded) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // chiusura menu quando si clicca su una categoria
  const menuItems = genreMenu.querySelectorAll('li');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 600) {
        genreMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}