plugins {
    id("java")
    id("io.freefair.lombok") version "9.5.0"
}

group = "org.example"
version = "unspecified"

repositories {
    mavenCentral()
}

val restEasyVersion = "7.0.2.Final"
val weldVersion = "6.0.4.Final"
var hibernateVersion = "7.4.1.Final"

dependencies {
    //CDI
    // ya se usa weld en la dependencia undertow
    //implementation("org.jboss.weld.se:weld-se-core:${weldVersion}")

    //JPA
    implementation("org.hibernate.orm:hibernate-core:${hibernateVersion}")
    implementation("org.postgresql:postgresql:42.7.11")

    //REST
    implementation("org.jboss.resteasy:resteasy-core:${restEasyVersion}")
    // implementation("org.jboss.resteasy:resteasy-undertow:${restEasyVersion}")
    implementation("org.jboss.resteasy:resteasy-undertow-cdi:${restEasyVersion}")
    implementation("org.jboss.resteasy:resteasy-json-binding-provider:${restEasyVersion}")
}

tasks.test {
    useJUnitPlatform()
}