package com.programacion.web.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Disposes;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

/**
 * Puente entre CDI (Weld) y JPA (Hibernate).
 *
 * CDI administra una instancia de esta clase y esta clase crea los objetos de
 * JPA que otras clases podrán solicitar mediante @Inject.
 *
 * El flujo esperado es:
 * beans.xml -> Weld descubre JpaConfig -> @PostConstruct -> persistence.xml
 * -> Hibernate crea EntityManagerFactory -> el productor crea EntityManager.
 */
@ApplicationScoped
public class JpaConfig {

    /*
     * La fábrica es segura para ser compartida y debe existir una sola vez
     * durante la vida de la aplicación.
     */
    private EntityManagerFactory emf;

    /*
     * CDI ejecuta este método después de construir JpaConfig.
     *
     * La llamada busca la unidad "place" en META-INF/persistence.xml y utiliza
     * su proveedor, URL, usuario, contraseña y demás propiedades.
     */
    @PostConstruct
    void init() {
        emf = Persistence.createEntityManagerFactory("place");
    }

    /*
     * Método productor: su intención es enseñar a CDI cómo obtener un
     * EntityManager cuando otra clase declare:
     *
     *     @Inject
     *     EntityManager em;
     *
     * ATENCIÓN: el import actual es jakarta.ws.rs.Produces, que pertenece a
     * JAX-RS. Para que este sea un productor CDI debe utilizarse:
     *
     *     jakarta.enterprise.inject.Produces
     *
     * También conviene que EntityManager tenga alcance de petición en vez de
     * @ApplicationScoped, porque no es seguro compartirlo entre varios hilos.
     */
    @Produces
    @ApplicationScoped
    public EntityManagerFactory emf() {
        return emf;
    }

    @Produces
    @RequestScoped
    public EntityManager entityManager() {
        return emf.createEntityManager();
    }

    /*
     * CDI llama a un método con @Disposes cuando destruye el objeto producido.
     *
     * ATENCIÓN: actualmente se cierra emf, pero el recurso recibido por este
     * método es em. Lo habitual sería ejecutar em.close() aquí y cerrar emf una
     * sola vez al apagar la aplicación, por ejemplo mediante @PreDestroy.
     */
    void closeEntityManager(@Disposes EntityManager em) {
        if (em != null && em.isOpen()) {
            em.close();
        }
    }

    @PreDestroy
    void closeEntityManagerFactory() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
    
}
