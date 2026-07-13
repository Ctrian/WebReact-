plugins {
    id("java")
    id("application")
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

val restEasyVersion = "7.0.2.Final"
val weldVersion = "6.0.4.Final"
val hibernateVersion = "6.6.49.Final"

dependencies {
    //CDI
    implementation("org.jboss.weld.se:weld-se-core:${weldVersion}")

    //JPA
    implementation("org.hibernate.orm:hibernate-core:${hibernateVersion}")
    implementation("org.postgresql:postgresql:42.7.11")
    implementation("org.apache.deltaspike.modules:deltaspike-data-module-api:2.0.1")
    implementation("org.apache.deltaspike.modules:deltaspike-data-module-impl:2.0.1")

    //REST
    implementation("org.jboss.resteasy:resteasy-core:${restEasyVersion}")
    // implementation("org.jboss.resteasy:resteasy-undertow:${restEasyVersion}")
    implementation("org.jboss.resteasy:resteasy-undertow-cdi:${restEasyVersion}")
    implementation("org.jboss.resteasy:resteasy-json-binding-provider:${restEasyVersion}")
}

application {
    mainClass.set("com.programacion.web.RestPostMain")
}

tasks.test {
    useJUnitPlatform()
}

sourceSets {
    main {
        output.setResourcesDir(layout.buildDirectory.dir("classes/java/main"))
    }
}
