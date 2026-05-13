//class en un modelo, atributos, metodos

class Biblioteca {
  //Constructor

  constructor(nombre, sede, numero) {
    this.nombre = nombre;
    this.sede = sede;
    this.numero = numero;
  }

  get nombre() {
    return this._nombre;
  }
  get sede() {
    return this._sede;
  }
  get numero() {
    return this._numero;
  }

  set nombre(nombre) {
    this._nombre = nombre;
  }
  set sede(sede) {
    this._sede = sede;
  }
  set numero(numero) {
    this._numero = numero;
  }

}

export default Biblioteca;
