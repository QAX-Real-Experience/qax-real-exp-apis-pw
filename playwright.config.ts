import { defineConfig, devices } from "@playwright/test";

// Carga directa de variables desde .env local.
// No hay wrapper tipado: cada módulo lee `process.env` donde lo necesita.
require("dotenv").config();

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const BASE_URL_API = process.env.BASE_URL_API ?? "http://localhost";
const BASE_URL_WEB = process.env.BASE_URL_WEB ?? "http://localhost:5173";

export default defineConfig({
  // Cada project define su propio testDir; el general sólo fija defaults.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  globalTimeout: 60_000,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Projects por tecnología. No hay project `e2e` separado: cada
  // tecnología (apis, web) aloja sus flujos e2e dentro de su propia
  // carpeta (tests/<tech>/e2e/{smoke,regression}). Para correrlos se
  // filtra con --grep por tag (@smoke | @regression) o apuntando al
  // subdirectorio. Ver README > Nomenclatura y Smoke/Regression.
  projects: [
    {
      name: "apis",
      testDir: "./tests/apis",
      testMatch: /.*\.spec\.ts$/,
      use: {
        baseURL: BASE_URL_API,
        extraHTTPHeaders: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      },
    },
    {
      name: "web",
      testDir: "./tests/web",
      testMatch: /.*\.spec\.ts$/,
      use: {
        baseURL: BASE_URL_WEB,
        browserName: "chromium",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});