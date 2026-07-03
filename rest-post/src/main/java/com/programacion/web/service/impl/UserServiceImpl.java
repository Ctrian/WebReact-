package com.programacion.web.service.impl;

import com.programacion.web.db.User;
import com.programacion.web.repo.UserRepository;
import com.programacion.web.service.interfaces.UserService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserServiceImpl implements UserService {

    final UserRepository userRepo;

    @Inject
    public UserServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public List<User> findAll() {
        return userRepo.findAll();
    }

    @Override
    public Optional<User> findById(Integer id) {
        return userRepo.findOptionalBy(id);
    }

    @Override
    public User create(User user) {
        return userRepo.save(user);
    }

    @Override
    public Optional<User> update(Integer id, User user) {
        return userRepo.findOptionalBy(id)
                .map(existingUser -> {
                    existingUser.setName(user.getName());
                    existingUser.setUsername(user.getUsername());
                    existingUser.setEmail(user.getEmail());
                    existingUser.setAddressStreet(user.getAddressStreet());
                    existingUser.setAddressSuite(user.getAddressSuite());
                    existingUser.setAddressCity(user.getAddressCity());
                    existingUser.setAddressZipcode(user.getAddressZipcode());
                    existingUser.setAddressGeoLat(user.getAddressGeoLat());
                    existingUser.setAddressGeoLng(user.getAddressGeoLng());
                    existingUser.setPhone(user.getPhone());
                    existingUser.setWebsite(user.getWebsite());
                    existingUser.setCompanyName(user.getCompanyName());
                    existingUser.setCompanyCatchPhrase(user.getCompanyCatchPhrase());
                    existingUser.setCompanyBs(user.getCompanyBs());
                    return userRepo.save(existingUser);
                });
    }

    @Override
    public boolean deleteById(Integer id) {
        return userRepo.findOptionalBy(id)
                .map(existingUser -> {
                    userRepo.remove(existingUser);
                    return true;
                })
                .orElse(false);
    }
}
