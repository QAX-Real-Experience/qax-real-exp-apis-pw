import { APIResponse } from '@playwright/test';

// Helper para leer respuestas sin repetir la misma linea en todos los tests.

// Lee una respuesta JSON y la devuelve con el tipo que espera el test.
export async function getJsonBody<T>(response: APIResponse): Promise<T> {
    return await response.json() as T;
}

// Lee una respuesta como texto cuando solo queremos revisar el mensaje de error.
export async function getBodyAsText(response: APIResponse): Promise<string> {
    return await response.text();
}
