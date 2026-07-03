package com.programacion.web.client;

import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

import java.util.Arrays;

public class ClienteRestMain {
    public static void main(String[] args) {
        final String usersUrl = args.length > 0
                ? args[0]
                : "http://localhost:8080/api/users";

        try(var client = ClientBuilder.newClient() ) {
            WebTarget target = client.target(usersUrl + "/{id}")
                    .resolveTemplate("id", 1);

            var user = target.request()
                    .get(String.class);

            System.out.println(user);

            UserDto[] usersTmp = client.target(usersUrl)
                    .request(MediaType.APPLICATION_JSON)
                    .get(UserDto[].class);

            var users = Arrays.asList(usersTmp);

            System.out.println(users);

            var idx = System.currentTimeMillis();

            // Post
            var newUser = new UserDto();
            newUser.setId((int) (idx % 1_000_000_000));
            newUser.setName("Ctrian" + idx);
            newUser.setUsername("Ctrian" + idx);
            newUser.setEmail("ctrian@gmail");
            System.out.println("Creating user: " + newUser);

            var response = client.target(usersUrl)
                    .request(MediaType.APPLICATION_JSON)
                    .post(Entity.json(newUser));

            System.out.println("STATUS: " + response.getStatus());
            System.out.println("BODY: " + response.readEntity(String.class));

        }
    }
}
