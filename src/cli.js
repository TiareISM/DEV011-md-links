const mdLinks = require ('./index');
const yargs = require ('yargs');
const path = process.argv[2];
const options = yargs
.option('validate', {
    alias: 'v',
    describe: 'Validar si los enlaces responden con OK o Fail.',
    type: 'boolean',
  })
  .option('stats', {
    alias: 's',
    describe: 'Mostrar estadísticas de los enlaces.',
    type: 'boolean',
  })
  .argv;


mdLinks(path, options)
 .then(results => {
  if (options.validate && options.stats) {
    const brokenLinks = results.links.filter(link => link.status === 0);
    const bothResults = {
      Stats: results.stats || 'No hay estadísticas',
      Broken: brokenLinks.length || 0
    };
    console.table({bothResults});  
  } else if (options.validate) {
    console.table(results);  
  } else if (options.stats) {
    console.table([{ Stats: results.stats }]);
  } else {
    console.table(results);
  } 

  })
.catch(error => console.error('Error:', error.message));