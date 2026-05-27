/**
 * Servicio específico para la gestión de Reservaciones
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

export const obtenerReservaciones = async () => {
  return await obtenerListado(API_ENDPOINTS.reservaciones.listado);
};

export const obtenerReservacionPorId = async (idReservacion) => {
  const endpoint = API_ENDPOINTS.reservaciones.detalle.replace(':id', idReservacion);
  return await obtenerDetalles(endpoint);
};

export const crearReservacion = async (datosReservacion) => {
  if (!datosReservacion.idCliente || !datosReservacion.idHabitacion || !datosReservacion.fechaLlegada) {
    return { success: false, error: 'Cliente, habitación y fecha son requeridos' };
  }
  return await crearRegistro(API_ENDPOINTS.reservaciones.crear, datosReservacion);
};

export const actualizarReservacion = async (idReservacion, datosReservacion) => {
  const endpoint = API_ENDPOINTS.reservaciones.actualizar.replace(':id', idReservacion);
  return await actualizarRegistro(endpoint, datosReservacion);
};

export const desactivarReservacion = async (idReservacion) => {
  const endpoint = API_ENDPOINTS.reservaciones.desactivar.replace(':id', idReservacion);
  return await desactivarRegistro(endpoint);
};

export const buscarReservaciones = (reservaciones, termino) => {
  if (!termino || termino.trim() === '') return reservaciones;
  const terminoLower = termino.toLowerCase();
  return reservaciones.filter(r => 
    (r.cliente && r.cliente.toLowerCase().includes(terminoLower)) ||
    (r.estado && r.estado.toLowerCase().includes(terminoLower))
  );
};
