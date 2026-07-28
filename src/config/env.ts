/**
 * Carga y validación centralizada de variables de entorno.
 *
 * Cualquier variable requerida por la automatización debe declararse y
 * validarse aquí. Si falta una key obligatoria, la ejecución falla de
 * manera temprana con un mensaje claro, evitando errores confusos más
 * adelante en la suite.
 *
 * Las variables se obtienen desde `.env` (cargado por `dotenv` desde
 * `playwright.config.ts`) o desde el entorno del sistema operativo.
 */
import dotenv from "dotenv";

dotenv.config();

/**
 * Lista de variables obligatorias. Si alguna no está presente, la
 * validación fallará antes de ejecutar ninguna prueba.
 */
const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "BASE_URL_API",
  "TEST_USER_PASSWORD",
] as const;

/**
 * Lee una variable del entorno valida; lanza error si falta.
 */
function getRequired(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env and fill the values. See README > Manejo de KEYS.`
    );
  }
  return value;
}

function getOptional(name: string, fallback = ""): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

/**
 * Valida de forma eager las variables requeridas al importar este
 * módulo. Falla lo antes posible.
 */
function assertRequired() {
  for (const name of REQUIRED_ENV_VARS) {
    getRequired(name);
  }
}

assertRequired();

/**
 * Objeto tipado y centralizado con todas las variables del entorno.
 * Las variables opcionales exponen un valor por defecto seguro.
 */
export const env = {
  // Supabase
  supabaseUrl: getRequired("SUPABASE_URL"),
  supabaseAnonKey: getRequired("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getOptional("SUPABASE_SERVICE_ROLE_KEY"),

  // Base URLs por dominio
  baseUrlApi: getRequired("BASE_URL_API"),
  baseUrlWeb: getOptional("BASE_URL_WEB"),

  // Usuario de prueba
  testUserEmail: getOptional("TEST_USER_EMAIL"),
  testUserPassword: getRequired("TEST_USER_PASSWORD"),

  // Opcional
  apiToken: getOptional("API_TOKEN"),
} as const;

export type Env = typeof env;

/**
 * Helper para obtener una variable requerida a demanda (por ejemplo,
 * desde un fixture que sólo corre en ciertos proyectos).
 */
export function requireEnv(name: (typeof REQUIRED_ENV_VARS)[number] | string): string {
  return getRequired(name);
}