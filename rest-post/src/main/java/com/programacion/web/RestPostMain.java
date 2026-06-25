package com.programacion.web;

import jakarta.persistence.Persistence;
import jakarta.ws.rs.SeBootstrap;

import java.net.URI;

/**
 * Punto de entrada de la aplicación.
 *
 * En el estado actual, el método main solamente comprueba que JPA puede leer
 * persistence.xml y crear un EntityManager. El bloque de SeBootstrap que
 * iniciaría el servidor REST se encuentra comentado.
 */
public class RestPostMain {
    public static void main(String[] args) throws InterruptedException {

        /*
         * Busca en META-INF/persistence.xml una unidad de persistencia llamada
         * "place". Hibernate utiliza la configuración de esa unidad para crear
         * la fábrica de EntityManager.
         *
         * EntityManagerFactory es un objeto costoso y normalmente se crea una
         * sola vez durante toda la vida de la aplicación.
         */
        var emf = Persistence.createEntityManagerFactory("place");

        /*
         * EntityManager representa una sesión de trabajo con la base de datos.
         * Se utiliza para buscar, guardar, modificar y eliminar entidades.
         *
         * A diferencia de EntityManagerFactory, no debe compartirse libremente
         * entre peticiones o hilos.
         */
        var em = emf.createEntityManager();

        // Esta impresión solo permite comprobar que el EntityManager fue creado.
        System.out.println(em);

    /*
     * Este bloque iniciaría la aplicación REST mediante Jakarta REST
     * (JAX-RS). MyApplication define la configuración REST de la aplicación.
     *
     * SeBootstrap.Configuration config = SeBootstrap.Configuration.builder()
     * configura la dirección y el puerto del servidor.
     */
    /*SeBootstrap.Configuration config = SeBootstrap.Configuration.builder()
            .host("0.0.0.0")
            .port(8080)
            .protocol("http").build();

    SeBootstrap.start(MyApplication.class, config)
            .thenAccept(instance -> {
              System.out.println(instance);
              URI uri = instance.configuration().baseUri();
              System.out.println("Server started at: " + uri);
            });

    // Mantiene vivo el hilo principal para que el servidor no se cierre.
    Thread.currentThread().join();*/

        /*
         * IMPORTANTE:
         * En código definitivo deben cerrarse em y emf cuando ya no se usen.
         * JpaConfig pretende administrar estos recursos mediante CDI cuando
         * Weld sea quien controle el ciclo de vida de la aplicación.
         */
    }
}
