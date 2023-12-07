const { isAbsolutePath, 
  toAbsolutePath, 
  pathExistence, 
  isValidExtension, 
  readDocument, 
  findLinks,
  validateLinks, 
  getStats, } = require('./functions');

      //-----Función principal-----//
const mdLinks = (files, options = { validate: false, stats: false }) => {
  return new Promise((resolve, reject)=> {
// Validar la ruta absoluta
const isDefaultPath = isAbsolutePath(files)    
// Convertir la ruta a absoluta
const absolutePath = isDefaultPath ? files : toAbsolutePath(files)
// Comprobar que la ruta existe en el computador
    pathExistence(absolutePath)
    .then(() => {
// Verificar la extensión del archivo
       if (!isValidExtension(absolutePath)) {
        throw new Error('La extensión del archivo no es válida para Markdown');
      }
// Leer el contenido del archivo
  return readDocument(absolutePath);
      })
// Encontrar y Extraer links
      .then(fileContent => {
        const links = findLinks(fileContent, absolutePath);
// Validar links
if (options.validate) {
  validateLinks(links)
  .then((validatedLinks) => {
// Obtener stats
   if (options.stats) {
    const statsResult = getStats(validatedLinks);
    resolve({ links: validatedLinks, stats: statsResult})
   } else {
    resolve(validatedLinks);
   }
  })
  .catch((error) => {
    console.error(error.message);
    reject(error);
  });
 } else{
  if (options.stats) {
    const statsResult = getStats(links);
    resolve({ links: links, stats: statsResult });
  } else {
    resolve(links);
  }
  
 }
})

});
};



module.exports = mdLinks;

