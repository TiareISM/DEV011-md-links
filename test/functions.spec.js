const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { isAbsolutePath, 
        toAbsolutePath, 
        pathExistence,
        isValidExtension,
        readDocument,
        findLinks,
        validateLinks } = require('../src/functions.js');
const mdLinks = require('../src/index.js');

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
                {
                    text: 'EjemploInvalido1',
                    href: 'https://www.ejemploenlaceinvalido.com',
                    file: './test/archivoDePrueba.md',
                    line: 4,  
                  },
                  {
                    text: 'EjemploInvalido2',
                    href: 'https://www.ejemploenlacetiempoexcedido.com',
                    file: './test/archivoDePrueba.md',
                    line: 5,   
                  },
                  {
                    text: 'EjemploInalido3',
                    href: 'https://www.ejemploenlaceredireccioncircular.com',
                    file: './test/archivoDePrueba.md',
                    line: 6,  
                  },


            ];
            expect(findLinks(fileContent, filePath)).toEqual(linkResult);
        })
    });
});

describe('validateLinks', () => {
    let mock;
    beforeEach (() => {
        mock = new MockAdapter(axios);
    });
    afterEach(() => {
        mock.restore();
    });
    it('Debería validar exitosamente', () =>{
        const links = [
            { href: 'https://nodejs.org/en', text: 'Node.js', file: 'C:\\Users\\tiare\\OneDrive\\Documentos\\Proyectos Laboratoria\\DEV011-md-links\\test\\archivoDePrueba.md', line: 1 },     
        ];
        mock.onHead(links.href).reply(200);

        return validateLinks(links).then(validateLinks => {
            expect(validateLinks).toEqual([
                {
                    href: 'https://nodejs.org/en',
                    text: 'Node.js',
                    file: 'C:\\Users\\tiare\\OneDrive\\Documentos\\Proyectos Laboratoria\\DEV011-md-links\\test\\archivoDePrueba.md',
                    line: 1,
                    status: 200,
                    statusText: 'Ok',
                  },
            ]);
        });
    });
})