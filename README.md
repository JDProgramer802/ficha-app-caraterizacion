# Ficha de caracterización ICBF — Web (Next.js)

Aplicación en español para digitalizar la “Ficha de caracterización para los servicios de atención a la primera infancia – ICBF”, con módulos conectados (Unidad de Servicio, Niña/Niño, Familia) guardados en un solo JSON por ficha.

## Stack
- Next.js (Pages Router) + API Routes
- Persistencia en archivos JSON locales (`/data/fichas`)
- PDF: pdf-lib
- Excel: xlsx (SheetJS)

## Esquema JSON
Archivo `/data/fichas/{id}.json`:
```json
{
  "id": "uuid",
  "estado": "borrador|enviado",
  "currentStep": 0,
  "modulo0_identificacion": { "fecha_diligenciamiento": "DD/MM/AAAA" },
  "modulo1_unidad_servicio": {
    "regional": "",
    "centro_zonal": "",
    "nit_entidad": "",
    "codigo_cuentame_uds": "",
    "nombre_agente_educativo": ""
  },
  "modulo2_nina_nino": {},
  "modulo3_familia": {},
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```
Índice `/data/fichas/index.json`: lista con metadatos mínimos por ficha.

## Endpoints
- GET `/api/fichas` — lista de fichas, con filtros por `estado`, `fecha`, `regional`, `centro_zonal`, `nombre`, `documento`.
- POST `/api/fichas` — crea ficha y retorna `{ id }`.
- GET `/api/fichas/{id}` — obtiene ficha completa.
- PUT `/api/fichas/{id}` — actualiza ficha completa (mismos módulos).
- DELETE `/api/fichas/{id}` — elimina ficha.
- POST `/api/fichas/{id}/status` — cambia `estado` a `borrador|enviado`.
- GET `/api/fichas/{id}/export/pdf` — descarga PDF por ficha.
- GET `/api/fichas/{id}/export/excel` — descarga Excel por ficha.
- GET `/api/fichas/export/excel` — descarga Excel con todas las fichas.

## UI
- Wizard por pasos en `/ficha/{id}` con:
  - Barra de progreso
  - Validación por página
  - Botones: Anterior, Siguiente, Guardar borrador, Enviar
- Admin en `/admin`:
  - Listado y filtros
  - Ver/editar detalle
  - Eliminar ficha
  - Exportar PDF/Excel por ficha
  - Exportar todas a Excel
- Inicio `/`:
  - Crear nueva ficha
  - Reanudar borrador por ID

Variable `ADMIN_ENABLED=true|false` para ocultar el admin (por defecto true).

## Ejecutar local
```bash
npm install
npm run dev
```
Abrir http://localhost:3000

## Persistencia
- Carpeta `data/fichas` creada automáticamente.
- Escritura atómica: archivo temporal + rename.
