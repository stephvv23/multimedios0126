/**
 * Componentes UI reutilizables para modales, alertas, loaders y confirmaciones
 * Utiliza Bootstrap 5 para estilos y funcionalidad
 */

/**
 * Crea y muestra un modal Bootstrap genérico
 * @param {string} id - ID único del modal
 * @param {string} titulo - Título del modal
 * @param {string} contenido - HTML del contenido del modal
 * @param {Array} botones - Array de botones {label, class, onclick}
 * @returns {Element} Elemento del modal
 */
export const crearModal = (id, titulo, contenido, botones = []) => {
  const modalHTML = `
    <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="${id}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title" id="${id}Label">${titulo}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${contenido}
          </div>
          <div class="modal-footer border-secondary">
            ${botones.map(btn => `
              <button type="button" class="btn ${btn.class}" ${btn.onclick ? `onclick="${btn.onclick}"` : ''} ${btn.dataset ? Object.entries(btn.dataset).map(([k, v]) => `data-${k}="${v}"`).join(' ') : ''}>
                ${btn.label}
              </button>
            `).join('')}
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = modalHTML;
  document.body.appendChild(div.firstElementChild);
  
  return new bootstrap.Modal(document.getElementById(id));
};

/**
 * Muestra una alerta Bootstrap temporal
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta: success, danger, warning, info
 * @param {number} duracion - Duración en milisegundos (0 = permanente)
 */
export const mostrarAlerta = (mensaje, tipo = 'info', duracion = 5000) => {
  const alertId = 'alerta-' + Date.now();
  const alertHTML = `
    <div id="${alertId}" class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert" style="margin: 10px;">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  
  const alertContainer = document.getElementById('alertas-container') || crearContenedorAlertas();
  const div = document.createElement('div');
  div.innerHTML = alertHTML;
  alertContainer.appendChild(div.firstElementChild);
  
  if (duracion > 0) {
    setTimeout(() => {
      const alerta = document.getElementById(alertId);
      if (alerta) {
        alerta.remove();
      }
    }, duracion);
  }
};

/**
 * Crea el contenedor de alertas si no existe
 * @returns {Element} Contenedor de alertas
 */
const crearContenedorAlertas = () => {
  const container = document.createElement('div');
  container.id = 'alertas-container';
  container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
  document.body.appendChild(container);
  return container;
};

/**
 * Muestra un loader/spinner
 * @param {string} mensaje - Mensaje opcional a mostrar
 */
export const mostrarLoader = (mensaje = 'Cargando...') => {
  const loaderId = 'loader-' + Date.now();
  const loaderHTML = `
    <div id="${loaderId}" class="position-fixed top-50 start-50 translate-middle d-flex flex-column align-items-center" style="z-index: 9998; background: rgba(0,0,0,0.8); padding: 30px; border-radius: 10px; min-width: 200px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-light mt-3">${mensaje}</p>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = loaderHTML;
  document.body.appendChild(div.firstElementChild);
  
  return loaderId;
};

/**
 * Oculta un loader
 * @param {string} loaderId - ID del loader a ocultar
 */
export const ocultarLoader = (loaderId) => {
  const loader = document.getElementById(loaderId);
  if (loader) {
    loader.remove();
  }
};

/**
 * Muestra una confirmación modal
 * @param {string} mensaje - Mensaje de confirmación
 * @param {Function} onConfirm - Callback si se confirma
 * @param {Function} onCancel - Callback si se cancela
 */
export const mostrarConfirmacion = (mensaje, onConfirm, onCancel = null) => {
  const confirmId = 'modal-confirmacion-' + Date.now();
  
  const modalHTML = `
    <div class="modal fade" id="${confirmId}" tabindex="-1" role="dialog" aria-labelledby="confirmacionLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-warning">
          <div class="modal-header border-warning">
            <h5 class="modal-title" id="confirmacionLabel">
              <i class="bi bi-exclamation-triangle"></i> Confirmación
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${mensaje}
          </div>
          <div class="modal-footer border-warning">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="btn-confirmar-${confirmId}">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = modalHTML;
  document.body.appendChild(div.firstElementChild);
  
  const modal = new bootstrap.Modal(document.getElementById(confirmId));
  
  document.getElementById(`btn-confirmar-${confirmId}`).addEventListener('click', () => {
    modal.hide();
    if (onConfirm) onConfirm();
    setTimeout(() => document.getElementById(confirmId).remove(), 300);
  });
  
  document.getElementById(confirmId).addEventListener('hidden.bs.modal', () => {
    if (onCancel) onCancel();
  });
  
  modal.show();
};

/**
 * Crea una tabla Bootstrap responsive
 * @param {Array} columnas - Array de nombres de columnas
 * @param {Array} filas - Array de arrays con datos
 * @param {Array} acciones - Array de acciones {label, class, onclick}
 * @returns {string} HTML de la tabla
 */
export const crearTabla = (columnas, filas, acciones = []) => {
  const columnasHTML = columnas.map(col => `<th class="text-center">${col}</th>`).join('');
  
  const filasHTML = filas.map(fila => {
    const celdasHTML = fila.map((celda, idx) => {
      // Si está en la última columna (acciones), renderizar botones
      if (idx === fila.length - 1 && Array.isArray(celda)) {
        return `
          <td class="text-center">
            ${celda.map(btn => `
              <button class="btn btn-sm ${btn.class}" title="${btn.label}" onclick="${btn.onclick}">
                ${btn.icon ? `<i class="bi bi-${btn.icon}"></i>` : btn.label}
              </button>
            `).join('')}
          </td>
        `;
      }
      return `<td class="text-center">${celda || 'N/A'}</td>`;
    }).join('');
    
    return `<tr>${celdasHTML}</tr>`;
  }).join('');
  
  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary">
        <thead class="table-dark border-secondary">
          <tr>
            ${columnasHTML}
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${filasHTML || '<tr><td colspan="' + columnas.length + '" class="text-center text-muted">No hay datos disponibles</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Crea un formulario Bootstrap dentro de una estructura
 * @param {Array} campos - Array de campos {name, label, type, required, placeholder, options}
 * @param {Function} onSubmit - Callback al enviar el formulario
 * @returns {string} HTML del formulario
 */
export const crearFormulario = (campos, onSubmit) => {
  const camposHTML = campos.map(campo => {
    let inputHTML = '';
    
    switch(campo.type) {
      case 'select':
        inputHTML = `
          <select class="form-control bg-secondary text-light border-secondary" name="${campo.name}" ${campo.required ? 'required' : ''}>
            <option value="">Selecciona ${campo.label}</option>
            ${campo.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
        break;
      case 'textarea':
        inputHTML = `
          <textarea class="form-control bg-secondary text-light border-secondary" name="${campo.name}" placeholder="${campo.placeholder || ''}" ${campo.required ? 'required' : ''}></textarea>
        `;
        break;
      default:
        inputHTML = `
          <input type="${campo.type || 'text'}" class="form-control bg-secondary text-light border-secondary" name="${campo.name}" placeholder="${campo.placeholder || ''}" ${campo.required ? 'required' : ''}>
        `;
    }
    
    return `
      <div class="mb-3">
        <label for="${campo.name}" class="form-label text-light">${campo.label}</label>
        ${inputHTML}
      </div>
    `;
  }).join('');
  
  return `
    <form id="formulario-dinamico" onsubmit="return false;">
      ${camposHTML}
      <button type="submit" class="btn btn-primary w-100">Guardar</button>
    </form>
  `;
};

/**
 * Extrae datos de un formulario HTML
 * @param {HTMLFormElement} form - Elemento del formulario
 * @returns {Object} Datos del formulario
 */
export const extraerDatosFormulario = (form) => {
  const formData = new FormData(form);
  const datos = {};
  
  for (let [key, value] of formData.entries()) {
    datos[key] = value;
  }
  
  return datos;
};

/**
 * Limpia un formulario
 * @param {HTMLFormElement} form - Elemento del formulario
 */
export const limpiarFormulario = (form) => {
  if (form) {
    form.reset();
  }
};

/**
 * Emula navegación entre módulos (cambiar vista)
 * @param {string} modulo - Nombre del módulo
 * @param {Function} callback - Callback a ejecutar
 */
export const cambiarModulo = (modulo, callback) => {
  // Ocultar todas las vistas
  const vistas = document.querySelectorAll('.modulo-vista');
  vistas.forEach(vista => {
    vista.classList.add('d-none');
  });
  
  // Mostrar la vista del módulo
  const vista = document.getElementById(`modulo-${modulo}`);
  if (vista) {
    vista.classList.remove('d-none');
    if (callback) callback();
  }
};
