/**
 * Servicio específico para la gestión de Sedes
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

export const obtenerSedes = async () => {
  return await obtenerListado(API_ENDPOINTS.sedes.listado);
};

export const obtenerSedePorId = async (idSede) => {
  const endpoint = API_ENDPOINTS.sedes.detalle.replace(':id', idSede);
  return await obtenerDetalles(endpoint);
};

export const crearSede = async (datosSede) => {
  if (!datosSede.nombre || !datosSede.ubicacion) {
    return { success: false, error: 'Nombre y ubicación son requeridos' };
  }
  return await crearRegistro(API_ENDPOINTS.sedes.crear, datosSede);
};

export const actualizarSede = async (idSede, datosSede) => {
  if (!datosSede.nombre || !datosSede.ubicacion) {
    return { success: false, error: 'Nombre y ubicación son requeridos' };
  }
  const endpoint = API_ENDPOINTS.sedes.actualizar.replace(':id', idSede);
  return await actualizarRegistro(endpoint, datosSede);
};

export const desactivarSede = async (idSede) => {
  const endpoint = API_ENDPOINTS.sedes.desactivar.replace(':id', idSede);
  return await desactivarRegistro(endpoint);
};

export const buscarSedes = (sedes, termino) => {
  if (!termino || termino.trim() === '') return sedes;
  const terminoLower = termino.toLowerCase();
  return sedes.filter(sede => 
    (sede.nombre && sede.nombre.toLowerCase().includes(terminoLower)) ||
    (sede.ubicacion && sede.ubicacion.toLowerCase().includes(terminoLower))
  );
};
