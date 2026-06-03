import {
  getHabitaciones, getHabitacionById, getHabitacionByNombre,
  createHabitacion, updateHabitacion, deleteHabitacion
} from "./api.js";

function showAlert(msg, type = "success") {
  document.getElementById("alertZone").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function clearForm() {
  ["habitacionId","id_sede","numero","tipo","precio","capacidad","descripcion","usuario"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("btnSave").textContent = "Guardar";
}

function validateForm() {
  const required = ["id_sede","numero","tipo","precio","usuario"];
  for (const id of required) {
    if (!document.getElementById(id)?.value.trim()) {
      showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false;
    }
  }
  return true;
}

function estadoBadge(estado) {
  const color = { "Disponible": "success", "Ocupada": "danger", "Mantenimiento": "warning", "Inactivo": "secondary" };
  return `<span class="badge bg-${color[estado] ?? "secondary"}">${estado ?? ""}</span>`;
}

function renderTable(list) {
  const tbody = document.getElementById("habitacionTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(h => `
    <tr>
      <td>${h.id}</td>
      <td>${h.id_sede ?? ""}</td>
      <td>${h.numero ?? ""}</td>
      <td>${h.tipo ?? ""}</td>
      <td>₡${Number(h.precio ?? 0).toLocaleString()}</td>
      <td>${h.capacidad ?? ""}</td>
      <td>${h.descripcion ?? ""}</td>
      <td>${h.usuario ?? ""}</td>
      <td>${estadoBadge(h.estado)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editHabitacion(${h.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivateHabitacion(${h.id})">
          <i class="bi bi-x-circle"></i> Desactivar
        </button>
      </td>
    </tr>`).join("");
}

async function loadHabitaciones() {
  try {
    const res = await getHabitaciones();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) { showAlert("Error al cargar habitaciones: " + e.message, "danger"); }
}

async function saveHabitacion() {
  if (!validateForm()) return;
  const id = document.getElementById("habitacionId").value;
  const payload = {
    id_sede:     Number(document.getElementById("id_sede").value),
    numero:      document.getElementById("numero").value.trim(),
    tipo:        document.getElementById("tipo").value.trim(),
    precio:      Number(document.getElementById("precio").value),
    capacidad:   Number(document.getElementById("capacidad").value) || 1,
    descripcion: document.getElementById("descripcion").value.trim(),
    usuario:     document.getElementById("usuario").value.trim(),
  };
  try {
    document.getElementById("btnSave").disabled = true;
    const res = id
      ? await updateHabitacion({ id: Number(id), ...payload })
      : await createHabitacion(payload);
    showAlert(res.message ?? "Operación exitosa.");
    clearForm(); loadHabitaciones();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
  finally { document.getElementById("btnSave").disabled = false; }
}

window.editHabitacion = async function(id) {
  try {
    const res = await getHabitacionById(id);
    const h = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("habitacionId").value  = h.id;
    document.getElementById("id_sede").value       = h.id_sede ?? "";
    document.getElementById("numero").value        = h.numero ?? "";
    document.getElementById("tipo").value          = h.tipo ?? "";
    document.getElementById("precio").value        = h.precio ?? "";
    document.getElementById("capacidad").value     = h.capacidad ?? "";
    document.getElementById("descripcion").value   = h.descripcion ?? "";
    document.getElementById("usuario").value       = h.usuario ?? "";
    document.getElementById("btnSave").textContent = "Actualizar";
    document.getElementById("habitacionForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) { showAlert("Error al cargar habitación: " + e.message, "danger"); }
};

window.deactivateHabitacion = async function(id) {
  if (!confirm("¿Desactivar esta habitación?")) return;
  try {
    const res = await deleteHabitacion(id);
    showAlert(res.message ?? "Habitación desactivada."); loadHabitaciones();
  } catch (e) { showAlert("Error: " + e.message, "danger"); }
};

document.addEventListener("DOMContentLoaded", () => {
  loadHabitaciones();
  document.getElementById("btnSave").addEventListener("click", saveHabitacion);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();
    if (!id) return loadHabitaciones();
    try { const r = await getHabitacionById(id); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnSearchName").addEventListener("click", async () => {
    const n = document.getElementById("searchName").value.trim();
    if (!n) return loadHabitaciones();
    try { const r = await getHabitacionByNombre(n); renderTable(Array.isArray(r.data) ? r.data : [r.data]); }
    catch (e) { showAlert(e.message, "danger"); }
  });
  document.getElementById("btnLoadAll").addEventListener("click", loadHabitaciones);
});
