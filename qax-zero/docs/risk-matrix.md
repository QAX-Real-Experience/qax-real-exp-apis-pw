# Matriz de riesgos

| Caso | Severidad | Probabilidad | Impacto operacional | Prioridad |
| --- | --- | --- | --- | --- |
| Registro exitoso falla | Alta | Media | El aprendiz no entra al producto | Alta |
| No se asigna acceso free | Alta | Media | El aprendiz queda creado pero sin acceso | Alta |
| Email duplicado permite segundo usuario | Alta | Baja | Datos duplicados y sesiones inconsistentes | Alta |
| Password corta aceptada | Media | Media | Debilita regla mínima de seguridad | Media |
| Email mal formado aceptado | Media | Media | Usuarios inválidos y problemas de contacto | Media |
| Nombre mayor a 100 caracteres aceptado | Baja | Media | Problemas de visualización o almacenamiento | Media |
| Login exitoso falla | Alta | Media | El aprendiz registrado no puede entrar | Alta |
| Password incorrecta inicia sesión | Crítica | Baja | Acceso no autorizado | Alta |
| Usuario inexistente expone información | Media | Media | Riesgo de enumeración de usuarios | Media |
| Token no funciona en /auth/v1/user | Alta | Media | Sesión creada pero no usable | Alta |
| Email de bienvenida no llega | Media | Alta | Mala experiencia inicial. Confirmado como BUG-002 | Alta |
| Redirección a onboarding falla | Alta | Media | El aprendiz no completa información personal | Alta |
