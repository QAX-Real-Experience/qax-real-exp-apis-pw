# Diseño de pruebas

## Feature: Registro de aprendiz cero

Como aprendiz cero quiero registrarme para iniciar mi ingreso de información personal.

```gherkin
Scenario: Registro exitoso
  Given que el aprendiz no existe en el sistema
  When envía email, password y nombre completo válidos
  Then el sistema crea el usuario
  And asigna acceso free
```

```gherkin
Scenario: Registro inválido
  Given que el aprendiz envía datos incompletos o inválidos
  When solicita el registro
  Then el sistema rechaza la operación con un mensaje claro
```

| ID | Tipo | Caso | Automatizado | Tag |
| --- | --- | --- | --- | --- |
| REG-001 | HP | Registro exitoso | Si | `@smoke` |
| REG-002 | UH | Email faltante | Si | `@regression` |
| REG-003 | UH | Password menor a 8 caracteres | Si | `@regression` |
| REG-004 | HP | Password de exactamente 8 caracteres | Si | `@regression` |
| REG-005 | UH | Email mal formado | Si | `@regression` |
| REG-006 | HP | Nombre de exactamente 100 caracteres | Si | `@regression` |
| REG-007 | UH | Nombre mayor a 100 caracteres | Si, marcado como bug conocido | `@regression` |
| REG-008 | UH | Email duplicado | Si | `@regression` |
| REG-009 | HP | Email de bienvenida | No, descartado por BUG-002 | No aplica |

## Feature: Login de aprendiz cero

Como aprendiz registrado quiero iniciar sesión para acceder al onboarding.

```gherkin
Scenario: Login exitoso
  Given que el aprendiz ya está registrado
  When envía email y password válidos
  Then el sistema devuelve access_token
  And el token permite consultar /auth/v1/user
```

```gherkin
Scenario: Login inválido
  Given que las credenciales son incorrectas o incompletas
  When solicita login
  Then el sistema rechaza la sesión
```

| ID | Tipo | Caso | Automatizado | Tag |
| --- | --- | --- | --- | --- |
| LOG-001 | HP | Login exitoso y validación del token | Si | `@smoke` |
| LOG-002 | UH | Password incorrecta | Si | `@regression` |
| LOG-003 | UH | Usuario inexistente | Si | `@regression` |
| LOG-004 | UH | Email faltante | Si | `@regression` |
| LOG-005 | UH | Password faltante | Si | `@regression` |
| LOG-006 | UH | Email mal formado | Si | `@regression` |
| LOG-007 | HP | Redirección web a onboarding | Manual | No aplica |

## Feature: Flujo e2e de servicios

```gherkin
Scenario: Registro y login del aprendiz
  Given que se registra un aprendiz nuevo
  When inicia sesión con las mismas credenciales
  Then obtiene un access_token
  And /auth/v1/user confirma que es el mismo usuario
```

| ID | Tipo | Caso | Automatizado | Tag |
| --- | --- | --- | --- | --- |
| E2E-001 | HP | Registro -> login -> usuario autenticado | Si | `@e2e` |
| E2E-002 | HP | Registro -> email -> login -> onboarding web | Manual parcial; email descartado por BUG-002 | `@e2e` |
