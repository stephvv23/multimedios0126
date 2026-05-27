/**
 * Servicio específico para la gestión de Hoteles
 * Realiza operaciones CRUD de hoteles mediante la API REST
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

/**
 * Obtiene el listado de todos los hoteles
 * @returns {Promise<Array>} Listado de hoteles
 */
export const obtenerHoteles = async () => {
  return await obtenerListado(API_ENDPOINTS.hoteles.listado);
};

/**
 * Obtiene los detalles de un hotel específico
 * @param {number} idHotel - ID del hotel
 * @returns {Promise<Object>} Datos del hotel
 */
export const obtenerHotelPorId = async (idHotel) => {
  const endpoint = API_ENDPOINTS.hoteles.detalle.replace(':id', idHotel);
  return await obtenerDetalles(endpoint);
};

/**
 * Crea un nuevo hotel
 * @param {Object} datosHotel - Datos del hotel a crear
 * @returns {Promise<Object>} Respuesta con los datos creados
 */
export const crearHotel = async (datosHotel) => {
  // Validar datos requeridos
  if (!datosHotel.nombre || !datosHotel.codigo || !datosHotel.ubicacion) {
    return { success: false, error: 'Nombre, código y ubicación son requeridos' };
  }

  return await crearRegistro(API_ENDPOINTS.hoteles.crear, datosHotel);
};

/**
 * Actualiza un hotel existente
 * @param {number} idHotel - ID del hotel
 * @param {Object} datosHotel - Datos a actualizar
 * @returns {Promise<Object>} Respuesta de la actualización
 */
export const actualizarHotel = async (idHotel, datosHotel) => {
  if (!datosHotel.nombre || !datosHotel.codigo || !datosHotel.ubicacion) {
    return { success: false, error: 'Nombre, código y ubicación son requeridos' };
  }

  const endpoint = API_ENDPOINTS.hoteles.actualizar.replace(':id', idHotel);
  return await actualizarRegistro(endpoint, datosHotel);
};

/**
 * Desactiva un hotel
 * @param {number} idHotel - ID del hotel
 * @returns {Promise<Object>} Respuesta de la desactivación
 */
export const desactivarHotel = async (idHotel) => {
  const endpoint = API_ENDPOINTS.hoteles.desactivar.replace(':id', idHotel);
  return await desactivarRegistro(endpoint);
};

/**
 * Busca hoteles por término de búsqueda
 * @param {Array} hoteles - Listado de hoteles
 * @param {string} termino - Término de búsqueda
 * @returns {Array} Hoteles filtrados
 */
export const buscarHoteles = (hoteles, termino) => {
  if (!termino || termino.trim() === '') {
    return hoteles;
  }

  const terminoLower = termino.toLowerCase();
  return hoteles.filter(hotel => 
    (hotel.nombre && hotel.nombre.toLowerCase().includes(terminoLower)) ||
    (hotel.codigo && hotel.codigo.toLowerCase().includes(terminoLower)) ||
    (hotel.ubicacion && hotel.ubicacion.toLowerCase().includes(terminoLower)) ||
    (hotel.email && hotel.email.toLowerCase().includes(terminoLower))
  );
};

/**
 * Ordena hoteles por un campo específico
 * @param {Array} hoteles - Listado de hoteles
 * @param {string} campo - Campo por el que ordenar
 * @param {string} direccion - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export const ordenarHoteles = (hoteles, campo = 'nombre', direccion = 'asc') => {
  return [...hoteles].sort((a, b) => {
    const valorA = a[campo] || '';
    const valorB = b[campo] || '';
    
    if (valorA.toString().toLowerCase() < valorB.toString().toLowerCase()) {
      return direccion === 'asc' ? -1 : 1;
    }
    if (valorA.toString().toLowerCase() > valorB.toString().toLowerCase()) {
      return direccion === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
