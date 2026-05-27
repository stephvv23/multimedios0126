/**
 * Controlador específico para el módulo de Pagos
 */

import { generarVistaPagos, generarFormularioPago } from './pagosView.js';
import { obtenerPagos, crearPago, actualizarPago, desactivarPago, buscarPagos } from './pagosService.js';
import { extraerDatosFormulario } from '../../components/UIComponent.js';

let estadoPagos = {
  pagos: [],
  pagoEditando: null,
  termoBusqueda: '',
  reservaciones: []
};

export const inicializarPagos = async () => {
  const pagos = await obtenerPagos();
  estadoPagos.pagos = pagos;

  const vistaPagos = document.getElementById('modulo-pagos');
  if (vistaPagos) {
    vistaPagos.innerHTML = generarVistaPagos(pagos);
    vistaPagos.innerHTML += generarFormularioPago();
    actualizarDashboardPagos(pagos);
    asignarEventListenersPagos();
  }
};

const asignarEventListenersPagos = () => {
  document.getElementById('btn-guardar-pago')?.addEventListener('click', guardarPago);
  document.getElementById('buscar-pago')?.addEventListener('keyup', (e) => {
    estadoPagos.termoBusqueda = e.target.value;
    filtrarYMostrarPagos();
  });
};

const filtrarYMostrarPagos = () => {
  const pagosFiltrados = buscarPagos(estadoPagos.pagos, estadoPagos.termoBusqueda);
  const contenedor = document.getElementById('contenedor-tabla-pagos');
  if (contenedor) {
    contenedor.innerHTML = generarTablaPagos(pagosFiltrados);
  }
};

const generarTablaPagos = (pagos) => {
  if (!pagos || pagos.length === 0) {
    return `<div class="alert alert-info m-3"><i class="bi bi-info-circle"></i> No hay pagos registrados.</div>`;
  }

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

const actualizarDashboardPagos = (pagos) => {
  if (!pagos || pagos.length === 0) return;

  const totalPagos = pagos.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0);
  const completados = pagos.filter(p => p.estado === 'Completado').length;
  const pendientes = pagos.filter(p => p.estado === 'Pendiente').length;
  const cancelados = pagos.filter(p => p.estado === 'Cancelado').length;

  const totalElement = document.getElementById('total-pagos');
  if (totalElement) {
    totalElement.innerHTML = '₡' + totalPagos.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  document.getElementById('pagos-completados').innerHTML = completados;
  document.getElementById('pagos-pendientes').innerHTML = pendientes;
  document.getElementById('pagos-cancelados').innerHTML = cancelados;
};

const guardarPago = async () => {
  const formulario = document.getElementById('formPago');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    idReservacion: parseInt(datosForm.idReservacion),
    monto: parseFloat(datosForm.monto),
    metodo: datosForm.metodo,
    estado: datosForm.estado,
    fecha: datosForm.fecha,
    referencia: datosForm.referencia || null,
    activo: datosForm.activo === 'on'
  };

  let resultado;
  if (estadoPagos.pagoEditando) {
    resultado = await actualizarPago(estadoPagos.pagoEditando.id || estadoPagos.pagoEditando.idPago, datos);
  } else {
    resultado = await crearPago(datos);
  }

  if (resultado.success) {
    bootstrap.Modal.getInstance(document.getElementById('modalPago')).hide();
    await inicializarPagos();
  }
};

window.editarPago = async (idPago) => {
  const pago = estadoPagos.pagos.find(p => (p.id || p.idPago) === idPago);
  if (pago) {
    estadoPagos.pagoEditando = pago;
    document.getElementById('reservacion-pago').value = pago.idReservacion || '';
    document.getElementById('monto').value = pago.monto;
    document.getElementById('metodo-pago').value = pago.metodo;
    document.getElementById('estado-pago').value = pago.estado || 'Pendiente';
    document.getElementById('fecha-pago').value = pago.fecha || '';
    document.getElementById('referencia').value = pago.referencia || '';
    document.getElementById('activo-pago').checked = pago.activo !== false;
    new bootstrap.Modal(document.getElementById('modalPago')).show();
  }
};

window.desactivarPago = async (idPago) => {
  const resultado = await desactivarPago(idPago);
  if (resultado.success) {
    await inicializarPagos();
  }
};
