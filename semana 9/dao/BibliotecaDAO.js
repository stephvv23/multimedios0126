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
    this.arregloBiblioteca.push(nuevaBiblioteca);

    let elementoBibliotec = this.consultaraID(id);

    if (elementoBibliotec) {
      elementoBibliotec.nombre = nuevaBiblioteca.nombre;
      elementoBibliotec.sede = nuevaBiblioteca.sede;
      elementoBibliotec.numero = nuevaBiblioteca.numero;
    }

    //En el desarrollo moderno, se recomienda usar const por defecto,
    // let solo cuando sea necesario cambiar el valor y
    // evitar var por completo.
  }

  eliminar(id) {
    let elementoBibliotec = this.consultaraID(id);
    if (elementoBibliotec) {
      this.arregloBiblioteca = this.arregloBiblioteca.filter(
        (p) => p.id !== id,
      );
    }
  }
}
