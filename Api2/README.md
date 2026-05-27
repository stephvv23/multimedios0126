# Hotel Manager Pro - Sistema de Administración Hotelera

## 📋 Descripción General

**Hotel Manager Pro** es una aplicación web de una sola página (SPA) profesional desarrollada en JavaScript ES6+ puro, HTML5 y CSS3 con Bootstrap 5. Permite administrar todos los aspectos de una operación hotelera: hoteles, sedes, habitaciones, clientes, reservaciones y pagos.

### Características Principales

✅ **Arquitectura Modular**: Separación clara de responsabilidades (controladores, servicios, vistas)
✅ **SPA (Single Page Application)**: Navegación sin recargas de página
✅ **Diseño Responsive**: Compatible con dispositivos móviles, tablets y desktops
✅ **Tema Oscuro Profesional**: Interfaz moderna y cómoda para largas sesiones
✅ **CRUD Completo**: Crear, Leer, Actualizar y Desactivar registros
✅ **Consumo de API REST**: Integración con `https://paginas-web-cr.com/api`
✅ **Sin Dependencias Externas**: Únicamente Bootstrap 5 para estilos y JS puro
✅ **Validaciones de Datos**: Validación básica de formularios
✅ **Mensajes de Usuario**: Alertas, confirmaciones, loaders

---

## 📁 Estructura del Proyecto

```
Api2/
├── index.html                 # Archivo HTML principal
├── app.js                     # Orquestador de la SPA
│
├── config/
│   └── apiConfig.js           # Configuración de endpoints y constantes
│
├── services/
│   └── httpService.js         # Servicio HTTP genérico (Fetch API)
│
├── controllers/
│   └── baseController.js      # Controlador genérico CRUD
│
├── components/
│   └── UIComponent.js         # Componentes reutilizables (modales, tablas, etc)
│
├── views/                     # Carpeta vacía (vistas en modules)
│
├── modules/
│   ├── hoteles/
│   │   ├── hotelesController.js
│   │   ├── hotelesService.js
│   │   └── hotelesView.js
│   ├── sedes/
│   │   ├── sedesController.js
│   │   ├── sedesService.js
│   │   └── sedesView.js
│   ├── habitaciones/
│   │   ├── habitacionesController.js
│   │   ├── habitacionesService.js
│   │   └── habitacionesView.js
│   ├── clientes/
│   │   ├── clientesController.js
│   │   ├── clientesService.js
│   │   └── clientesView.js
│   ├── reservaciones/
│   │   ├── reservacionesController.js
│   │   ├── reservacionesService.js
│   │   └── reservacionesView.js
│   └── pagos/
│       ├── pagosController.js
│       ├── pagosService.js
│       └── pagosView.js
│
├── assets/
│   └── css/
│       └── styles.css         # Estilos principales (diseño oscuro)
│
└── README.md                  # Este archivo
```

---

## 🚀 Cómo Usar la Aplicación

### Pasos Iniciales

1. **Abrir la aplicación**: Abre el archivo `index.html` en un navegador moderno
2. **Navegar por módulos**: Usa el navbar superior para cambiar entre módulos
3. **Cargar datos**: Los datos se cargan automáticamente desde la API al abrir cada módulo

### Navegación

El navbar superior contiene 6 módulos principales:

- **🏢 Hoteles**: Gestión de hoteles
- **📍 Sedes**: Gestión de ubicaciones/sedes
- **🚪 Habitaciones**: Inventario de habitaciones
- **👥 Clientes**: Base de datos de clientes
- **📅 Reservaciones**: Sistema de reservas
- **💳 Pagos**: Gestión de transacciones

### Operaciones CRUD

Cada módulo tiene las siguientes funciones:

#### **Crear**
1. Haz clic en "Nuevo [Elemento]" en la esquina superior derecha
2. Completa el formulario en el modal
3. Haz clic en "Guardar"

#### **Consultar/Listar**
1. Al entrar a un módulo, los registros se cargan automáticamente
2. Usa la barra de búsqueda para filtrar registros
3. Haz clic en una fila para ver detalles

#### **Actualizar**
1. Haz clic en el botón ✏️ (Editar) en la tabla
2. Modifica los datos en el formulario
3. Haz clic en "Guardar"

#### **Desactivar**
1. Haz clic en el botón 🗑️ (Eliminar/Desactivar) en la tabla
2. Confirma la acción en el modal de confirmación
3. El registro se desactivará (no se elimina físicamente)

---

## 🔧 Configuración de la API

Los endpoints de la API se configuran en `config/apiConfig.js`:

```javascript
export const API_BASE_URL = 'https://paginas-web-cr.com/api';

export const API_ENDPOINTS = {
  hoteles: {
    listado: '/hoteles',
    detalle: '/hoteles/:id',
    crear: '/hoteles',
    actualizar: '/hoteles/:id',
    desactivar: '/hoteles/:id'
  },
  // ... más módulos
};
```

### Cambiar la URL base

Si la API está en una URL diferente, edita `API_BASE_URL` en `config/apiConfig.js`.

---

## 📝 Documentación Técnica

### Arquitectura de Módulos

Cada módulo sigue el patrón MVC:

1. **Model/Service** (`*Service.js`): Interactúa con la API
2. **View** (`*View.js`): Genera el HTML de la interfaz
3. **Controller** (`*Controller.js`): Orquesta el módulo

### Servicios HTTP

El archivo `services/httpService.js` proporciona funciones HTTP genéricas:

```javascript
import { fetchGET, fetchPOST, fetchPUT, fetchDELETE } from './httpService.js';

// Obtener datos
const datos = await fetchGET('/hoteles');

// Crear registro
const resultado = await fetchPOST('/hoteles', { nombre: 'Hotel Test' });

// Actualizar
const actualizado = await fetchPUT('/hoteles/1', { nombre: 'Hotel Nuevo' });

// Eliminar
const eliminado = await fetchDELETE('/hoteles/1');
```

### Componentes UI Reutilizables

El archivo `components/UIComponent.js` proporciona componentes:

```javascript
// Mostrar alerta
mostrarAlerta('Mensaje', 'success', 3000);

// Mostrar confirmación
mostrarConfirmacion('¿Está seguro?', () => { /* Confirmar */ });

// Mostrar loader
const id = mostrarLoader('Cargando...');
ocultarLoader(id);

// Crear tabla
crearTabla(columnas, filas, acciones);

// Crear formulario
crearFormulario(campos, onSubmit);
```

### Controlador Base

El archivo `controllers/baseController.js` tiene funciones CRUD genéricas:

```javascript
import { 
  obtenerListado, 
  crearRegistro, 
  actualizarRegistro, 
  desactivarRegistro,
  validarDatos 
} from './baseController.js';

// Usar en cada módulo
const hoteles = await obtenerListado('/hoteles');
```

---

## 🎨 Personalización

### Cambiar Colores

Los colores se definen como variables CSS en `assets/css/styles.css`:

```css
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
  /* ... más colores */
}
```

### Agregar un Nuevo Módulo

1. Crea una carpeta en `modules/[nombre_modulo]/`
2. Crea tres archivos:
   - `[modulo]Service.js` - Consumir API
   - `[modulo]View.js` - Generar HTML
   - `[modulo]Controller.js` - Orquestar

3. Importa el controlador en `app.js`:
```javascript
import { inicializar[Modulo] } from './modules/[modulo]/[modulo]Controller.js';

// Agregar a estadoApp.controladores
```

4. Agrega un div en `index.html`:
```html
<div id="modulo-[modulo]" class="modulo-vista d-none"></div>
```

---

## 🌐 Endpoints de la API

La aplicación espera los siguientes endpoints:

```
GET    /api/[recurso]              - Obtener todos
GET    /api/[recurso]/:id          - Obtener uno
POST   /api/[recurso]              - Crear
PUT    /api/[recurso]/:id          - Actualizar
DELETE /api/[recurso]/:id          - Desactivar
```

Donde `[recurso]` puede ser: `hoteles`, `sedes`, `habitaciones`, `clientes`, `reservaciones`, `pagos`

---

## 📱 Responsividad

La aplicación es completamente responsive:

- **Desktop (> 1024px)**: Vista completa optimizada
- **Tablet (768px - 1024px)**: Ajustes de padding y font-size
- **Mobile (< 768px)**: Stack vertical, tablas scroll horizontal

Los breakpoints se definen en `assets/css/styles.css` usando media queries.

---

## 🔐 Validaciones

- **Campos requeridos**: Se validan con `required` en formularios
- **Formatos**: Email y valores numéricos se validan
- **Confirmaciones**: Acciones críticas requieren confirmación del usuario

---

## 📊 Características por Módulo

### Hoteles
- Crear/editar hoteles
- Información: nombre, código, ubicación, provincia, contacto
- Búsqueda por nombre, código o ubicación

### Sedes
- Gestionar sedes u oficinas
- Información: nombre, ubicación, teléfono
- Búsqueda por nombre o ubicación

### Habitaciones
- Inventario de habitaciones
- Información: número, tipo, precio, capacidad
- Búsqueda por número o tipo

### Clientes
- Base de datos de clientes
- Información: nombre, cédula, email, teléfono, nacionalidad, dirección
- Búsqueda por nombre, email o cédula

### Reservaciones
- Sistema de reservas
- Información: cliente, habitación, fechas, estado, observaciones
- Cálculo automático de noches
- Estados: Confirmada, Cancelada, Completada

### Pagos
- Gestión de pagos y transacciones
- Dashboard con estadísticas totales
- Información: reservación, monto, método, Estado
- Búsqueda por método o estado
- Métodos: Tarjeta Crédito, Débito, Transferencia, Efectivo, Cheque

---

## 🐛 Solución de Problemas

### La aplicación no carga
- Verifica que abras `index.html` en un navegador moderno
- Revisa la consola del navegador (F12)

### Los datos no se cargan
- Verifica tu conexión a internet
- Comprueba que la URL de la API sea correcta
- Abre la consola para ver mensajes de error

### Los estilos se ven mal
- Asegúrate de que `styles.css` esté en la ruta correcta
- Limpia el caché del navegador (Ctrl+Shift+Delete)

### Los formularios no funcionan
- Verifica que Bootstrap 5 se haya cargado correctamente
- Abre la consola para errores de JavaScript

---

## 📚 Referencias

- **Bootstrap 5**: https://getbootstrap.com/
- **Bootstrap Icons**: https://icons.getbootstrap.com/
- **Fetch API**: https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- **ES6 Modules**: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules

---

## 💡 Consejos de Uso

1. **Búsqueda**: Usa la barra de búsqueda para filtrar resultados en tiempo real
2. **Validación**: Los formularios validan datos antes de guardar
3. **Confirmación**: Las acciones críticas siempre piden confirmación
4. **Responsive**: La aplicación se adapta automáticamente al tamaño de la pantalla
5. **Persistencia**: Los datos se guardan en el servidor, no localmente

---

## 🔄 Flujo de Datos

```
Usuario Interactúa
    ↓
Controlador (Controller)
    ↓
Servicio (Service)
    ↓
HTTP Service (Fetch API)
    ↓
API REST
    ↓
Respuesta JSON
    ↓
Actualizar DOM/Vista
    ↓
Usuario ve cambios
```

---

## 📞 Soporte

Para reportar errores o sugerir mejoras, contacta al desarrollador.

---

## 📄 Versión

**Hotel Manager Pro v1.0**
Desarrollado: Mayo 2026

---

**Hecho con ❤️ usando JavaScript puro, HTML5, CSS3 y Bootstrap 5**
