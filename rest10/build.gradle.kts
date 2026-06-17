plugins {
    id("java")
    id("application")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

dependencies {
    implementation("org.jboss.resteasy:resteasy-core:7.0.2.Final")
    implementation("org.jboss.resteasy:resteasy-undertow:7.0.2.Final")
    implementation("org.jboss.resteasy:resteasy-client:7.0.2.Final")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}
application {
    // Main class that starts the server
    mainClass.set("com.programacion.web.Rest01Server")
}

tasks.test {
    useJUnitPlatform()
}