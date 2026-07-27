export class errorSignup{

    error_code: string;

    constructor(data: any) {
    this.error_code = data.error_code;
    }

    hasErrorMessage(): boolean {
    return this.error_code === 'validation_failed';
  }
}