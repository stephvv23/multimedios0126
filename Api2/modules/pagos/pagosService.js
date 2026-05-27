/**
 * Servicio específico para la gestión de Pagos
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

export const obtenerPagos = async () => {
  return await obtenerListado(API_ENDPOINTS.pagos.listado);
};

export const obtenerPagoPorId = async (idPago) => {
  const endpoint = API_ENDPOINTS.pagos.detalle.replace(':id', idPago);
  return await obtenerDetalles(endpoint);
};

export const crearPago = async (datosPago) => {
  if (!datosPago.idReservacion || !datosPago.monto) {
    return { success: false, error: 'Reservación y monto son requeridos' };
  }
  return await crearRegistro(API_ENDPOINTS.pagos.crear, datosPago);
};

export const actualizarPago = async (idPago, datosPago) => {
  const endpoint = API_ENDPOINTS.pagos.actualizar.replace(':id', idPago);
  return await actualizarRegistro(endpoint, datosPago);
};

export const desactivarPago = async (idPago) => {
  const endpoint = API_ENDPOINTS.pagos.desactivar.replace(':id', idPago);
  return await desactivarRegistro(endpoint);
};

export const buscarPagos = (pagos, termino) => {
  if (!termino || termino.trim() === '') return pagos;
  const terminoLower = termino.toLowerCase();
  return pagos.filter(p => 
    (p.metodo && p.metodo.toLowerCase().includes(terminoLower)) ||
    (p.estado && p.estado.toLowerCase().includes(terminoLower))
  );
};
