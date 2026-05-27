/**
 * Servicio específico para la gestión de Clientes
 */

import { API_ENDPOINTS } from '../../config/apiConfig.js';
import { 
  obtenerListado, 
  obtenerDetalles, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro 
} from '../../controllers/baseController.js';

export const obtenerClientes = async () => {
  return await obtenerListado(API_ENDPOINTS.clientes.listado);
};

export const obtenerClientePorId = async (idCliente) => {
  const endpoint = API_ENDPOINTS.clientes.detalle.replace(':id', idCliente);
  return await obtenerDetalles(endpoint);
};

export const crearCliente = async (datosCliente) => {
  if (!datosCliente.nombre || !datosCliente.email) {
    return { success: false, error: 'Nombre y email son requeridos' };
  }
  return await crearRegistro(API_ENDPOINTS.clientes.crear, datosCliente);
};

export const actualizarCliente = async (idCliente, datosCliente) => {
  if (!datosCliente.nombre || !datosCliente.email) {
    return { success: false, error: 'Nombre y email son requeridos' };
  }
  const endpoint = API_ENDPOINTS.clientes.actualizar.replace(':id', idCliente);
  return await actualizarRegistro(endpoint, datosCliente);
};

export const desactivarCliente = async (idCliente) => {
  const endpoint = API_ENDPOINTS.clientes.desactivar.replace(':id', idCliente);
  return await desactivarRegistro(endpoint);
};

export const buscarClientes = (clientes, termino) => {
  if (!termino || termino.trim() === '') return clientes;
  const terminoLower = termino.toLowerCase();
  return clientes.filter(c => 
    (c.nombre && c.nombre.toLowerCase().includes(terminoLower)) ||
    (c.email && c.email.toLowerCase().includes(terminoLower)) ||
    (c.cedula && c.cedula.toLowerCase().includes(terminoLower)) ||
    (c.telefono && c.telefono.toLowerCase().includes(terminoLower))
  );
};
