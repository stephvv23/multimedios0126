/**
 * Vista del módulo de Sedes
 */

export const generarVistaSedes = (sedes = []) => {
  const tablasContenido = generarTablaSedes(sedes);
  
  return `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-geo-alt"></i> Administración de Sedes
          </h2>
          <p class="text-muted">Gestiona las sedes y ubicaciones de tus hoteles</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nueva-sede" data-bs-toggle="modal" data-bs-target="#modalSede">
            <i class="bi bi-plus-circle"></i> Nueva Sede
          </button>
        </div>
      </div>

      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-sede" placeholder="Buscar por nombre o ubicación...">
        </div>
      </div>

      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Sedes</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-sedes">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaSedes = (sedes) => {
  if (!sedes || sedes.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay sedes registradas.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Sede</th>
            <th class="text-center">Ubicación</th>
            <th class="text-center">Teléfono</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${sedes.map(sede => `
            <tr>
              <td><strong>${sede.nombre || 'Sin nombre'}</strong></td>
              <td class="text-center">${sede.ubicacion || 'N/A'}</td>
              <td class="text-center">${sede.telefono || 'N/A'}</td>
              <td class="text-center"><span class="badge ${sede.activo ? 'bg-success' : 'bg-danger'}">${sede.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarSede(${sede.id || sede.idSede})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarSede(${sede.id || sede.idSede})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

export const generarFormularioSede = (sede = null) => {
  const esEdicion = sede && sede.id;

  return `
    <div class="modal fade" id="modalSede" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${esEdicion ? 'Editar Sede' : 'Nueva Sede'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formSede">
              <div class="mb-3">
                <label for="nombre-sede" class="form-label">Nombre *</label>
                <input type="text" class="form-control bg-secondary text-light border-secondary" id="nombre-sede" name="nombre" value="${sede?.nombre || ''}" required>
              </div>
              <div class="mb-3">
                <label for="ubicacion-sede" class="form-label">Ubicación *</label>
                <input type="text" class="form-control bg-secondary text-light border-secondary" id="ubicacion-sede" name="ubicacion" value="${sede?.ubicacion || ''}" required>
              </div>
              <div class="mb-3">
                <label for="telefono-sede" class="form-label">Teléfono</label>
                <input type="tel" class="form-control bg-secondary text-light border-secondary" id="telefono-sede" name="telefono" value="${sede?.telefono || ''}">
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="activo-sede" name="activo" ${sede?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo-sede">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-sede">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
