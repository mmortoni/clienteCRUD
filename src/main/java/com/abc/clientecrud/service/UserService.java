package com.abc.clientecrud.service;

import java.util.List;

import com.abc.clientecrud.dto.UserDto;
import com.abc.clientecrud.model.User;

public interface UserService {

    User save(UserDto user);
    
    List<User> findAll();
    
    void delete(long id);
    
    User findOne(String username);

    User findById(Long id);
}
