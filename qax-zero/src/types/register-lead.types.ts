// Define los datos que enviamos para registrar un aprendiz cero.
export interface RegisterLeadRequest {
    email: string;
    password: string;
    full_name: string;
    captcha_token: string | null;
}

// Define los datos principales que devuelve un registro exitoso.
export interface RegisterLeadResponse {
    success: boolean;
    user_id: string;
    enrollment_id: string;
    enrollment_framework_id: string;
    payment_status: string;
    id_status: string;
}

// Define posibles campos de error cuando el login falla, con el signo ? en la propiedad, se indica que el valor es opcional, es decir, puede o no estar presente en la respuesta.
export interface RegisterLeadErrorResponse {
    success?: boolean;
    message?: string;
    error?: string;
}
