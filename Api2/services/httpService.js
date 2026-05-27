/**
 * Servicio HTTP genérico para consumir la API REST
 * Maneja solicitudes GET, POST, PUT, DELETE con validación y errores
 */

import { API_BASE_URL, API_CONFIG, HTTP_STATUS, MESSAGES } from '../config/apiConfig.js';

/**
 * Realiza una solicitud HTTP a la API
 * @param {string} endpoint - Ruta del endpoint
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} data - Datos a enviar en el body (opcional)
 * @param {Object} options - Opciones adicionales (headers, etc)
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchAPI = async (
  endpoint,
  method = 'GET',
  data = null,
  options = {}
) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const fetchOptions = {
      method,
      headers,
      timeout: API_CONFIG.timeout,
      ...options
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    // Validar código de estado HTTP
    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        message: obtenerMensajeError(response.status)
      };
    }

    // Intentar parsear JSON
    const responseData = await response.json().catch(() => ({}));

    return {
      success: true,
      status: response.status,
      data: responseData,
      message: MESSAGES.success
    };

  } catch (error) {
    console.error('[HTTP Error]', error);
    
    return {
      success: false,
      status: error.status || 0,
      error: error.message || MESSAGES.errorConexion,
      message: error.message || MESSAGES.errorConexion
    };
  }
};

/**
 * Realiza una solicitud GET
 * @param {string} endpoint - Ruta del endpoint
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchGET = (endpoint) => {
  return fetchAPI(endpoint, 'GET');
};

/**
 * Realiza una solicitud POST
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} data - Datos a enviar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchPOST = (endpoint, data) => {
  return fetchAPI(endpoint, 'POST', data);
};

/**
 * Realiza una solicitud PUT
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchPUT = (endpoint, data) => {
  return fetchAPI(endpoint, 'PUT', data);
};

/**
 * Realiza una solicitud DELETE
 * @param {string} endpoint - Ruta del endpoint
 * @returns {Promise<Object>} Respuesta de la API
 */
export const fetchDELETE = (endpoint) => {
  return fetchAPI(endpoint, 'DELETE');
};

/**
 * Obtiene el mensaje de error correspondiente al código de estado HTTP
 * @param {number} status - Código de estado HTTP
 * @returns {string} Mensaje de error
 */
const obtenerMensajeError = (status) => {
  const mensajes = {
    400: 'Solicitud inválida',
    401: 'No autorizado',
    403: 'Acceso prohibido',
    404: 'Recurso no encontrado',
    409: 'Conflicto en la solicitud',
    500: 'Error interno del servidor',
    503: 'Servicio no disponible'
  };
  
  return mensajes[status] || MESSAGES.errorConexion;
};

/**
 * Valida que la respuesta sea exitosa
 * @param {Object} response - Respuesta de fetchAPI
 * @returns {boolean}
 */
export const esRespuestaExitosa = (response) => {
  return response && response.success === true;
};

/**
 * Extrae datos de la respuesta de forma segura
 * @param {Object} response - Respuesta de fetchAPI
 * @returns {Object|Array} Datos extraídos o array vacío
 */
export const extraerDatos = (response) => {
  if (!response || !response.success) {
    return Array.isArray(response?.data) ? [] : {};
  }
  return response.data || (Array.isArray(response.data) ? [] : {});
};
