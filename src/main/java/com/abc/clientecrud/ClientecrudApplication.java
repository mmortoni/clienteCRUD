package com.abc.clientecrud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
//@RestController
public class ClientecrudApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientecrudApplication.class, args);
	}
/*
	@GetMapping("/api/v1/login")
	public @ResponseBody String home(Authentication authentication) { //      SecurityContextHolder auth
		String msg = "";
	    
		for (GrantedAuthority authority : authentication.getAuthorities()) {
		     String role = authority.getAuthority();
            msg += authentication.getName() + ", You have " + role;
		 }
		
		System.out.println(msg);
		
		return msg;	
	}
*/
}
