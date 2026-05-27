/**
 * Vista del módulo de Hoteles
 * Renderiza la interfaz para administrar hoteles
 */

/**
 * Genera el HTML de la vista de hoteles
 * @param {Array} hoteles - Listado de hoteles
 * @returns {string} HTML de la vista
 */
export const generarVistaHoteles = (hoteles = []) => {
  const tablasContenido = generarTablaHoteles(hoteles);
  
  return `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-building"></i> Administración de Hoteles
          </h2>
          <p class="text-muted">Gestiona la información y datos de los hoteles registrados</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nuevo-hotel" data-bs-toggle="modal" data-bs-target="#modalHotel">
            <i class="bi bi-plus-circle"></i> Nuevo Hotel
          </button>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-hotel" placeholder="Buscar por nombre, código o ubicación...">
            </div>
            <div class="col-md-4">
              <button class="btn btn-outline-primary w-100" id="filtrar-hoteles">
                <i class="bi bi-funnel"></i> Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de hoteles -->
      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Hoteles</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-hoteles">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

/**
 * Genera la tabla con el listado de hoteles
 * @param {Array} hoteles - Listado de hoteles
 * @returns {string} HTML de la tabla
 */
const generarTablaHoteles = (hoteles) => {
  if (!hoteles || hoteles.length === 0) {
    return `
      <div class="alert alert-info m-3">
        <i class="bi bi-info-circle"></i> No hay hoteles registrados. Crea uno nuevo.
      </div>
    `;
  }

  const filas = hoteles.map(hotel => [`
    <div>
      <strong>${hotel.nombre || 'Sin nombre'}</strong>
      <br>
      <small class="text-muted">${hotel.codigo || 'S/C'}</small>
    </div>
  `, 
    hotel.ubicacion || 'N/A',
    hotel.telefono || 'N/A',
    hotel.email || 'N/A',
    `<span class="badge ${hotel.activo ? 'bg-success' : 'bg-danger'}">${hotel.activo ? 'Activo' : 'Inactivo'}</span>`,
    [
      { label: 'Editar', class: 'btn-warning btn-sm', icon: 'pencil', onclick: `editarHotel(${hotel.id || hotel.idHotel})` },
      { label: 'Eliminar', class: 'btn-danger btn-sm', icon: 'trash', onclick: `desactivarHotel(${hotel.id || hotel.idHotel})` }
    ]
  ]);

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Hotel</th>
            <th class="text-center">Ubicación</th>
            <th class="text-center">Teléfono</th>
            <th class="text-center">Email</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${filas.map(fila => `
            <tr>
              <td>${fila[0]}</td>
              <td class="text-center">${fila[1]}</td>
              <td class="text-center">${fila[2]}</td>
              <td class="text-center">${fila[3]}</td>
              <td class="text-center">${fila[4]}</td>
              <td class="text-center">
                ${fila[5].map(btn => `
                  <button class="btn btn-sm ${btn.class}" title="${btn.label}" onclick="${btn.onclick}">
                    <i class="bi bi-${btn.icon}"></i>
                  </button>
                `).join('')}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Genera el formulario modal para crear/editar hoteles
 * @param {Object} hotel - Datos del hotel a editar (opcional)
 * @returns {string} HTML del formulario
 */
export const generarFormularioHotel = (hotel = null) => {
  const esEdicion = hotel && hotel.id;
  const titulo = esEdicion ? 'Editar Hotel' : 'Crear Nuevo Hotel';

  return `
    <div class="modal fade" id="modalHotel" tabindex="-1" role="dialog" aria-labelledby="modalHotelLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title" id="modalHotelLabel">${titulo}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="formHotel">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nombre" class="form-label">Nombre del Hotel *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="nombre" name="nombre" placeholder="Ej: Hotel San José" value="${hotel?.nombre || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="codigo" class="form-label">Código *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="codigo" name="codigo" placeholder="Ej: HSJ001" value="${hotel?.codigo || ''}" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="ubicacion" class="form-label">Ubicación *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="ubicacion" name="ubicacion" placeholder="Ej: San José, Centro" value="${hotel?.ubicacion || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="provincia" class="form-label">Provincia</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="provincia" name="provincia">
                    <option value="">Selecciona provincia</option>
                    <option value="San José" ${hotel?.provincia === 'San José' ? 'selected' : ''}>San José</option>
                    <option value="Alajuela" ${hotel?.provincia === 'Alajuela' ? 'selected' : ''}>Alajuela</option>
                    <option value="Cartago" ${hotel?.provincia === 'Cartago' ? 'selected' : ''}>Cartago</option>
                    <option value="Heredia" ${hotel?.provincia === 'Heredia' ? 'selected' : ''}>Heredia</option>
                    <option value="Guanacaste" ${hotel?.provincia === 'Guanacaste' ? 'selected' : ''}>Guanacaste</option>
                    <option value="Puntarenas" ${hotel?.provincia === 'Puntarenas' ? 'selected' : ''}>Puntarenas</option>
                    <option value="Limón" ${hotel?.provincia === 'Limón' ? 'selected' : ''}>Limón</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="telefono" class="form-label">Teléfono *</label>
                  <input type="tel" class="form-control bg-secondary text-light border-secondary" id="telefono" name="telefono" placeholder="Ej: +506 2345 6789" value="${hotel?.telefono || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input type="email" class="form-control bg-secondary text-light border-secondary" id="email" name="email" placeholder="Ej: contacto@hotel.com" value="${hotel?.email || ''}" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea class="form-control bg-secondary text-light border-secondary" id="descripcion" name="descripcion" rows="3" placeholder="Describe el hotel...">${hotel?.descripcion || ''}</textarea>
              </div>

              <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="activo" name="activo" ${hotel?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-hotel">Guardar Hotel</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
