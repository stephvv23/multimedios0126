/**
 * Controlador específico para el módulo de Reservaciones
 */

import { generarVistaReservaciones, generarFormularioReservacion } from './reservacionesView.js';
import { obtenerReservaciones, crearReservacion, actualizarReservacion, desactivarReservacion, buscarReservaciones } from './reservacionesService.js';
import { extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoReservaciones = {
  reservaciones: [],
  reservacionEditando: null,
  termoBusqueda: '',
  clientes: [],
  habitaciones: []
};

export const inicializarReservaciones = async () => {
  const reservaciones = await obtenerReservaciones();
  estadoReservaciones.reservaciones = reservaciones;

  const vistaReservaciones = document.getElementById('modulo-reservaciones');
  if (vistaReservaciones) {
    vistaReservaciones.innerHTML = generarVistaReservaciones(reservaciones);
    vistaReservaciones.innerHTML += generarFormularioReservacion();
    asignarEventListenersReservaciones();
  }
};

const asignarEventListenersReservaciones = () => {
  document.getElementById('btn-guardar-reservacion')?.addEventListener('click', guardarReservacion);
  document.getElementById('buscar-reservacion')?.addEventListener('keyup', (e) => {
    estadoReservaciones.termoBusqueda = e.target.value;
    filtrarYMostrarReservaciones();
  });

  // Calular noches automáticamente
  document.getElementById('fechaLlegada')?.addEventListener('change', calcularNoches);
  document.getElementById('fechaSalida')?.addEventListener('change', calcularNoches);
};

const calcularNoches = () => {
  const llegada = document.getElementById('fechaLlegada')?.value;
  const salida = document.getElementById('fechaSalida')?.value;

  if (llegada && salida) {
    const dateA = new Date(llegada);
    const dateB = new Date(salida);
    const noches = Math.ceil((dateB - dateA) / (1000 * 60 * 60 * 24));
    if (noches > 0) {
      document.getElementById('noches').value = noches;
    }
  }
};

const filtrarYMostrarReservaciones = () => {
  const reservacionesFiltradas = buscarReservaciones(estadoReservaciones.reservaciones, estadoReservaciones.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-reservaciones');
  if (contenedor) {
    contenedor.innerHTML = generarTablaReservaciones(reservacionesFiltradas);
  }
};

const generarTablaReservaciones = (reservaciones) => {
  if (!reservaciones || reservaciones.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay reservaciones registradas.</div>`;
  }

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

const guardarReservacion = async () => {
  const formulario = document.getElementById('formReservacion');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    idCliente: parseInt(datosForm.idCliente),
    idHabitacion: parseInt(datosForm.idHabitacion),
    fechaLlegada: datosForm.fechaLlegada,
    fechaSalida: datosForm.fechaSalida,
    estado: datosForm.estado,
    observaciones: datosForm.observaciones || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoReservaciones.reservacionEditando) {
    resultado = await actualizarReservacion(estadoReservaciones.reservacionEditando.id || estadoReservaciones.reservacionEditando.idReservacion, datos);
  } else {
    resultado = await crearReservacion(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalReservacion')).hide();
    await inicializarReservaciones();
  }
};

window.editarReservacion = async (idReservacion) => {
  const reservacion = estadoReservaciones.reservaciones.find(r => (r.id || r.idReservacion) === idReservacion);
  if (reservacion) {
    estadoReservaciones.reservacionEditando = reservacion;
    document.getElementById('cliente-res').value = reservacion.idCliente || '';
    document.getElementById('habitacion-res').value = reservacion.idHabitacion || '';
    document.getElementById('fechaLlegada').value = reservacion.fechaLlegada || '';
    document.getElementById('fechaSalida').value = reservacion.fechaSalida || '';
    document.getElementById('estado-res').value = reservacion.estado || 'Confirmada';
    document.getElementById('observaciones').value = reservacion.observaciones || '';
    document.getElementById('activo-res').checked = reservacion.activo !== false;
    calcularNoches();
    new bootstrap.Modal(document.getElementById('modalReservacion')).show();
  }
};

window.desactivarReservacion = async (idReservacion) => {
  const resultado = await desactivarReservacion(idReservacion);
  if (resultado.success) {
    await inicializarReservaciones();
  }
};
