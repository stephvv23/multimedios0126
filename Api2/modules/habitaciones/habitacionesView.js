/**
 * Vista del módulo de Habitaciones
 */

export const generarVistaHabitaciones = (habitaciones = []) => {
  const tablasContenido = generarTablaHabitaciones(habitaciones);
  
  return `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-door-closed"></i> Administración de Habitaciones
          </h2>
          <p class="text-muted">Gestiona el inventario de habitaciones disponibles</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nueva-habitacion" data-bs-toggle="modal" data-bs-target="#modalHabitacion">
            <i class="bi bi-plus-circle"></i> Nueva Habitación
          </button>
        </div>
      </div>

      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-habitacion" placeholder="Buscar por número o tipo...">
        </div>
      </div>

      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Habitaciones</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-habitaciones">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaHabitaciones = (habitaciones) => {
  if (!habitaciones || habitaciones.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay habitaciones registradas.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Número</th>
            <th class="text-center">Tipo</th>
            <th class="text-center">Precio/Noche</th>
            <th class="text-center">Capacidad</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${habitaciones.map(hab => `
            <tr>
              <td class="text-center"><strong>${hab.numero || 'N/A'}</strong></td>
              <td class="text-center">${hab.tipo || 'N/A'}</td>
              <td class="text-center">${formatearMoneda(hab.precioPorNoche)}</td>
              <td class="text-center">${hab.capacidad || 1} pax</td>
              <td class="text-center"><span class="badge ${hab.activo ? 'bg-success' : 'bg-danger'}">${hab.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarHabitacion(${hab.id || hab.idHabitacion})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarHabitacion(${hab.id || hab.idHabitacion})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const formatearMoneda = (valor) => {
  if (!valor) return '₡0';
  return '₡' + parseFloat(valor).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const generarFormularioHabitacion = (habitacion = null) => {
  const esEdicion = habitacion && habitacion.id;

  return `
    <div class="modal fade" id="modalHabitacion" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${esEdicion ? 'Editar Habitación' : 'Nueva Habitación'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formHabitacion">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="numero" class="form-label">Número *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="numero" name="numero" value="${habitacion?.numero || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="tipo" class="form-label">Tipo *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="tipo" name="tipo" required>
                    <option value="">Selecciona tipo</option>
                    <option value="Sencilla" ${habitacion?.tipo === 'Sencilla' ? 'selected' : ''}>Sencilla</option>
                    <option value="Doble" ${habitacion?.tipo === 'Doble' ? 'selected' : ''}>Doble</option>
                    <option value="Suite" ${habitacion?.tipo === 'Suite' ? 'selected' : ''}>Suite</option>
                    <option value="Presidencial" ${habitacion?.tipo === 'Presidencial' ? 'selected' : ''}>Presidencial</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="precioPorNoche" class="form-label">Precio/Noche *</label>
                  <input type="number" class="form-control bg-secondary text-light border-secondary" id="precioPorNoche" name="precioPorNoche" value="${habitacion?.precioPorNoche || ''}" required step="0.01">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="capacidad" class="form-label">Capacidad *</label>
                  <input type="number" class="form-control bg-secondary text-light border-secondary" id="capacidad" name="capacidad" value="${habitacion?.capacidad || '2'}" required min="1">
                </div>
              </div>
              <div class="mb-3">
                <label for="descripcion-hab" class="form-label">Descripción</label>
                <textarea class="form-control bg-secondary text-light border-secondary" id="descripcion-hab" name="descripcion" rows="2">${habitacion?.descripcion || ''}</textarea>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="activo-hab" name="activo" ${habitacion?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo-hab">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-habitacion">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
