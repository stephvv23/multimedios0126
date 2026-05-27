/**
 * Funciones auxiliares y utilidades para toda la aplicación
 * Contiene helpers comunes para validación, formateo y conversión
 */

/**
 * Valida si una cadena es un email válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const esEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida si una cadena es un teléfono válido (básico)
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean}
 */
export const esTelefonoValido = (telefono) => {
  const regex = /^[0-9+\-\s()]{7,}$/;
  return regex.test(telefono);
};

/**
 * Valida si una cédula tiene un formato válido
 * @param {string} cedula - Cédula a validar
 * @returns {boolean}
 */
export const esCedulaValida = (cedula) => {
  // Acepta números y guiones
  const regex = /^[0-9]{1,2}-?[0-9]{4}-?[0-9]{4}$/;
  return regex.test(cedula.replace(/\s/g, ''));
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} texto - Texto a capitalizar
 * @returns {string}
 */
export const capitalizarPrimera = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Capitaliza todas las palabras
 * @param {string} texto - Texto a capitalizar
 * @returns {string}
 */
export const capitalizarPalabras = (texto) => {
  if (!texto) return '';
  return texto.split(' ').map(palabra => capitalizarPrimera(palabra)).join(' ');
};

/**
 * Formatea un número como moneda
 * @param {number} cantidad - Cantidad a formatear
 * @param {string} moneda - Código de moneda (ej: CRC, USD)
 * @returns {string}
 */
export const formatoMoneda = (cantidad, moneda = 'CRC') => {
  if (!cantidad) return '₡0.00';
  
  const formatadores = {
    CRC: (n) => '₡' + n.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    USD: (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    EUR: (n) => '€' + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  };

  const formatador = formatadores[moneda] || formatadores.CRC;
  return formatador(parseFloat(cantidad));
};

/**
 * Formatea una fecha a formato local
 * @param {string|Date} fecha - Fecha a formatear
 * @param {string} formato - Formato deseado: 'corto', 'largo', 'completo'
 * @returns {string}
 */
export const formatoFecha = (fecha, formato = 'corto') => {
  if (!fecha) return 'N/A';
  
  const date = new Date(fecha);
  
  const formatos = {
    corto: (d) => d.toLocaleDateString('es-CR'),
    largo: (d) => d.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    completo: (d) => d.toLocaleString('es-CR')
  };

  return (formatos[formato] || formatos.corto)(date);
};

/**
 * Calcula la diferencia entre dos fechas en días
 * @param {string|Date} fecha1 - Primera fecha
 * @param {string|Date} fecha2 - Segunda fecha
 * @returns {number}
 */
export const calcularDias = (fecha1, fecha2) => {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  const diferencia = Math.abs(d2 - d1);
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene la edad en años a partir de una fecha de nacimiento
 * @param {string|Date} fechaNacimiento - Fecha de nacimiento
 * @returns {number}
 */
export const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
};

/**
 * Trunca una cadena a una longitud máxima
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @param {string} sufijo - Sufijo a agregar (por defecto '...')
 * @returns {string}
 */
export const truncarTexto = (texto, longitud = 50, sufijo = '...') => {
  if (!texto || texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + sufijo;
};

/**
 * Genera un ID único
 * @returns {string}
 */
export const generarIdUnico = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Genera un código aleatorio
 * @param {number} longitud - Longitud del código
 * @returns {string}
 */
export const generarCodigo = (longitud = 8) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  return codigo;
};

/**
 * Valida si un valor no está vacío
 * @param {*} valor - Valor a validar
 * @returns {boolean}
 */
export const noEstaVacio = (valor) => {
  if (valor === null || valor === undefined) return false;
  if (typeof valor === 'string') return valor.trim() !== '';
  if (Array.isArray(valor)) return valor.length > 0;
  if (typeof valor === 'object') return Object.keys(valor).length > 0;
  return !!valor;
};

/**
 * Convierte un objeto a parámetros de consulta URL
 * @param {Object} obj - Objeto a convertir
 * @returns {string}
 */
export const objetoAQueryString = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

/**
 * Convierte parámetros de consulta a objeto
 * @param {string} queryString - Query string
 * @returns {Object}
 */
export const queryStringAObjeto = (queryString) => {
  const params = new URLSearchParams(queryString);
  const objeto = {};
  
  for (let [key, value] of params) {
    objeto[key] = value;
  }
  
  return objeto;
};

/**
 * Clona profundamente un objeto
 * @param {Object} obj - Objeto a clonar
 * @returns {Object}
 */
export const clonarProfundo = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Mezcla múltiples objetos
 * @param {...Object} objetos - Objetos a mezclar
 * @returns {Object}
 */
export const mezclarObjetos = (...objetos) => {
  return Object.assign({}, ...objetos);
};

/**
 * Ordena un array de objetos por un campo
 * @param {Array} array - Array a ordenar
 * @param {string} campo - Campo por el que ordenar
 * @param {string} direccion - 'asc' o 'desc'
 * @returns {Array}
 */
export const ordenarPor = (array, campo, direccion = 'asc') => {
  return [...array].sort((a, b) => {
    const valorA = a[campo];
    const valorB = b[campo];
    
    if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra un array por múltiples criterios
 * @param {Array} array - Array a filtrar
 * @param {Object} criterios - Objeto con criterios de filtro
 * @returns {Array}
 */
export const filtrarPor = (array, criterios) => {
  return array.filter(item => {
    return Object.entries(criterios).every(([key, value]) => {
      return item[key] == value;
    });
  });
};

/**
 * Agrupa elementos de un array por un campo
 * @param {Array} array - Array a agrupar
 * @param {string} campo - Campo por el que agrupar
 * @returns {Object}
 */
export const agruparPor = (array, campo) => {
  return array.reduce((grupos, item) => {
    const clave = item[campo];
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(item);
    return grupos;
  }, {});
};

/**
 * Obtiene valores únicos de un array
 * @param {Array} array - Array
 * @param {string} campo - Campo (opcional, si es array de objetos)
 * @returns {Array}
 */
export const obtenerUnicos = (array, campo = null) => {
  if (campo) {
    return [...new Set(array.map(item => item[campo]))];
  }
  return [...new Set(array)];
};

/**
 * Suma los valores de un campo en un array
 * @param {Array} array - Array de objetos
 * @param {string} campo - Campo a sumar
 * @returns {number}
 */
export const sumarCampo = (array, campo) => {
  return array.reduce((total, item) => total + (parseFloat(item[campo]) || 0), 0);
};

/**
 * Obtiene el promedio de un campo
 * @param {Array} array - Array de objetos
 * @param {string} campo - Campo a promediar
 * @returns {number}
 */
export const promedioCampo = (array, campo) => {
  if (!array.length) return 0;
  return sumarCampo(array, campo) / array.length;
};

/**
 * Convierte segundos a formato HH:MM:SS
 * @param {number} segundos - Segundos
 * @returns {string}
 */
export const formatoTiempo = (segundos) => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;
  
  return [horas, minutos, secs]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
};

/**
 * Comprueba si un valor está entre un rango
 * @param {number} valor - Valor a verificar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean}
 */
export const estaEnRango = (valor, min, max) => {
  return valor >= min && valor <= max;
};

/**
 * Genera un objeto de paginación
 * @param {Array} array - Array a paginar
 * @param {number} pagina - Número de página (1-indexed)
 * @param {number} porPagina - Registros por página
 * @returns {Object}
 */
export const paginar = (array, pagina = 1, porPagina = 10) => {
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  
  return {
    datos: array.slice(inicio, fin),
    pagina,
    porPagina,
    total: array.length,
    totalPaginas: Math.ceil(array.length / porPagina),
    tieneSiguiente: pagina < Math.ceil(array.length / porPagina),
    tieneAnterior: pagina > 1
  };
};

/**
 * Descarga datos como archivo JSON
 * @param {Object} datos - Datos a descargar
 * @param {string} nombre - Nombre del archivo
 */
export const descargarJSON = (datos, nombre = 'datos.json') => {
  const json = JSON.stringify(datos, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombre;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Copia texto al portapapeles
 * @param {string} texto - Texto a copiar
 */
export const copiarAlPortapapeles = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (error) {
    console.error('Error al copiar:', error);
    return false;
  }
};

/**
 * Espera un tiempo determinado (promesa)
 * @param {number} ms - Milisegundos
 * @returns {Promise}
 */
export const esperar = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
