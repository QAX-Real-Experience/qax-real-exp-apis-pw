# QAX Real Experience · Automatización APIs + Web + E2E

Repositorio **base** de automatización funcional del programa **QAX Real Experience** de **QAXpert**. Soporta pruebas de **APIs**, **Web** y **E2E integrados** usando **Playwright + TypeScript** en un solo proyecto.

> **Nota sobre el nombre del repo:** el nombre real es `qax-real-exp-playwirght` (con el typo histórico `playwirght`). La wiki y versiones anteriores referencian `qax-real-exp-apis-pw` (nombre canónico inexistente) y/o `qax-real-exp-apis-pw`. Mantenemos el nombre real para no romper los enlaces del tablero y la org. Ver inconsistencias conocidas en `AGENTS.md` y `.github.wiki`.

Este espacio está destinado a que los aprendices apliquen, en un contexto real, las prácticas, técnicas y criterios de calidad trabajados en sus **mentorías 1:1**, desarrollando automatizaciones sobre features asignadas durante el sprint.

## 🎯 Objetivo

Servir como **proyecto base genera-ejecutable** para todos los aprendices, cubriendo los tres niveles de automatización funcionales:

- **APIs** — consumo y validación de servicios REST (Supabase Auth por defecto).
- **Web** — interacción UI con Page Object Model (POM).
- **E2E** — flujos integrados que combinan API + UI (ej: crear recurso vía API, validar en UI; login vía API + navegación UI).

## ✅ Pre-requisitos

- **Node.js** ≥ 18 ( recomendado 20 LTS ).
- **npm** ≥ 9.
- **Git** configurado con tu cuenta de la org `QAX-Real-Experience`.
- **Playwright** browsers (instalados en el paso de setup).

## 🚀 Setup

```bash
# 1. Clone (si no lo tenés)
git clone https://github.com/QAX-Real-Experience/qax-real-exp-playwirght.git
cd qax-real-exp-playwirght

# 2. Dependencias
npm install

# 3. Browsers de Playwright
npx playwright install

# 4. Variables de entorno
cp .env.example .env
# Editar .env y llenar los valores (ver Manejo de KEYS abajo)

# 5. Validar typecheck y listado de specs
npm run typecheck
npm run list
```

## 🔑 Manejo de KEYS

Las credenciales viven en un archivo `.env` **local** que **nunca** se commitea (ya ignorado por `.gitignore`). La carga y validación se hace en `src/config/env.ts`, que **falla temprano** si falta una variable requerida.

### Variables requeridas

| Variable | Para qué | Dónde obtenerla |
|----------|----------|-----------------|
| `SUPABASE_URL`            | URL del project Supabase | Dashboard > **Project Settings** > **API** > `Project URL` |
| `SUPABASE_ANON_KEY`       | Header `apikey` en requests | Dashboard > **Project Settings** > **API** > `anon public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Crear usuarios vía API en E2E | Dashboard > **Project Settings** > **API** > `service_role` (⚠️ secreto, no exponer en cliente) |
| `BASE_URL_API`           | Base URL del proyecto APIs (normalmente = `SUPABASE_URL`) | — |
| `BASE_URL_WEB`           | URL de la app Web (QAX-TERMINAL local: `http://localhost:5173`) | — |
| `TEST_USER_PASSWORD`     | Contraseña usada para usuarios dinámicos creados por dataBuilder | Definida por vos |
| `TEST_USER_EMAIL`        | (opcional) Usuario preexistente para smoke de login UI | — |
| `API_TOKEN`              | (opcional) Token genérico si la app objetivo lo requiere | — |

### Por qué NO se commitean

- Las keys (`SUPABASE_ANON_KEY`, y especialmente `service_role`) son secretos del proyecto. Filtrarlas permite a terceros actuar como tu proyecto.
- `.gitignore` excluye `.env` y `.env.*` **excepto** `.env.example` (que tiene placeholders vacíos).
- Cualquier commit que incluya un `.env` real será rechazado en review.

### Cómo validar que las keys están cargadas

```bash
# Debe listar specs sin error de "Missing required environment variable"
npm run list

# Si falta una key, el error indicará cuál y apuntará a este README.
```

## 🗂 Estructura de carpetas

```
qax-real-exp-playwirght/
├── .env.example                 # template con placeholders (commiteable)
├── .gitignore                   # ignora .env*, node_modules, reportes, logs
├── LICENSE                      # MIT
├── package.json                 # scripts por dominio (apis|web|e2e)
├── playwright.config.ts         # projects separados + reporters + grep por tags
├── tsconfig.json                # typescript estricto
├── README.md
│
├── src/
│   ├── config/
│   │   └── env.ts               # carga + valida variables (fail-fast tipado)
│   ├── types/                   # interfaces de dominio compartidas
│   │   ├── auth.ts              # AuthRequest, AuthResponse, SignupResponse
│   │   └── api.ts               # ApiResponse<T>, ApiError
│   ├── apis/                    # dominio APIs
│   │   ├── helpers/apiHelper.ts # wrapper HTTP con logging
│   │   ├── services/            # AuthService, SignupService
│   │   └── models/              # signupResponse, errorSignupResponse
│   ├── web/                     # dominio Web
│   │   ├── helpers/uiHelper.ts  # wrapper Page (goto/fill/click)
│   │   ├── pages/               # Page Objects (LoginPage)
│   │   └── models/              # session.ts
│   ├── e2e/                     # fixtures E2E (apiSession inyecta sesión API en UI)
│   │   └── fixtures/authFixture.ts
│   ├── shared/                  # utilidades compartidas
│   │   ├── helpers/logger.ts    # Logger (step/request/response/error)
│   │   └── utils/dataGenerator.ts
│   └── data/
│       └── builders/userBuilder.ts  # data builders (validUser, withoutPassword)
│
└── tests/
    ├── apis/                   # specs APIs (.spec.ts)
    │   ├── auth.spec.ts
    │   └── signup.spec.ts
    ├── web/                    # specs Web
    │   └── login.spec.ts
    └── e2e/                    # specs E2E (API → UI)
        └── api-web-flow.spec.ts
```

## ▶️ Cómo ejecutar

### Por proyecto (dominio)

```bash
npm run test:apis      # sólo APIs
npm run test:web       # sólo Web
npm run test:e2e       # sólo E2E
npm test               # todos
```

### Por tag grep

Los specs están tagueados con `@smoke`, `@regression`, `@web`, `@e2e`.

```bash
npx playwright test --grep "@smoke"
npx playwright test --project=apis --grep "@regression"
```

### Headed / debug / headless

```bash
npm run test:headed                    # abre browser
PWDEBUG=1 npx playwright test          # Playwright Inspector
npx playwright test --project=web      # headless por defecto
```

### Reportes

```bash
npm run report            # HTML (abre navegador)
# JUnit en test-results/junit.xml
# List en consola por defecto
```

## 📐 Convenciones

- **Naming de specs:** `*.spec.ts` dentro de `tests/<dominio>/`.
- **Page Objects:** en `src/web/pages/<Name>Page.ts`. Selectores vía `data-testid` preferentemente.
- **Services API:** en `src/apis/services/<Name>Service.ts`. Reciben `APIRequestContext`.
- **Data builders:** en `src/data/builders/`. Funciones `build*()` que devuelven payloads tipados.
- **Fixtures:** en `src/e2e/fixtures/`. Reutilizan services API + inyectan sesión en la UI.
- **Logger:** usar `Logger.step(name, fn)` para pasos lógicos (aparece en reporte HTML).
- **Tipos:** interfaces en `src/types/`. **Prohibido `any`** salvo en borders crudos (parsers).

## 🌿 Flujo de trabajo git del aprendiz

Según **`Flujo-del-aprendiz.md`** (wiki):

1. Recibir feature/tarea asignada.
2. Actualizar `main`: `git checkout main && git pull`.
3. Crear rama feature **desde `main`**: `git checkout -b feature/<algo>`.
4. Desarrollar la automatización.
5. Validar localmente (`npm test`, `npm run typecheck`).
6. Abrir **Pull Request hacia `dev`** (la wiki dice `develop`, pero el repo real usa `dev`).
7. Solicitar **revisión en pares** (regla de oro: ningún PR se aprueba sin pair review).
8. El revisor ejecuta o valida la entrega; si hay errores, abre issue `[BUG]`.
9. El autor corrige lo necesario.
10. El revisor deja comentario en el PR indicando que realizó la revisión.
11. **Merge a `dev`** sólo con aprobación del TL de QA.
12. En la ceremony de Review se hace `dev → main` y se ejecuta el CI/CD.

> **Inconsistencia conocida:** la wiki referencia la rama `develop`; el repo real usa `dev`. Prevalece el repo real.

## ➕ Cómo agregar una nueva prueba

### API (en `tests/apis/`)

1. Definí tipos de request/response en `src/types/`.
2. Implementá el service en `src/apis/services/`.
3. (Si hace falta) Sumá un builder en `src/data/builders/`.
4. Creá `tests/apis/<feature>.spec.ts` con `test.describe` + tags `@smoke`/`@regression`.

### Web (en `tests/web/`)

1. Creá un Page Object en `src/web/pages/<Name>Page.ts`.
2. Sumá el helper UI si necesitás acciones comunes.
3. Creá `tests/web/<feature>.spec.ts` con tag `@web`.

### E2E (en `tests/e2e/`)

1. Sumá un fixture en `src/e2e/fixtures/` que prepare datos vía API.
2. Creá `tests/e2e/<flow>.spec.ts` que use ese fixture + Page Objects Web.
3. Tagueá con `@e2e` y `@smoke`/`@regression` según corresponda.

## 📊 Cobertura / alcance esperado

- **APIs:** happy path + escenarios de error (status 4xx) por endpoint cubierto.
- **Web:** flujos principales de la feature asignada, sin flaquear en detalle estético.
- **E2E:** al menos un flujo integrado por feature (`API crea → UI valida` o `API autentica → UI navega`).

## 🐞 Cómo reportar bugs

Los **aprendices** abren issues `[BUG]` en el repo del proyecto. El **TL de QA NO crea issues de bugs**: deja feedback de corrección en el PR y, si hace falta, devuelve la tarjeta a `In Progress`.

Plantilla sugerida para el issue:
```
[BUG] <título corto>
- Spec afectada: tests/<dominio>/<spec>.spec.ts
- Pasos para reproducir: ...
- Resultado actual: ...
- Resultado esperado: ...
- Evidencia (logs/screenshot): ...
```

## 🔗 Referencias

- [QAX Real Experience Wiki](https://github.com/QAX-Real-Experience/.github/wiki)
  - [Flujo del aprendiz](https://github.com/QAX-Real-Experience/.github/wiki/Flujo-del-aprendiz)
  - [Convención de commits](https://github.com/QAX-Real-Experience/.github/wiki/Convención-de-Commits)
  - [Definition of Ready](https://github.com/QAX-Real-Experience/.github/wiki/Definition-of-Ready)
  - [Definition of Done](https://github.com/QAX-Real-Experience/.github/wiki/Definition-of-Done)
- [Tablero (Campus QAX)](https://github.com/orgs/QAX-Real-Experience/projects/1)
- [QAXpert](https://qaxpert.com)