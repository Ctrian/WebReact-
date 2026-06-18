package com.programacion.web;

import com.programacion.web.rest.ChaoRest;
import com.programacion.web.rest.CustomerRest;
import com.programacion.web.rest.HolaRest;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.util.Set;

@ApplicationPath("/api")
public class MyApplication extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        return Set.of(
                HolaRest.class, ChaoRest.class, CustomerRest.class);
    }

}
