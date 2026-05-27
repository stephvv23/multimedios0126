/**
 * Controlador genérico para operaciones CRUD
 * Se reutiliza para todos los módulos (Hoteles, Sedes, Habitaciones, etc)
 */

import { fetchGET, fetchPOST, fetchPUT, fetchDELETE } from '../services/httpService.js';
import { mostrarAlerta, mostrarLoader, ocultarLoader, mostrarConfirmacion } from '../components/UIComponent.js';

/**
 * Obtiene el listado de registros de un módulo
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise<Array>} Listado de registros
 */
export const obtenerListado = async (endpoint) => {
  const loaderId = mostrarLoader('Cargando datos...');
  
  try {
    const response = await fetchGET(endpoint);
    
    if (response.success) {
      ocultarLoader(loaderId);
      return response.data || [];
    } else {
      ocultarLoader(loaderId);
      mostrarAlerta(response.error || 'Error al cargar los datos', 'danger');
      return [];
    }
  } catch (error) {
    ocultarLoader(loaderId);
    mostrarAlerta('Error de conexión', 'danger');
    console.error(error);
    return [];
  }
};

/**
 * Obtiene un registro específico por ID
 * @param {string} endpoint - Endpoint de la API (ej: /hoteles/1)
 * @returns {Promise<Object>} Datos del registro
 */
export const obtenerDetalles = async (endpoint) => {
  try {
    const response = await fetchGET(endpoint);
    
    if (response.success) {
      return response.data || {};
    } else {
      mostrarAlerta('Error al cargar los detalles', 'danger');
      return {};
    }
  } catch (error) {
    mostrarAlerta('Error de conexión', 'danger');
    console.error(error);
    return {};
  }
};

/**
 * Crea un nuevo registro
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} datos - Datos del nuevo registro
 * @returns {Promise<Object>} Respuesta de la API
 */
export const crearRegistro = async (endpoint, datos) => {
  const loaderId = mostrarLoader('Guardando...');
  
  try {
    const response = await fetchPOST(endpoint, datos);
    ocultarLoader(loaderId);
    
    if (response.success) {
      mostrarAlerta('Registro creado exitosamente', 'success');
      return { success: true, data: response.data };
    } else {
      mostrarAlerta(response.error || 'Error al crear el registro', 'danger');
      return { success: false };
    }
  } catch (error) {
    ocultarLoader(loaderId);
    mostrarAlerta('Error de conexión', 'danger');
    console.error(error);
    return { success: false };
  }
};

/**
 * Actualiza un registro existente
 * @param {string} endpoint - Endpoint de la API (ej: /hoteles/1)
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const actualizarRegistro = async (endpoint, datos) => {
  const loaderId = mostrarLoader('Actualizando...');
  
  try {
    const response = await fetchPUT(endpoint, datos);
    ocultarLoader(loaderId);
    
    if (response.success) {
      mostrarAlerta('Registro actualizado exitosamente', 'success');
      return { success: true, data: response.data };
    } else {
      mostrarAlerta(response.error || 'Error al actualizar el registro', 'danger');
      return { success: false };
    }
  } catch (error) {
    ocultarLoader(loaderId);
    mostrarAlerta('Error de conexión', 'danger');
    console.error(error);
    return { success: false };
  }
};

/**
 * Desactiva o elimina un registro
 * @param {string} endpoint - Endpoint de la API (ej: /hoteles/1)
 * @returns {Promise<Object>} Respuesta de la API
 */
export const desactivarRegistro = async (endpoint) => {
  return new Promise((resolve) => {
    mostrarConfirmacion(
      '¿Está seguro de que desea desactivar este registro?',
      async () => {
        const loaderId = mostrarLoader('Desactivando...');
        
        try {
          const response = await fetchDELETE(endpoint);
          ocultarLoader(loaderId);
          
          if (response.success) {
            mostrarAlerta('Registro desactivado exitosamente', 'success');
            resolve({ success: true });
          } else {
            mostrarAlerta(response.error || 'Error al desactivar el registro', 'danger');
            resolve({ success: false });
          }
        } catch (error) {
          ocultarLoader(loaderId);
          mostrarAlerta('Error de conexión', 'danger');
          console.error(error);
          resolve({ success: false });
        }
      },
      () => {
        resolve({ cancelled: true });
      }
    );
  });
};

/**
 * Valida un objeto de datos según reglas básicas
 * @param {Object} datos - Datos a validar
 * @param {Array} campos - Array de campos requeridos
 * @returns {Object} {válido: boolean, errores: Array}
 */
export const validarDatos = (datos, campos) => {
  const errores = [];
  
  campos.forEach(campo => {
    if (!datos[campo.name] || datos[campo.name].trim() === '') {
      errores.push(`${campo.label} es requerido`);
    }
  });
  
  if (errores.length > 0) {
    mostrarAlerta(errores.join('<br>'), 'warning');
  }
  
  return {
    válido: errores.length === 0,
    errores
  };
};

/**
 * Formatea un valor según su tipo
 * @param {*} valor - Valor a formatear
 * @param {string} tipo - Tipo de dato (texto, número, fecha, moneda)
 * @returns {string} Valor formateado
 */
export const formatearValor = (valor, tipo = 'texto') => {
  if (!valor) return 'N/A';
  
  switch(tipo) {
    case 'fecha':
      return new Date(valor).toLocaleDateString('es-ES');
    case 'moneda':
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC'
      }).format(valor);
    case 'porcentaje':
      return `${valor}%`;
    default:
      return valor.toString();
  }
};

/**
 * Busca registros en un array
 * @param {Array} registros - Array de registros
 * @param {string} termino - Término de búsqueda
 * @param {Array} campos - Campos en los que buscar
 * @returns {Array} Registros filtrados
 */
export const buscarRegistros = (registros, termino, campos) => {
  if (!termino || termino.trim() === '') {
    return registros;
  }
  
  const terminoLower = termino.toLowerCase();
  
  return registros.filter(registro => 
    campos.some(campo => {
      const valor = registro[campo];
      return valor && valor.toString().toLowerCase().includes(terminoLower);
    })
  );
};

/**
 * Ordena un array de registros por un campo
 * @param {Array} registros - Array de registros
 * @param {string} campo - Campo por el que ordenar
 * @param {string} direccion - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export const ordenarRegistros = (registros, campo, direccion = 'asc') => {
  return [...registros].sort((a, b) => {
    const valorA = a[campo];
    const valorB = b[campo];
    
    if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
    return 0;
  });
};
