// Genera emails unicos para evitar conflictos con usuarios ya registrados.
export function generateEmail(): string {
  // Combina fecha actual y sufijo aleatorio para reducir repetidos.
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  return `qre.auth.${timestamp}.${randomSuffix}@example.com`;
}
