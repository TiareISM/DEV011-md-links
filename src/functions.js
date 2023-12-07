const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');

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

// Función para validar los links
const validateLinks = (links) => {
  const validation = links.map(link => {
    return axios.get(link.href)
    .then(response => {
      return {
        ...link,
        status: response.status,
        statusText: response.status >= 200 && response.status < 400 ? 'Ok' : 'Fail',  
      };
    })
    .catch(error => {
      return {
        ...link,
        status: error.response ? error.response.status : 0,
        statusText: 'Fail',
      };
    });
});
return Promise.all(validation);
};

// Función para obtener estadísticas
const getStats = (links) => {
  const totalLinks = links.length;
  const uniqueLinks = new Set(links.map(link=> link.href)).size;
  return { total: totalLinks, unique: uniqueLinks };
}


module.exports = {
  isAbsolutePath,
  toAbsolutePath,
  pathExistence,
  isValidExtension,
  readDocument,
  findLinks,
  validateLinks,
  getStats,
};