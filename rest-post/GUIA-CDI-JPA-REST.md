# Guía de integración: RESTEasy, CDI/Weld y JPA/Hibernate

Esta guía explica cómo se conectan los siguientes archivos del proyecto:

- `build.gradle.kts`
- `RestPostMain.java`
- `JpaConfig.java`
- `User.java`
- `META-INF/persistence.xml`
- `META-INF/beans.xml`
- `MyApplication.java`

## Idea principal

Agregar una dependencia en `build.gradle.kts` hace que una tecnología esté disponible en el proyecto, pero no configura automáticamente cómo debe utilizarse.

Por ejemplo:

- Hibernate proporciona la implementación de JPA, pero no conoce la URL, el usuario ni la contraseña de la base de datos.
- El driver de PostgreSQL permite conectarse a PostgreSQL, pero no conoce qué base debe abrir.
- Weld proporciona CDI, pero todavía necesita descubrir qué clases de la aplicación serán administradas como beans.
- RESTEasy proporciona Jakarta REST, pero necesita conocer la aplicación y sus recursos REST.

La relación general es:

```text
build.gradle.kts
    |
    +-- instala Hibernate y PostgreSQL
    |       |
    |       +-- persistence.xml configura la conexión y la unidad JPA
    |
    +-- instala RESTEasy Undertow CDI
            |
            +-- aporta REST, Undertow y Weld/CDI
                    |
                    +-- beans.xml configura el descubrimiento CDI
                    +-- JpaConfig crea objetos JPA inyectables
```

## `build.gradle.kts`

Este archivo administra las dependencias y la construcción del proyecto.

### Java 21

El proyecto debe compilarse con una versión de Java compatible con las librerías usadas por CDI/Weld, Jandex y DeltaSpike.

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

Esto evita errores como:

```text
Unsupported class file major version 68
```

`major version 68` corresponde a clases compiladas con Java 24. Si IntelliJ o Gradle usan JDK 24 para compilar, algunas librerías de escaneo de clases pueden fallar. Para este proyecto se fijó Java 21 porque es estable y compatible con el conjunto actual de dependencias.

Después de cambiar la versión de Java conviene limpiar y recompilar:

```powershell
.\gradlew.bat clean run
```

En IntelliJ IDEA también debe revisarse:

```text
Settings / Build, Execution, Deployment / Build Tools / Gradle / Gradle JVM
```

Debe apuntar a Java 21. Si IntelliJ ejecuta Gradle con Java 24, puede volver a aparecer el error aunque `build.gradle.kts` tenga toolchain configurado.

### Hibernate

```kotlin
implementation("org.hibernate.orm:hibernate-core:${hibernateVersion}")
```

Hibernate es la implementación de Jakarta Persistence utilizada por el proyecto. Proporciona clases capaces de convertir entidades Java en operaciones SQL.

### Driver PostgreSQL

```kotlin
implementation("org.postgresql:postgresql:42.7.11")
```

Este driver permite que Java se comunique con PostgreSQL mediante JDBC.

### RESTEasy

```kotlin
implementation("org.jboss.resteasy:resteasy-core:${restEasyVersion}")
implementation("org.jboss.resteasy:resteasy-undertow-cdi:${restEasyVersion}")
implementation("org.jboss.resteasy:resteasy-json-binding-provider:${restEasyVersion}")
```

Estas dependencias proporcionan:

- La implementación de Jakarta REST.
- El servidor web embebido Undertow.
- Integración entre Undertow, RESTEasy y CDI.
- Conversión entre objetos Java y JSON mediante JSON-B.

### CDI y DeltaSpike Data

Para ejecutar `RestPostMain` con CDI en modo Java SE se declara Weld explícitamente:

```kotlin
implementation("org.jboss.weld.se:weld-se-core:${weldVersion}")
```

DeltaSpike Data necesita tanto la API como la implementación:

```kotlin
implementation("org.apache.deltaspike.modules:deltaspike-data-module-api:2.0.1")
implementation("org.apache.deltaspike.modules:deltaspike-data-module-impl:2.0.1")
```

Si falta `deltaspike-data-module-impl`, CDI puede descubrir la interfaz del repositorio, pero no tendrá la implementación necesaria para ejecutar métodos como `findAll()`.

### Plugin `application`

Para poder ejecutar el proyecto con Gradle se usa:

```kotlin
plugins {
    application
}

application {
    mainClass.set("com.programacion.web.RestPostMain")
}
```

Con esto Gradle sabe qué clase contiene el método `main` y se puede ejecutar:

```powershell
.\gradlew.bat run
```

## `RestPostMain.java`

Es el punto de entrada de la aplicación porque contiene:

```java
public static void main(String[] args)
```

Actualmente realiza una prueba de CDI + JPA + DeltaSpike Data:

```java
var cdiContainer = SeContainerInitializer.newInstance()
        .initialize();

var repo = cdiContainer.select(UserRepository.class).get();

repo.findAll().forEach(System.out::println);
```

Es decir:

1. Inicia Weld/CDI.
2. CDI descubre `JpaConfig`.
3. `JpaConfig` crea el `EntityManagerFactory`.
4. DeltaSpike Data crea una implementación para `UserRepository`.
5. `repo.findAll()` consulta la tabla `users`.

### ¿Qué sucede al crear la fábrica JPA?

Cuando se ejecuta:

```java
Persistence.createEntityManagerFactory("place");
```

JPA realiza, de forma simplificada, estos pasos:

1. Busca el archivo `META-INF/persistence.xml` en el classpath.
2. Busca una unidad de persistencia cuyo nombre sea `place`.
3. Lee qué proveedor JPA debe utilizar.
4. Lee la configuración de PostgreSQL.
5. Carga el driver JDBC.
6. Hibernate crea un `EntityManagerFactory`.

La cadena `"place"` conecta el código Java con:

```xml
<persistence-unit name="place">
```

El `EntityManagerFactory` es una fábrica pesada y reutilizable. Normalmente se crea una sola vez durante la vida de la aplicación. En este proyecto lo crea `JpaConfig`, no directamente `RestPostMain`.

El `EntityManager` representa un contexto de trabajo con la base de datos. Se usa para operaciones como:

```java
em.persist(entidad);
em.find(Entidad.class, id);
em.remove(entidad);
```

### Estado actual del servidor REST

El bloque que utiliza `SeBootstrap` está comentado. Por tanto, el programa actual:

- Inicializa CDI.
- Crea los objetos JPA desde `JpaConfig`.
- Obtiene `UserRepository`.
- Ejecuta `findAll()`.
- Imprime los usuarios.
- No inicia el servidor REST.

Cuando se reactive `SeBootstrap`, `MyApplication.class` será la configuración principal de Jakarta REST.

### Ejecución recomendada

Desde la carpeta del proyecto:

```powershell
cd C:\Users\andre\Downloads\WebReact-\rest-post
.\gradlew.bat clean run
```

`clean` es útil cuando se cambió la versión de Java, porque elimina clases compiladas previamente con otra versión.

## `persistence.xml`

Ubicación obligatoria habitual:

```text
src/main/resources/META-INF/persistence.xml
```

Es el archivo estándar de configuración de Jakarta Persistence.

### Unidad de persistencia

```xml
<persistence-unit name="place" transaction-type="RESOURCE_LOCAL">
```

Una unidad de persistencia agrupa toda la configuración JPA bajo un nombre. En este proyecto se llama `place`.

### Tipo de transacción

```xml
transaction-type="RESOURCE_LOCAL"
```

Indica que la propia aplicación controla las transacciones:

```java
var transaction = em.getTransaction();

try {
    transaction.begin();
    em.persist(entidad);
    transaction.commit();
} catch (Exception e) {
    if (transaction.isActive()) {
        transaction.rollback();
    }
    throw e;
}
```

No se está utilizando un administrador de transacciones JTA proporcionado por un servidor Jakarta EE completo.

### Proveedor JPA

```xml
<provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
```

Indica que Hibernate implementará JPA.

### Registro de entidades

En este proyecto se registra explícitamente la entidad `User`:

```xml
<class>com.programacion.web.db.User</class>
```

Esto evita errores como:

```text
Could not resolve root entity 'User'
```

Ese error aparece cuando Hibernate ejecuta una consulta sobre una entidad que no fue incluida en la unidad de persistencia.

### Configuración de PostgreSQL

```xml
<property name="jakarta.persistence.jdbc.driver"
          value="org.postgresql.Driver" />

<property name="jakarta.persistence.jdbc.url"
          value="jdbc:postgresql://localhost:5432/place" />

<property name="jakarta.persistence.jdbc.user"
          value="postgres" />

<property name="jakarta.persistence.jdbc.password"
          value="..." />
```

Estas propiedades especifican:

- El driver JDBC.
- El servidor y puerto de PostgreSQL.
- El nombre de la base de datos.
- Las credenciales.

No es recomendable guardar una contraseña real en un repositorio. Para proyectos reales debería obtenerse desde una variable de entorno, un archivo local ignorado por Git o un gestor de secretos.

### Presentación del SQL

```xml
<property name="hibernate.show_sql" value="true" />
<property name="hibernate.format_sql" value="true" />
<property name="hibernate.highlight_sql" value="true" />
```

Estas opciones permiten ver el SQL generado por Hibernate, formateado y resaltado. Son útiles durante el desarrollo.

### Generación del esquema

La propiedad comentada:

```xml
<!--
<property name="jakarta.persistence.schema-generation.database.action"
          value="update" />
-->
```

controlaría la generación o actualización automática de tablas. Debe utilizarse con precaución, especialmente fuera de desarrollo.

## `beans.xml`

Ubicación:

```text
src/main/resources/META-INF/beans.xml
```

Este archivo pertenece a CDI. En este proyecto, Weld es la implementación de CDI.

La configuración:

```xml
<beans version="4.0" bean-discovery-mode="annotated">
</beans>
```

indica que CDI debe descubrir las clases que tengan anotaciones que las conviertan en beans.

Algunos ejemplos son:

```java
@ApplicationScoped
@RequestScoped
@SessionScoped
@Dependent
```

Aunque `beans.xml` esté vacío, sí tiene una función: declara y configura el archivo de beans CDI.

Con:

```xml
bean-discovery-mode="annotated"
```

Weld no administra todas las clases indiscriminadamente. Se concentra en las clases que poseen anotaciones CDI apropiadas.

En versiones modernas de CDI ciertos proyectos pueden descubrir beans anotados sin incluir `beans.xml`. Sin embargo, agregarlo hace explícita la configuración y permite controlar el modo de descubrimiento.

## `JpaConfig.java`

La intención de esta clase es unir CDI con JPA.

### Bean de aplicación

```java
@ApplicationScoped
public class JpaConfig {
}
```

`@ApplicationScoped` indica que CDI debe crear una sola instancia de `JpaConfig` para toda la aplicación.

### Inicialización

```java
@PostConstruct
void init() {
    emf = Persistence.createEntityManagerFactory("place");
}
```

Después de construir el bean, CDI ejecuta el método marcado con `@PostConstruct`.

El método:

1. Busca `persistence.xml`.
2. Selecciona la unidad `place`.
3. Crea el `EntityManagerFactory`.

### Método productor

La intención del método:

```java
@Produces
public EntityManager entityManager() {
    return emf.createEntityManager();
}
```

es enseñarle a CDI cómo fabricar un `EntityManager`.

Gracias a un productor CDI, otra clase podría solicitarlo mediante:

```java
@Inject
EntityManager em;
```

CDI detectaría que necesita un `EntityManager`, buscaría un productor compatible y llamaría al método de `JpaConfig`.

### Import correcto de `@Produces`

Debe comprobarse que el import sea:

```java
import jakarta.enterprise.inject.Produces;
```

No debe ser:

```java
import jakarta.ws.rs.Produces;
```

Son anotaciones distintas:

- `jakarta.enterprise.inject.Produces`: crea objetos inyectables mediante CDI.
- `jakarta.ws.rs.Produces`: indica el formato que produce un endpoint REST, por ejemplo JSON.

Ejemplo del segundo caso:

```java
@GET
@Produces(MediaType.APPLICATION_JSON)
public Place buscar() {
    // ...
}
```

### Alcance del `EntityManager`

Un `EntityManager` no debería ser `@ApplicationScoped` en una aplicación web real.

`EntityManagerFactory`:

- Es pesada de crear.
- Puede compartirse.
- Debe vivir durante toda la aplicación.

`EntityManager`:

- Representa una unidad o contexto de trabajo.
- No es seguro compartirlo simultáneamente entre peticiones.
- Normalmente debe existir uno por petición o por operación.

Una configuración más apropiada para una aplicación web sería:

```java
@Produces
@RequestScoped
public EntityManager entityManager() {
    return emf.createEntityManager();
}
```

En la prueba actual de consola, el programa ejecuta una operación corta y termina. Para servidor REST, conviene usar `@RequestScoped` o un patrón equivalente por petición.

## `User.java`

Esta clase es la entidad JPA que representa la tabla `users`.

```java
@Entity
@Table(name = "users")
public class User {
}
```

### Nombres de columnas

Los nombres de campos Java usan `camelCase`, por ejemplo:

```java
private String addressCity;
```

Pero la tabla PostgreSQL usa nombres con guion bajo:

```text
address_city
```

Por eso se agregan anotaciones `@Column`:

```java
@Column(name = "address_city")
private String addressCity;
```

Sin ese mapeo Hibernate intentaba consultar columnas como `addressCity` o `addresscity`, y PostgreSQL respondía:

```text
ERROR: no existe la columna u1_0.addresscity
Hint: Probablemente quiera hacer referencia a la columna "u1_0.address_city".
```

La regla práctica es: si el nombre del campo Java no coincide exactamente con el nombre de la columna real, se debe indicar con `@Column(name = "...")`.

### Método disposer

Un método con `@Disposes` realiza la limpieza del objeto producido:

```java
void closeEntityManager(@Disposes EntityManager em) {
    if (em != null && em.isOpen()) {
        em.close();
    }
}
```

El código debe cerrar el `EntityManager` recibido. No debe cerrar el `EntityManagerFactory` cada vez que termina un `EntityManager`.

La fábrica debería cerrarse una sola vez al apagar la aplicación, por ejemplo:

```java
@PreDestroy
void close() {
    if (emf != null && emf.isOpen()) {
        emf.close();
    }
}
```

Una estructura conceptual más adecuada sería:

```java
@ApplicationScoped
public class JpaConfig {

    private EntityManagerFactory emf;

    @PostConstruct
    void init() {
        emf = Persistence.createEntityManagerFactory("place");
    }

    @Produces
    @RequestScoped
    EntityManager entityManager() {
        return emf.createEntityManager();
    }

    void closeEntityManager(@Disposes EntityManager em) {
        if (em != null && em.isOpen()) {
            em.close();
        }
    }

    @PreDestroy
    void closeFactory() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}
```

## `MyApplication.java`

Esta clase configura Jakarta REST:

```java
@ApplicationPath("/api")
public class MyApplication extends Application {
}
```

`@ApplicationPath("/api")` define la ruta base de los endpoints.

Por ejemplo, si posteriormente existe:

```java
@Path("/places")
public class PlaceResource {
}
```

su ruta comenzará con:

```text
/api/places
```

El método actual:

```java
@Override
public Set<Class<?>> getClasses() {
    return Set.of();
}
```

devuelve un conjunto vacío. Esto significa que no registra manualmente ninguna clase de recurso REST.

Dependiendo de la integración y del modo de descubrimiento utilizado, los recursos pueden descubrirse automáticamente o requerir que se agreguen al conjunto:

```java
return Set.of(PlaceResource.class);
```

## Flujo esperado de una petición futura

Cuando el servidor REST y los endpoints estén implementados, el flujo general será:

```text
Cliente HTTP
    |
    | POST /api/places
    v
RESTEasy + Undertow
    |
    v
Clase @Path
    |
    | @Inject
    v
Servicio o repositorio CDI
    |
    | @Inject EntityManager
    v
JpaConfig produce EntityManager
    |
    v
Hibernate / JPA
    |
    v
Driver PostgreSQL
    |
    v
Base de datos "place"
```

Al terminar la petición:

1. CDI destruye el `EntityManager` asociado a esa petición.
2. El método con `@Disposes` lo cierra.
3. El `EntityManagerFactory` permanece abierto para futuras peticiones.
4. Al apagar la aplicación, `@PreDestroy` cierra la fábrica.

## Dependencia frente a configuración

| Elemento | Responsabilidad |
|---|---|
| `build.gradle.kts` | Descarga e incorpora librerías |
| `persistence.xml` | Configura JPA, Hibernate y la conexión |
| `beans.xml` | Configura el descubrimiento CDI |
| `JpaConfig.java` | Produce y administra recursos JPA mediante CDI |
| `User.java` | Mapea la tabla `users` y sus columnas |
| `MyApplication.java` | Define la aplicación y ruta base REST |
| `RestPostMain.java` | Inicia o prueba la aplicación |

Una forma sencilla de recordarlo:

```text
Dependencia = qué herramientas tengo.
Configuración = cómo quiero utilizarlas.
Código = cuándo y para qué las utilizo.
```

## Errores comunes vistos al ejecutar

### `Unsupported class file major version 68`

Significa que se están leyendo clases compiladas con Java 24. La solución aplicada fue:

1. Fijar Java 21 en `build.gradle.kts`.
2. Configurar Gradle JVM en IntelliJ con Java 21.
3. Ejecutar `.\gradlew.bat clean run` para borrar clases antiguas.

### `Could not resolve root entity 'User'`

Hibernate no encontraba la entidad `User` dentro de la unidad de persistencia. La solución fue agregarla en `persistence.xml`:

```xml
<class>com.programacion.web.db.User</class>
```

### `no existe la columna u1_0.addresscity`

La tabla usa nombres `snake_case`, como `address_city`, pero la clase Java usa `camelCase`, como `addressCity`. La solución fue mapear cada campo con `@Column(name = "...")`.

## Puntos importantes para repasar

1. `"place"` debe coincidir entre Java y `persistence.xml`.
2. `EntityManagerFactory` se crea una vez y se comparte.
3. `EntityManager` se crea por petición o unidad de trabajo.
4. `@Produces` para inyección debe provenir de `jakarta.enterprise.inject`.
5. `@Disposes` debe cerrar el objeto producido.
6. `@PreDestroy` puede cerrar la fábrica al apagar la aplicación.
7. `beans.xml` configura CDI; `persistence.xml` configura JPA.
8. Las dependencias no reemplazan la configuración específica de la aplicación.
9. Para ejecutar con Gradle se necesita el plugin `application` y `mainClass`.
10. Las credenciales reales no deberían guardarse en el repositorio.
11. Java 24 produce `major version 68`; este proyecto debe compilarse con Java 21.
12. Las entidades pueden registrarse explícitamente en `persistence.xml`.
13. Si la base usa `snake_case`, los campos `camelCase` deben mapearse con `@Column`.
