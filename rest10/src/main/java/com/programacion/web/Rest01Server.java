package com.programacion.web;

import jakarta.ws.rs.SeBootstrap;

import java.net.URI;

public class Rest01Server {
    public static void main(String[] args) throws InterruptedException {
        SeBootstrap.Configuration confi = SeBootstrap.Configuration.builder()
                .host("0.0.0.0")
                .port(8080)
                .protocol("http")
                .build();

        SeBootstrap.start(MyApplication.class, confi)
                .thenAccept(instance -> {
                    System.out.println(instance + "\n");
                    URI uri = instance.configuration().baseUri();
                    System.out.println("Server started at: " + uri);
                    System.out.println(uri.getHost() + ":" + uri.getPort());
                });

        // bloqueamos el hilo pa que no finalice
        // se debe añadir throws InterruptedException a la firma del main
        Thread.currentThread().join();

    }
}