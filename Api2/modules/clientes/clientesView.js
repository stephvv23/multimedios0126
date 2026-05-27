/**
 * Vista del módulo de Clientes
 */

export const generarVistaClientes = (clientes = []) => {
  const tablasContenido = generarTablaClientes(clientes);
  
  return `
    <div class="container-fluid py-4">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="text-light mb-0">
            <i class="bi bi-people"></i> Administración de Clientes
          </h2>
          <p class="text-muted">Gestiona la información de clientes hospedados</p>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary btn-lg" id="btn-nuevo-cliente" data-bs-toggle="modal" data-bs-target="#modalCliente">
            <i class="bi bi-plus-circle"></i> Nuevo Cliente
          </button>
        </div>
      </div>

      <div class="card bg-dark border-secondary mb-4 shadow-sm">
        <div class="card-body">
          <input type="text" class="form-control bg-secondary text-light border-secondary" id="buscar-cliente" placeholder="Buscar por nombre, email o cédula...">
        </div>
      </div>

      <div class="card bg-dark border-secondary shadow-sm">
        <div class="card-header border-secondary">
          <h5 class="text-light mb-0">Listado de Clientes</h5>
        </div>
        <div class="card-body p-0" id="contenedor-tabla-clientes">
          ${tablasContenido}
        </div>
      </div>
    </div>
  `;
};

const generarTablaClientes = (clientes) => {
  if (!clientes || clientes.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay clientes registrados.</div>`;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Nombre</th>
            <th class="text-center">Cédula</th>
            <th class="text-center">Email</th>
            <th class="text-center">Teléfono</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${clientes.map(cliente => `
            <tr>
              <td><strong>${cliente.nombre || 'Sin nombre'}</strong></td>
              <td class="text-center">${cliente.cedula || 'N/A'}</td>
              <td class="text-center">${cliente.email || 'N/A'}</td>
              <td class="text-center">${cliente.telefono || 'N/A'}</td>
              <td class="text-center"><span class="badge ${cliente.activo ? 'bg-success' : 'bg-danger'}">${cliente.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="window.editarCliente(${cliente.id || cliente.idCliente})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="window.desactivarCliente(${cliente.id || cliente.idCliente})"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

export const generarFormularioCliente = (cliente = null) => {
  const esEdicion = cliente && cliente.id;

  return `
    <div class="modal fade" id="modalCliente" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formCliente">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nombre-cliente" class="form-label">Nombre Completo *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="nombre-cliente" name="nombre" value="${cliente?.nombre || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="cedula-cliente" class="form-label">Cédula *</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="cedula-cliente" name="cedula" value="${cliente?.cedula || ''}" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="email-cliente" class="form-label">Email *</label>
                  <input type="email" class="form-control bg-secondary text-light border-secondary" id="email-cliente" name="email" value="${cliente?.email || ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="telefono-cliente" class="form-label">Teléfono</label>
                  <input type="tel" class="form-control bg-secondary text-light border-secondary" id="telefono-cliente" name="telefono" value="${cliente?.telefono || ''}">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nacionalidad" class="form-label">Nacionalidad</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="nacionalidad" name="nacionalidad" value="${cliente?.nacionalidad || ''}">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="direccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control bg-secondary text-light border-secondary" id="direccion" name="direccion" value="${cliente?.direccion || ''}">
                </div>
              </div>

              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="activo-cliente" name="activo" ${cliente?.activo !== false ? 'checked' : ''}>
                <label class="form-check-label" for="activo-cliente">Activo</label>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="btn-guardar-cliente">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
