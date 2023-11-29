const path = require('path');
const fs = require('fs').promises;
const { isAbsolutePath, 
        toAbsolutePath, 
        pathExistence,
        isValidExtension,
        readDocument,
        findLinks } = require('../src/functions.js');

describe('isAbsolutePath', ()=>{
    it('Debería retornar true para una ruta absoluta', () =>{
        const realAbsolutePath = 'C:/Users/tiare/OneDrive/Documentos/Proyectos Laboratoria/DEV011-md-links/docs/04-milestone.md'
        expect(isAbsolutePath(realAbsolutePath)).toBe(true);
    })
    it('Debería retornar false para una ruta no absoluta', () => {
        const relativePath = 'docs/04-milestone.md';
        expect(isAbsolutePath(relativePath)).toBe(false);
    });
})

describe('toAbsolutePath', () =>{
    it('Si la ruta es absoluta, retornar la ruta sin cambios',() =>{
        const absolutePath = 'C:/Users/tiare/OneDrive/Documentos/Proyectos Laboratoria/DEV011-md-links/docs/04-milestone.md';
        expect(toAbsolutePath(absolutePath)).toBe(absolutePath);
    })
    it('Si la ruta no es absoluta, resolver la ruta relativa y retornarla', () =>{
        const relativePath = 'docs/04-milestone.md';
        const expectedAbsolutePath = path.resolve(relativePath);
        expect(toAbsolutePath(relativePath)).toBe(expectedAbsolutePath);
    })
})

describe('pathExistence', () => {
    it('Debería pasar a una ruta existente', () => {
        const existingPath = './test/archivoDePrueba.md';
        return pathExistence(existingPath);
    });
    it('Debería mostar error para una ruta inexistente', () => {
        const nonExistentPath = './test/rutaInexistente.md';
        return pathExistence(nonExistentPath)
        .catch(error => {
            expect(error.message).toBe('La ruta no existe');
        });
    });
})

describe('isValidExtension',() => {
    it('isValidExtension retorna true si el archivo tiene la extensión .md', () => {
        const archivo = 'archivo.md';
        const resultado = isValidExtension(archivo);
        expect(resultado).toBe(true);
      });
      
    it('isValidExtension retorna false si el archivo no tiene la extensión .md', () => {
        const archivo = 'archivo.txt';
        const resultado = isValidExtension(archivo);
        expect(resultado).toBe(false);
      });
})

describe('readDocument', () => {
    const filePath = './test/archivoDePrueba.md';
    it('Debería leer el contendido del archivo', () => {
       return readDocument(filePath)
       .then(fileContent => {
        expect(typeof fileContent).toBe('string');
        expect(fileContent.length).toBeGreaterThan(0);
       });
    });
    it('Dbería mostrar error al intentar leer un archivo que no existe', () =>{
        const nonExistenFilePath = './test/archinoInexistente.md'
        return readDocument(nonExistenFilePath)
        .catch(error => {
            expect(error.message).toBe('Error al leer el archivo');
        });
    });
});

describe('findLinks', () => {
    it('Debería retornar un array de objetos con los enlaces encontrados', () =>{
        
        const filePath = './test/archivoDePrueba.md';
        return fs.readFile(filePath, 'utf-8')
        .then(fileContent => {
            const linkResult = [
                {
                    text: 'Node.js',
                    href: 'https://nodejs.org/en',
                    file: filePath,
                    line: 1,
                },
                {
                    text: 'Google',
                    href: 'https://www.google.com/',
                    file: filePath,
                    line: 2,
                },
                {
                    text: 'Wikipedia',
                    href: 'https://www.wikipedia.org/',
                    file: filePath,
                    line: 3,
                }, 
            ];
            expect(findLinks(fileContent, filePath)).toEqual(linkResult);
        })
    });
});



