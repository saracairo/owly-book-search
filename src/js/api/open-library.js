import axios from 'axios';
import _ from 'lodash';

const BASE_URL = 'https://openlibrary.org';

// timeout richieste
const TIMEOUT = 10000; // 10 secondi

// configurazione Axios con timeout
axios.defaults.timeout = TIMEOUT;

// ========================================
// 	API FUNCTIONS
// ========================================
// ricerca libri per titolo, autore e categoria

/**
 * Cerca libri per genere/soggetto
 * @param {string} subject - genere da cercare (es: 'fiction', 'science')
 * @returns {Promise<Array>} - restituisce array di libri trovati
 */
export async function searchBooksBySubject(subject, limit = 20, offset = 0) {
	try {
		// 1. costruzione url
		const url = `${BASE_URL}/subjects/${subject.toLowerCase()}.json`;

		// 2. chiamata GET con Axios
		const response = await axios.get(url, {
			params: {
				limit: limit, // limite risultati
				offset: offset // offset per paginazione
			}
		});

		const works = _.get(response, 'data.works', []);
    const workCount = _.get(response, 'data.work_count', 0);

		// 3. estrazione array di libri con Lodash
		const books = works.map(book => ({
			key: _.get(book, 'key', ''),
			title: _.get(book, 'title', 'No title available'),
			authors: _.get(book, 'authors', []).map(author =>
					_.get(author, 'name', 'Unknown')
			),
			coverId: _.get(book, 'cover_id', null),
			firstPublishYear: _.get(book, 'first_publish_year', null),
    }));

		// 4. mappatura dati in formato semplice
		return {
            books: books,
            totalCount: workCount,
            hasMore: (offset + limit) < workCount
        };
	} catch (error) {

		// 5. gestione errori
		console.error('Error fetching books by subject:', error);
		if (error.response) {
			// errore risposta del server
			throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
		} else if (error.request) {
			// nessuna risposta ricevuta
			throw new Error('Network Error: No response received from API');
		} else {
			// altro errore
			throw new Error(`Error: ${error.message}`);
		}
	}
}

/**
 * Ottiene i dettagli di un libro specifico
 * @param {string} key - chiave del libro (es: '/works/OL45804W')
 * @returns {Promise<Object>} - dettagli
 */
export async function getBookDetails(key) {
	try {
		// 1. costruzione url
		const url = `${BASE_URL}${key}.json`;

		// 2. chiamata GET con Axios
		const response = await axios.get(url);

		// 3. estrazione descrizione libro tramite Lodash
		// (può essere stringa o oggetto)
		let description = _.get(response, 'data.description', null);

		// 4. se descrizione non esiste, uso messaggio di default
		if (!description) {
			description = 'No description available.';
		}

		// 6. restuzione dati formattati
		return {
			title: _.get(response, 'data.title', 'No title available'),
			description: description,
			covers: _.get(response, 'data.covers', []),
			subjects: _.get(response, 'data.subjects', []),
			firstPublishDate: _.get(response, 'data.first_publish_date', 'N/A'),
			numberOfPages: _.get(response, 'data.number_of_pages', 'N/A'),
		};
	} catch (error) {
		// 7. gestione errori
		console.error('Error fetching book details:', error);
		if (error.response) {
			// errore risposta del server
			throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
		} else if (error.request) {
			// nessuna risposta ricevuta
			throw new Error('Network Error: No response received from API');
		} else {
			// altro errore
			throw new Error(`Error: ${error.message}`);
		}
	}
}

/**
 * Genera URL immagine copertina
 * @param {number} coverId - id copertina
 * @param {string} size - dimensione ('S', 'M', 'L')
 * @returns {string} - url immagine
 */
export function getCoverImageUrl(coverId, size = 'M') {
	if (!coverId) {
		return 'https://via.placeholder.com/200x300?text=No+Cover';
	}
	return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}