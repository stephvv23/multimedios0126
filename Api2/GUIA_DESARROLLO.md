# Guía de Desarrollo

## Para Desarrolladores de Hotel Manager Pro

---

## 🛠️ Herramientas Necesarias

1. **Editor de código**: VS Code, Sublime, WebStorm, etc.
2. **Navegador moderno**: Chrome, Firefox, Edge (con DevTools)
3. **Servidor local** (opcional): Live Server, Python http.server, etc.
4. **Git**: Para control de versiones

---

## 🚀 Configuración del Entorno

### Método 1: Abrir directamente
1. Navega a la carpeta `Api2/`
2. Haz doble click en `index.html`

### Método 2: Usar Live Server
1. Instala extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Método 3: Servidor Python
```bash
cd Api2/
python -m http.server 8000
# Luego accede a http://localhost:8000
```

---

## 📝 Estructura de Código

### Importes Correctos
```javascript
// ✓ CORRECTO - Siempre especificar .js al final
import { obtenerHoteles } from './hotelesService.js';
import { mostrarAlerta } from '../../components/UIComponent.js';

// ✗ INCORRECTO - Sin extension
import { obtenerHoteles } from './hotelesService';
```

### Nomenclatura
```javascript
// Variables y funciones: camelCase
const estadoHoteles = {};
const obtenerHoteles = async () => {};

// Clases: PascalCase (si las usas)
class HotelManager {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://...';
```

### Comentarios
```javascript
/**
 * Descripción breve de la función
 * @param {type} paramName - Descripción
 * @returns {type} Descripción de retorno
 */
export const miFunction = (paramName) => {
  // Comentarios internos solo si es complejo
};
```

---

## 🔧 Tareas Comunes

### Agregar un nuevo campo a un formulario

**1. En `*View.js`** (ej: `hotelesView.js`):
```javascript
export const generarFormularioHotel = (hotel = null) => {
  return `
    <div class="mb-3">
      <label for="nuevocampo" class="form-label">Nuevo Campo</label>
      <input type="text" class="form-control..." id="nuevocamp" name="nuevocamp" required>
    </div>
  `;
};
```

**2. En `*Controller.js`** (ej: `hotelesController.js`):
```javascript
const guardarHotel = async () => {
  const datosForm = extraerDatosFormulario(formulario);
  const datos = {
    nombre: datosForm.nombre,
    // ... campos existentes
    nuevocamp: datosForm.nuevocamp  // ← Agregar
  };
};
```

### Cambiar la URL de la API

Edita `config/apiConfig.js`:
```javascript
// Cambiar esta línea
export const API_BASE_URL = 'https://mi-servidor.com/api';
```

### Agregar validación customizada

En `*Service.js`:
```javascript
export const crearHotel = async (datos) => {
  // Validación existente
  if (!datos.nombre) return { success: false };
  
  // Agregar más validaciones
  if (datos.nombre.length < 3) {
    return { success: false, error: 'Nombre muy corto' };
  }
  
  return await crearRegistro(API_ENDPOINTS.hoteles.crear, datos);
};
```

### Customizar estilos

Edita `assets/css/styles.css`:
```css
/* Cambiar color primario */
:root {
  --primary-color: #tu-color; /* Cambiar aquí */
}

/* Agregar estilos personalizados */
.mi-clase-custom {
  background-color: #color;
  padding: 1rem;
}
```

---

## 🐛 Debugging

### Activar logs en consola

Los logs están listos, solo abre la consola del navegador (F12):

```javascript
// Ya están en httpService.js y baseController.js
console.log('[HTTP Error]', error);
console.log('[APP] Inicializando aplicación...');
```

### Usar DevTools

1. **F12 o Ctrl+Shift+I**: Abrir DevTools
2. **Console**: Ver logs y errores
3. **Network**: Ver requests HTTP
4. **Elements**: Inspeccionar HTML
5. **Application**: Verificar localStorage, etc.

### Realizar pruebas manuales

```javascript
// En consola del navegador (F12):

// Verificar estado del app
app.getModuloActual()

// Refrescar módulo actual
await app.refrescarModulo()

// Ver estado global
app.getEstado()
```

---

## 📋 Realizar un Cambio Completo

### Escenario: Cambiar el color del badge "Activo" de verde a azul

**Paso 1**: Identificar dónde está
```bash
# Buscar en todos los archivos
Ctrl+Shift+F "badge"
# Encontramos: hotelesView.js (línea 45)
```

**Paso 2**: Entender el contexto
```javascript
// En hotelesView.js
<span class="badge ${hotel.activo ? 'bg-success' : 'bg-danger'}">
  Activo
</span>
```

**Paso 3**: Realizar el cambio
```javascript
// Cambiar bg-success a bg-info (azul en Bootstrap)
<span class="badge ${hotel.activo ? 'bg-info' : 'bg-danger'}">
  Activo
</span>
```

**Paso 4**: Probar
1. Actualiza el navegador (F5)
2. Verifica que el cambio se vea

**Paso 5**: Repetir en otros módulos
- sedesView.js
- habitacionesView.js
- clientesView.js
- reservacionesView.js
- pagosView.js

---

## 🧬 Estructura de una Función Típica

```javascript
/**
 * Obtiene y renderiza los hoteles
 * @returns {Promise<void>}
 */
const filtrarYMostrarHoteles = () => {
  // 1. Obtener datos del estado
  const hotelesFiltrados = buscarHoteles(
    estadoHoteles.hoteles,
    estadoHoteles.termoBusqueda
  );
  
  // 2. Generar HTML
  const html = generarTablaHoteles(hotelesFiltrados);
  
  // 3. Obtener elemento del DOM
  const contenedor = document.getElementById('contenedor-tabla-hoteles');
  
  // 4. Inyectar HTML
  if (contenedor) {
    contenedor.innerHTML = html;
  }
};
```

---

## ✅ Checklist de Código

Antes de hacer commit, verifica:

- [ ] Imports necesarios incluidos (.js al final)
- [ ] Nombrado siguiendo convenciones (camelCase, PascalCase)
- [ ] Comentarios explicando lógica compleja
- [ ] Sin `console.log` de debug (usa los existentes)
- [ ] Validaciones de entrada
- [ ] Manejo de errores con try/catch
- [ ] Código DRY (Don't Repeat Yourself)
- [ ] Sin variables globales innecesarias
- [ ] Funciones pequeñas y focalizadas

---

## 🔄 Git Workflow

### Ciclo típico
```bash
# 1. Crear rama
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# ... editar archivos ...

# 3. Ver cambios
git status

# 4. Agregar cambios
git add .

# 5. Hacer commit
git commit -m "Agregar nueva funcionalidad: [descripción]"

# 6. Empujar rama
git push origin feature/nueva-funcionalidad

# 7. Pull request en GitHub
```

### Mensajes de commit
```bash
# ✓ BUENOS
git commit -m "Agregar validación de email en formulario de clientes"
git commit -m "Fijar bug: modal no cierra al desactivar hotel"
git commit -m "Mejorar rendimiento: cachear datos de módulos"

# ✗ MALOS
git commit -m "cambios"
git commit -m "arreglé algo"
git commit -m "fuck"
```

---

## 📊 Estructura de Pull Request

```markdown
# Descripción
Explica QUÉ cambió y POR QUÉ

# Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Cambio de documentación

# Cómo probar
Explica cómo probar los cambios

# Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He probado localmente
- [ ] Agregué comentarios donde es necesario
- [ ] No hay console.logs de debug
```

---

## 🎯 Performance Tips

### Evitar
```javascript
// ✗ MAD: Re-calculando en cada iteración
for (let i = 0; i < array.length; i++) { /* lento */ }

// ✗ MAD: Modificando el DOM constantemente
for (item of items) {
  container.innerHTML += `<div>${item}</div>`;
}

// ✗ MAD: Acceso al DOM en loops
for (item of items) {
  const element = document.getElementById('id');
}
```

### Hacer
```javascript
// ✓ BIEN: Cachear length
const len = array.length;
for (let i = 0; i < len; i++) { /* rápido */ }

// ✓ BIEN: Construir HTML en memoria
let html = '';
for (item of items) {
  html += `<div>${item}</div>`;
}
container.innerHTML = html;

// ✓ BIEN: Cachear referencias al DOM
const element = document.getElementById('id');
for (item of items) {
  // Usar elemento cacheado
}
```

---

## 🎓 Recursos de Aprendizaje

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [Modern JavaScript](https://www.syncfusion.com/javascript/)

### Web APIs
- [Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [DOM API](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model)
- [Web Components](https://developer.mozilla.org/es/docs/Web/Web_Components)

### Bootstrap
- [Bootstrap 5 Docs](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

### Herramientas
- [Can I Use](https://caniuse.com/) - Compatibilidad de navegadores
- [Color Picker](https://htmlcolorcodes.com/) - Seleccionar colores
- [JSON Validator](https://jsonlint.com/) - Validar JSON

---

## 🚨 Errores Comunes

### Error: "Cannot read property 'xxx' of undefined"
```javascript
// Causa: Accediendo a propiedad null/undefined
const nombre = hotel.nombre; // ← hotel es undefined

// Solución: Verificar antes
const nombre = hotel?.nombre || 'Sin nombre';
```

### Error: "Fetch failed"
```javascript
// Causa: CORS, API no disponible, URL incorrecta

// Solución: 
// 1. Verificar URL en config/apiConfig.js
// 2. Abrir Network tab en DevTools
// 3. Ver mensaje de error exacto
```

### Error: "Module not found"
```javascript
// Causa: Ruta incorrecta o falta .js

// ✗ Incorrecto
import { func } from '../services/httpService';

// ✓ Correcto
import { func } from '../services/httpService.js';
```

---

## 📞 Soporte

Preguntas frecuentes:

**P: ¿Cómo cambiará el navbar?**
R: Edita el HTML en `index.html` sección `<nav>`

**P: ¿Dónde agregar lógica de logout?**
R: En `app.js`, en la función `setupEventosGlobales()`

**P: ¿Cómo agregar notificaciones push?**
R: En `components/UIComponent.js`, crear nueva función `notificarPush()`

**P: ¿Cómo conectar a otra API?**
R: Cambia `API_BASE_URL` en `config/apiConfig.js` y ajusta `API_ENDPOINTS`

---

**Última actualización**: Mayo 2026
**Versión**: 1.0
**Mantenedor**: Equipo de Desarrollo
