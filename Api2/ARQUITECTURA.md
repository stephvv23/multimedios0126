# Documentación de Arquitectura

## Hotel Manager Pro - SPA de Administración Hotelera

---

## 📐 Arquitectura General

### Patrón Arquitectónico: MVC + Servicios

La aplicación implementa una variante del patrón MVC (Model-View-Controller) con una capa de servicios adicional:

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE DE USUARIO                     │
│                      (HTML + CSS)                           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLADORES (JS)                        │
│  Orquestación → Estado → Eventos → Validación              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│        COMPONENTES UI + SERVICIOS DE APLICACIÓN             │
│  UIComponent.js (Modales, Tablas, Alertas)                 │
│  Helper.js (Utilidades, Validaciones)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              SERVICIOS DE NEGOCIO (Services)                │
│  Lógica de datos → Transformación → Validación             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│           HTTP SERVICE (httpService.js)                     │
│        Fetch API → Manejo de errores → JSON                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    API REST REMOTA                          │
│          https://paginas-web-cr.com/api                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Capas de la Aplicación

### 1. **Capa de Presentación (UI)**
- **Ubicación**: `index.html`, `assets/css/styles.css`
- **Responsabilidad**: Renderizar interfaz, mostrar datos, capturar eventos del usuario
- **Tecnologías**: HTML5, CSS3, Bootstrap 5

### 2. **Capa de Controladores**
- **Ubicación**: `modules/[modulo]/[modulo]Controller.js`
- **Responsabilidad**: Orquestar eventos, gestionar estado del módulo, coordinar vista y servicio
- **Patrón**: Cada controlador maneja un módulo completo

### 3. **Capa de Servicios de Negocio**
- **Ubicación**: `modules/[modulo]/[modulo]Service.js`
- **Responsabilidad**: Lógica de negocio, validaciones de datos, llamadas HTTP
- **Patrón**: Servicios específicos por módulo que usan `baseController.js`

### 4. **Capa de HTTP/API**
- **Ubicación**: `services/httpService.js`
- **Responsabilidad**: Comunicación con API REST, manejo de errores HTTP
- **Patrón**: Funciones genéricas para GET, POST, PUT, DELETE

### 5. **Capa de Configuración**
- **Ubicación**: `config/apiConfig.js`
- **Responsabilidad**: URLs, endpoints, constantes de la aplicación
- **Patrón**: Configuración centralizada

### 6. **Capa de Utilidades**
- **Ubicación**: `components/UIComponent.js`, `assets/js/helpers.js`
- **Responsabilidad**: Funciones reutilizables, componentes UI genéricos
- **Patrón**: Funciones puras sin estado

---

## 🔄 Flujo de Datos

### Ciclo de vida de una operación CRUD

```
1. USUARIO INTERACTÚA
   └─ Click en botón → Llamada a función global (window.editarHotel)

2. CONTROLADOR INTERCEPTA
   └─ hotelesController.editarHotel()
      └─ Extrae datos del DOM
      └─ Valida entrada
      └─ Llama al servicio

3. SERVICIO PROCESA
   └─ hotelesService.actualizarHotel()
      └─ Validana datos de negocio
      └─ Llama a baseController.actualizarRegistro()
      └─ Este llama a httpService.fetchPUT()

4. HTTP SERVICE COMUNICA
   └─ httpService.fetchPUT()
      └─ Realiza Fetch API
      └─ Maneja errores HTTP
      └─ Retorna respuesta

5. VISTA SE ACTUALIZA
   └─ Controlador recibe respuesta
      └─ Si éxito: cierra modal, muestra alerta, refresca datos
      └─ SI fallo: muestra mensaje de error

6. DOM SE RENDERIZA
   └─ hotelesView.generarTablaHoteles()
      └─ Genera HTML con datos nuevos
      └─ Inyecta en el DOM
      └─ Asigna event listeners
```

---

## 📦 Responsabilidades de Cada Capa

### View (hotelesView.js)
```javascript
// Genera HTML estático
export const generarVistaHoteles = (hoteles) => {
  return `<div>...HTML...</div>`;
};

// Solo responsabilidad: retornar strings de HTML
```

### Service (hotelesService.js)
```javascript
// Lógica de negocio + validación
export const actualizarHotel = async (id, datos) => {
  // Validar datos
  if (!datos.nombre) return { success: false };
  
  // Llamar a controlador base
  return await actualizarRegistro(endpoint, datos);
};
```

### Controller (hotelesController.js)
```javascript
// Orquestación + Event listeners
const guardarHotel = async () => {
  // Obtener datos del formulario
  const datos = extraerDatosFormulario(formulario);
  
  // Llamar a servicio
  const resultado = await crearHotel(datos);
  
  // Actualizar vista
  await inicializarHoteles();
};
```

### HTTP Service (httpService.js)
```javascript
// Comunicación pura con API
export const fetchPUT = (endpoint, data) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```

---

## 🎯 Patrones Utilizados

### 1. **Singleton Pattern**
Cada módulo tiene un único estado global:
```javascript
let estadoHoteles = {
  hoteles: [],
  hotelEditando: null,
  termoBusqueda: ''
};
```

### 2. **Service Locator Pattern**
El `app.js` actúa como localizador central:
```javascript
const estadoApp = {
  controladores: {
    hoteles: inicializarHoteles,
    sedes: inicializarSedes,
    // ...
  }
};
```

### 3. **Observer Pattern**
Event listeners en componentes UI:
```javascript
document.getElementById('btn-guardar').addEventListener('click', guardarHotel);
```

### 4. **Factory Pattern**
Generadores de HTML (componentes):
```javascript
export const crearTabla = (columnas, filas) => { /* ... */ };
export const crearFormulario = (campos) => { /* ... */ };
```

### 5. **Repository Pattern**
Servicios actúan como repositorios de datos:
```javascript
export const obtenerHoteles = () => fetchGET(API_ENDPOINTS.hoteles.listado);
```

---

## 🔌 Inyección de Dependencias

Las dependencias se inyectan via imports ES6:

```javascript
// En hotelesController.js
import { generarVistaHoteles } from './hotelesView.js';
import { obtenerHoteles } from './hotelesService.js';
import { mostrarAlerta } from '../../components/UIComponent.js';

// Todas las dependencias se inyectan en la función
export const inicializarHoteles = async () => {
  const hoteles = await obtenerHoteles(); // ← Inyección
  const vista = generarVistaHoteles(hoteles); // ← Inyección
};
```

---

## 🌊 Estado Global vs Estado Local

### Estado Global del módulo
```javascript
let estadoHoteles = {      // ← Estado persistente durante sesión
  hoteles: [],
  hotelEditando: null,
  termoBusqueda: ''
};
```

### Estado en funciones
```javascript
const guardarHotel = async () => {
  const datoForm = extraerDatosFormulario(formulario); // ← Estado temporal
  const resultado = await crearHotel(datos); // ← Estado temporal
};
```

---

## 🔐 Manejo de Errores

### En HTTP Service
```javascript
if (!response.ok) {
  throw {
    status: response.status,
    message: obtenerMensajeError(response.status)
  };
}
```

### En Controller
```javascript
try {
  const resultado = await crearHotel(datos);
  if (resultado.success) { /* Éxito */ }
} catch (error) {
  mostrarAlerta('Error', 'danger');
}
```

---

## 📊 Escalabilidad

### Agregar un Módulo Nuevo

1. **Crear estructura de carpetas**
```
modules/usuarios/
├── usuariosService.js
├── usuariosView.js
└── usuariosController.js
```

2. **Implementar Service**
```javascript
export const obtenerUsuarios = () => {
  return fetchGET(API_ENDPOINTS.usuarios.listado);
};
```

3. **Implementar View**
```javascript
export const generarVistaUsuarios = (usuarios) => {
  return `<div>...HTML...</div>`;
};
```

4. **Implementar Controller**
```javascript
export const inicializarUsuarios = async () => {
  const usuarios = await obtenerUsuarios();
  // Renderizar...
};
```

5. **Registrar en app.js**
```javascript
import { inicializarUsuarios } from './modules/usuarios/usuariosController.js';

estadoApp.controladores.usuarios = inicializarUsuarios;
```

6. **Agregar en index.html**
```html
<div id="modulo-usuarios" class="modulo-vista d-none"></div>
```

7. **Agregar en navbar**
```html
<a class="nav-link" onclick="cambiarVista('usuarios')">Usuarios</a>
```

---

## 🧪 Testing

### Estructura para testing (recomendado)
```
tests/
├── hoteles.test.js
├── sedes.test.js
└── helpers.test.js
```

### Ejemplo de test
```javascript
import { esEmailValido } from '../assets/js/helpers.js';

test('esEmailValido debe validar emails correctamente', () => {
  expect(esEmailValido('test@example.com')).toBe(true);
  expect(esEmailValido('invalido')).toBe(false);
});
```

---

## 🚀 Optimizaciones Implementadas

1. **Lazy Loading**: Módulos se cargan bajo demanda
2. **Event Delegation**: Uso eficiente de event listeners
3. **DOM Caching**: Referencias a elementos del DOM se cachean
4. **API Caching**: Los datos se mantienen en estado local
5. **Minificación de CSS**: Usando Bootstrap CDN

---

## 📈 Rendimiento

### Métricas esperadas
- **First Paint**: < 1s
- **Interactive**: < 2s
- **Module Load Time**: < 500ms per módulo
- **API Response Time**: Varía según servidor

### Estrategias de optimización futura
1. Implementar Service Workers
2. Agregar Web Workers para procesamiento
3. Implementar Progressive Web App (PWA)
4. Usar IndexedDB para caché local

---

## 🔐 Seguridad

### Medidas implementadas
1. **HTTPS**: Conexión encriptada con API
2. **CORS**: Manejo de políticas CORS
3. **Validación de entrada**: En formularios
4. **Sanitización de datos**: Antes de renderizar

### Mejoras recomendadas
1. Implementar JWT tokens
2. Agregar rate limiting
3. Validación de CSRF
4. Content Security Policy (CSP)

---

## 📚 Referencias de Arquitectura

- [Martin Fowler - MVC Pattern](https://martinfowler.com/)
- [Clean Architecture](https://blog.cleancoder.com/)
- [JavaScript Design Patterns](https://refactoring.guru/design-patterns/javascript)

---

**Documento de Arquitectura - Hotel Manager Pro v1.0**
