/**
 * Utilidades de generación de datos compartidas entre dominios.
 */

/**
 * Genera emails únicos para evitar conflictos con usuarios ya
 * registrados. Combina timestamp + sufijo aleatorio.
 */
export function generateEmail(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `qre.auth.${timestamp}.${randomSuffix}@example.com`;
}