plugins {
    id("java")
    application
    id("io.freefair.lombok") version "9.5.0"
}

group = "org.example"
version = "unspecified"

repositories {
    mavenCentral()
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

dependencies {
    // rest easy - json b
    implementation("org.jboss.resteasy:resteasy-client:7.0.2.Final")// rest easy - json b
    implementation("org.jboss.resteasy:resteasy-json-binding-provider:7.0.2.Final")
}

application {
    mainClass.set("com.programacion.web.client.ClienteRestMain")
}

tasks.test {
    useJUnitPlatform()
}
