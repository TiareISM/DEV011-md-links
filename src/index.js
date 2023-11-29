const { isAbsolutePath, 
  toAbsolutePath, 
  pathExistence, 
  isValidExtension, 
  readDocument, 
  findLinks } = require('./functions');

      //-----Función principal-----//
const mdLinks = (files) => {
  return new Promise((resolve, reject)=> {
// Validar la ruta absoluta
const absoluteDefault = isAbsolutePath(files)    
// Convertir la ruta a absoluta
const absolutePath = absoluteDefault ? files : toAbsolutePath(files)
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
        console.log('Contenido del archivo:', fileContent);
        const links = findLinks(fileContent, absolutePath);
        console.log(links);
        resolve(links);
      })
      .catch(error => {
        console.error(error.message);
        reject (error);
      });
  
  
  }); 

};




module.exports = mdLinks;

