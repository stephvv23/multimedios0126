const BASE_URL = "https://paginas-web-cr.com/Api/hotelApi";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function request(url, method = "GET", body = null) {
  const options = { method, headers: JSON_HEADERS };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try { const err = await res.json(); msg = err.message ?? JSON.stringify(err); } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// ── Hoteles ──────────────────────────────────────────────
export const getHoteles       = ()         => request(`${BASE_URL}/hotel/hotel.php`);
export const getHotelById     = (id)       => request(`${BASE_URL}/hotel/hotel.php?id=${id}`);
export const getHotelByNombre = (nombre)   => request(`${BASE_URL}/hotel/hotel.php?nombre=${encodeURIComponent(nombre)}`);
export const createHotel      = (data)     => request(`${BASE_URL}/hotel/hotel.php`, "POST",   data);
export const updateHotel      = (data)     => request(`${BASE_URL}/hotel/hotel.php`, "PUT",    data);
export const deleteHotel      = (id)       => request(`${BASE_URL}/hotel/hotel.php`, "DELETE", { id });

// ── Sedes ─────────────────────────────────────────────────
export const getSedes         = ()         => request(`${BASE_URL}/sede/sede.php`);
export const getSedeById      = (id)       => request(`${BASE_URL}/sede/sede.php?id=${id}`);
export const getSedeByNombre  = (nombre)   => request(`${BASE_URL}/sede/sede.php?nombre=${encodeURIComponent(nombre)}`);
export const createSede       = (data)     => request(`${BASE_URL}/sede/sede.php`, "POST",   data);
export const updateSede       = (data)     => request(`${BASE_URL}/sede/sede.php`, "PUT",    data);
export const deleteSede       = (id)       => request(`${BASE_URL}/sede/sede.php`, "DELETE", { id });

// ── Habitaciones ──────────────────────────────────────────
export const getHabitaciones       = ()       => request(`${BASE_URL}/habitacion/habitacion.php`);
export const getHabitacionById     = (id)     => request(`${BASE_URL}/habitacion/habitacion.php?id=${id}`);
export const getHabitacionByNombre = (nombre) => request(`${BASE_URL}/habitacion/habitacion.php?nombre=${encodeURIComponent(nombre)}`);
export const createHabitacion      = (data)   => request(`${BASE_URL}/habitacion/habitacion.php`, "POST",   data);
export const updateHabitacion      = (data)   => request(`${BASE_URL}/habitacion/habitacion.php`, "PUT",    data);
export const deleteHabitacion      = (id)     => request(`${BASE_URL}/habitacion/habitacion.php`, "DELETE", { id });

// ── Clientes ──────────────────────────────────────────────
export const getClientes       = ()         => request(`${BASE_URL}/cliente/cliente.php`);
export const getClienteById    = (id)       => request(`${BASE_URL}/cliente/cliente.php?id=${id}`);
export const getClienteByNombre= (nombre)   => request(`${BASE_URL}/cliente/cliente.php?nombre=${encodeURIComponent(nombre)}`);
export const createCliente     = (data)     => request(`${BASE_URL}/cliente/cliente.php`, "POST",   data);
export const updateCliente     = (data)     => request(`${BASE_URL}/cliente/cliente.php`, "PUT",    data);
export const deleteCliente     = (id)       => request(`${BASE_URL}/cliente/cliente.php`, "DELETE", { id });

// ── Reservaciones ─────────────────────────────────────────
export const getReservaciones       = ()     => request(`${BASE_URL}/reservacion/reservacion.php`);
export const getReservacionById     = (id)   => request(`${BASE_URL}/reservacion/reservacion.php?id=${id}`);
export const createReservacion      = (data) => request(`${BASE_URL}/reservacion/reservacion.php`, "POST",   data);
export const updateReservacion      = (data) => request(`${BASE_URL}/reservacion/reservacion.php`, "PUT",    data);
export const deleteReservacion      = (id)   => request(`${BASE_URL}/reservacion/reservacion.php`, "DELETE", { id });

// ── Pagos ─────────────────────────────────────────────────
export const getPagos       = ()     => request(`${BASE_URL}/pago/pago.php`);
export const getPagoById    = (id)   => request(`${BASE_URL}/pago/pago.php?id=${id}`);
export const createPago     = (data) => request(`${BASE_URL}/pago/pago.php`, "POST",   data);
export const updatePago     = (data) => request(`${BASE_URL}/pago/pago.php`, "PUT",    data);
export const deletePago     = (id)   => request(`${BASE_URL}/pago/pago.php`, "DELETE", { id });
