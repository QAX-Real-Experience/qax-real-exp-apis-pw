# Bugs detectados

## BUG-001 - Registro permite nombre mayor a 100 caracteres

**Historia:** US1 - Registro de aprendiz cero.

**Criterio afectado:** el nombre completo debe tener máximo 100 caracteres.

**Pasos:**

1. Enviar `POST /functions/v1/register-lead`.
2. Usar un `full_name` de 101 caracteres.
3. Enviar email y password válidos.

**Resultado esperado:** el servicio rechaza el registro con status `400` o `422`.

**Resultado actual:** el servicio responde `200` y crea el aprendiz.

**Impacto:** se pueden guardar datos fuera del límite definido por negocio.

**Automatización:** el test queda marcado con `test.fail` para mantener el bug visible sin romper la suite completa.

## BUG-002 - No llega email de bienvenida después del registro

**Historia:** US1 - Registro de aprendiz cero.

**Criterio afectado:** el sistema debe enviar un correo de bienvenida al aprendiz recién registrado.

**Pasos manuales:**

1. Registrar un aprendiz nuevo.
2. Revisar la bandeja de entrada del email usado en el registro.
3. Revisar spam o correo no deseado.

**Resultado esperado:** debe llegar un email desde `alertas@qaxpert.com` con el asunto esperado y saludo al aprendiz.

**Resultado actual:** el email de bienvenida no llega.

**Impacto:** el aprendiz no recibe la confirmación/bienvenida esperada después del registro.

**Automatización:** se descarta este test de la automatización porque primero la funcionalidad debe estar operativa. El caso queda marcado con `test.fixme` en el flujo e2e.
