const mdLinks = require ('./index');
//const path = process.argv[2];


mdLinks('README.md')
.then(results => console.table(results))
.catch(error => console.error('Error:', error.message));