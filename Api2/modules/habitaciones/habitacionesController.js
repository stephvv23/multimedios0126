/**
 * Controlador específico para el módulo de Habitaciones
 */

import { generarVistaHabitaciones, generarFormularioHabitacion } from './habitacionesView.js';
import { obtenerHabitaciones, crearHabitacion, actualizarHabitacion, desactivarHabitacion, buscarHabitaciones } from './habitacionesService.js';
import { mostrarAlerta, extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoHabitaciones = {
  habitaciones: [],
  habitacionEditando: null,
  termoBusqueda: ''
};

export const inicializarHabitaciones = async () => {
  const habitaciones = await obtenerHabitaciones();
  estadoHabitaciones.habitaciones = habitaciones;

  const vistaHabitaciones = document.getElementById('modulo-habitaciones');
  if (vistaHabitaciones) {
    vistaHabitaciones.innerHTML = generarVistaHabitaciones(habitaciones);
    vistaHabitaciones.innerHTML += generarFormularioHabitacion();
    asignarEventListenersHabitaciones();
  }
};

const asignarEventListenersHabitaciones = () => {
  document.getElementById('btn-guardar-habitacion')?.addEventListener('click', guardarHabitacion);
  document.getElementById('buscar-habitacion')?.addEventListener('keyup', (e) => {
    estadoHabitaciones.termoBusqueda = e.target.value;
    filtrarYMostrarHabitaciones();
  });
};

const filtrarYMostrarHabitaciones = () => {
  const habitacionesFiltradas = buscarHabitaciones(estadoHabitaciones.habitaciones, estadoHabitaciones.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-habitaciones');
  if (contenedor) {
    contenedor.innerHTML = generarTablaHabitaciones(habitacionesFiltradas);
  }
};

const generarTablaHabitaciones = (habitaciones) => {
  if (!habitaciones || habitaciones.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay habitaciones registradas.</div>`;
  }

  const formatearMoneda = (valor) => {
    if (!valor) return '₡0';
    return '₡' + parseFloat(valor).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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

const guardarHabitacion = async () => {
  const formulario = document.getElementById('formHabitacion');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    numero: datosForm.numero,
    tipo: datosForm.tipo,
    precioPorNoche: parseFloat(datosForm.precioPorNoche),
    capacidad: parseInt(datosForm.capacidad),
    descripcion: datosForm.descripcion || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoHabitaciones.habitacionEditando) {
    resultado = await actualizarHabitacion(estadoHabitaciones.habitacionEditando.id || estadoHabitaciones.habitacionEditando.idHabitacion, datos);
  } else {
    resultado = await crearHabitacion(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalHabitacion')).hide();
    await inicializarHabitaciones();
  }
};

window.editarHabitacion = async (idHabitacion) => {
  const habitacion = estadoHabitaciones.habitaciones.find(h => (h.id || h.idHabitacion) === idHabitacion);
  if (habitacion) {
    estadoHabitaciones.habitacionEditando = habitacion;
    document.getElementById('numero').value = habitacion.numero;
    document.getElementById('tipo').value = habitacion.tipo;
    document.getElementById('precioPorNoche').value = habitacion.precioPorNoche;
    document.getElementById('capacidad').value = habitacion.capacidad || 2;
    document.getElementById('descripcion-hab').value = habitacion.descripcion || '';
    document.getElementById('activo-hab').checked = habitacion.activo !== false;
    new bootstrap.Modal(document.getElementById('modalHabitacion')).show();
  }
};

window.desactivarHabitacion = async (idHabitacion) => {
  const resultado = await desactivarHabitacion(idHabitacion);
  if (resultado.success) {
    await inicializarHabitaciones();
  }
};
