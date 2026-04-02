# 🏛️ OEA Panel de Comunicaciones Pro — Google Apps Script
## Guía de Instalación Completa

---

## ARCHIVOS INCLUIDOS

| Archivo | Descripción |
|---------|-------------|
| `Code.gs` | Lógica principal: menú, datos, alertas, exportaciones |
| `Sidebar.html` | Panel interactivo (abre como barra lateral en Google Sheets) |
| `appsscript.json` | Manifiesto de permisos |

---

## INSTALACIÓN PASO A PASO

### 1. Abrir Apps Script

1. Abre tu Google Sheet en `docs.google.com/spreadsheets`
2. En el menú superior: **Extensiones → Apps Script**
3. Se abre el editor de Apps Script en una nueva pestaña

### 2. Crear los archivos

**Archivo 1 — Code.gs** (ya existe por defecto):
- Selecciona todo el contenido del editor
- Borrarlo y pegar el contenido de `Code.gs`
- Guardar: `Ctrl+S` (Mac: `Cmd+S`)

**Archivo 2 — Sidebar.html**:
- Clic en **"+"** junto a "Archivos"
- Selecciona **HTML**
- Nombre: `Sidebar` (exactamente así, sin .html)
- Pega el contenido de `Sidebar.html`
- Guardar

**Archivo 3 — appsscript.json** (manifiesto):
- En el menú izquierdo del editor, clic en ⚙️ (Configuración del proyecto)
- Activa la casilla **"Mostrar el archivo de manifiesto 'appsscript.json' en el editor"**
- Vuelve al editor, selecciona `appsscript.json`
- Reemplaza el contenido con el del archivo `appsscript.json`
- Guardar

### 3. Ejecutar por primera vez

1. En el editor de Apps Script, selecciona la función `onOpen` en el menú desplegable
2. Haz clic en **▶ Ejecutar**
3. Aparecerá el diálogo de autorización de permisos:
   - Clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Clic en **"Avanzado"** → **"Ir a [nombre del proyecto] (no seguro)"**
   - Clic en **"Permitir"**

### 4. Volver al Google Sheet

1. Cierra el editor de Apps Script
2. Recarga tu Google Sheet (`F5` o `Cmd+R`)
3. En el menú superior verás: **🏛️ OEA Panel**

---

## CONFIGURACIÓN INICIAL

### Inicializar hojas de datos

1. **OEA Panel → Inicializar hojas de datos**
   - Crea la hoja `OEA_Datos` con la estructura correcta
   - Crea la hoja `OEA_Config` con parámetros
   - Crea la hoja `OEA_Alertas` para el historial

2. **OEA Panel → Importar datos de ejemplo**
   - Agrega 6 periodos de ejemplo para ver el panel funcionando

### Configurar correos del equipo

1. Ve a la hoja `OEA_Config`
2. Busca las filas que empiezan con `email_`
3. Ingresa el correo de cada responsable:
   ```
   email_karen          → correo de Karen (Redes Sociales)
   email_mar_a_isabel   → correo de María Isabel / Paola (Web)
   email_m_nica         → correo de Mónica (Email)
   email_kerne          → correo de Kerne / Ernesto (Video)
   email_juan_manuel    → correo de Juan Manuel (Fotografía)
   ```

---

## USO DEL PANEL

### Abrir el Panel
**OEA Panel → Abrir Panel de Métricas**

El panel se abre como una barra lateral a la derecha (460px de ancho).

### Pestañas disponibles

| Pestaña | Función |
|---------|---------|
| 📊 Panel | KPIs, gráfica de variación, tabla completa |
| ↕ Comp. | Comparativas mes/trimestre/semestre/año/usuario×tiempo |
| 👤 Usuarios | Año a año por responsable |
| ✏️ Datos | Ingresar / editar periodos directamente |
| ⬇ Export | CSV, Excel, PDF, Word, PowerPoint, Tabla en Sheet |
| 🔔 Alertas | Configurar correos y enviar recordatorios |

### Pestaña de Alertas

1. Ve a la pestaña **🔔 Alertas**
2. Ingresa los correos del equipo
3. Clic en **"💾 Guardar correos"**
4. Escribe el nombre del periodo pendiente
5. Clic en **"🔔 Enviar alertas al equipo"**

Cada responsable recibe un correo HTML personalizado con:
- Sus métricas específicas (tabla vacía para llenar)
- La fecha límite configurada
- Instrucciones de entrega

---

## ESTRUCTURA DE DATOS

La hoja `OEA_Datos` tiene la siguiente estructura:

| Columna | ID | Descripción |
|---------|-----|-------------|
| A | periodo | Nombre del periodo (ej. "Q1-2026") |
| B | tweets | Tweets emitidos |
| C | seguidores | Nuevos seguidores |
| D | impresiones | Impresiones (en millones) |
| E | visitantes | Visitantes únicos |
| F | pageviews | Páginas vistas (en millones) |
| G | email_productos | Productos de email enviados |
| H | email_lecturas | Lecturas totales de email |
| I | email_apertura | Ratio de apertura (%) |
| J | videos | Videos producidos |
| K | webcasts | Webcasts en directo |
| L | galerias | Galerías fotográficas |

---

## FUNCIONES DEL MENÚ

```
🏛️ OEA Panel
├── 📊 Abrir Panel de Métricas          → Abre la barra lateral interactiva
├── ─────────────────────────────────
├── 📋 Inicializar hojas de datos       → Crea OEA_Datos, OEA_Config, OEA_Alertas
├── 📥 Importar datos de ejemplo        → Agrega 6 periodos de muestra
├── ─────────────────────────────────
├── 📄 Generar informe Word (.docx)     → Instrucciones para exportar
├── 📊 Generar Excel con tablas         → Crea hojas Comparativa y Por Responsable
├── 📑 Generar presentación (.pptx)     → Esquema para PowerPoint/Slides
├── 🔔 Enviar alertas al equipo         → Envía correos de recordatorio
├── ─────────────────────────────────
├── ⚙️ Configurar correos del equipo    → Instrucciones de configuración
└── ❓ Ayuda                            → Resumen de funciones
```

---

## SOLUCIÓN DE PROBLEMAS

**No aparece el menú "OEA Panel":**
- Ve a Apps Script y ejecuta `onOpen` manualmente
- O cierra y vuelve a abrir el Google Sheet

**Error de permisos al enviar correos:**
- En Apps Script: Ejecutar → `enviarAlertasDesdeMenu` → Autorizar permisos de Gmail

**Panel no carga datos:**
- Verifica que la hoja `OEA_Datos` exista (Inicializar hojas primero)
- El panel usa datos de respaldo si no hay datos en el Sheet

**Exports de Excel/PDF no funcionan en la barra lateral:**
- El panel descarga los archivos directamente desde el navegador
- Asegúrate de que el navegador no esté bloqueando descargas automáticas

---

## SOPORTE TÉCNICO

Este sistema fue desarrollado para el Departamento de Prensa de la OEA.
Versión 2.0 — Compatible con Google Workspace.
