// API Constants
export const API_BASE_URL = 'https://openlibrary.org';

// DOM Selectors
export const SELECTORS = {
  searchForm: 'search-form',
  searchInput: 'search-bar',
  searchButton: 'search-button',
  genreMenu: 'genre-menu',
  resultsContainer: 'search-result',
  bookModal: 'book-modal',
  hamburgerBtn: 'hamburger-btn'
};

// Messages
export const MESSAGES = {
  loading: 'Loading books...',
  noResults: 'No books found',
  error: 'An error occurred. Please try again.',
  emptyInput: 'Please enter a search term',
  minLength: 'Search term must be at least 2 characters'
};

// Config
export const CONFIG = {
  minSearchLength: 2,
  errorDuration: 5000,
  resultsLimit: 20
};