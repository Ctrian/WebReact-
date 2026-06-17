package com.programacion.web.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;

import java.time.LocalDateTime;

@Path("/hola")
public class HolaRest {

    @GET
    @Produces("text/plain")
    @Path("mundo")
    public String hola() {
        return "hola rest" + LocalDateTime.now();

    }

    @GET
    @Produces("text/plain")
    @Path("world/{name}")
    public String hi(@PathParam("name") String name) {
        return "hi rest de name: " + name + LocalDateTime.now();
    }

    @GET
    @Produces("text/plain")
    @Path("mundo/{nombre}/{apellido}")
    public String hola0(@PathParam("nombre") String nombre, @PathParam("apellido") String apellido) {
        return "hola mundo %s : %s --> %s: ".formatted(nombre, apellido, LocalDateTime.now());
    }

    /*
     * http://localhost:8080/api/hola/mundo3?nombre=a&apellido=b
     * Si no lleva apellido, usa el valor por defecto
     */
    @GET
    @Produces("text/plain")
    @Path("mundo1")
    public String hola1(@QueryParam("nombre") String nombre,
            @QueryParam("apellido") @DefaultValue("Sin apellido") String apellido) {
        return "hola mundo 1 %s : %s -> %s: ".formatted(nombre, apellido, LocalDateTime.now());
    }

    /*
     * Combinación PathParam + QueryParam
     * GET /hola/personas/123?incluir=direccion,telefono&expandir=true
     */
    @GET
    @Produces("application/json")
    @Path("personas/{id}")
    public String getPersona(
            @PathParam("id") Long id,
            @QueryParam("incluir") String incluir,
            @QueryParam("expandir") @DefaultValue("false") boolean expandir) {
        return """
                {
                  "id": %d,
                  "nombre": "Juan",
                  "apellido": "Perez",
                  "incluir": "%s",
                  "expandir": %b
                }
                """.formatted(id, incluir != null ? incluir : "ninguno", expandir);
    }

    /*
     * Obtener informacion de las cabeceras
     */
    @GET
    @Produces("text/plain")
    @Path("mundo2")
    public String hola2(@Context HttpServletRequest request, @HeaderParam("Host") String host0, @QueryParam("nombre") String nombre) {
        return "Hola mundo 2: " + "Host" + " --- " + host0 + " --- nombre: " + nombre;
    }

}
