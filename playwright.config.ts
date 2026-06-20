import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

// Carga las variables definidas en el archivo .env local.
dotenv.config();

// Variables obligatorias para ejecutar las pruebas contra Supabase.
const requiredEnvVars = ["BASE_URL", "SUPABASE_API_KEY", "TEST_USER_PASSWORD"] as const;

// Detiene la ejecucion si falta alguna variable requerida.
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Variables ya validadas para usarlas dentro de la configuracion.
const baseURL = process.env.BASE_URL as string;
const supabaseApiKey = process.env.SUPABASE_API_KEY as string;

// Configuracion general de Playwright para las pruebas de API.
export default defineConfig({
  testDir: "./tests",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    // Headers comunes que se enviaran en todas las requests.
    extraHTTPHeaders: {
      apikey: supabaseApiKey,
      "Content-Type": "application/json",
    },
  },
});
