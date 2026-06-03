/**
 * pagoController.js
 *
 * Documentación (ES):
 * Controlador responsable de la gestión de pagos relacionados con reservaciones.
 * - Valida formulario, verifica existencia de la reservación (FK) antes de enviar
 *   y muestra la tabla de pagos.
 */

import {
  getPagos, getPagoById,
  createPago, updatePago, deletePago
} from "./api.js";
import { getReservacionById } from "./api.js";

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
 * Limpia el formulario de pago y estado de validación de campos.
 */
function clearForm() {
  ["pagoId","id_reservacion","monto","metodo","detalle","fecha_pago","usuario"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ""; el.classList.remove("is-valid","is-invalid"); }
    });
  document.getElementById("btnSave").textContent = "Guardar";
}

function validateForm() {
  const required = ["id_reservacion","monto","metodo","fecha_pago","usuario"];
  for (const id of required) {
    if (!document.getElementById(id)?.value.trim()) {
      showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false;
    }
  }
  if (Number(document.getElementById("monto").value) <= 0) {
    showAlert("El monto debe ser mayor a 0.", "warning"); return false;
  }
  return true;
}

// Verify the reservacion FK exists before hitting the DB
/**
 * Verifica que la reservación referenciada exista antes de crear un pago.
 * Devuelve true si existe, false y marca el campo en rojo si no.
 */
async function verifyReservacion() {
  const input = document.getElementById("id_reservacion");
  const val   = input?.value.trim();
  if (!val) return true;
  input.classList.remove("is-invalid","is-valid");
  try {
    const res  = await getReservacionById(val);
    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!data || !data.id) throw new Error();
    input.classList.add("is-valid");
    return true;
  } catch {
    input.classList.add("is-invalid");
    showAlert(`Reservación con ID <b>${val}</b> no existe. Verifique el ID.`, "warning");
    return false;
  }
}

function estadoBadge(estado) {
  const color = {
    "Pendiente":  "warning",
    "Completado": "success",
    "Anulado":    "danger",
    "Activo":     "success",
  };
  return `<span class="badge bg-${color[estado] ?? "secondary"}">${estado ?? ""}</span>`;
}

// Strip time portion returned by API so date input can display it
function toDateInput(val) {
  if (!val) return "";
  return val.toString().substring(0, 10);
}

function renderTable(list) {
  const tbody = document.getElementById("pagoTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.id_reservacion ?? ""}</td>
      <td>₡${Number(p.monto ?? 0).toLocaleString()}</td>
      <td>${p.metodo ?? ""}</td>
      <td>${p.detalle ?? ""}</td>
      <td>${toDateInput(p.fecha_pago)}</td>
      <td>${p.usuario ?? ""}</td>
      <td>${estadoBadge(p.estado)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editPago(${p.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivatePago(${p.id})">
          <i class="bi bi-x-circle"></i> Anular
        </button>
      </td>
    </tr>`).join("");
}

async function loadPagos() {
  try {
    const res = await getPagos();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) { showAlert("Error al cargar pagos: " + e.message, "danger"); }
}

async function savePago() {
  if (!validateForm()) return;
  if (!await verifyReservacion()) return;

  const id = document.getElementById("pagoId").value;
  const payload = {
    id_reservacion: Number(document.getElementById("id_reservacion").value),
    monto:          parseFloat(Number(document.getElementById("monto").value).toFixed(2)),
    metodo:         document.getElementById("metodo").value.trim(),
    detalle:        document.getElementById("detalle").value.trim(),
    fecha_pago:     document.getElementById("fecha_pago").value,
    usuario:        document.getElementById("usuario").value.trim(),
  };
  try {
    document.getElementById("btnSave").disabled = true;
    const res = id ? await updatePago({ id: Number(id), ...payload }) : await createPago(payload);
    showAlert(res.message ?? "Operación exitosa.");
    clearForm(); loadPagos();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
  finally { document.getElementById("btnSave").disabled = false; }
}

window.editPago = async function(id) {
  try {
    const res = await getPagoById(id);
    const p = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("pagoId").value         = p.id;
    document.getElementById("id_reservacion").value = p.id_reservacion ?? "";
    document.getElementById("monto").value          = p.monto ?? "";
    document.getElementById("metodo").value         = p.metodo ?? "";
    document.getElementById("detalle").value        = p.detalle ?? "";
    document.getElementById("fecha_pago").value     = toDateInput(p.fecha_pago);
    document.getElementById("usuario").value        = p.usuario ?? "";
    document.getElementById("btnSave").textContent  = "Actualizar";
    document.getElementById("pagoForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) { showAlert("Error al cargar pago: " + e.message, "danger"); }
};

window.deactivatePago = async function(id) {
  if (!confirm("¿Anular este pago?")) return;
  try {
    const res = await deletePago(id);
    showAlert(res.message ?? "Pago anulado."); loadPagos();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
};

document.addEventListener("DOMContentLoaded", () => {
  loadPagos();
  document.getElementById("btnSave").addEventListener("click", savePago);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) return loadPagos();
    try { const r = await getPagoById(id); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnLoadAll").addEventListener("click", loadPagos);
});
