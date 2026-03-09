# Portal Internacional de Prensa

Sitio web estático (HTML/CSS/JS) en `website/`.

## Ejecutar local

Opcionalmente puedes levantar un servidor estático desde la carpeta raíz:

```bash
python3 -m http.server 8000
```

Luego abre:

`http://localhost:8000/website/index.html`

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (vacío).
2. Desde esta carpeta raíz, inicializa y sube:

```bash
git init
git add .
git commit -m "Portal de prensa: mejoras de calidad y accesibilidad"
git checkout -b codex/portal-calidad
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin codex/portal-calidad
```

3. En GitHub:
- `Settings` -> `Pages`
- `Build and deployment` -> `Source: Deploy from a branch`
- `Branch: codex/portal-calidad` y carpeta `/website`
- Guarda cambios

4. GitHub Pages publicará el portal en:

`https://TU_USUARIO.github.io/TU_REPO/`

## Archivos clave

- `website/index.html`
- `website/css/styles.css`
- `website/css/multimedia-tabs.css`
- `website/css/registration.css`
- `website/js/main.js`
- `website/js/multimedia-tabs.js`
- `website/js/registro-desplegable.js`
