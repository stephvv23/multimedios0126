/**
 * Vista del módulo de Pagos
 */

export const generarVistaPagos = (pagos = []) => {
  const tablasContenido = generarTablaPagos(pagos);
  
  return `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-credit-card"></i> Administración de Pagos
          </h2>
          <p class="text-muted">Gestiona los pagos y transacciones de las reservaciones</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nuevo-pago" data-bs-toggle="modal" data-bs-target="#modalPago">
            <i class="bi bi-plus-circle"></i> Nuevo Pago
          </button>
        </div>
      </div>

      <!-- Dashboard de pagos -->
      <div class="row mb-4" id="dashboard-pagos">
        <div class="col-md-3">
          <div class="card bg-dark border-secondary text-center">
            <div class="card-body">
              <h6 class="text-muted">Total Pagos</h6>
              <h3 class="text-success" id="total-pagos">₡0</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-dark border-secondary text-center">
            <div class="card-body">
              <h6 class="text-muted">Pagados</h6>
              <h3 class="text-info" id="pagos-completados">0</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-dark border-secondary text-center">
            <div class="card-body">
              <h6 class="text-muted">Pendientes</h6>
              <h3 class="text-warning" id="pagos-pendientes">0</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-dark border-secondary text-center">
            <div class="card-body">
              <h6 class="text-muted">Cancelados</h6>
              <h3 class="text-danger" id="pagos-cancelados">0</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-pago" placeholder="Buscar por método o estado...">
            </div>
            <div class="col-md-4">
              <select class="form-control bg-secondary text-light border-secondary" id="filtro-pago-estado">
                <option value="">Todos los estados</option>
                <option value="Completado">Completado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Pagos</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-pagos">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaPagos = (pagos) => {
  if (!pagos || pagos.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay pagos registrados.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Reservación</th>
            <th class="text-center">Monto</th>
            <th class="text-center">Método</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${pagos.map(pago => `
            <tr>
              <td class="text-center"><strong>${pago.reservacion || 'N/A'}</strong></td>
              <td class="text-center">${formatearMoneda(pago.monto)}</td>
              <td class="text-center">${pago.metodo || 'N/A'}</td>
              <td class="text-center">${formatearFecha(pago.fecha)}</td>
              <td class="text-center"><span class="badge ${obtenerColorEstadoPago(pago.estado)}">${pago.estado || 'Pendiente'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarPago(${pago.id || pago.idPago})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarPago(${pago.id || pago.idPago})"><i class="bi bi-trash"></i></button>
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

const obtenerColorEstadoPago = (estado) => {
  const colores = {
    'Completado': 'bg-success',
    'Pendiente': 'bg-warning',
    'Cancelado': 'bg-danger'
  };
  return colores[estado] || 'bg-secondary';
};

export const generarFormularioPago = (pago = null) => {
  const esEdicion = pago && pago.id;

  return `
    <div class="modal fade" id="modalPago" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${esEdicion ? 'Editar Pago' : 'Nuevo Pago'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formPago">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="reservacion-pago" class="form-label">Reservación *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="reservacion-pago" name="idReservacion" required>
                    <option value="">Selecciona reservación</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="monto" class="form-label">Monto *</label>
                  <input type="number" class="form-control bg-secondary text-light border-secondary" id="monto" name="monto" value="${pago?.monto || ''}" required step="0.01" min="0">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="metodo-pago" class="form-label">Método de Pago *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="metodo-pago" name="metodo" required>
                    <option value="">Selecciona método</option>
                    <option value="Tarjeta Crédito" ${pago?.metodo === 'Tarjeta Crédito' ? 'selected' : ''}>Tarjeta Crédito</option>
                    <option value="Tarjeta Débito" ${pago?.metodo === 'Tarjeta Débito' ? 'selected' : ''}>Tarjeta Débito</option>
                    <option value="Transferencia" ${pago?.metodo === 'Transferencia' ? 'selected' : ''}>Transferencia</option>
                    <option value="Efectivo" ${pago?.metodo === 'Efectivo' ? 'selected' : ''}>Efectivo</option>
                    <option value="Cheque" ${pago?.metodo === 'Cheque' ? 'selected' : ''}>Cheque</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="estado-pago" class="form-label">Estado *</label>
                  <select class="form-control bg-secondary text-light border-secondary" id="estado-pago" name="estado" required>
                    <option value="Completado" ${pago?.estado === 'Completado' ? 'selected' : ''}>Completado</option>
                    <option value="Pendiente" ${pago?.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Cancelado" ${pago?.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label for="fecha-pago" class="form-label">Fecha del Pago *</label>
                <input type="date" class="form-control bg-secondary text-light border-secondary" id="fecha-pago" name="fecha" value="${pago?.fecha || ''}" required>
              </div>

              <div class="mb-3">
                <label for="referencia" class="form-label">Referencia/Comprobante</label>
                <input type="text" class="form-control bg-secondary text-light border-secondary" id="referencia" name="referencia" value="${pago?.referencia || ''}" placeholder="Ej: #12345 o Transacción XYZ">
              </div>

              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="activo-pago" name="activo" ${pago?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo-pago">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-pago">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
