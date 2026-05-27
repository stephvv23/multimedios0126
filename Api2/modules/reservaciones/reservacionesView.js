/**
 * Vista del módulo de Reservaciones
 */

export const generarVistaReservaciones = (reservaciones = []) => {
  const tablasContenido = generarTablaReservaciones(reservaciones);
  
  return `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-calendar-check"></i> Administración de Reservaciones
          </h2>
          <p class="text-muted">Gestiona las reservas de habitaciones</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nueva-reservacion" data-bs-toggle="modal" data-bs-target="#modalReservacion">
            <i class="bi bi-plus-circle"></i> Nueva Reservación
          </button>
        </div>
      </div>

      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-reservacion" placeholder="Buscar por cliente o estado...">
            </div>
            <div class="col-md-4">
              <select class="form-control bg-secondary text-light border-secondary" id="filtro-estado">
                <option value="">Todos los estados</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Reservaciones</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-reservaciones">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaReservaciones = (reservaciones) => {
  if (!reservaciones || reservaciones.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay reservaciones registradas.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Cliente</th>
            <th class="text-center">Habitación</th>
            <th class="text-center">Llegada</th>
            <th class="text-center">Salida</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Total</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${reservaciones.map(res => `
            <tr>
              <td><strong>${res.cliente || 'N/A'}</strong></td>
              <td class="text-center">${res.habitacion || 'N/A'}</td>
              <td class="text-center">${formatearFecha(res.fechaLlegada)}</td>
              <td class="text-center">${formatearFecha(res.fechaSalida)}</td>
              <td class="text-center"><span class="badge ${obtenerColorEstado(res.estado)}">${res.estado || 'Pendiente'}</span></td>
              <td class="text-center">${formatearMoneda(res.total)}</td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarReservacion(${res.id || res.idReservacion})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarReservacion(${res.id || res.idReservacion})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-CR');
};

const formatearMoneda = (valor) => {
  if (!valor) return '₡0';
  return '₡' + parseFloat(valor).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const obtenerColorEstado = (estado) => {
  const colores = {
    'Confirmada': 'bg-success',
    'Cancelada': 'bg-danger',
    'Completada': 'bg-info',
    'Pendiente': 'bg-warning'
  };
  return colores[estado] || 'bg-secondary';
};

export const generarFormularioReservacion = (reservacion = null) => {
  const esEdicion = reservacion && reservacion.id;

  return `
    <div class="modal fade" id="modalReservacion" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${esEdicion ? 'Editar Reservación' : 'Nueva Reservación'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formReservacion">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="cliente-res" class="form-label">Cliente *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="cliente-res" name="idCliente" required>
                    <option value="">Selecciona cliente</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="habitacion-res" class="form-label">Habitación *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="habitacion-res" name="idHabitacion" required>
                    <option value="">Selecciona habitación</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="fechaLlegada" class="form-label">Fecha de Llegada *</label>
                  <input type="date" class="form-control bg-secondary text-light border-secondary" id="fechaLlegada" name="fechaLlegada" value="${reservacion?.fechaLlegada || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="fechaSalida" class="form-label">Fecha de Salida *</label>
                  <input type="date" class="form-control bg-secondary text-light border-secondary" id="fechaSalida" name="fechaSalida" value="${reservacion?.fechaSalida || ''}" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="noches" class="form-label">Noches</label>
                  <input type="number" class="form-control bg-secondary text-light border-secondary" id="noches" name="noches" value="${reservacion?.noches || '1'}" min="1" readonly>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="estado-res" class="form-label">Estado *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="estado-res" name="estado" required>
                    <option value="Confirmada" ${reservacion?.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
                    <option value="Cancelada" ${reservacion?.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                    <option value="Completada" ${reservacion?.estado === 'Completada' ? 'selected' : ''}>Completada</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label for="observaciones" class="form-label">Observaciones</label>
                <textarea class="form-control bg-secondary text-light border-secondary" id="observaciones" name="observaciones" rows="2">${reservacion?.observaciones || ''}</textarea>
              </div>

              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="activo-res" name="activo" ${reservacion?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo-res">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-reservacion">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
