# Portal de empleo Teknoservice

Mini aplicación web (HTML, CSS y JavaScript puro) para publicar ofertas de empleo y registrar candidaturas.

## Funcionalidades

- Vista pública con listado de ofertas activas.
- Filtros por texto, ubicación y tipo de jornada.
- Formulario de candidatura (nombre, email, teléfono y carta de presentación).
- Panel RRHH con acceso por contraseña.
- Creación, activación/desactivación y eliminación de ofertas.
- Persistencia en `localStorage` para ofertas y candidaturas.
- Carga de logo corporativo en la cabecera.

## Uso

1. Abrir `index.html` en el navegador.
2. En la parte superior, entrar a **Acceso RRHH**.
3. Contraseña por defecto: `0101Mitoevol@#@`.
4. Crear y gestionar ofertas desde la pestaña **Ofertas**.
5. Revisar candidaturas desde la pestaña **Candidaturas**.

## Cómo cargar el logo de Teknoservice

1. Crea la carpeta `assets` en la raíz del proyecto (si no existe).
2. Copia tu logo como `assets/logo-teknoservice.png`.
3. Recarga la página en el navegador.

> Si el archivo no existe o el nombre no coincide, el portal ocultará la imagen y seguirá mostrando el texto “TEKNOSERVICE”.

## Nota

Este proyecto está pensado como prototipo local. Para producción, añade backend, autenticación segura y base de datos.
