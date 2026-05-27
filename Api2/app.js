/**
 * Archivo principal de la aplicación SPA
 * Orquestra la carga de módulos, navegación y gestión del estado global
 */

// Importar controladores de módulos
import { inicializarHoteles } from './modules/hoteles/hotelesController.js';
import { inicializarSedes } from './modules/sedes/sedesController.js';
import { inicializarHabitaciones } from './modules/habitaciones/habitacionesController.js';
import { inicializarClientes } from './modules/clientes/clientesController.js';
import { inicializarReservaciones } from './modules/reservaciones/reservacionesController.js';
import { inicializarPagos } from './modules/pagos/pagosController.js';
import { mostrarAlerta } from './components/UIComponent.js';

/**
 * Estado global de la aplicación
 */
const estadoApp = {
  moduloActual: 'hoteles',
  cargado: false,
  controladores: {
    hoteles: inicializarHoteles,
    sedes: inicializarSedes,
    habitaciones: inicializarHabitaciones,
    clientes: inicializarClientes,
    reservaciones: inicializarReservaciones,
    pagos: inicializarPagos
  }
};

/**
 * Inicializa la aplicación al cargar
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('[APP] Inicializando aplicación...');
  
  // Verificar conectividad
  verificarConectividad();
  
  // Cargar módulo inicial (Hoteles)
  cambiarVista('hoteles');
  
  // Setup de eventos globales
  setupEventosGlobales();
});

/**
 * Cambia la vista a un módulo específico
 * @param {string} modulo - Nombre del módulo a mostrar
 */
window.cambiarVista = async (modulo) => {
  // Validar que el módulo exista
  if (!estadoApp.controladores[modulo]) {
    console.error(`[APP] Módulo no encontrado: ${modulo}`);
    mostrarAlerta(`Módulo no encontrado: ${modulo}`, 'danger');
    return;
  }

  try {
    // Actualizar estado actual
    estadoApp.moduloActual = modulo;

    // Ocultar todas las vistas
    const vistas = document.querySelectorAll('.modulo-vista');
    vistas.forEach(vista => {
      vista.classList.add('d-none');
    });

    // Mostrar la vista seleccionada
    const vistaActual = document.getElementById(`modulo-${modulo}`);
    if (vistaActual) {
      vistaActual.classList.remove('d-none');
    }

    // Actualizar navegación activa
    actualizarNavActiva(modulo);

    // Cargar datos del módulo
    console.log(`[APP] Cargando módulo: ${modulo}`);
    const controlador = estadoApp.controladores[modulo];
    await controlador();

  } catch (error) {
    console.error(`[APP] Error al cambiar vista a ${modulo}:`, error);
    mostrarAlerta(`Error al cargar el módulo ${modulo}`, 'danger');
  }
};

/**
 * Actualiza la navegación activa en el navbar
 * @param {string} modulo - Módulo seleccionado
 */
const actualizarNavActiva = (modulo) => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active');
  });

  // Encontrar el link del módulo actual y marcarlo como activo
  const enlaceActual = Array.from(links).find(link => {
    const nombre = link.textContent.toLowerCase();
    return nombre.includes(modulo);
  });

  if (enlaceActual) {
    enlaceActual.classList.add('active');
  }
};

/**
 * Verifica la conectividad con la API
 */
const verificarConectividad = async () => {
  try {
    console.log('[APP] Verificando conectividad...');
    
    // Intentar obtener datos de hoteles para verificar API
    const response = await fetch('https://paginas-web-cr.com/api/hoteles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn('[APP] API respondió con estado:', response.status);
      mostrarAlerta(
        'Advertencia: Posibles problemas de conectividad con la API',
        'warning',
        5000
      );
    } else {
      console.log('[APP] ✓ Conectividad verificada exitosamente');
    }
  } catch (error) {
    console.error('[APP] Error de conectividad:', error);
    mostrarAlerta(
      'Error: No se puede conectar con el servidor. Verifica tu conexión.',
      'danger',
      7000
    );
  }
};

/**
 * Setup de eventos globales de la aplicación
 */
const setupEventosGlobales = () => {
  // Detectar cambios de conectividad
  window.addEventListener('online', () => {
    console.log('[APP] Conexión restablecida');
    mostrarAlerta('Conexión restablecida', 'success', 3000);
  });

  window.addEventListener('offline', () => {
    console.log('[APP] Conexión perdida');
    mostrarAlerta('Conexión perdida', 'danger', 5000);
  });

  // Tecla ESC para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modalesAbiertos = document.querySelectorAll('.modal.show');
      modalesAbiertos.forEach(modal => {
        bootstrap.Modal.getInstance(modal)?.hide();
      });
    }
  });

  // Prevenir cambios accidentales
  window.addEventListener('beforeunload', (e) => {
    // Descomentar si hay cambios sin guardar detectados
    // e.preventDefault();
    // e.returnValue = '';
  });
};

/**
 * Utilidades globales
 */
window.app = {
  /**
   * Obtiene el módulo actual
   */
  getModuloActual: () => estadoApp.moduloActual,

  /**
   * Refresca el módulo actual
   */
  refrescarModulo: async () => {
    await cambiarVista(estadoApp.moduloActual);
  },

  /**
   * Obtiene el estado global de la app
   */
  getEstado: () => estadoApp
};

// Exportar para uso en módulos si es necesario
export { estadoApp };

// Log de inicialización
console.log('%c[Hotel Manager Pro]', 'color: #0d6efd; font-size: 16px; font-weight: bold');
console.log('%cSistema de Administración Hotelera v1.0', 'color: #6c757d; font-size: 12px');
console.log('%c✓ Aplicación cargada correctamente', 'color: #198754; font-size: 11px');
console.log('Módulos disponibles:', Object.keys(estadoApp.controladores));
