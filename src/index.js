const { isAbsolutePath, 
  toAbsolutePath, 
  pathExistence, 
  isValidExtension, 
  readDocument, 
  findLinks,
  validateLinks, } = require('./functions');

      //-----Función principal-----//
const mdLinks = (files, options = { validate: false }) => {
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
        .then(validateLinks => {
          resolve(validateLinks);
        })
        .catch(error => {
          console.error(error.message);
          reject(error);
        });
       } else{
        resolve(links);
       }
      })

  });
};




module.exports = mdLinks;

