import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Carga variables desde .env local antes de evaluar cualquier project.
// La validación tipada (fail-fast) la hace src/config/env.ts, que se
// importa estáticamente desde los módulos de tests en runtime.
dotenv.config();

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const BASE_URL_API = process.env.BASE_URL_API ?? "http://localhost";
const BASE_URL_WEB = process.env.BASE_URL_WEB ?? "http://localhost:5173";

export default defineConfig({
  testDir: "./tests",
  // Suite separada en subdirectorios; cada project selecciona el suyo.
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

  // Projects: APIs, Web y E2E. Podés correrlos con --project=<name>.
  projects: [
    {
      name: "apis",
      testDir: "./tests/apis",
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
      use: {
        baseURL: BASE_URL_WEB,
        browserName: "chromium",
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      dependencies: ["apis"],
      use: {
        baseURL: BASE_URL_WEB,
        browserName: "chromium",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});