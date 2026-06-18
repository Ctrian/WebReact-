package com.programacion.web.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
// API fluida encadenable: Customer.builder().id(1).nombre("x").direccion("y").build()
@Builder
@NoArgsConstructor
//  constructor con todos los argumentos: new Customer(1, "x", "y")
@AllArgsConstructor
public class Customer {
    private Integer id;
    private String nombre;
    private String direccion;
}
