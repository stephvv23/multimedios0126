/**
 * Configuración centralizada de la API REST
 * Define la URL base y constantes de la aplicación
 */

/**
 * URL base de la API REST para hotelería
 * @type {string}
 */
export const API_BASE_URL = 'https://paginas-web-cr.com/api';

/**
 * Configuración de timeouts y reintentos
 * @type {Object}
 */
export const API_CONFIG = {
  timeout: 10000, // Tiempo de espera en milisegundos
  retries: 3, // Número de reintentos en caso de fallo
  retryDelay: 1000 // Delay entre reintentos en milisegundos
};

/**
 * Endpoints disponibles en la API
 * @type {Object}
 */
export const API_ENDPOINTS = {
  // Hoteles
  hoteles: {
    listado: '/hoteles',
    detalle: '/hoteles/:id',
    crear: '/hoteles',
    actualizar: '/hoteles/:id',
    desactivar: '/hoteles/:id'
  },
  // Sedes
  sedes: {
    listado: '/sedes',
    detalle: '/sedes/:id',
    crear: '/sedes',
    actualizar: '/sedes/:id',
    desactivar: '/sedes/:id'
  },
  // Habitaciones
  habitaciones: {
    listado: '/habitaciones',
    detalle: '/habitaciones/:id',
    crear: '/habitaciones',
    actualizar: '/habitaciones/:id',
    desactivar: '/habitaciones/:id'
  },
  // Clientes
  clientes: {
    listado: '/clientes',
    detalle: '/clientes/:id',
    crear: '/clientes',
    actualizar: '/clientes/:id',
    desactivar: '/clientes/:id'
  },
  // Reservaciones
  reservaciones: {
    listado: '/reservaciones',
    detalle: '/reservaciones/:id',
    crear: '/reservaciones',
    actualizar: '/reservaciones/:id',
    desactivar: '/reservaciones/:id'
  },
  // Pagos
  pagos: {
    listado: '/pagos',
    detalle: '/pagos/:id',
    crear: '/pagos',
    actualizar: '/pagos/:id',
    desactivar: '/pagos/:id'
  }
};

/**
 * Mensajes estándar de la aplicación
 * @type {Object}
 */
export const MESSAGES = {
  success: 'Operación realizada exitosamente',
  error: 'Ha ocurrido un error',
  created: 'Registro creado exitosamente',
  updated: 'Registro actualizado exitosamente',
  deleted: 'Registro eliminado exitosamente',
  deactivated: 'Registro desactivado exitosamente',
  errorConexion: 'Error de conexión. Intenta nuevamente',
  cargando: 'Cargando...',
  confirmDelete: '¿Está seguro de que desea eliminar este registro?',
  confirmDeactivate: '¿Está seguro de que desea desactivar este registro?'
};

/**
 * Códigos de estado HTTP
 * @type {Object}
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};
