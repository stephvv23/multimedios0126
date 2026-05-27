/**
 * Controlador específico para el módulo de Clientes
 */

import { generarVistaClientes, generarFormularioCliente } from './clientesView.js';
import { obtenerClientes, crearCliente, actualizarCliente, desactivarCliente, buscarClientes } from './clientesService.js';
import { extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoClientes = {
  clientes: [],
  clienteEditando: null,
  termoBusqueda: ''
};

export const inicializarClientes = async () => {
  const clientes = await obtenerClientes();
  estadoClientes.clientes = clientes;

  const vistaClientes = document.getElementById('modulo-clientes');
  if (vistaClientes) {
    vistaClientes.innerHTML = generarVistaClientes(clientes);
    vistaClientes.innerHTML += generarFormularioCliente();
    asignarEventListenersClientes();
  }
};

const asignarEventListenersClientes = () => {
  document.getElementById('btn-guardar-cliente')?.addEventListener('click', guardarCliente);
  document.getElementById('buscar-cliente')?.addEventListener('keyup', (e) => {
    estadoClientes.termoBusqueda = e.target.value;
    filtrarYMostrarClientes();
  });
};

const filtrarYMostrarClientes = () => {
  const clientesFiltrados = buscarClientes(estadoClientes.clientes, estadoClientes.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-clientes');
  if (contenedor) {
    contenedor.innerHTML = generarTablaClientes(clientesFiltrados);
  }
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

const guardarCliente = async () => {
  const formulario = document.getElementById('formCliente');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    nombre: datosForm.nombre,
    cedula: datosForm.cedula,
    email: datosForm.email,
    telefono: datosForm.telefono || null,
    nacionalidad: datosForm.nacionalidad || null,
    direccion: datosForm.direccion || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoClientes.clienteEditando) {
    resultado = await actualizarCliente(estadoClientes.clienteEditando.id || estadoClientes.clienteEditando.idCliente, datos);
  } else {
    resultado = await crearCliente(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
    await inicializarClientes();
  }
};

window.editarCliente = async (idCliente) => {
  const cliente = estadoClientes.clientes.find(c => (c.id || c.idCliente) === idCliente);
  if (cliente) {
    estadoClientes.clienteEditando = cliente;
    document.getElementById('nombre-cliente').value = cliente.nombre;
    document.getElementById('cedula-cliente').value = cliente.cedula;
    document.getElementById('email-cliente').value = cliente.email;
    document.getElementById('telefono-cliente').value = cliente.telefono || '';
    document.getElementById('nacionalidad').value = cliente.nacionalidad || '';
    document.getElementById('direccion').value = cliente.direccion || '';
    document.getElementById('activo-cliente').checked = cliente.activo !== false;
    new bootstrap.Modal(document.getElementById('modalCliente')).show();
  }
};

window.desactivarCliente = async (idCliente) => {
  const resultado = await desactivarCliente(idCliente);
  if (resultado.success) {
    await inicializarClientes();
  }
};
