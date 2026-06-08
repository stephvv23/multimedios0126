/**
 * reservacionController.js
 *
 * Documentación (ES):
 * Controlador para gestionar reservaciones: validar fechas, verificar claves foráneas
 * (cliente, habitación), y orquestar operaciones CRUD mediante `api.js`.
 */

import {
  getReservaciones, getReservacionById,
  createReservacion, updateReservacion, deleteReservacion
} from "./api.js";
import { getClienteById }    from "./api.js";
import { getHabitacionById } from "./api.js";

/**
 * Muestra una alerta en `alertZone`.
 */
function showAlert(msg, type = "success") {
  document.getElementById("alertZone").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

/**
 * Resetea el formulario de reservación y remueve clases de validación.
 */
function clearForm() {
  ["reservacionId","id_cliente","id_habitacion","fecha_entrada","fecha_salida",
   "cantidad_personas","total","usuario","estado"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ""; el.classList.remove("is-valid","is-invalid"); }
    });
  document.getElementById("btnSave").textContent = "Guardar";
}

/**
 * Valida campos obligatorios y consistencia de fechas (entrada < salida).
 * @returns {boolean}
 */
function validateForm() {
  const required = ["id_cliente","id_habitacion","fecha_entrada","fecha_salida","usuario"];
  for (const id of required) {
    if (!document.getElementById(id)?.value.trim()) {
      showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false;
    }
  }
  const entrada = new Date(document.getElementById("fecha_entrada").value);
  const salida  = new Date(document.getElementById("fecha_salida").value);
  if (salida <= entrada) {
    showAlert("La fecha de salida debe ser posterior a la de entrada.", "warning"); return false;
  }
  return true;
}

/**
 * Verifica que una clave foránea exista usando la función `fetchFn` provista.
 * @param {string} inputId - id del input en el DOM que contiene el valor a verificar
 * @param {Function} fetchFn - función que consulta la API (ej. getClienteById)
 * @param {string} label - etiqueta amigable para mensajes de error
 * @returns {Promise<boolean>}
 */
async function verifyForeignKey(inputId, fetchFn, label) {
  const input = document.getElementById(inputId);
  const val   = input?.value.trim();
  if (!val) return true; // required check already handled by validateForm
  input.classList.remove("is-invalid", "is-valid");
  try {
    const res = await fetchFn(val);
    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!data || !data.id) throw new Error("not found");
    input.classList.add("is-valid");
    return true;
  } catch {
    input.classList.add("is-invalid");
    const fb = document.getElementById(`${inputId}Feedback`);
    if (fb) fb.textContent = `${label} con ID ${val} no existe en la base de datos.`;
    showAlert(`${label} con ID <b>${val}</b> no existe. Verifique el ID ingresado.`, "warning");
    return false;
  }
}

function estadoBadge(estado) {
  const color = {
    "confirmada": "success",  "Confirmada":  "success",
    "cancelada":  "danger",   "Cancelada":   "danger",
    "pendiente":  "warning",  "Pendiente":   "warning",
    "Activa":     "success",
    "Completada": "info",
  };
  return `<span class="badge bg-${color[estado] ?? "secondary"}">${estado ?? ""}</span>`;
}

function renderTable(list) {
  const tbody = document.getElementById("reservacionTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.id_cliente ?? ""}</td>
      <td>${r.id_habitacion ?? ""}</td>
      <td>${r.fecha_entrada ?? ""}</td>
      <td>${r.fecha_salida ?? ""}</td>
      <td>${r.cantidad_personas ?? ""}</td>
      <td>₡${Number(r.total ?? 0).toLocaleString()}</td>
      <td>${r.usuario ?? ""}</td>
      <td>${estadoBadge(r.estado)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editReservacion(${r.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivateReservacion(${r.id})">
          <i class="bi bi-x-circle"></i> Cancelar
        </button>
      </td>
    </tr>`).join("");
}

async function loadReservaciones() {
  try {
    const res = await getReservaciones();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) { showAlert("Error al cargar reservaciones: " + e.message, "danger"); }
}

async function saveReservacion() {
  if (!validateForm()) return;

  // Verify FK references exist before hitting the DB
  const [clienteOk, habitacionOk] = await Promise.all([
    verifyForeignKey("id_cliente",    getClienteById,    "Cliente"),
    verifyForeignKey("id_habitacion", getHabitacionById, "Habitación"),
  ]);
  if (!clienteOk || !habitacionOk) return;

  const id = document.getElementById("reservacionId").value;
  const cantRaw   = document.getElementById("cantidad_personas").value.trim();
  const totalRaw  = document.getElementById("total").value.trim();
  const payload = {
    id_cliente:    Number(document.getElementById("id_cliente").value),
    id_habitacion: Number(document.getElementById("id_habitacion").value),
    fecha_entrada: document.getElementById("fecha_entrada").value,
    fecha_salida:  document.getElementById("fecha_salida").value,
    usuario:       document.getElementById("usuario").value.trim(),
    estado:        document.getElementById("estado").value,
    ...(cantRaw  ? { cantidad_personas: Number(cantRaw) }            : {}),
    ...(totalRaw ? { total: parseFloat(Number(totalRaw).toFixed(2)) } : {}),
  };
  try {
    document.getElementById("btnSave").disabled = true;
    const res = id
      ? await updateReservacion({ id: Number(id), ...payload })
      : await createReservacion(payload);
    showAlert(res.message ?? "Operación exitosa.");
    clearForm(); loadReservaciones();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
  finally { document.getElementById("btnSave").disabled = false; }
}

window.editReservacion = async function(id) {
  try {
    const res = await getReservacionById(id);
    const r = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("reservacionId").value     = r.id;
    document.getElementById("id_cliente").value        = r.id_cliente ?? "";
    document.getElementById("id_habitacion").value     = r.id_habitacion ?? "";
    document.getElementById("fecha_entrada").value     = r.fecha_entrada ?? "";
    document.getElementById("fecha_salida").value      = r.fecha_salida ?? "";
    document.getElementById("cantidad_personas").value = r.cantidad_personas ?? "";
    document.getElementById("total").value             = r.total ?? "";
    document.getElementById("usuario").value           = r.usuario ?? "";
    document.getElementById("estado").value            = r.estado ?? "";
    document.getElementById("btnSave").textContent     = "Actualizar";
    document.getElementById("reservacionForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) { showAlert("Error al cargar reservación: " + e.message, "danger"); }
};

window.deactivateReservacion = async function(id) {
  if (!confirm("¿Cancelar esta reservación?")) return;
  try {
    const res = await deleteReservacion(id);
    showAlert(res.message ?? "Reservación cancelada."); loadReservaciones();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
};

document.addEventListener("DOMContentLoaded", () => {
  loadReservaciones();
  document.getElementById("btnSave").addEventListener("click", saveReservacion);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) return loadReservaciones();
    try { const r = await getReservacionById(id); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnLoadAll").addEventListener("click", loadReservaciones);
});
