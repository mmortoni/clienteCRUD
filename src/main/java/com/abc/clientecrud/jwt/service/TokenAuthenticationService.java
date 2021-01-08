package com.abc.clientecrud.jwt.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.abc.clientecrud.dto.LoginRequest;

import org.springframework.security.core.GrantedAuthority;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class TokenAuthenticationService {

    private static final long EXPIRATIONTIME = 864000000;
    private static final String SECRET = "MySecreteApp";
    private static final String TOKEN_PREFIX = "Bearer";
    private static final String HEADER_STRING = "Authorization";

    public static void addAuthentication(HttpServletResponse res, String userName) {
    	LoginRequest loginRequest = new LoginRequest();
        String JWT = Jwts.builder()
                .setSubject(userName)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();

        String token = TOKEN_PREFIX + " " + JWT;
        res.addHeader(HEADER_STRING, token);
        
        if (token != null) {
        	loginRequest.setUserName(userName);
        	loginRequest.setToken(token);
        	
        	if("admin".equalsIgnoreCase(userName)) {
        		String[] roles = {"ADMIN","USER"};
        		loginRequest.setRoles(roles);
        	} else if("comum".equalsIgnoreCase(userName)) {
        		String[] roles = {"USER"};
        		loginRequest.setRoles(roles);        		
        	}
        }
        
        try {
            res.getOutputStream().print(loginRequest.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Authentication getByToken(String token) {
    	final JwtParser jwtParser = Jwts.parser().setSigningKey(SECRET);
    	final Jws claimsJws = jwtParser.parseClaimsJws(token.replace(TOKEN_PREFIX, ""));
    	final Claims claims = (Claims) claimsJws.getBody();
    	Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
 
    	claims.forEach((k,v)-> {
    			boolean isNumeric = v.toString().chars().allMatch( Character::isDigit );
    			if(!isNumeric) {
    				grantedAuthorities.add(new SimpleGrantedAuthority(v.toString().toUpperCase()));
    			}
    		}
    	);
    	
        String user = Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                .getBody()
                .getSubject();

        return user != null ? new UsernamePasswordAuthenticationToken(user, null, grantedAuthorities) : null;
    }

    public static Authentication getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(HEADER_STRING);
        if (token != null) {
            return getByToken(token);
        }
        return null;
    }
}
