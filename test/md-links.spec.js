const mdLinks = require('../src/index.js');
describe('mdLinks', () => {
  it('Deberia devolver una promesa', () => {
    const resultado = mdLinks('./test/archivoDePrueba.md');
    expect(resultado).toBeInstanceOf(Promise);
  });
});

it('Debería devolver un array de objetos', () => {
  return mdLinks('./test/archivoDePrueba.md')
  .then((result) => {
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('text'); 
    });
  });
});

it('Debería regresar un array de objetos con enlaces con validación', () => {
  return mdLinks('./test/archivoDePrueba.md', { validate: true })
  .then((result) => {
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('text');
      expect(link).toHaveProperty('status');
      expect(link).toHaveProperty('statusText');
    });
  });
});

it('Debería entregar estadísticas si es proporcionado stats', () => {
  return mdLinks('./test/archivoDePrueba.md', { stats:true })
  .then((result) => {
    expect(result).toHaveProperty('links');
    expect(result).toHaveProperty('stats');
  });
});

