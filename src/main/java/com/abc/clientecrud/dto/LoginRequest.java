package com.abc.clientecrud.dto;

import java.util.Arrays;
import java.util.stream.Collectors;

public class LoginRequest {
    private String userName;
    private String[] roles;
    private String token;
    
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String[] getRoles() {
		return roles;
	}
	public void setRoles(String[] roles) {
		this.roles = roles;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
	@Override
	public String toString() {
		String result = roles.length == 0 ? "[]" : "[\"" + String.join("\", \"", roles) + "\"]";
		
//		return "{\"user\":{\"userName\":\"" + userName + "\", \"roles\":" + result + ", \"token\":\"" + token + "\"}}";
		return "{\"userName\":\"" + userName + "\", \"roles\":" + result + ", \"token\":\"" + token + "\"}";
	}
}
