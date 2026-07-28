/**
 * Modelo de respuesta de error del endpoint de signup.
 */
export class ErrorSignupResponse {
  error_code: string;

  constructor(data: any) {
    this.error_code = data?.error_code;
  }

  hasErrorMessage(): boolean {
    return this.error_code === "validation_failed";
  }
}