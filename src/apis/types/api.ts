/**
 * Tipos genéricos utilitarios para pruebas de APIs.
 */

// Envelope estándar devuelto por ApiHelper.post/get/etc.
export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

// Forma mínima de un error devuelto por Supabase.
export interface ApiError {
  code?: string;
  error_code?: string;
  msg?: string;
  message?: string;
}