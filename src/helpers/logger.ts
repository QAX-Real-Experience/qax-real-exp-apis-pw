/**
 * Logger reutilizable para APIs, Web y E2E.
 *
 * Envuelve `test.step` de Playwright para registrar pasos lógicos en
 * el reporte HTML y emite logs legibles en consola para requests y
 * respuestas HTTP.
 */
import { test } from "@playwright/test";

export class Logger {
  /** Log para un paso lógico del test (se ve en el reporte HTML). */
  static async step<T>(name: string, callback: () => Promise<T>): Promise<T> {
    return await test.step(name, async () => {
      console.log(`\n[PASO] >>> ${name}`);
      return await callback();
    });
  }

  /** Log detallado de una petición API. */
  static request(method: string, url: string, body?: unknown) {
    console.log(`\n🚀 REQUEST [${method}]`);
    console.log(`🔗 URL: ${url}`);
    if (body) {
      console.log(`📦 Body: ${JSON.stringify(body, null, 2)}`);
    }
  }

  /** Log detallado de una respuesta API. */
  static response(status: number, body: unknown) {
    console.log(`\n✅ RESPONSE`);
    console.log(`📊 Status: ${status}`);
    const bodyString = JSON.stringify(body, null, 2);
    console.log(
      `📄 Body: ${bodyString.length > 500 ? bodyString.substring(0, 500) + "..." : bodyString}`
    );
    console.log("--------------------------------------------------");
  }

  /** Log para errores claros. */
  static error(message: string, error?: unknown) {
    console.error(`\n❌ ERROR: ${message}`);
    if (error) {
      console.error(error);
    }
  }
}