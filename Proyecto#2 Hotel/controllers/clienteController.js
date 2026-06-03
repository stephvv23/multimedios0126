/**
 * clienteController.js
 *
 * Documentación (ES):
 * Controlador de la interfaz para gestionar clientes.
 * - Importa las funciones CRUD desde `api.js`.
 * - Se encarga de validar formularios, renderizar la tabla de clientes,
 *   y enlazar botones/acciones del DOM con llamadas a la API.
 *
 * Workflow resumido:
 * Usuario -> vista HTML -> eventos -> funciones en este archivo -> llamadas a `api.js` -> respuesta -> actualizar UI
 */

import {
  getClientes, getClienteById, getClienteByNombre,
  createCliente, updateCliente, deleteCliente
} from "./api.js";

/**
 * Muestra una alerta en la zona `alertZone` del DOM.
 * @param {string} msg - Mensaje HTML o texto a mostrar
 * @param {string} [type=success] - Tipo de bootstrap alert (success, warning, danger)
 */
function showAlert(msg, type = "success") {
  document.getElementById("alertZone").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

/**
 * Limpia los campos del formulario de cliente y resetea el botón guardar.
 */
function clearForm() {
  ["clienteId","nombre","apellidos","identificacion","telefono","correo","usuario"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("btnSave").textContent = "Guardar";
}

/**
 * Valida campos obligatorios del formulario de cliente.
 * @returns {boolean} true si válido
 */
function validateForm() {
  const required = ["nombre","apellidos","identificacion","correo","usuario"];
  for (const id of required) {
    if (!document.getElementById(id)?.value.trim()) {
      showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false;
    }
  }
  const correo = document.getElementById("correo").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    showAlert("Ingrese un correo válido.", "warning"); return false;
  }
  return true;
}

function renderTable(list) {
  const tbody = document.getElementById("clienteTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre ?? ""}</td>
      <td>${c.apellidos ?? ""}</td>
      <td>${c.identificacion ?? ""}</td>
      <td>${c.telefono ?? ""}</td>
      <td>${c.correo ?? ""}</td>
      <td>${c.usuario ?? ""}</td>
      <td><span class="badge bg-${c.activo == 1 ? "success" : "secondary"}">${c.activo == 1 ? "Activo" : "Inactivo"}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editCliente(${c.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivateCliente(${c.id})">
          <i class="bi bi-x-circle"></i> Desactivar
        </button>
      </td>
    </tr>`).join("");
}

/**
 * Carga la lista de clientes desde la API y la renderiza.
 */
async function loadClientes() {
  try {
    const res = await getClientes();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) { showAlert("Error al cargar clientes: " + e.message, "danger"); }
}

/**
 * Envía los datos del formulario para crear o actualizar un cliente.
 * Realiza validación previa y actualiza la tabla al finalizar.
 */
async function saveCliente() {
  if (!validateForm()) return;
  const id = document.getElementById("clienteId").value;
  const payload = {
    nombre:         document.getElementById("nombre").value.trim(),
    apellidos:      document.getElementById("apellidos").value.trim(),
    identificacion: document.getElementById("identificacion").value.trim(),
    telefono:       document.getElementById("telefono").value.trim(),
    correo:         document.getElementById("correo").value.trim(),
    usuario:        document.getElementById("usuario").value.trim(),
  };
  try {
    document.getElementById("btnSave").disabled = true;
    const res = id ? await updateCliente({ id: Number(id), ...payload }) : await createCliente(payload);
    showAlert(res.message ?? "Operación exitosa.");
    clearForm(); loadClientes();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
  finally { document.getElementById("btnSave").disabled = false; }
}

window.editCliente = async function(id) {
  try {
    const res = await getClienteById(id);
    const c = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("clienteId").value      = c.id;
    document.getElementById("nombre").value         = c.nombre ?? "";
    document.getElementById("apellidos").value      = c.apellidos ?? "";
    document.getElementById("identificacion").value = c.identificacion ?? "";
    document.getElementById("telefono").value       = c.telefono ?? "";
    document.getElementById("correo").value         = c.correo ?? "";
    document.getElementById("usuario").value        = c.usuario ?? "";
    document.getElementById("btnSave").textContent  = "Actualizar";
    document.getElementById("clienteForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) { showAlert("Error al cargar cliente: " + e.message, "danger"); }
};

window.deactivateCliente = async function(id) {
  if (!confirm("¿Desactivar este cliente?")) return;
  try {
    const res = await deleteCliente(id);
    showAlert(res.message ?? "Cliente desactivado."); loadClientes();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
};

document.addEventListener("DOMContentLoaded", () => {
  loadClientes();
  document.getElementById("btnSave").addEventListener("click", saveCliente);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) return loadClientes();
    try { const r = await getClienteById(id); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnSearchName").addEventListener("click", async () => {
    const n = document.getElementById("searchName").value.trim();
    if (!n) return loadClientes();
    try { const r = await getClienteByNombre(n); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnLoadAll").addEventListener("click", loadClientes);
});
