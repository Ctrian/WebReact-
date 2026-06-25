plugins {
    id("java")
    id("application")
    id("io.freefair.lombok") version "9.5.0"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

dependencies {
    implementation("org.jboss.resteasy:resteasy-core:7.0.2.Final")
    implementation("org.jboss.resteasy:resteasy-undertow:7.0.2.Final")
    
    implementation("org.jboss.resteasy:resteasy-client:7.0.2.Final")

    // rest easy - json b
    implementation("org.jboss.resteasy:resteasy-json-binding-provider:7.0.2.Final")
}
application {
    // Main class that starts the server
    mainClass.set("com.programacion.web.Rest01Server")
}

tasks.test {
    useJUnitPlatform()
}