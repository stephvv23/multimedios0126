import {
  getHoteles, getHotelById, getHotelByNombre,
  createHotel, updateHotel, deleteHotel
} from "./api.js";

// ── Helpers ───────────────────────────────────────────────

function showAlert(msg, type = "success") {
  const zone = document.getElementById("alertZone");
  zone.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function setLoading(on) {
  document.getElementById("btnSave").disabled = on;
}

function clearForm() {
  ["hotelId","nombre","descripcion","telefono","correo","sitio_web","usuario"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  document.getElementById("btnSave").textContent = "Guardar";
  document.getElementById("hotelId").value = "";
}

function validateForm() {
  const required = ["nombre","telefono","correo","usuario"];
  for (const id of required) {
    const val = document.getElementById(id)?.value.trim();
    if (!val) { showAlert(`El campo <b>${id}</b> es obligatorio.`, "warning"); return false; }
  }
  return true;
}

// ── Table ─────────────────────────────────────────────────

function renderTable(list) {
  const tbody = document.getElementById("hotelTableBody");
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Sin registros.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(h => `
    <tr>
      <td>${h.id}</td>
      <td>${h.nombre}</td>
      <td>${h.descripcion ?? ""}</td>
      <td>${h.telefono ?? ""}</td>
      <td>${h.correo ?? ""}</td>
      <td>${h.sitio_web ? `<a href="${h.sitio_web}" target="_blank" class="text-truncate d-inline-block" style="max-width:120px">${h.sitio_web}</a>` : ""}</td>
      <td>${h.usuario ?? ""}</td>
      <td><span class="badge bg-${h.estado === "Activo" ? "success" : "secondary"}">${h.estado ?? ""}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editHotel(${h.id})">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deactivateHotel(${h.id})">
          <i class="bi bi-x-circle"></i> Desactivar
        </button>
      </td>
    </tr>`).join("");
}

// ── Load ──────────────────────────────────────────────────

async function loadHoteles() {
  try {
    const res = await getHoteles();
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) {
    showAlert("Error al cargar hoteles: " + e.message, "danger");
  }
}

// ── CRUD ──────────────────────────────────────────────────

async function saveHotel() {
  if (!validateForm()) return;
  const id = document.getElementById("hotelId").value;
  const payload = {
    nombre:      document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    telefono:    document.getElementById("telefono").value.trim(),
    correo:      document.getElementById("correo").value.trim(),
    sitio_web:   document.getElementById("sitio_web").value.trim(),
    usuario:     document.getElementById("usuario").value.trim(),
  };
  try {
    setLoading(true);
    let res;
    if (id) {
      res = await updateHotel({ id: Number(id), ...payload });
    } else {
      res = await createHotel(payload);
    }
    showAlert(res.message ?? "Operación exitosa.");
    clearForm();
    loadHoteles();
  } catch (e) {
    showAlert("Error: " + e.message, "danger");
  } finally {
    setLoading(false);
  }
}

window.editHotel = async function(id) {
  try {
    const res = await getHotelById(id);
    const h = Array.isArray(res.data) ? res.data[0] : res.data;
    document.getElementById("hotelId").value    = h.id;
    document.getElementById("nombre").value     = h.nombre ?? "";
    document.getElementById("descripcion").value= h.descripcion ?? "";
    document.getElementById("telefono").value   = h.telefono ?? "";
    document.getElementById("correo").value     = h.correo ?? "";
    document.getElementById("sitio_web").value  = h.sitio_web ?? "";
    document.getElementById("usuario").value    = h.usuario ?? "";
    document.getElementById("btnSave").textContent = "Actualizar";
    document.getElementById("hotelForm").scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    showAlert("Error al cargar hotel: " + e.message, "danger");
  }
};

window.deactivateHotel = async function(id) {
  if (!confirm("¿Desactivar este hotel?")) return;
  try {
    const res = await deleteHotel(id);
    showAlert(res.message ?? "Hotel desactivado.");
    loadHoteles();
  } catch (e) {
    showAlert("Error: " + e.message, "danger");
  }
};

// ── Search ────────────────────────────────────────────────

async function searchById() {
  const id = document.getElementById("searchId").value.trim();
  if (!id) return loadHoteles();
  try {
    const res = await getHotelById(id);
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) {
    showAlert("Error: " + e.message, "danger");
  }
}

async function searchByName() {
  const nombre = document.getElementById("searchName").value.trim();
  if (!nombre) return loadHoteles();
  try {
    const res = await getHotelByNombre(nombre);
    renderTable(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
  } catch (e) {
    showAlert("Error: " + e.message, "danger");
  }
}

// ── Init ──────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadHoteles();

  document.getElementById("btnSave").addEventListener("click", saveHotel);
  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnSearchId").addEventListener("click", searchById);
  document.getElementById("btnSearchName").addEventListener("click", searchByName);
  document.getElementById("btnLoadAll").addEventListener("click", loadHoteles);
});
