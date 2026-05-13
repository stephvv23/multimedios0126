class BibliotecaDAO {
  //BD, API, json, csv, xml, txt, xml, memoria

  constructor() {
    this.arregloBiblioteca = [];
  }

  consultar() {
    return this.arregloBiblioteca;
  }

  consultraID(id) {
    return this.arregloBiblioteca.find((p) => p.id === id);
  }

  insertar(Biblioteca) {
    this.arregloBiblioteca.push(Biblioteca);
  }

  actualizar(id, nuevaBiblioteca) {
    let elementoBiblioteca = this.consultraID(id);

    if (elementoBiblioteca) {
      elementoBiblioteca.nombre = nuevaBiblioteca.nombre;
      elementoBiblioteca.sede = nuevaBiblioteca.sede;
      elementoBiblioteca.numero = nuevaBiblioteca.numero;
    }

    //En el desarrollo moderno, se recomienda usar const por defecto,
    // let solo cuando sea necesario cambiar el valor y
    // evitar var por completo.
  }

  eliminar(id) {
    let elementoBiblioteca = this.consultaraID(id);
    if (elementoBiblioteca) {
      this.arregloBiblioteca = this.arregloBiblioteca.filter(
        (p) => p.id !== id,
      );
    }
  }
}

export default BibliotecaDAO;
