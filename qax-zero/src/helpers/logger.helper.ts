// Helper para mostrar en consola los pasos principales de cada prueba.

export class Logger {

    // Marca pasos importantes durante una prueba.
    static step(message: string): void {
        console.log(`\nSTEP: ${message}`);
    }

    // Muestra el metodo, endpoint y body antes de llamar a la API.
    static request(method: string, endpoint: string, data?: unknown): void {
        console.log(`\nREQUEST: ${method} ${endpoint}`);

        if (data) {
            console.log('REQUEST BODY:', JSON.stringify(data, null, 2));
        }
    }

    // Muestra el status code y, si se pide, el body de respuesta.
    static response(status: number, body?: unknown): void {
        console.log(`RESPONSE STATUS: ${status}`);

        if (body) {
            console.log('RESPONSE BODY:', JSON.stringify(body, null, 2));
        }
    }
}
