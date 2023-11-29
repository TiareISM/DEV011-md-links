const mdLinks = require('../src/index.js');


describe('mdLinks', () => {
  it('Deberia devolver una promesa', () => {
    const resultado = mdLinks('README.md');
    expect(resultado).toBeInstanceOf(Promise);
  });

});
