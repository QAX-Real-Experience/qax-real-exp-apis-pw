/**
 * Modelo de respuesta exitosa del endpoint de signup.
 * Acepta el envelope crudo y expone validaciones de negocio.
 */
export class SignupResponseModel {
  id: string;
  aud: string;

  constructor(data: any) {
    this.id = data?.user?.id;
    this.aud = data?.user?.aud;
  }

  hasValidId(): boolean {
    return this.id !== undefined && this.id !== null;
  }

  hasValidAud(): boolean {
    return this.aud === "authenticated";
  }
}