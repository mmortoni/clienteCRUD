package com.abc.clientecrud.web;

import static com.abc.clientecrud.config.constant.Constants.TOKEN_PREFIX;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.abc.clientecrud.config.TokenProvider;
import com.abc.clientecrud.dto.LoginRequest;
import com.abc.clientecrud.dto.LoginUser;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestBody LoginUser loginUser) throws AuthenticationException {
    	LoginRequest loginRequest = new LoginRequest();
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getUserName(),
                        loginUser.getPassword()
                )
        );
        
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        authorities.replaceAll(a -> a.substring(5));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = TOKEN_PREFIX + jwtTokenUtil.generateToken(authentication);
        loginRequest.setUserName(loginUser.getUserName());
        loginRequest.setToken(token);
        loginRequest.setRoles(authorities.toArray(new String[0]));
        
        return ResponseEntity.ok(loginRequest.toString());
    }
}
