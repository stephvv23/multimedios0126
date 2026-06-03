/**
 * sedeController.js
 *
 * Documentación (ES):
 * Controlador para la gestión de sedes (filiales): valida formulario, renderiza tabla
 * y llama a `api.js` para operaciones CRUD.
 */

import {
  getSedes, getSedeById, getSedeByNombre,
  createSede, updateSede, deleteSede
} from "./api.js";

/**
 * Inserta una alerta en `alertZone`.
 */
function showAlert(msg, type = "success") {
  document.getElementById("alertZone").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function clearForm() {
  ["sedeId","id_hotel","nombre","pais","provincia","ciudad","direccion",
   "telefono","correo","cantidad_habitaciones","usuario"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("btnSave").textContent = "Guardar";
}

function validateForm() {
  const required = ["id_hotel","nombre","provincia","ciudad","direccion","usuario"];
  for (const id of required) {
    if (!document.getElementById(id)?.value.trim()) {
      showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false;
    }
  }
  return true;
}

function renderTable(list) {
  const tbody = document.getElementById("sedeTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.id_hotel ?? ""}</td>
      <td>${s.nombre ?? ""}</td>
      <td>${s.pais ?? ""}</td>
      <td>${s.provincia ?? ""}</td>
      <td>${s.ciudad ?? ""}</td>
      <td>${s.direccion ?? ""}</td>
      <td>${s.telefono ?? ""}</td>
      <td>${s.correo ?? ""}</td>
      <td>${s.cantidad_habitaciones ?? ""}</td>
      <td>${s.usuario ?? ""}</td>
      <td><span class="badge bg-${s.estado === "Activo" ? "success" : "secondary"}">${s.estado ?? ""}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editSede(${s.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivateSede(${s.id})">
          <i class="bi bi-x-circle"></i> Desactivar
        </button>
      </td>
    </tr>`).join("");
}

async function loadSedes() {
  try {
    const res = await getSedes();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) { showAlert("Error al cargar sedes: " + e.message, "danger"); }
}

async function saveSede() {
  if (!validateForm()) return;
  const id = document.getElementById("sedeId").value;
  const payload = {
    id_hotel:             Number(document.getElementById("id_hotel").value),
    nombre:               document.getElementById("nombre").value.trim(),
    pais:                 document.getElementById("pais").value.trim(),
    provincia:            document.getElementById("provincia").value.trim(),
    ciudad:               document.getElementById("ciudad").value.trim(),
    direccion:            document.getElementById("direccion").value.trim(),
    telefono:             document.getElementById("telefono").value.trim(),
    correo:               document.getElementById("correo").value.trim(),
    cantidad_habitaciones: Number(document.getElementById("cantidad_habitaciones").value) || 0,
    usuario:              document.getElementById("usuario").value.trim(),
  };
  try {
    document.getElementById("btnSave").disabled = true;
    const res = id ? await updateSede({ id: Number(id), ...payload }) : await createSede(payload);
    showAlert(res.message ?? "Operación exitosa.");
    clearForm(); loadSedes();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
  finally { document.getElementById("btnSave").disabled = false; }
}

window.editSede = async function(id) {
  try {
    const res = await getSedeById(id);
    const s = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("sedeId").value                = s.id;
    document.getElementById("id_hotel").value              = s.id_hotel ?? "";
    document.getElementById("nombre").value                = s.nombre ?? "";
    document.getElementById("pais").value                  = s.pais ?? "";
    document.getElementById("provincia").value             = s.provincia ?? "";
    document.getElementById("ciudad").value                = s.ciudad ?? "";
    document.getElementById("direccion").value             = s.direccion ?? "";
    document.getElementById("telefono").value              = s.telefono ?? "";
    document.getElementById("correo").value                = s.correo ?? "";
    document.getElementById("cantidad_habitaciones").value = s.cantidad_habitaciones ?? "";
    document.getElementById("usuario").value               = s.usuario ?? "";
    document.getElementById("btnSave").textContent = "Actualizar";
    document.getElementById("sedeForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) { showAlert("Error al cargar sede: " + e.message, "danger"); }
};

window.deactivateSede = async function(id) {
  if (!confirm("¿Desactivar esta sede?")) return;
  try {
    const res = await deleteSede(id);
    showAlert(res.message ?? "Sede desactivada."); loadSedes();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
};

document.addEventListener("DOMContentLoaded", () => {
  loadSedes();
  document.getElementById("btnSave").addEventListener("click", saveSede);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) return loadSedes();
    try { const r = await getSedeById(id); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnSearchName").addEventListener("click", async () => {
    const n = document.getElementById("searchName").value.trim();
    if (!n) return loadSedes();
    try { const r = await getSedeByNombre(n); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnLoadAll").addEventListener("click", loadSedes);
});
