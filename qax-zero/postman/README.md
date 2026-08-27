# Ejecución manual en Postman

Este archivo es una guía simple para ejecutar manualmente la colección de Postman.

## Paso 1: sacar la supabase_anon_key desde el navegador

La variable `supabase_anon_key` se saca desde el navegador, no desde el código, para ello se deben serguir estos pasos:

1. Abrir la página de QAX en Chrome.
2. Hacer login con el usuario y password que le permiten entrar a la página.
3. Abrir las herramientas del navegador con `Option + Command + I`.
4. Entrar a la pestaña `Network`.
5. Ir a la página donde se puede registrar el aprendiz.
6. Ejecutar un registro o abrir el request de registro.
7. Buscar el request llamado `register-lead`.
8. Entrar a `Headers`.
9. Buscar el header `apikey`.
10. Copiar el valor completo de `apikey`.

Ese valor normalmente empieza con:

```text
eyJhbGciOi...
```

Ese valor se pega en Postman en la variable:

```text
supabase_anon_key
```

Importante: se pega solo el token, sin la palabra `Bearer`.

## Paso 2: completar variables en Postman

En Postman, abrir la colección y entrar a la pestaña `Variables`.

Completar estas variables:

| Variable | Qué valor va |
| --- | --- |
| `base_url` | `https://zjlscomkvdbspkuudled.supabase.co` |
| `supabase_anon_key` | El valor copiado desde el header `apikey` del navegador |
| `email` | Email del aprendiz que se quiere registrar o loguear |
| `password` | Password del aprendiz |
| `full_name` | Nombre del aprendiz |
| `access_token` | Token que sale después de hacer login en Postman |

La variable `supabase_anon_key` debe ir en `Current value`.

## Paso 3: revisar los headers

Para registro y login, los dos headers usan el mismo valor:

```text
apikey: {{supabase_anon_key}}
Authorization: Bearer {{supabase_anon_key}}
```

Eso significa que:

- `apikey` usa la variable `supabase_anon_key`.
- `Authorization` también usa la variable `supabase_anon_key`.
- En `Authorization` se agrega la palabra `Bearer`, pero eso ya está armado en la colección.
- No debe escribir `Bearer` dentro de la variable.

Correcto:

```text
supabase_anon_key = eyJhbGciOi...
```

Incorrecto:

```text
supabase_anon_key = Bearer eyJhbGciOi...
```

## Paso 4: dejar Authorization en No Auth

En cada request, la pestaña `Authorization` de Postman debe quedar en:

```text
No Auth
```

La autorización ya está en la pestaña `Headers`.

Si la pestaña `Authorization` queda activa con otro valor, Postman puede mandar un token incorrecto y Supabase puede responder:

```json
{
  "code": "UNAUTHORIZED_INVALID_JWT_FORMAT",
  "message": "Invalid JWT"
}
```

## Flujo manual recomendado

1. Completar `supabase_anon_key`.
2. Completar un `email` nuevo.
3. Ejecutar `Registro exitoso`.
4. Ejecutar `Login exitoso` con el mismo email y password.
5. Copiar el `access_token` de la respuesta del login.
6. Pegar el token en la variable `access_token`.
7. Ejecutar `Validar usuario autenticado`.

## Diferencia entre supabase_anon_key y access_token

`supabase_anon_key`:

- Sale del navegador, desde el header `apikey`.
- Se usa para ejecutar registro y login.
- Es el mismo valor que se usa en `apikey` y en `Authorization` para esos requests.

`access_token`:

- Sale de la respuesta del request `Login exitoso`.
- Se usa para ejecutar `Validar usuario autenticado`.
- No reemplaza a `supabase_anon_key`.

