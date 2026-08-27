# Estrategia de pruebas

## Automatizado

Se automatizan los escenarios que validan reglas críticas del backend y no dependen de herramientas externas:

- Registro exitoso.
- Validaciones mínimas de registro.
- Email duplicado.
- Login exitoso.
- Login con credenciales inválidas.
- Validación del `access_token` en `/auth/v1/user`.
- Flujo de servicios registro -> login -> usuario autenticado.

## Manual

Se mantienen manuales los escenarios que dependen de email, navegador o validación visual:

- Contenido del email de bienvenida. Se descarta de la automatización por BUG-002: la prueba manual confirmó que el email no llega.
- Remitente y asunto del email. Se descarta de la automatización por BUG-002.
- Redirección web al onboarding.
- Bienvenida con el nombre del aprendiz en pantalla.
- Validación detallada del acceso free trial más allá de la respuesta de registro.

## Tags

El proyecto usa solo estos tags:

- `@smoke`: casos principales que confirman que el flujo base funciona.
- `@regression`: validaciones de reglas y escenarios negativos.
- `@e2e`: flujo completo de servicios.

## Datos

Cada registro usa un email dinámico para evitar duplicados accidentales.

El token de login se guarda solo en una variable dentro del test. No se guarda en archivos.

## Seguridad

No se deben subir:

- `.env`
- `.env.stg`
- tokens
- passwords
- reportes temporales
- resultados de pruebas
