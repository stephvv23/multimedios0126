/**
 * PLANTILLA PARA CREAR UN NUEVO MÓDULO
 * 
 * Pasos para crear un nuevo módulo:
 * 1. Copiar esta plantilla a un nuevo archivo
 * 2. Reemplazar "Template" con el nombre del nuevo módulo
 * 3. Reemplazar "templates" con pluralizar del módulo
 * 4. Ajustar campos según necesidad
 * 5. Importar en app.js
 * 
 * EJEMPLO: Crear módulo "Proveedores"
 * - Carpeta: modules/proveedores/
 * - Archivos: proveedoresService.js, proveedoresView.js, proveedoresController.js
 */

// ============================================================================
// ARCHIVO 1: modules/templates/templatesService.js
// ============================================================================

/**
 * Servicio específico para la gestión de Templates
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
 * Obtiene el listado de todos los templates
 */
export const obtenerTemplates = async () => {
  return await obtenerListado(API_ENDPOINTS.templates.listado);
};

/**
 * Obtiene los detalles de un template específico
 */
export const obtenerTemplatePorId = async (idTemplate) => {
  const endpoint = API_ENDPOINTS.templates.detalle.replace(':id', idTemplate);
  return await obtenerDetalles(endpoint);
};

/**
 * Crea un nuevo template
 */
export const crearTemplate = async (datosTemplate) => {
  // Validar datos requeridos
  if (!datosTemplate.nombre) {
    return { success: false, error: 'Nombre es requerido' };
  }

  return await crearRegistro(API_ENDPOINTS.templates.crear, datosTemplate);
};

/**
 * Actualiza un template existente
 */
export const actualizarTemplate = async (idTemplate, datosTemplate) => {
  if (!datosTemplate.nombre) {
    return { success: false, error: 'Nombre es requerido' };
  }

  const endpoint = API_ENDPOINTS.templates.actualizar.replace(':id', idTemplate);
  return await actualizarRegistro(endpoint, datosTemplate);
};

/**
 * Desactiva un template
 */
export const desactivarTemplate = async (idTemplate) => {
  const endpoint = API_ENDPOINTS.templates.desactivar.replace(':id', idTemplate);
  return await desactivarRegistro(endpoint);
};

/**
 * Busca templates por término
 */
export const buscarTemplates = (templates, termino) => {
  if (!termino || termino.trim() === '') return templates;
  
  const terminoLower = termino.toLowerCase();
  return templates.filter(template => 
    (template.nombre && template.nombre.toLowerCase().includes(terminoLower)) ||
    (template.descripcion && template.descripcion.toLowerCase().includes(terminoLower))
  );
};

// ============================================================================
// ARCHIVO 2: modules/templates/templatesView.js
// ============================================================================

/**
 * Vista del módulo de Templates
 */

export const generarVistaTemplates = (templates = []) => {
  const tablasContenido = generarTablaTemplates(templates);
  
  return `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-file-earmark"></i> Gestión de Templates
          </h2>
          <p class="text-muted">Mantenimiento de templates</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nuevo-template" data-bs-toggle="modal" data-bs-target="#modalTemplate">
            <i class="bi bi-plus-circle"></i> Nuevo
          </button>
        </div>
      </div>

      <!-- Búsqueda -->
      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-template" placeholder="Buscar...">
        </div>
      </div>

      <!-- Tabla -->
      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-templates">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaTemplates = (templates) => {
  if (!templates || templates.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay registros.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Nombre</th>
            <th class="text-center">Descripción</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${templates.map(t => `
            <tr>
              <td><strong>${t.nombre || 'N/A'}</strong></td>
              <td class="text-center">${(t.descripcion || 'N/A').substring(0, 50)}</td>
              <td class="text-center"><span class="badge ${t.activo ? 'bg-success' : 'bg-danger'}">${t.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarTemplate(${t.id || t.idTemplate})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarTemplate(${t.id || t.idTemplate})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

export const generarFormularioTemplate = (template = null) => {
  return `
    <div class="modal fade" id="modalTemplate" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${template ? 'Editar' : 'Nuevo'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formTemplate">
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control bg-secondary text-light border-secondary" name="nombre" value="${template?.nombre || ''}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control bg-secondary text-light border-secondary" name="descripcion" rows="3">${template?.descripcion || ''}</textarea>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" name="activo" ${template?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-template">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ============================================================================
// ARCHIVO 3: modules/templates/templatesController.js
// ============================================================================

/**
 * Controlador específico para el módulo de Templates
 */

import { generarVistaTemplates, generarFormularioTemplate } from './templatesView.js';
import { obtenerTemplates, crearTemplate, actualizarTemplate, desactivarTemplate, buscarTemplates } from './templatesService.js';
import { extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoTemplates = {
  templates: [],
  templateEditando: null,
  termoBusqueda: ''
};

export const inicializarTemplates = async () => {
  const templates = await obtenerTemplates();
  estadoTemplates.templates = templates;

  const vistaTemplates = document.getElementById('modulo-templates');
  if (vistaTemplates) {
    vistaTemplates.innerHTML = generarVistaTemplates(templates);
    vistaTemplates.innerHTML += generarFormularioTemplate();
    asignarEventListenersTemplates();
  }
};

const asignarEventListenersTemplates = () => {
  document.getElementById('btn-guardar-template')?.addEventListener('click', guardarTemplate);
  document.getElementById('buscar-template')?.addEventListener('keyup', (e) => {
    estadoTemplates.termoBusqueda = e.target.value;
    filtrarYMostrarTemplates();
  });
};

const filtrarYMostrarTemplates = () => {
  const templatesFilt = buscarTemplates(estadoTemplates.templates, estadoTemplates.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-templates');
  if (contenedor) {
    contenedor.innerHTML = generarTablaTemplates(templatesFilt);
  }
};

const generarTablaTemplates = (templates) => {
  if (!templates || templates.length === 0) {
    return `<div class="alert alert-info m-3">No hay registros.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Nombre</th>
            <th class="text-center">Descripción</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${templates.map(t => `
            <tr>
              <td><strong>${t.nombre || 'N/A'}</strong></td>
              <td class="text-center">${(t.descripcion || 'N/A').substring(0, 50)}</td>
              <td class="text-center"><span class="badge ${t.activo ? 'bg-success' : 'bg-danger'}">${t.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarTemplate(${t.id || t.idTemplate})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarTemplate(${t.id || t.idTemplate})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const guardarTemplate = async () => {
  const formulario = document.getElementById('formTemplate');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    nombre: datosForm.nombre,
    descripcion: datosForm.descripcion || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoTemplates.templateEditando) {
    resultado = await actualizarTemplate(estadoTemplates.templateEditando.id || estadoTemplates.templateEditando.idTemplate, datos);
  } else {
    resultado = await crearTemplate(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalTemplate')).hide();
    await inicializarTemplates();
  }
};

window.editarTemplate = async (idTemplate) => {
  const template = estadoTemplates.templates.find(t => (t.id || t.idTemplate) === idTemplate);
  if (template) {
    estadoTemplates.templateEditando = template;
    // Llenar formulario
    document.querySelector('input[name="nombre"]').value = template.nombre;
    document.querySelector('textarea[name="descripcion"]').value = template.descripcion || '';
    document.querySelector('input[name="activo"]').checked = template.activo !== false;
    new bootstrap.Modal(document.getElementById('modalTemplate')).show();
  }
};

window.desactivarTemplate = async (idTemplate) => {
  const resultado = await desactivarTemplate(idTemplate);
  if (resultado.success) {
    await inicializarTemplates();
  }
};

// ============================================================================
// PASO 4: AGREGAR EN config/apiConfig.js
// ============================================================================
/*
  En el objeto API_ENDPOINTS, agregar:
  
  templates: {
    listado: '/templates',
    detalle: '/templates/:id',
    crear: '/templates',
    actualizar: '/templates/:id',
    desactivar: '/templates/:id'
  },
*/

// ============================================================================
// PASO 5: AGREGAR EN app.js
// ============================================================================
/*
  import { inicializarTemplates } from './modules/templates/templatesController.js';
  
  estadoApp.controladores.templates = inicializarTemplates;
*/

// ============================================================================
// PASO 6: AGREGAR EN index.html
// ============================================================================
/*
  En el navbar:
  <li class="nav-item">
    <a class="nav-link" onclick="cambiarVista('templates')">
      <i class="bi bi-file-earmark"></i> Templates
    </a>
  </li>
  
  En el contenedor de módulos:
  <div id="modulo-templates" class="modulo-vista d-none"></div>
*/

export default {
  inicializarTemplates,
  obtenerTemplates,
  crearTemplate,
  actualizarTemplate,
  desactivarTemplate,
  buscarTemplates
};
