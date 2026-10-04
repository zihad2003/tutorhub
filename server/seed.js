const pool = require('./db');
const { TUTORS } = require('../src/data/tutors');
const { INITIAL_CATEGORIES } = require('../src/data/categoriesData');

// Note: Using a workaround to require ES modules in CommonJS by reading the file manually, 
// because src/data are ES modules. Actually, let's just write the insert queries directly.
