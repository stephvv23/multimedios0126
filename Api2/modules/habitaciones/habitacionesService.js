/**
 * Servicio específico para la gestión de Habitaciones
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

export const obtenerHabitaciones = async () => {
  return await obtenerListado(API_ENDPOINTS.habitaciones.listado);
};

export const obtenerHabitacionPorId = async (idHabitacion) => {
  const endpoint = API_ENDPOINTS.habitaciones.detalle.replace(':id', idHabitacion);
  return await obtenerDetalles(endpoint);
};

export const crearHabitacion = async (datosHabitacion) => {
  if (!datosHabitacion.numero || !datosHabitacion.tipo) {
    return { success: false, error: 'Número de habitación y tipo son requeridos' };
  }
  return await crearRegistro(API_ENDPOINTS.habitaciones.crear, datosHabitacion);
};

export const actualizarHabitacion = async (idHabitacion, datosHabitacion) => {
  if (!datosHabitacion.numero || !datosHabitacion.tipo) {
    return { success: false, error: 'Número de habitación y tipo son requeridos' };
  }
  const endpoint = API_ENDPOINTS.habitaciones.actualizar.replace(':id', idHabitacion);
  return await actualizarRegistro(endpoint, datosHabitacion);
};

export const desactivarHabitacion = async (idHabitacion) => {
  const endpoint = API_ENDPOINTS.habitaciones.desactivar.replace(':id', idHabitacion);
  return await desactivarRegistro(endpoint);
};

export const buscarHabitaciones = (habitaciones, termino) => {
  if (!termino || termino.trim() === '') return habitaciones;
  const terminoLower = termino.toLowerCase();
  return habitaciones.filter(h => 
    (h.numero && h.numero.toString().toLowerCase().includes(terminoLower)) ||
    (h.tipo && h.tipo.toLowerCase().includes(terminoLower))
  );
};
