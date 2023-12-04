const mdLinks = require ('./index');
const filePath = process.argv[2];

// Verifica si se proporciona la opción --validate
const validateOptionIndex = process.argv.indexOf('--validate');
const validate = validateOptionIndex !== -1;

mdLinks(filePath, { validate })
.then(results => console.table(results))
.catch(error => console.error('Error:', error.message));