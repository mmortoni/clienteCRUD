package com.abc.clientecrud.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.abc.clientecrud.dto.UserDto;
import com.abc.clientecrud.model.User;
import com.abc.clientecrud.repository.UserRepository;
import com.abc.clientecrud.service.UserService;


@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {
	
	@Autowired
	private UserRepository repository;

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repository.findByUsername(username);
		
		if(user == null){
			throw new UsernameNotFoundException("Invalid username or password.");
		}
		
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), getAuthority(user));
	}

	private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        
		user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
		});
		
		return authorities;
	}

	public List<User> findAll() {
		List<User> list = new ArrayList<>();
		repository.findAll().iterator().forEachRemaining(list::add);
		return list;
	}

	@Override
	public void delete(long id) {
		repository.deleteById(id);
	}

	@Override
	public User findOne(String username) {
		return repository.findByUsername(username);
	}

	@Override
	public User findById(Long id) {
		return repository.findById(id).get();
	}

	@Override
    public User save(UserDto user) {
	    User newUser = new User();
	    newUser.setUsername(user.getUsername());
	    newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
        return repository.save(newUser);
    }
}
