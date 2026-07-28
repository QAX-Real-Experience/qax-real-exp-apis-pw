import { test } from '@playwright/test';

export class Logger {
  /**
   * Log para un paso lógico del test (se verá en el reporte HTML)
   */
  static async step(name: string, callback: () => Promise<any>) {
    return await test.step(name, async () => {
      console.log(`\n[PASO] >>> ${name}`);
      return await callback();
    });
  }

  /**
   * Log detallado de una petición API
   */
  static request(method: string, url: string, body?: any) {
    console.log(`\n🚀 REQUEST [${method}]`);
    console.log(`🔗 URL: ${url}`);
    if (body) {
      console.log(`📦 Body: ${JSON.stringify(body, null, 2)}`);
    }
  }

  /**
   * Log detallado de una respuesta API
   */
  static response(status: number, body: any) {
    console.log(`\n✅ RESPONSE`);
    console.log(`📊 Status: ${status}`);
    // Mostramos un resumen del body si es muy largo, o todo si es pequeño
    const bodyString = JSON.stringify(body, null, 2);
    console.log(`📄 Body: ${bodyString.length > 500 ? bodyString.substring(0, 500) + '...' : bodyString}`);
    console.log('--------------------------------------------------');
  }

  /**
   * Log para errores claros
   */
  static error(message: string, error?: any) {
    console.error(`\n❌ ERROR: ${message}`);
    if (error) {
      console.error(error);
    }
  }
}
