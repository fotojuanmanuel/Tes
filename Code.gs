// ═══════════════════════════════════════════════════════════════════════════
// OEA · PANEL DE COMUNICACIONES PRO — Google Apps Script
// Versión: 2.0 | Autor: Panel OEA | Fecha: 2026
// ═══════════════════════════════════════════════════════════════════════════
// INSTALACIÓN:
//   1. Abre tu Google Sheet
//   2. Extensiones → Apps Script
//   3. Pega Code.gs, Sidebar.html, EmailTemplate.html en archivos separados
//   4. Guarda (Ctrl+S) y actualiza la hoja → verás el menú "OEA Panel"
// ═══════════════════════════════════════════════════════════════════════════

// ── CONSTANTES ───────────────────────────────────────────────────────────────
var SHEET_DATOS      = 'OEA_Datos';
var SHEET_CONFIG     = 'OEA_Config';
var SHEET_ALERTAS    = 'OEA_Alertas';
var PROP_KEY_EMAIL   = 'OEA_EMAIL_FROM';
var PROP_KEY_EQUIPO  = 'OEA_EQUIPO_JSON';

var METRIC_DEFS = [
  { id:'tweets',          label:'Tweets emitidos',       area:'Redes Sociales', resp:'Karen' },
  { id:'seguidores',      label:'Nuevos seguidores',     area:'Redes Sociales', resp:'Karen' },
  { id:'impresiones',     label:'Impresiones (M)',       area:'Redes Sociales', resp:'Karen' },
  { id:'visitantes',      label:'Visitantes únicos',     area:'Sitio Web',      resp:'María Isabel / Paola' },
  { id:'pageviews',       label:'Páginas vistas (M)',    area:'Sitio Web',      resp:'María Isabel / Paola' },
  { id:'email_productos', label:'Productos enviados',    area:'Email',          resp:'Mónica' },
  { id:'email_lecturas',  label:'Lecturas totales',      area:'Email',          resp:'Mónica' },
  { id:'email_apertura',  label:'Ratio de apertura (%)', area:'Email',          resp:'Mónica' },
  { id:'videos',          label:'Videos producidos',     area:'Video',          resp:'Kerne / Ernesto' },
  { id:'webcasts',        label:'Webcasts en directo',   area:'Video',          resp:'Kerne / Ernesto' },
  { id:'galerias',        label:'Galerías fotográficas', area:'Fotografía',     resp:'Juan Manuel' }
];

// ── MENÚ ─────────────────────────────────────────────────────────────────────
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏛️ OEA Panel')
    .addItem('📊 Abrir Panel de Métricas', 'abrirPanel')
    .addSeparator()
    .addItem('📋 Inicializar hojas de datos', 'inicializarHojas')
    .addItem('📥 Importar datos de ejemplo', 'importarDatosEjemplo')
    .addSeparator()
    .addItem('📄 Generar informe Word (.docx)', 'generarWordDesdeMenu')
    .addItem('📊 Generar Excel con tablas dinámicas', 'generarExcelDesdeMenu')
    .addItem('📑 Generar presentación (.pptx)', 'generarPptxDesdeMenu')
    .addItem('🔔 Enviar alertas al equipo', 'enviarAlertasDesdeMenu')
    .addSeparator()
    .addItem('⚙️ Configurar correos del equipo', 'configurarEquipo')
    .addItem('❓ Ayuda', 'mostrarAyuda')
    .addToUi();
}

// ── ABRIR PANEL ───────────────────────────────────────────────────────────────
function abrirPanel() {
  var html = HtmlService.createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle('OEA Panel de Métricas')
    .setWidth(460);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ── INCLUDE HTML ──────────────────────────────────────────────────────────────
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN DE HOJAS
// ══════════════════════════════════════════════════════════════════════════════
function inicializarHojas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  _crearHojaDatos(ss);
  _crearHojaConfig(ss);
  _crearHojaAlertas(ss);
  SpreadsheetApp.getUi().alert('✅ Hojas inicializadas correctamente.\n\nHojas creadas:\n• ' + SHEET_DATOS + '\n• ' + SHEET_CONFIG + '\n• ' + SHEET_ALERTAS);
}

function _crearHojaDatos(ss) {
  var sheet = ss.getSheetByName(SHEET_DATOS) || ss.insertSheet(SHEET_DATOS);
  sheet.clearContents();
  var headers = ['periodo'].concat(METRIC_DEFS.map(function(m){ return m.id; }));
  var labelRow = ['Periodo'].concat(METRIC_DEFS.map(function(m){ return m.label; }));
  sheet.appendRow(labelRow);
  sheet.appendRow(headers);

  // Estilos encabezado
  var hdr = sheet.getRange(1, 1, 1, headers.length);
  hdr.setBackground('#0A0D14').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(10);
  var hdr2 = sheet.getRange(2, 1, 1, headers.length);
  hdr2.setBackground('#1A2035').setFontColor('#9BAECC').setFontSize(8).setFontStyle('italic');

  sheet.setColumnWidth(1, 200);
  for (var i = 2; i <= headers.length; i++) sheet.setColumnWidth(i, 110);
  sheet.setFrozenRows(2);
  return sheet;
}

function _crearHojaConfig(ss) {
  var sheet = ss.getSheetByName(SHEET_CONFIG) || ss.insertSheet(SHEET_CONFIG);
  sheet.clearContents();
  var cfg = [
    ['Parámetro', 'Valor', 'Descripción'],
    ['deadline_dia', '5', 'Día del mes límite para entregar métricas'],
    ['alerta_auto', 'FALSE', 'Enviar alerta automática si no hay datos'],
    ['correo_jefe', '', 'Correo del jefe de comunicaciones'],
    ['nombre_org', 'OEA — Departamento de Prensa', 'Nombre de la organización'],
    ['periodo_actual', '', 'Nombre del periodo actual (ej. Q1-2026)'],
  ].concat(METRIC_DEFS.map(function(m){
    return ['email_' + m.resp.replace(/[^a-z]/gi,'_').toLowerCase(), '', 'Correo de ' + m.resp + ' (' + m.area + ')'];
  }));
  sheet.getRange(1, 1, cfg.length, 3).setValues(cfg);
  sheet.getRange(1,1,1,3).setBackground('#0A0D14').setFontColor('#fff').setFontWeight('bold');
  sheet.setColumnWidth(1,220).setColumnWidth(2,280).setColumnWidth(3,340);
}

function _crearHojaAlertas(ss) {
  var sheet = ss.getSheetByName(SHEET_ALERTAS) || ss.insertSheet(SHEET_ALERTAS);
  sheet.clearContents();
  var headers = ['Fecha', 'Tipo', 'Responsable', 'Área', 'Correo', 'Estado', 'Mensaje'];
  sheet.appendRow(headers);
  sheet.getRange(1,1,1,7).setBackground('#C9231A').setFontColor('#fff').setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// ══════════════════════════════════════════════════════════════════════════════
// DATOS — LEER / ESCRIBIR
// ══════════════════════════════════════════════════════════════════════════════
function getTodosPeriodos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATOS);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 3) return [];
  var headers = data[1]; // fila 2 = IDs de métricas
  var result = [];
  for (var r = 2; r < data.length; r++) {
    var row = data[r];
    if (!row[0]) continue;
    var raw = {};
    for (var c = 1; c < headers.length; c++) {
      raw[headers[c]] = parseFloat(row[c]) || 0;
    }
    result.push({ periodo: String(row[0]), raw: raw });
  }
  return result;
}

function guardarPeriodo(periodoObj) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATOS);
  if (!sheet) { inicializarHojas(); sheet = ss.getSheetByName(SHEET_DATOS); }
  var headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Buscar si ya existe
  var data = sheet.getDataRange().getValues();
  var existRow = -1;
  for (var r = 2; r < data.length; r++) {
    if (String(data[r][0]) === String(periodoObj.periodo)) { existRow = r + 1; break; }
  }

  var newRow = [periodoObj.periodo];
  for (var c = 1; c < headers.length; c++) {
    newRow.push(periodoObj.raw[headers[c]] || 0);
  }

  if (existRow > 0) {
    sheet.getRange(existRow, 1, 1, newRow.length).setValues([newRow]);
  } else {
    sheet.appendRow(newRow);
  }
  _aplicarFormato(sheet);
  return { ok: true, accion: existRow > 0 ? 'actualizado' : 'creado' };
}

function _aplicarFormato(sheet) {
  var last = sheet.getLastRow();
  if (last < 3) return;
  var range = sheet.getRange(3, 1, last - 2, sheet.getLastColumn());
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
}

function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_CONFIG);
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  var cfg = {};
  for (var r = 1; r < data.length; r++) {
    if (data[r][0]) cfg[data[r][0]] = data[r][1];
  }
  return cfg;
}

// ══════════════════════════════════════════════════════════════════════════════
// DATOS DE EJEMPLO
// ══════════════════════════════════════════════════════════════════════════════
function importarDatosEjemplo() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATOS);
  if (!sheet) { inicializarHojas(); sheet = ss.getSheetByName(SHEET_DATOS); }

  var ejemplos = [
    ['Ene–Mar 2024', 310, 5200, 3.1, 580000, 1.6, 240, 98000, 19.2, 28, 18, 95],
    ['Abr–Jun 2024', 380, 6100, 3.8, 630000, 1.8, 275, 108000, 20.1, 34, 22, 108],
    ['Jul–Sep 2024', 402, 6800, 4.2, 690000, 1.9, 310, 118000, 20.5, 37, 48, 115],
    ['Oct–Dic 2024', 425, 7100, 4.5, 710000, 2.0, 325, 121000, 20.7, 38, 52, 119],
    ['Jun–Oct 2025', 440, 7493, 4.7, 715597, 2.0, 334, 125000, 20.9, 39, 55, 122],
    ['Nov 2025–Feb 2026', 612, 4355, 2.3, 753000, 2.0, 281, 162598, 21.56, 59, 30, 138]
  ];

  for (var i = 0; i < ejemplos.length; i++) {
    sheet.appendRow(ejemplos[i]);
  }
  _aplicarFormato(sheet);
  SpreadsheetApp.getUi().alert('✅ ' + ejemplos.length + ' periodos de ejemplo importados a la hoja ' + SHEET_DATOS);
}

// ══════════════════════════════════════════════════════════════════════════════
// ALERTAS Y CORREOS
// ══════════════════════════════════════════════════════════════════════════════
function getEquipo() {
  var props = PropertiesService.getScriptProperties();
  var json = props.getProperty(PROP_KEY_EQUIPO);
  if (json) {
    try { return JSON.parse(json); } catch(e) {}
  }
  // Fallback: leer de Config sheet
  var cfg = getConfig();
  var equipo = [];
  METRIC_DEFS.forEach(function(m) {
    var key = 'email_' + m.resp.replace(/[^a-z]/gi,'_').toLowerCase();
    var email = cfg[key] || '';
    if (!equipo.find(function(e){ return e.resp === m.resp; })) {
      equipo.push({ resp: m.resp, area: m.area, email: email });
    }
  });
  return equipo;
}

function guardarEquipo(equipoArr) {
  PropertiesService.getScriptProperties().setProperty(PROP_KEY_EQUIPO, JSON.stringify(equipoArr));
  return { ok: true };
}

function enviarAlertasDesdeMenu() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.alert('⚠️ Enviar alertas', '¿Deseas enviar correos de alerta a los miembros del equipo que no han enviado su reporte del periodo actual?', ui.ButtonSet.YES_NO);
  if (resp === ui.Button.YES) {
    var resultado = enviarAlertas({ periodo: 'Periodo pendiente', manual: true });
    ui.alert(resultado.mensaje);
  }
}

function enviarAlertas(params) {
  var equipo = getEquipo();
  var cfg = getConfig();
  var periodos = getTodosPeriodos();
  var periodoCurr = params.periodo || cfg['periodo_actual'] || (periodos.length > 0 ? periodos[periodos.length-1].periodo : 'Pendiente');

  var enviados = 0;
  var errores = 0;
  var log = [];

  equipo.forEach(function(miembro) {
    if (!miembro.email) {
      log.push({ resp: miembro.resp, estado: 'SIN_EMAIL', msg: 'No hay correo configurado' });
      return;
    }
    try {
      var subject = '🔔 OEA Comunicaciones · Recordatorio de métricas — ' + periodoCurr;
      var htmlBody = _buildEmailHTML(miembro, periodoCurr, cfg);
      GmailApp.sendEmail(miembro.email, subject, _buildEmailText(miembro, periodoCurr), {
        htmlBody: htmlBody,
        name: cfg['nombre_org'] || 'OEA — Departamento de Prensa'
      });
      enviados++;
      log.push({ resp: miembro.resp, estado: 'ENVIADO', msg: miembro.email });
      _registrarAlerta('RECORDATORIO', miembro.resp, miembro.area, miembro.email, 'ENVIADO', periodoCurr);
    } catch(e) {
      errores++;
      log.push({ resp: miembro.resp, estado: 'ERROR', msg: e.message });
      _registrarAlerta('ERROR', miembro.resp, miembro.area, miembro.email, 'ERROR: ' + e.message, periodoCurr);
    }
  });

  return {
    ok: true,
    enviados: enviados,
    errores: errores,
    log: log,
    mensaje: '✅ Alertas procesadas:\n• Enviadas: ' + enviados + '\n• Errores: ' + errores + '\n\nRevisa la hoja ' + SHEET_ALERTAS + ' para el detalle.'
  };
}

function _registrarAlerta(tipo, resp, area, email, estado, mensaje) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_ALERTAS);
  if (!sheet) return;
  sheet.appendRow([new Date(), tipo, resp, area, email, estado, mensaje]);
}

function _buildEmailHTML(miembro, periodo, cfg) {
  var orgName = cfg['nombre_org'] || 'OEA — Departamento de Prensa';
  var deadline = cfg['deadline_dia'] ? 'Fecha límite: día ' + cfg['deadline_dia'] + ' del mes en curso.' : '';

  // Métricas de este responsable
  var misMetricas = METRIC_DEFS.filter(function(m){ return m.resp === miembro.resp; });
  var metricasHtml = misMetricas.map(function(m){
    return '<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px">' + m.label + '</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#9BA5B5">___________</td></tr>';
  }).join('');

  return '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#F4F5F8;padding:30px 0;margin:0">' +
    '<div style="max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)">' +
    '<div style="background:#0A0D14;padding:28px 32px">' +
    '<div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.02em">' + orgName + '</div>' +
    '<div style="font-size:13px;color:rgba(255,255,255,.5);margin-top:4px">Panel de Métricas de Comunicaciones</div>' +
    '</div>' +
    '<div style="padding:32px">' +
    '<div style="background:#FEF3E2;border:1px solid #F2C98A;border-radius:10px;padding:16px 20px;margin-bottom:24px">' +
    '<div style="font-size:13px;font-weight:700;color:#B45309;margin-bottom:4px">🔔 Recordatorio de entrega de métricas</div>' +
    '<div style="font-size:12px;color:#92400E">Periodo: <strong>' + periodo + '</strong> · ' + deadline + '</div>' +
    '</div>' +
    '<p style="font-size:14px;color:#3A4055;line-height:1.7">Hola <strong>' + miembro.resp + '</strong>,<br><br>Te escribimos para recordarte que está pendiente la entrega de las métricas del área de <strong>' + miembro.area + '</strong> correspondientes al periodo <strong>' + periodo + '</strong>.</p>' +
    '<h3 style="font-size:13px;font-weight:700;color:#0A0D14;margin:24px 0 12px;text-transform:uppercase;letter-spacing:.06em">Métricas bajo tu responsabilidad</h3>' +
    '<table style="width:100%;border-collapse:collapse;border:1px solid #E4E7F0;border-radius:10px;overflow:hidden">' +
    '<tr style="background:#F4F5F8"><th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A8299;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Indicador</th><th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A8299;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Valor del periodo</th></tr>' +
    metricasHtml +
    '</table>' +
    '<p style="font-size:12px;color:#7A8299;margin-top:24px;line-height:1.7">Para entregar tus datos, accede al Google Sheet compartido o responde este correo con los valores. Si ya enviaste tus métricas, por favor ignora este recordatorio.</p>' +
    '<div style="margin-top:28px;padding-top:20px;border-top:1px solid #E4E7F0;font-size:11px;color:#9BA5B5">' + orgName + ' · Panel de Métricas · Mensaje automático generado por el sistema de reportes.</div>' +
    '</div></div></body></html>';
}

function _buildEmailText(miembro, periodo) {
  var misMetricas = METRIC_DEFS.filter(function(m){ return m.resp === miembro.resp; });
  return 'Recordatorio de métricas — ' + periodo + '\n\nHola ' + miembro.resp + ',\n\nTienes pendiente la entrega de métricas del área ' + miembro.area + ' para el periodo ' + periodo + '.\n\nMétricas:\n' +
    misMetricas.map(function(m){ return '• ' + m.label; }).join('\n') +
    '\n\nPor favor accede al Google Sheet para completar los datos.\n\nSaludos,\nOEA — Departamento de Prensa';
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTACIONES — DESDE MENÚ
// ══════════════════════════════════════════════════════════════════════════════
function generarWordDesdeMenu() {
  SpreadsheetApp.getUi().alert('📄 Generar Word', 'Para generar el informe Word (.docx), abre el Panel de Métricas (menú OEA Panel → Abrir Panel de Métricas) y usa el botón "Exportar Word" en la pestaña de Exportar.\n\nAlternativamente, puedes descargar el CSV desde el panel y abrirlo en Word.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function generarExcelDesdeMenu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetComp = ss.getSheetByName('Comparativa') || ss.insertSheet('Comparativa');
  sheetComp.clearContents();
  var periodos = getTodosPeriodos();
  if (periodos.length < 2) { SpreadsheetApp.getUi().alert('Necesitas al menos 2 periodos de datos para generar la comparativa.'); return; }

  var curr = periodos[periodos.length - 1];
  var prev = periodos[periodos.length - 2];

  var headers = ['Métrica', 'Área', 'Responsable', prev.periodo, curr.periodo, 'Δ Absoluto', 'Δ %'];
  sheetComp.appendRow(headers);
  sheetComp.getRange(1,1,1,7).setBackground('#0038FF').setFontColor('#fff').setFontWeight('bold');

  METRIC_DEFS.forEach(function(m) {
    var vA = curr.raw[m.id] || 0;
    var vP = prev.raw[m.id] || 0;
    var delta = vP !== 0 ? ((vA - vP) / Math.abs(vP) * 100) : 0;
    sheetComp.appendRow([m.label, m.area, m.resp, vP, vA, vA - vP, delta.toFixed(2) + '%']);
  });

  // Formato tabla dinámica — colores condicionales en delta
  var lastRow = sheetComp.getLastRow();
  var deltaCol = sheetComp.getRange(2, 7, lastRow - 1, 1);
  var rules = [
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0).setBackground('#E3F9F0').setFontColor('#00875A').setRanges([deltaCol]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0).setBackground('#FDECEA').setFontColor('#C9231A').setRanges([deltaCol]).build(),
  ];
  // Note: apply text-based delta to numeric for CF — rebuild as numbers
  var deltaColNum = sheetComp.getRange(2, 8, lastRow - 1, 1);
  sheetComp.getRange(1,8,1,1).setValue('Δ % num');
  METRIC_DEFS.forEach(function(m, i) {
    var vA = curr.raw[m.id] || 0;
    var vP = prev.raw[m.id] || 0;
    var delta = vP !== 0 ? ((vA - vP) / Math.abs(vP) * 100) : 0;
    sheetComp.getRange(i+2, 8).setValue(parseFloat(delta.toFixed(2)));
  });
  sheetComp.setConditionalFormatRules(rules);

  // Por responsable
  var sheetUser = ss.getSheetByName('Por Responsable') || ss.insertSheet('Por Responsable');
  sheetUser.clearContents();
  sheetUser.appendRow(['Responsable', 'Área', 'Métrica', prev.periodo, curr.periodo, 'Δ %']);
  sheetUser.getRange(1,1,1,6).setBackground('#0A0D14').setFontColor('#fff').setFontWeight('bold');
  var usersMap = {};
  METRIC_DEFS.forEach(function(m) {
    if (!usersMap[m.resp]) usersMap[m.resp] = [];
    usersMap[m.resp].push(m);
  });
  Object.keys(usersMap).forEach(function(user) {
    usersMap[user].forEach(function(m) {
      var vA = curr.raw[m.id] || 0;
      var vP = prev.raw[m.id] || 0;
      var delta = vP !== 0 ? ((vA - vP) / Math.abs(vP) * 100) : 0;
      sheetUser.appendRow([user, m.area, m.label, vP, vA, delta.toFixed(2) + '%']);
    });
  });

  SpreadsheetApp.getUi().alert('✅ Excel generado\n\nSe crearon las hojas:\n• Comparativa (con formato condicional)\n• Por Responsable\n\nPuedes usar Archivo → Descargar → Microsoft Excel para obtener el .xlsx');
}

function generarPptxDesdeMenu() {
  SpreadsheetApp.getUi().alert('📑 Presentación', 'Para generar la presentación, abre el Panel de Métricas y usa el botón "Exportar PowerPoint" en la pestaña Exportar.\n\nEsto generará los datos formateados que puedes pegar en PowerPoint o Google Slides.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function configurarEquipo() {
  SpreadsheetApp.getUi().alert('⚙️ Configurar equipo', 'Para configurar los correos del equipo:\n\n1. Ve a la hoja "' + SHEET_CONFIG + '"\n2. Busca las filas que empiezan con "email_"\n3. Ingresa el correo de cada responsable en la columna B\n\nEsto permite enviar alertas automáticas al equipo.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function mostrarAyuda() {
  var msg = 'OEA Panel de Comunicaciones Pro v2.0\n\n' +
    'FUNCIONES DISPONIBLES:\n' +
    '• Panel de Métricas: Dashboard interactivo con comparativas\n' +
    '• Comparativas: Mes, Trimestre, Semestre, Año\n' +
    '• Por Usuario: Rendimiento por responsable año a año\n' +
    '• Exportar: CSV, Excel, PDF, Word, PPTX\n' +
    '• Alertas: Correos automáticos al equipo\n\n' +
    'CONFIGURACIÓN:\n' +
    '• Hoja ' + SHEET_DATOS + ': Datos de periodos\n' +
    '• Hoja ' + SHEET_CONFIG + ': Parámetros y correos\n' +
    '• Hoja ' + SHEET_ALERTAS + ': Historial de alertas enviadas\n\n' +
    'Para inicializar: OEA Panel → Inicializar hojas de datos';
  SpreadsheetApp.getUi().alert('❓ Ayuda', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ══════════════════════════════════════════════════════════════════════════════
// API PARA SIDEBAR (llamadas desde JavaScript del HTML)
// ══════════════════════════════════════════════════════════════════════════════
function apiGetPeriodos() {
  return JSON.stringify(getTodosPeriodos());
}

function apiGuardarPeriodo(json) {
  try {
    var obj = JSON.parse(json);
    return JSON.stringify(guardarPeriodo(obj));
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function apiEnviarAlertas(json) {
  try {
    var params = JSON.parse(json);
    return JSON.stringify(enviarAlertas(params));
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function apiGetEquipo() {
  return JSON.stringify(getEquipo());
}

function apiGuardarEquipo(json) {
  try {
    return JSON.stringify(guardarEquipo(JSON.parse(json)));
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function apiGetConfig() {
  return JSON.stringify(getConfig());
}

function apiGenerarExcel() {
  try {
    generarExcelDesdeMenu();
    return JSON.stringify({ ok: true, msg: 'Excel generado. Descarga desde Archivo → Descargar → Microsoft Excel.' });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function apiInicializar() {
  try {
    inicializarHojas();
    return JSON.stringify({ ok: true });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}
