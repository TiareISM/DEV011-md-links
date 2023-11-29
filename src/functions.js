const path = require('path');
const fs = require('fs').promises;
//Obtener la ruta del archivo desde los argumentos de la línea de comandos
//const filePath = process.argv[2];

// Función para validar que la ruta es absoluta
const isAbsolutePath = (route) => path.isAbsolute(route);

// Función para convertir a ruta absoluta
const toAbsolutePath = (route) => {
  return path.isAbsolute(route) ? route : path.resolve(route);
};

// Función para comprobar la existencia de la ruta
const pathExistence = (path) => {
  console.log('Comprobando existencia', path);
  return fs.access(path)
  .catch(() => {
    throw new Error('La ruta no existe');
  });
};

// Función para validar la extensión del documento
const isValidExtension = (route) => {
  const validExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  const extension = path.extname(route.toLowerCase());
  return validExtensions.includes(extension);
};

// Función para leer el contenido del documento
const readDocument = (path) => {
  return fs.readFile(path,'utf8')
  .catch(error => {
    throw new Error('Error al leer el archivo', error);
  });
}

// Función para Encontrar y Extraer links
const findLinks = (fileContent, path) => {
  const lines = fileContent.split('\n');
  let links = [];
  for(let i = 0;i < lines.length; i++){
    const line = lines[i];
    const linkRegex = /\[([^\]]+)]\((https?:\/\/[^\s\)]+)\)/g;
    const linkMatches = line.matchAll(linkRegex);

    for(const match of linkMatches){
      const [, text, href] = match;
      const data = {
        text,
        href,
        file: path,
        line: i + 1,
      };
      links.push(data);
    }
  }
  return links
};

module.exports = {
  isAbsolutePath,
  toAbsolutePath,
  pathExistence,
  isValidExtension,
  readDocument,
  findLinks,
};