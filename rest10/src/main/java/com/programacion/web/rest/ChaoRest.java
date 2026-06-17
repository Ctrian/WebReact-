package com.programacion.web.rest;

import java.time.LocalDateTime;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Path("/chao")
public class ChaoRest {

    @GET
    @Produces("text/plain")
    @Path("mundo")
    public String chao() {
        return "chao rest" + LocalDateTime.now();
    }
}
