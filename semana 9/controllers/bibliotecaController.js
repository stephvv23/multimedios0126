import Biblioteca from '../models/biblioteca.js';
import BibliotecaDAO from '../dao/BibliotecaDAO.js';

const dao = new BibliotecaDAO();

// Crear objetos Biblioteca
const biblioteca1 = new Biblioteca('Biblioteca Central', 'Sede Principal', 150);
const biblioteca2 = new Biblioteca('Biblioteca Sucursal', 'Sede Sur', 85);
const biblioteca3 = new Biblioteca('Biblioteca Digital', 'Sede Virtual', 500);

// Insertar en el DAO
dao.insertar(biblioteca1);
dao.insertar(biblioteca2);
dao.insertar(biblioteca3);

// Imprimir bibliotecas
console.log('=== Bibliotecas registradas ===');
const bibliotecas = dao.consultar();
bibliotecas.forEach((bib, index) => {
  console.log(`${index + 1}. ${bib.nombre} - ${bib.sede} (Capacidad: ${bib.numero})`);
});

console.log('\n=== Objeto completo ===');
console.log(bibliotecas);

