# Owly Book Search

> Motore di ricerca libri

<a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge" alt="JavaScript"></a>
<a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank"><img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge" alt="HTML5"></a>
<a href="https://developer.mozilla.org/docs/Web/CSS" target="_blank"><img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge" alt="CSS3"></a>

Applicazione web per la ricerca, esplorazione e condivisione di libri tramite le API di Open Library.


## Funzionalità principali

- 🔍 Ricerca libri per titolo, autore o genere
- 📚 Navigazione per generi letterari
- 📄 Visualizzazione dettagli libro (copertina, descrizione, soggetti)
- 🔢 Paginazione intelligente dei risultati
- 🔗 Condivisione libro via link, social, WhatsApp, Web Share API
- 🖼️ Visualizzazione copertine ad alta risoluzione
- 🕶️ Modal accessibile per dettagli libro
- 📱 Interfaccia responsive e mobile-friendly

## Installazione

1. Clona il repository:
	```sh
	git clone https://github.com/saracairo/owly-book-search.git
	```
2. Installa le dipendenze:
	```sh
	cd owly-book-search
	npm install
	```
3. Avvia l'app in locale:
	```sh
	npm start
	```
	Oppure, per build di produzione:
	```sh
	npm run build
	```

## Struttura del progetto

```
owly-book-search/
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── index.js
│       ├── api/
│       │   └── open-library.js
│       ├── components/
│       │   ├── book-details.js
│       │   ├── book-list.js
│       │   ├── genre-menu.js
│       │   └── search-bar.js
│       └── utils/
│           ├── constants.js
│           ├── helpers.js
│           ├── pagination.js
│           ├── share.js
│           └── storage.js
├── package.json
├── webpack.config.js
└── README.md
```

## Tecnologie utilizzate

- JavaScript (ES6+)
- HTML5, CSS3 (custom design)
- Webpack
- Open Library API
- Font Awesome (icone)

## Come usare

1. Cerca un libro tramite la barra di ricerca o seleziona un genere dal menu
2. Sfoglia i risultati con la paginazione
3. Clicca su un libro per vedere i dettagli
4. Condividi il libro tramite i bottoni social o copia il link
5. Apri un link condiviso per vedere direttamente il libro

## Crediti

Creato da [saracairo](https://github.com/saracairo) per scopo didattico.
API: [Open Library](https://openlibrary.org/developers/api)

---
Per suggerimenti o segnalazione bug, apri una issue su GitHub!