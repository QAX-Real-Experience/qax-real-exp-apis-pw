import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.ENV || 'stg';

// Cargamos variables del ambiente seleccionado, por ejemplo .env.stg.
dotenv.config({
  path: path.resolve(__dirname, `.env.${environment}`),
});

// Si falta alguna variable, tambien revisa .env como apoyo local.
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  // Playwright busca las pruebas dentro de esta carpeta.
  testDir: './tests',

  // Los tests corren de forma controlada porque crean usuarios reales en stg.
  fullyParallel: false,

  // Evita que se suba por accidente un test.only al pipeline.
  forbidOnly: Boolean(process.env.CI),

  // En CI reintenta dos veces. En local no reintenta.
  retries: process.env.CI ? 2 : 0,

  // Un solo worker evita cruces entre usuarios creados por los tests.
  workers: 1,

  // Tiempo maximo permitido para cada test.
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  // Carpeta temporal donde Playwright deja resultados y trazas.
  outputDir: 'test-results',

  // Reporte simple para ver resultados en consola y en HTML.
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
  ],

  use: {
    // URL base del proyecto Supabase.
    baseURL: process.env.API_BASE_URL,

    // Headers que necesitan las APIs de Supabase.
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apikey: process.env.SUPABASE_ANON_KEY || '',
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
      'x-client-info': 'supabase-js/2.112.3; runtime=web',
      'x-supabase-api-version': '2024-01-01',
    },

    // Guarda trace solo cuando una prueba falla.
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',

      // Solo toma archivos que terminen en .api.spec.ts.
      testMatch: /.*\.api\.spec\.ts/,
    },
  ],
});
