# Sistema Stock

## Descripción
Sistema sencillo de gestión de stock Full‑Stack con:

- Backend: NestJS + Prisma (PostgreSQL)
- Frontend: React (Vite + TypeScript)
- Autenticación JWT con roles ADMIN / USER

## Tecnologías utilizadas

- Backend: Node.js, NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: React, Vite, TypeScript
- Autenticación: JWT
- Tests: Jest

## Requisitos

- Git
- Node.js 18+ y npm
- PostgreSQL (local o en Docker)
- (Opcional) Docker

## Configuración rápida

1. Clonar el repositorio:

```bash
git clone <repo-url>
cd Sistema_Stock
```

2. Backend:

```bash
cd backend
npm install
```

- Crear archivo `.env` en `backend/` (ejemplo más abajo).
- Ejecutar migraciones:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Ejecutar en modo desarrollo:

```bash
npm run start:dev
```

El backend escucha por defecto en: `http://localhost:3000`

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Vite sirve por defecto en `http://localhost:5173`.
Si necesitas apuntar a otra URL del backend, edita `frontend/src/config.ts` (const `API_BASE_URL`).

4. Abrir la app en el navegador: `http://localhost:5173`

## Variables de entorno (ejemplo `.env` en `backend/`)

```
DATABASE_URL="postgresql://user:password@localhost:5432/sistema_stock"
JWT_SECRET="cambiar_por_algo_seguro"
```

Notas:
- `DATABASE_URL` es obligatorio para Prisma.
- `JWT_SECRET` tiene un valor por defecto en el código (`supersecret`) si no se provee, pero en producción debe configurarse.

## Scripts importantes

### Backend (`backend/package.json`)
- `npm run start:dev` — iniciar servidor en modo watch
- `npm run start` — iniciar servidor (producción)
- `npm run build` — construir
- `npm run test` — ejecutar tests

### Frontend (`frontend/package.json`)
- `npm run dev` — iniciar Vite en modo desarrollo
- `npm run build` — construir para producción
- `npm run preview` — servir build localmente

## Endpoints principales

- POST `/auth/register` — { email, password } → crea usuario (role USER por defecto)
- POST `/auth/login` — { email, password } → { access_token }
- Productos: `/products`
  - GET `/products` — listado (JWT requerido)
  - GET `/products/:id`
  - POST `/products` — crear (solo ADMIN)
  - PATCH `/products/:id` — actualizar (solo ADMIN)
  - PATCH `/products/:id/disable` — desactivar (solo ADMIN)
- Movimientos: `/stock-movements`
  - GET `/stock-movements` — lista (filter por `productId` opcional)
  - POST `/stock-movements` — crear movimiento (registra userId del token)

Todos los endpoints protegidos requieren la cabecera `Authorization: Bearer <token>`.

## Funcionamiento del proyecto

- El backend expone una API REST para gestionar usuarios, productos y movimientos de stock.
- Autenticación mediante JWT: al hacer login se recibe `access_token` que se debe enviar en las peticiones.
- Prisma gestiona el esquema y las migraciones contra PostgreSQL.
- El frontend consume la API y gestiona interacción y autenticación en el cliente.

## Uso con Docker (Postgres rápido)

```bash
docker run --name sistema-stock-postgres -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
# luego ajustar DATABASE_URL
```

## Tests

Desde `backend`:

```bash
npm run test
npm run test:e2e
```

## Crear usuario ADMIN (método rápido)

Registrar por `/auth/register` y después cambiar el rol directamente en la base de datos:

```sql
UPDATE "User" SET role='ADMIN' WHERE email='tu@correo';
```

## Ejemplos de prompts para generar estructura del proyecto

Prompt para estructura del proyecto:

> "Genera la estructura de un proyecto full-stack: backend con NestJS (TypeScript), Prisma apuntando a PostgreSQL, autenticación JWT con roles ADMIN/USER, y frontend con React + Vite en TypeScript. Incluye endpoints: auth (register/login), products (CRUD con control por roles), stock-movements (crear/listar). Añade configuración de Prisma, scripts npm, y un README inicial con instrucciones de setup."

Prompt para generar README en español:

> "Escribe un README en español para un proyecto llamado 'Sistema Stock' que incluya: descripción, requisitos, pasos detallados para clonar e instalar (backend/frontend), variables de entorno con ejemplos, cómo ejecutar migraciones Prisma, comandos npm principales, endpoints y ejemplos de cómo autenticar con JWT, y una breve guía para crear un usuario admin."

## Notas finales

- No subas archivos `.env` al repositorio.
- En producción usa `npx prisma migrate deploy` y configura `JWT_SECRET` seguro.

---

Archivo creado: `README.md` en la raíz del repositorio.