package com.programacion.web.rest;

import java.util.HashMap;
import java.util.Map;

import com.programacion.web.rest.dto.Customer;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/customers")
public class CustomerRest {
    private static Map<Integer, Customer> customers = new HashMap<>(Map.of(
            1, Customer.builder().id(1).nombre("cliente 1").direccion("dir 1").build(),
            2, Customer.builder().id(2).nombre("cliente 2").direccion("dir 2").build(),
            3, Customer.builder().id(3).nombre("cliente 3").direccion("dir 3").build(),
            4, Customer.builder().id(4).nombre("cliente 4").direccion("dir 4").build(),
            5, Customer.builder().id(5).nombre("cliente 5").direccion("dir 5").build()));

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String findById(@PathParam("id") int id) {
        var customer = CustomerRest.customers.get(id);

        if (customer == null) {
            return "Customer not found";
        }

        String json = """
                {
                "id":%d,
                "nombre": "%s",
                "direccion": "%s"
                }
                        """.formatted(customer.getId(), customer.getNombre(), customer.getDireccion());

        /*
         * retorno de un String
         * return customer.toString();
         */

        return json;
    }

    /*
     * Uso de Response para devolver un codigo de estado especifico
     */
    @GET
    @Path("response/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findById0(@PathParam("id") int id) {
        var customer = CustomerRest.customers.get(id);
        if (customer == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        // el nombre de la cabecera no puede tener espacios
        return Response.ok(customer).header("mi_cabecera", "152729").build();
    }    

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCustomer(Customer customer) {
        int newId = customers.keySet().stream().max(Integer::compare).orElse(0) + 1;
        customer.setId(newId);
        customers.put(newId, customer);
        return Response.status(Response.Status.CREATED).entity(customer).build();
    }
}
