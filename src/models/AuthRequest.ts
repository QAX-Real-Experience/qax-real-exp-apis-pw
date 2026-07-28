// Estructura del body que se envia a los endpoints de signup y login.
export interface AuthRequest {
  email: string;
  password: string;
}
