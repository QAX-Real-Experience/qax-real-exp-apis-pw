# QAX Real Experience · Automatización APIs + Web + E2E

Repositorio **base** de automatización funcional del programa **QAX Real Experience** de **QAXpert**. Soporta pruebas de **APIs** y **Web** con **Playwright + TypeScript**, incluyendo flujos **E2E** por cada tecnología.

> **Nota sobre el nombre del repo:** el nombre real es `qax-real-exp-playwirght` (con el typo histórico `playwirght`). La wiki y versiones anteriores referencian `qax-real-exp-apis-pw` (nombre canónico inexistente). Mantenemos el nombre real para no romper los enlaces del tablero y la org. Ver inconsistencias conocidas en `AGENTS.md` y `.github.wiki`.

Este espacio está destinado a que los aprendices apliquen, en un contexto real, las prácticas, técnicas y criterios de calidad trabajados en sus **mentorías 1:1**, desarrollando automatizaciones sobre features asignadas durante el sprint.

## 🎯 Objetivo

Servir como **proyecto base genera-ejecutable** para todos los aprendices, cubriendo los niveles de automatización funcionales:

- **APIs** — consumo y validación de servicios REST (Supabase Auth por defecto).
- **Web** — interacción UI con Page Object Model (POM).

Cada tecnología organiza sus pruebas en **`feature/`** (funcionales por feature) y **`e2e/`** (flujos integrados con enfoque `smoke` o `regression`). No existe un dominio `e2e` transversal: el e2e es propiedad de cada tecnología.

## ✅ Pre-requisitos

- **Node.js** ≥ 18 (recomendado 20 LTS).
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

Las credenciales viven en un archivo `.env` **local** que **nunca** se commitea (ya ignorado por `.gitignore`). La carga se hace con `dotenv` directamente en `playwright.config.ts`; cada módulo lee `process.env` donde lo necesita.

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
# Debe listar specs sin errores de "undefined" en runtime
npm run list
# typecheck garantiza que los imports y tipos están OK
npm run typecheck
```

> ⚠️ A diferencia de versiones previas, este repo **no** valida fail-fast las variables en un módulo wrapper. Si falta una key, el fallo se manifestará en runtime dentro de la prueba que la usa (headers vacíos, baseURL `localhost`, etc.). Se optó por simplicidad: `dotenv` directo, `process.env` en cada Consumer.

## 🗂 Estructura de carpetas

```
qax-real-exp-playwirght/
├── .env.example                 # template con placeholders (commiteable)
├── .gitignore                   # ignora .env*, node_modules, reportes, logs
├── LICENSE                      # MIT
├── package.json                 # scripts por tecnología (apis|web)
├── playwright.config.ts         # projects apis|web, reporters list+html+junit
├── tsconfig.json                # typescript estricto
├── README.md
│
├── src/
│   ├── helpers/
│   │   └── logger.ts            # Logger reutilizable (step/request/response)
│   ├── utils/
│   │   └── dataGenerator.ts     # helpers de datos (generateEmail, ...)
│   ├── apis/                    # dominio APIs
│   │   ├── helpers/
│   │   │   ├── apiHelper.ts     # wrapper HTTP con logging + apikey
│   │   │   └── userBuilder.ts   # data builders (buildValidUser, ...)
│   │   ├── services/            # AuthService, SignupService
│   │   ├── models/              # signupResponse, errorSignupResponse
│   │   └── types/               # auth.ts, api.ts
│   ├── web/                     # dominio Web
│   │   ├── helpers/uiHelper.ts  # wrapper de Page (goto/fill/click)
│   │   ├── pages/               # Page Objects (LoginPage.ts de ejemplo)
│   │   └── models/              # session.ts
│   └── data/                    # opcional: CSV/JSON estáticos para data-driven
│       └── .gitkeep
│
└── tests/
    ├── apis/
    │   ├── feature/             # pruebas funcionales por feature
    │   │   ├── auth/
    │   │   │   └── auth.spec.ts
    │   │   └── signup/
    │   │       └── signup.spec.ts
    │   └── e2e/                 # flujos e2e de APIs
    │       ├── smoke/           # .gitkeep (ver Nomenclatura)
    │       └── regression/      # .gitkeep
    └── web/
        ├── feature/             # .gitkeep (sin specs reales todavía)
        └── e2e/
            ├── smoke/           # .gitkeep
            └── regression/      # .gitkeep
```

### `src/data/` (opcional)

Carpeta **opcional** para guardar archivos de datos estáticos (`.csv`, `.json`) usados en pruebas **data-driven** (por ejemplo, payloads parametrizados, datasets de login). No es obligatoria ni contiene código: queda vacía con un `.gitkeep` para que la carpeta exista en git, y cada aprendiz/agrega los archivos que necesite en su feature. **No usar** para secretos ni credenciales — eso va en `.env`.

## 📛 Nomenclatura

### Carpetas

| Carpeta | Contenido |
|---------|-----------|
| `tests/<tech>/`            | Raíz por tecnología: `apis` o `web`. |
| `tests/<tech>/feature/`    | Pruebas **funcionales** por feature, una subcarpeta por funcionalidad (`auth/`, `signup/`, `register/`, ...). |
| `tests/<tech>/e2e/smoke/`  | Flujos **E2E smoke**: verificación rápida de caminos críticos. |
| `tests/<tech>/e2e/regression/` | Flujos **E2E regression**: recorrido completo de funcionalidad tras cambios. |

`<tech>` ∈ { `apis`, `web` }. No existe `tests/e2e/` a nivel superior — el e2e es propiedad de cada tecnología.

### Archivos de prueba

- Extensión obligatoria: **`*.spec.ts`**.
- **camelCase** para specs cortos / unitarios (sigue la convención ya usada): `auth.spec.ts`, `signup.spec.ts`.
- **kebab-case** para specs de flujos largos o e2e descriptivos: `testing-learner-cero-register.spec.ts`, `login-flow-smoke.spec.ts`.
- Regla clara:
  - Si el spec cubre **una funcionalidad atómica** → camelCase: `signup.spec.ts`.
  - Si el spec describe **un flujo largo / escenario compuesto** (típico en e2e) → kebab-case descriptivo: `testing-learner-cero-register.spec.ts`.

### Tags (en `test.describe` o `test`)

- `@smoke` — verificación rápida de caminos críticos (corre siempre).
- `@regression` — recorrido completo de funcionalidad tras cambios.
- `@feature` — cubre una funcionalidad específica nueva o existente.
- `@apis` / `@web` — opcional, para filtrar por tecnología más allá del project.

## 🧭 Smoke, Regression y Feature

### 🟢 Smoke

- **Qué son:** verificación rápida y mínima de los caminos críticos. Confirman que lo esencial funciona (login OK, endpoint clave responde 200, página carga).
- **Cuándo correrlas:** antes de cada PR, en cada push a `dev`, en CI ligero.
- **Tag sugerido:** `@smoke`.
- **Dónde viven:** `tests/<tech>/feature/` para casos puntuales, `tests/<tech>/e2e/smoke/` para flujos integrados críticos.

### 🔵 Regression

- **Qué son:** recorrido completo de una funcionalidad tras cambios — happy path + edge cases + escenarios de error. Garantizan que nada se rompió.
- **Cuándo correrlas:** al cerrar una feature, previo a merge a `dev`, en CI completo (nocturno o por PR).
- **Tag sugerido:** `@regression`.
- **Dónde viven:** `tests/<tech>/feature/` (casos funcionales) y `tests/<tech>/e2e/regression/` (flujos integrados).

### 🟣 Feature

- **Qué son:** pruebas que cubren una funcionalidad **específica** nueva o existente, sin alcance transversal.
- **Cuándo correrlas:** mientras desarrollás la feature, antes de pedir pair review.
- **Tag sugerido:** `@feature`.
- **Dónde viven:** `tests/<tech>/feature/<nombre-funcionalidad>/`.

### Cómo combinar con `--grep`

```bash
# Sólo smoke (todas las tecnologías)
npx playwright test --grep "@smoke"

# Smoke sólo APIs
npx playwright test --project=apis --grep "@smoke"

# Regression sólo Web
npx playwright test --project=web --grep "@regression"

# Una feature específica
npx playwright test --project=apis --grep "@feature"
```

> ⚠️ Nota: `--grep` matchea el título del test (incluido el `@tag` que pongas en `test.describe(...)` o `test("... @tag", ...)`). Por eso los tags viven en los títulos, no sólo en nombres de archivo.

### Ejemplo conceptual: E2E de APIs

> No hay specs e2e reales en `tests/apis/e2e/` todavía (sólo la estructura con `.gitkeep`). Cuando un aprendiz agregue uno, un nombre válido sería:

`tests/apis/e2e/regression/testing-learner-cero-register.spec.ts`

```ts
import { test, expect } from "@playwright/test";
import { AuthService } from "../../../../src/apis/services/AuthService.js";
import { buildValidUser } from "../../../../src/apis/helpers/userBuilder.js";

test.describe("E2E APIs: register → login → get user @regression", () => {
  test("flujo completo de un learner cero @smoke", async ({ request }) => {
    const auth = new AuthService(request);
    const user = buildValidUser();

    const signup = await auth.signup(user);
    expect(signup.ok()).toBeTruthy();

    const login = await auth.login(user);
    const body = await login.json();
    expect(body.access_token).toBeTruthy();

    const me = await auth.getUser(body.access_token);
    expect(me.ok()).toBeTruthy();
  });
});
```

## ▶️ Cómo ejecutar

### Por tecnología

```bash
npm run test:apis      # sólo APIs
npm run test:web       # sólo Web
npm test               # todas
```

### Por tag grep

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

- **Naming de specs:** `*.spec.ts` dentro de `tests/<tech>/<feature|e2e>/<...>/`. Ver Nomenclatura.
- **Page Objects:** en `src/web/pages/<Name>Page.ts`. Selectores vía `data-testid` preferentemente.
- **Services API:** en `src/apis/services/<Name>Service.ts`. Reciben `APIRequestContext`.
- **Data builders:** en `src/apis/helpers/userBuilder.ts` (API). Funciones `build*()` que devuelven payloads tipados.
- **Logger:** usar `Logger.step(name, fn)` para pasos lógicos (aparece en reporte HTML). Vive en `src/helpers/logger.ts` (reutilizable por cualquier tecnología).
- **Tipos:** interfaces en `src/apis/types/` para APIs; `src/web/types/` cuando Web necesite los suyos. **Prohibido `any`** salvo en borders crudos (parsers).
- **Variables de entorno:** leer `process.env.X` donde se necesite. No hay wrapper tipado.

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

### Convención de commits

`tipo: descripción breve` en minúsculas. Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- ✅ `feat: add login api automation`
- ✅ `refactor: reestructura src por dominios apis/web`
- ❌ `update`, `cambios`, `fix stuff`.

## ➕ Cómo agregar una nueva prueba

### API funcional (en `tests/apis/feature/`)

1. Definí tipos de request/response en `src/apis/types/`.
2. Implementá el service en `src/apis/services/`.
3. (Si hace falta) Sumá un builder en `src/apis/helpers/` (junto a `userBuilder.ts`).
4. Creá `tests/apis/feature/<funcionalidad>/<nombre>.spec.ts` con `test.describe` + tags `@feature` (y `@smoke`/`@regression` según corresponda).

### API E2E (en `tests/apis/e2e/`)

1. Reutilizá services + builders existentes.
2. Creá `tests/apis/e2e/<smoke|regression>/<flujo>.spec.ts` (kebab-case) tagueado `@smoke` o `@regression`.

### Web (en `tests/web/...`)

1. Creá un Page Object en `src/web/pages/<Name>Page.ts`.
2. Sumá el helper UI en `src/web/helpers/` si necesitás acciones comunes.
3. Creá el spec en `tests/web/feature/<funcionalidad>/` (funcional) o `tests/web/e2e/<smoke|regression>/` (flujo integrado).

## 🐞 Cómo reportar bugs

Si un **aprendiz** encuentra un bug durante la automatización, debe **abrir un issue en GitHub** en el repo correspondiente (ej. `qax-real-exp-playwirght`):

1. Crear issue con título `[BUG] <descripción corta>`.
2. Describir:
   - **Spec afectada:** `tests/<tech>/<...>/<spec>.spec.ts` + nombre del test.
   - **Pasos para reproducir:** secuencia exacta.
   - **Resultado actual:** qué ocurre.
   - **Resultado esperado:** qué debería ocurrir.
   - **Evidencia:** logs, capturas, o —preferentemente— **adjuntar el reporte de ejecución del caso que está fallando** (HTML: `playwright-report/` o JUnit: `test-results/junit.xml`) como attachment del issue.
3. Linkear el issue desde el PR si bloquea la entrega.

> ⚠️ **El TL de QA NO crea issues `[BUG]`.** Los abren los aprendices. El TL deja feedback de corrección en el PR y, si hace falta, devuelve la tarjeta a `In Progress`.

Plantilla sugerida para el issue:
```
[BUG] <título corto>
- Spec afectada: tests/<tech>/<spec>.spec.ts
- Pasos para reproducir: ...
- Resultado actual: ...
- Resultado esperado: ...
- Evidencia (logs/screenshot/report HTML|junit): ...
```

## 📊 Cobertura / alcance esperado

- **APIs:** happy path + escenarios de error (status 4xx) por endpoint cubierto.
- **Web:** flujos principales de la feature asignada.
- **E2E:** al menos un flujo integrado por feature (`API crea → API valida` o `Web navega → API valida`), respetando la carpeta `e2e/<smoke|regression>/` de su tecnología.

## 🔗 Referencias

- [QAX Real Experience Wiki](https://github.com/QAX-Real-Experience/.github/wiki)
  - [Flujo del aprendiz](https://github.com/QAX-Real-Experience/.github/wiki/Flujo-del-aprendiz)
  - [Convención de commits](https://github.com/QAX-Real-Experience/.github/wiki/Convención-de-Commits)
  - [Definition of Ready](https://github.com/QAX-Real-Experience/.github/wiki/Definition-of-Ready)
  - [Definition of Done](https://github.com/QAX-Real-Experience/.github/wiki/Definition-of-Done)
- [Tablero (Campus QAX)](https://github.com/orgs/QAX-Real-Experience/projects/1)
- [QAXpert](https://qaxpert.com)