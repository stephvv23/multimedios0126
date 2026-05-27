/**
 * Controlador específico para el módulo de Hoteles
 * Orquestra la interacción entre vista, servicio y componentes UI
 */

import { generarVistaHoteles, generarFormularioHotel } from './hotelesView.js';
import { 
  obtenerHoteles, 
  crearHotel, 
  actualizarHotel, 
  desactivarHotel, 
  buscarHoteles 
} from './hotelesService.js';
import { mostrarAlerta, cambiarModulo, extraerDatosFormulario } from '../../components/UIComponent.js';

/**
 * Estado global del módulo de hoteles
 */
let estadoHoteles = {
  hoteles: [],
  hotelEditando: null,
  termoBusqueda: ''
};

/**
 * Inicializa el módulo de hoteles
 */
export const inicializarHoteles = async () => {
  // Obtener hoteles de la API
  const hoteles = await obtenerHoteles();
  estadoHoteles.hoteles = hoteles;

  // Renderizar vista
  const vistaHoteles = document.getElementById('modulo-hoteles');
  if (vistaHoteles) {
    vistaHoteles.innerHTML = generarVistaHoteles(hoteles);
    vistaHoteles.innerHTML += generarFormularioHotel();

    // Asignar event listeners
    asignarEventListenersHoteles();
  }
};

/**
 * Asigna los event listeners a los elementos de la vista
 */
const asignarEventListenersHoteles = () => {
  // Botón nuevo hotel
  const btnNuevoHotel = document.getElementById('btn-nuevo-hotel');
  if (btnNuevoHotel) {
    btnNuevoHotel.addEventListener('click', () => {
      estadoHoteles.hotelEditando = null;
      const formulario = document.getElementById('formHotel');
      if (formulario) formulario.reset();
    });
  }

  // Botón guardar hotel
  const btnGuardarHotel = document.getElementById('btn-guardar-hotel');
  if (btnGuardarHotel) {
    btnGuardarHotel.addEventListener('click', guardarHotel);
  }

  // Búsqueda
  const buscarInput = document.getElementById('buscar-hotel');
  if (buscarInput) {
    buscarInput.addEventListener('keyup', (e) => {
      estadoHoteles.termoBusqueda = e.target.value;
      filtrarYMostrarHoteles();
    });
  }

  // Botón filtrar
  const btnFiltrar = document.getElementById('filtrar-hoteles');
  if (btnFiltrar) {
    btnFiltrar.addEventListener('click', filtrarYMostrarHoteles);
  }
};

/**
 * Filtra y renderiza los hoteles según el término de búsqueda
 */
const filtrarYMostrarHoteles = () => {
  const hotelesFiltrados = buscarHoteles(estadoHoteles.hoteles, estadoHoteles.termoBusqueda);
  
  const contenedor = document.getElementById('contenedor-tabla-hoteles');
  if (contenedor) {
    contenedor.innerHTML = generarTablaHoteles(hotelesFiltrados);
    
    // Reasignar listeners de acciones
    hotelesFiltrados.forEach(hotel => {
      const btnEditar = document.querySelector(`[onclick*="editarHotel(${hotel.id || hotel.idHotel})"]`);
      if (btnEditar) {
        btnEditar.addEventListener('click', () => abrirEditarHotel(hotel));
      }
    });
  }
};

/**
 * Genera la tabla con el listado de hoteles (auxiliar)
 */
const generarTablaHoteles = (hoteles) => {
  if (!hoteles || hoteles.length === 0) {
    return `
      <div class="alert alert-info m-3">
        <i class="bi bi-info-circle"></i> No hay hoteles registrados. Crea uno nuevo.
      </div>
    `;
  }

  return `
    <div class="table-responsive">
      <table class="table table-hover table-striped align-middle bg-dark text-light border-secondary mb-0">
        <thead class="table-dark border-secondary">
          <tr>
            <th class="text-center">Hotel</th>
            <th class="text-center">Ubicación</th>
            <th class="text-center">Teléfono</th>
            <th class="text-center">Email</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="border-secondary">
          ${hoteles.map(hotel => `
            <tr>
              <td>
                <div>
                  <strong>${hotel.nombre || 'Sin nombre'}</strong>
                  <br>
                  <small class="text-muted">${hotel.codigo || 'S/C'}</small>
                </div>
              </td>
              <td class="text-center">${hotel.ubicacion || 'N/A'}</td>
              <td class="text-center">${hotel.telefono || 'N/A'}</td>
              <td class="text-center">${hotel.email || 'N/A'}</td>
              <td class="text-center">
                <span class="badge ${hotel.activo ? 'bg-success' : 'bg-danger'}">
                  ${hotel.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" title="Editar" onclick="window.editarHotel(${hotel.id || hotel.idHotel})">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" title="Desactivar" onclick="window.desactivarHotel(${hotel.id || hotel.idHotel})">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Abre el formulario para editar un hotel
 * @param {Object} hotel - Hotel a editar
 */
const abrirEditarHotel = async (hotel) => {
  estadoHoteles.hotelEditando = hotel;
  
  // Actualizar modal con datos del hotel
  document.getElementById('nombre').value = hotel.nombre || '';
  document.getElementById('codigo').value = hotel.codigo || '';
  document.getElementById('ubicacion').value = hotel.ubicacion || '';
  document.getElementById('provincia').value = hotel.provincia || '';
  document.getElementById('telefono').value = hotel.telefono || '';
  document.getElementById('email').value = hotel.email || '';
  document.getElementById('descripcion').value = hotel.descripcion || '';
  document.getElementById('activo').checked = hotel.activo !== false;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('modalHotel'));
  modal.show();
};

/**
 * Guarda un nuevo hotel o actualiza uno existente
 */
const guardarHotel = async () => {
  const formulario = document.getElementById('formHotel');
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    nombre: datosForm.nombre,
    codigo: datosForm.codigo,
    ubicacion: datosForm.ubicacion,
    provincia: datosForm.provincia || null,
    telefono: datosForm.telefono,
    email: datosForm.email,
    descripcion: datosForm.descripcion || null,
    activo: datosForm.activo === 'on' ? true : false
  };

  let resultado;
  if (estadoHoteles.hotelEditando) {
    // Actualizar
    resultado = await actualizarHotel(estadoHoteles.hotelEditando.id || estadoHoteles.hotelEditando.idHotel, datos);
  } else {
    // Crear
    resultado = await crearHotel(datos);
  }

  if (resultado.success) {
    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById('modalHotel')).hide();
    
    // Refrescar listado
    await inicializarHoteles();
  }
};

/**
 * Edita un hotel (global)
 * @param {number} idHotel - ID del hotel
 */
window.editarHotel = async (idHotel) => {
  const hotel = estadoHoteles.hoteles.find(h => (h.id || h.idHotel) === idHotel);
  if (hotel) {
    abrirEditarHotel(hotel);
  }
};

/**
 * Desactiva un hotel (global)
 * @param {number} idHotel - ID del hotel
 */
window.desactivarHotel = async (idHotel) => {
  const resultado = await desactivarHotel(idHotel);
  if (resultado.success) {
    await inicializarHoteles();
  }
};
