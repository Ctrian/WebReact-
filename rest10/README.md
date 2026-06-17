# rest10

Pequeño proyecto REST con Jakarta RESTEasy + Undertow para pruebas locales.

Requisitos
- Java 17
- (Opcional) Gradle local o usar el wrapper incluido

Comandos útiles

Desde la carpeta `rest10`:

Windows (PowerShell o cmd):

```
gradlew.bat build
gradlew.bat run
```

Unix/macOS:

```
./gradlew build
./gradlew run
```

El servidor arranca por defecto en `http://0.0.0.0:8080/` y la aplicación publica la API bajo `/api`.

Endpoint de ejemplo

```
GET http://localhost:8080/api/hola/mundo
Accept: text/plain
```

Ejemplo con `curl`:

```
curl -i http://localhost:8080/api/hola/mundo
```

Notas
- Se añadió el plugin `application` en `build.gradle.kts` para permitir `gradlew run`.
- Si obtienes errores al ejecutar `java -cp ...`, usa `gradlew run` para garantizar el classpath completo.
- Para detener el servidor presiona `Ctrl+C` en la terminal donde ejecutaste `gradlew run`.

Solución de problemas
- Si el puerto 8080 está en uso, modifica `Rest01Server` o detén el servicio que ocupa el puerto.
- Si la petición falla por cabeceras, evita problemas de quoting en `cmd` y usa PowerShell o curl desde WSL.
