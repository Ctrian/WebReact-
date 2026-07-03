package com.programacion.web.service.interfaces;

import com.programacion.web.db.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> findAll();

    Optional<User> findById(Integer id);

    User create(User user);

    Optional<User> update(Integer id, User user);

    boolean deleteById(Integer id);
}
