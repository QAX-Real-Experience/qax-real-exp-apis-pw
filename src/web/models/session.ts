/**
 * Modelos mínimos de dominio Web.
 */

// Estado de sesión que puede propagarse entre API y UI.
export interface SessionState {
  accessToken: string;
  refreshToken?: string;
  userId?: string;
  email?: string;
}