/**
 * Data builders para entidades de prueba. Permite construir payloads
 * válidos e inválidos de forma declarativa.
 */
import { faker } from "@faker-js/faker";
import type { AuthRequest } from "../../types/auth.js";
import { generateEmail } from "../../shared/utils/dataGenerator.js";

/**
 * Construye un usuario válido con email aleatorio y contraseña segura.
 */
export function buildValidUser(): AuthRequest {
  return {
    email: generateEmail(),
    password: `Test${faker.string.alphanumeric(4)}3*`,
  };
}

/**
 * Construye un usuario con contraseña vacía (escenario de error).
 */
export function buildUserWithoutPassword(): AuthRequest {
  const user = buildValidUser();
  return { ...user, password: "" };
}