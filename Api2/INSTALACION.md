# 🚀 INSTALACIÓN Y PRIMEROS PASOS

## Hotel Manager Pro - Guía de Inicio Rápido

---

## 📥 DESCARGA DEL PROYECTO

El proyecto **Hotel Manager Pro** ya está completo y listo para usar.

### Ubicación
```
Ruta: c:\Users\Estudiante\Documents\GitHub\multimedios0126\Api2\
```

### Contenido
✅ Todos los archivos necesarios están listos
✅ Estructura modular completa
✅ Documentación incluida
✅ Componentes reutilizables
✅ 6 módulos funcionales

---

## ⚡ INICIO RÁPIDO (30 SEGUNDOS)

### Opción 1: Abrir directamente (Más fácil)
```
1. Navega a: Api2/
2. Haz doble click en: index.html
3. ¡La aplicación abre en tu navegador!
```

### Opción 2: Usar Visual Studio Code
```
1. Abre VS Code
2. Abre la carpeta: File → Open Folder → Api2/
3. Click derecho en index.html
4. Selecciona: "Open with Live Server"
   (o instala la extensión "Live Server" si no la tienes)
```

### Opción 3: Usar Python (si tienes instalado)
```bash
cd Api2/
python -m http.server 8000
# Accede a: http://localhost:8000
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

Cuando abres `index.html`:

1. **Deberías ver**:
   - Logo "Hotel Manager Pro" en la esquina superior izquierda
   - Navbar con 6 módulos: Hoteles, Sedes, Habitaciones, Clientes, Reservaciones, Pagos
   - Una tabla con datos (si la API está disponible)

2. **Si ves errores**:
   - Abre la consola (F12)
   - Verifica si hay mensajes rojos
   - Lee la sección "SOLUCIÓN DE PROBLEMAS"

3. **Si los datos no cargan**:
   - Verifica tu conexión a internet
   - Comprueba que la URL de la API sea correcta: `https://paginas-web-cr.com/api`
   - Abre DevTools (F12) → Network tab → Busca requests a la API

---

## 📚 DOCUMENTACIÓN

Dentro del proyecto encontrarás:

| Archivo | Para | Tiempo |
|---------|------|--------|
| **README.md** | Usuarios: guía de cómo usar | 5 min |
| **RESUMEN.md** | Referencia rápida del proyecto | 3 min |
| **ARQUITECTURA.md** | Desarrolladores: entender el sistema | 15 min |
| **GUIA_DESARROLLO.md** | Developers: cómo extender | 20 min |
| **PLANTILLA_NUEVO_MODULO.md** | Crear nuevos módulos | 10 min |

### Lectura recomendada por rol:

**👤 Usuario "Gerente"**:
1. README.md (secciones "Descripción", "Cómo usar")
2. Listo para usar

**👨‍💻 Desarrollador "Frontend"**:
1. ARQUITECTURA.md (componentes)
2. GUIA_DESARROLLO.md (tareas comunes)
3. Código de un módulo (ej: hoteles/)

**🏗️ Arquitecto/Tech Lead**:
1. ARQUITECTURA.md (todo)
2. PLANTILLA_NUEVO_MODULO.md (extensibilidad)
3. app.js (orquestación central)

---

## 🎯 PRIMEROS PASOS COMO USUARIO

### 1️⃣ Explorar el Panel Principal (Hoteles)
```
1. Abre la aplicación
2. Verás la tabla de Hoteles
3. Busca un hotel en la barra de búsqueda
4. Click en ✏️ para editar o 🗑️ para desactivar
```

### 2️⃣ Crear un Nuevo Hotel
```
1. Click en botón "Nuevo" en la esquina superior derecha
2. Rellena el formulario:
   - Nombre: Ej: "Hotel Las Rocas"
   - Código: Ej: "HR001"
   - Ubicación: Ej: "San José"
   - Provincia: Ej: "San José"
   - Teléfono: Ej: "2222-2222"
   - Email: Ej: "info@hotelrocas.cr"
3. Click "Guardar"
4. Verás una alerta de éxito
5. El hotel aparecerá en la tabla
```

### 3️⃣ Cambiar de Módulo
```
1. Usa la navegación superior
2. Click en "Sedes" → ver sedes
3. Click en "Habitaciones" → ver habitaciones
4. Etc.
```

### 4️⃣ Buscar Registros
```
1. Escribe en la barra "Buscar"
2. La tabla filtra en tiempo real
3. Presiona Backspace para limpiar
```

---

## 🛠️ CONFIGURACIÓN INICIAL (SI NECESITAS CAMBIOS)

### Cambiar la URL de la API

**Archivo**: `config/apiConfig.js`

**Línea a cambiar**:
```javascript
// Busca esta línea (línea ~5)
export const API_BASE_URL = 'https://paginas-web-cr.com/api';

// Cámbiala por tu URL:
export const API_BASE_URL = 'https://mi-servidor.com/api';
```

### Cambiar colores del tema

**Archivo**: `assets/css/styles.css`

**Sección a cambiar** (línea ~1, en `:root`):
```css
--primary-color: #0d6efd;      /* Azul - cámbialo al que quieras */
--success-color: #198754;       /* Verde */
--danger-color: #dc3545;        /* Rojo */
```

**Colores populares**:
```
Azul:     #0d6efd o #007bff
Verde:    #198754 o #28a745
Rojo:     #dc3545 o #ff6b6b
Naranja:  #fd7e14 o #ff9800
Púrpura:  #7c3aed o #9c27b0
```

---

## 🖅 ACTUALIZAR PROYECTO DESDE GIT

Si el proyecto está en Git:

```bash
# Navega a la carpeta
cd c:\Users\Estudiante\Documents\GitHub\multimedios0126\Api2\

# Obtén los cambios más recientes
git pull origin main

# Verifica el estado
git status
```

---

## 🔄 ACTUALIZAR DEPENDENCIAS (si agrega algunas en el futuro)

Actualmente el proyecto **NO tiene dependencias** (funciona con JavaScript puro).

Si en el futuro alguien agrega dependencias:
```bash
# Si hay package.json
npm install

# Si hay requirements.txt (Python)
pip install -r requirements.txt
```

---

## 📱 USAR EN MÓVIL O TABLET

La aplicación es **100% responsive**:

1. Funciona en smartphone, tablet, laptop
2. El layout se adapta automáticamente
3. Usa Bootstrap 5 Grid System

**Para ver en móvil**:
- Opción 1: Abre en navegador del teléfono
- Opción 2: En PC, abre DevTools (F12) → Click en icono móvil (alto abajo-izquierda)

---

## 🌐 DESPLEGAR A PRODUCCIÓN

Si quieres publicar en internet:

### Opción 1: GitHub Pages (Gratis)
```bash
# Sube los archivos a un repositorio GitHub
# Habilita GitHub Pages en Settings
# URL: https://usuario.github.io/multimedios0126/Api2/
```

### Opción 2: Hosting como Netlify (Gratis)
```
1. Sube archivos a GitHub
2. Conecta a Netlify
3. Se despliega automáticamente
```

### Opción 3: Hosting tradicional (Pago)
```
1. Compra hosting + dominio
2. Upload archivos vía FTP
3. Listo
```

---

## 🔒 SEGURIDAD PARA PRODUCCIÓN

Antes de ir a producción, considera:

- [ ] Usar HTTPS (certificado SSL)
- [ ] Validar inputs en backend también
- [ ] Implementar autenticación (JWT)
- [ ] Rate limiting en API
- [ ] CORS configurado correctamente
- [ ] Logs de seguridad

Ver más en `ARQUITECTURA.md` sección "Seguridad"

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Puedo cambiar el nombre "Hotel Manager Pro"?
**R:** Sí, en `index.html` busca `"Hotel Manager Pro"` y cámbialo

### P: ¿Cómo cambio el logo?
**R:** En `index.html` línea ~72, edita el `<i class="bi bi-building"></i>`
```html
<!-- Cambiar de: -->
<i class="bi bi-building"></i> Hotel Manager Pro

<!-- A: -->
<i class="bi bi-houses"></i> Mi Hotel
```

### P: ¿Cómo agrego más campos a un formulario?
**R:** Ver `PLANTILLA_NUEVO_MODULO.md` o `GUIA_DESARROLLO.md`

### P: ¿Puedo usar esta aplicación offline?
**R:** No sin modificar (necesita API). Pero pueden agregar LocalStorage

### P: ¿Es gratis el proyecto?
**R:** Sí, código abierto. Úsalo como quieras

### P: ¿Puede manejar 10,000+ registros?
**R:** Sí, pero considera paginar los resultados

### P: ¿Funciona en IE11?
**R:** No. Funciona en navegadores modernos (Chrome, Firefox, Edge, Safari)

---

## 📞 SOPORTE

### Si algo no funciona:

1. **Revisa la consola** (F12 en el navegador)
2. **Lee los logs** que aparecen en la consola
3. **Verifica la conexión** con la API
4. **Comprueba que** todos los archivos están en su lugar
5. **Recarga la página** (Ctrl+F5)

### Errores comunes:

```
Error: "Cannot find module"
├─ Causa: Import sin .js al final
└─ Solución: Agregar .js al final de imports

Error: "No data from API"
├─ Causa: URL de API incorrecta o API offline
└─ Solución: Verificar config/apiConfig.js y conectividad

Error: "Styles not loading"
├─ Causa: CSS no se cargó
└─ Solución: Recarga (Ctrl+F5) o verifica ruta
```

---

## 📊 SIGUIENTE PASO

Después de confirmr que funciona:

1. **Explora los módulos** (Hoteles, Sedes, etc.)
2. **Lee la documentación** (README.md)
3. **Personaliza** (colores, campos, etc.)
4. **Extiende** (agrega nuevos módulos siguiendo PLANTILLA_NUEVO_MODULO.md)
5. **Despliega** (sube a servidor)

---

## 🎉 ¡LISTO!

Tu aplicación **Hotel Manager Pro** está completamente funcional.

Para más información, revisa los archivos `.md` en la carpeta raíz del proyecto.

**¿Qué waits? ¡Empieza a usarla! 🚀**

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026  
**Estado**: ✅ Completamente funcional
