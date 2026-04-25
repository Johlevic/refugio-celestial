// generar_versiculos.js
// Este script te ayuda a expandir el JSON a 5,000+ versículos

const fs = require('fs');

// Estructura base de libros con capítulos reflexivos
const BOOK_STRUCTURE = {
  'Salmos': {
    chapters: 150,
    reflectiveChapters: Array.from({length: 150}, (_, i) => i + 1),
    versesPerChapter: {min: 1, max: 10} // Solo primeros 10 versículos más reflexivos
  },
  'Proverbios': {
    chapters: 31,
    reflectiveChapters: Array.from({length: 31}, (_, i) => i + 1),
    versesPerChapter: {min: 1, max: 5}
  },
  'Eclesiastés': {
    chapters: 12,
    reflectiveChapters: [1,2,3,4,5,7,9,11,12],
    versesPerChapter: {min: 1, max: 3}
  },
  'Isaías': {
    chapters: 66,
    reflectiveChapters: [1,6,9,11,12,25,26,30,35,40,41,42,43,44,49,51,53,54,55,57,58,60,61,65,66],
    versesPerChapter: {min: 1, max: 3}
  },
  'Jeremías': {
    chapters: 52,
    reflectiveChapters: [1,7,9,17,18,23,29,31,32,33,39],
    versesPerChapter: {min: 1, max: 2}
  },
  'Mateo': {
    chapters: 28,
    reflectiveChapters: Array.from({length: 28}, (_, i) => i + 1),
    versesPerChapter: {min: 1, max: 5}
  },
  // ... continúa con más libros
};

// Función para generar IDs únicos
let idCounter = 1;

function generateVerseTemplate(book, chapter, verse) {
  return {
    id: idCounter++,
    book: book,
    chapter: chapter,
    verse: verse,
    text: "", // Requiere ser llenado manualmente o mediante API
    ref: `${book} ${chapter}:${verse}`,
    categories: []
  };
}

// Generar todos los IDs de versículos potenciales
function generateAllVerseReferences() {
  const allVerses = [];
  
  for (const [book, structure] of Object.entries(BOOK_STRUCTURE)) {
    structure.reflectiveChapters.forEach(chapter => {
      const maxVerse = structure.versesPerChapter.max;
      for (let verse = 1; verse <= maxVerse; verse++) {
        allVerses.push(generateVerseTemplate(book, chapter, verse));
      }
    });
  }
  
  return allVerses;
}

const verseTemplates = generateAllVerseReferences();
console.log(`Total de versículos para completar: ${verseTemplates.length}`);

// Guardar plantilla
fs.writeFileSync(
  'verses_template.json', 
  JSON.stringify({ templates: verseTemplates, total: verseTemplates.length }, null, 2)
);

console.log('Plantilla generada. Completa los textos manualmente o mediante API.');