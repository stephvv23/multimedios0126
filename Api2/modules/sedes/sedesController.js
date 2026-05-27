/**
 * Controlador específico para el módulo de Sedes
 */

import { generarVistaSedes, generarFormularioSede } from './sedesView.js';
import { obtenerSedes, crearSede, actualizarSede, desactivarSede, buscarSedes } from './sedesService.js';
import { mostrarAlerta, extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoSedes = {
  sedes: [],
  sedeEditando: null,
  termoBusqueda: ''
};

export const inicializarSedes = async () => {
  const sedes = await obtenerSedes();
  estadoSedes.sedes = sedes;

  const vistaSedes = document.getElementById('modulo-sedes');
  if (vistaSedes) {
    vistaSedes.innerHTML = generarVistaSedes(sedes);
    vistaSedes.innerHTML += generarFormularioSede();
    asignarEventListenersSedes();
  }
};

const asignarEventListenersSedes = () => {
  document.getElementById('btn-guardar-sede')?.addEventListener('click', guardarSede);
  document.getElementById('buscar-sede')?.addEventListener('keyup', (e) => {
    estadoSedes.termoBusqueda = e.target.value;
    filtrarYMostrarSedes();
  });
};

const filtrarYMostrarSedes = () => {
  const sedesFiltradas = buscarSedes(estadoSedes.sedes, estadoSedes.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-sedes');
  if (contenedor) {
    contenedor.innerHTML = generarTablaSedes(sedesFiltradas);
  }
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

const guardarSede = async () => {
  const formulario = document.getElementById('formSede');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    nombre: datosForm.nombre,
    ubicacion: datosForm.ubicacion,
    telefono: datosForm.telefono || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoSedes.sedeEditando) {
    resultado = await actualizarSede(estadoSedes.sedeEditando.id || estadoSedes.sedeEditando.idSede, datos);
  } else {
    resultado = await crearSede(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalSede')).hide();
    await inicializarSedes();
  }
};

window.editarSede = async (idSede) => {
  const sede = estadoSedes.sedes.find(s => (s.id || s.idSede) === idSede);
  if (sede) {
    estadoSedes.sedeEditando = sede;
    document.getElementById('nombre-sede').value = sede.nombre;
    document.getElementById('ubicacion-sede').value = sede.ubicacion;
    document.getElementById('telefono-sede').value = sede.telefono || '';
    document.getElementById('activo-sede').checked = sede.activo !== false;
    new bootstrap.Modal(document.getElementById('modalSede')).show();
  }
};

window.desactivarSede = async (idSede) => {
  const resultado = await desactivarSede(idSede);
  if (resultado.success) {
    await inicializarSedes();
  }
};
