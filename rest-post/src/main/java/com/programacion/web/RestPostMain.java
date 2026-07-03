package com.programacion.web;

import com.programacion.web.config.JpaConfig;
import com.programacion.web.repo.UserRepository;
import jakarta.enterprise.inject.se.SeContainerInitializer;
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
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;

        var cdiContainer = SeContainerInitializer.newInstance()
                .initialize();

        // var repo = cdiContainer.select(UserRepository.class).get();
        // repo.findAll().forEach(System.out::println);

        // mostrar el nombre del contenedor, en este caso es un contenedor Weld SE
        var cc = cdiContainer.select(JpaConfig.class).get();
        System.out.println(cc);

    /*
     * Este bloque iniciaría la aplicación REST mediante Jakarta REST
     * (JAX-RS). MyApplication define la configuración REST de la aplicación.
     *
     * SeBootstrap.Configuration config = SeBootstrap.Configuration.builder()
     * configura la dirección y el puerto del servidor.
     */
    SeBootstrap.Configuration config = SeBootstrap.Configuration.builder()
            .host("0.0.0.0")
            .port(port)
            .protocol("http").build();

    SeBootstrap.start(MyApplication.class, config)
            .thenAccept(instance -> {
              System.out.println(instance);
              URI uri = instance.configuration().baseUri();
              System.out.println("Server started at: " + uri);
            });

    // Mantiene vivo el hilo principal para que el servidor no se cierre.
    Thread.currentThread().join();

        /*
         * IMPORTANTE:
         * En código definitivo deben cerrarse em y emf cuando ya no se usen.
         * JpaConfig pretende administrar estos recursos mediante CDI cuando
         * Weld sea quien controle el ciclo de vida de la aplicación.
         */
    }
}
