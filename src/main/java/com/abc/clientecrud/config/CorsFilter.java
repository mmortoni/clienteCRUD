package com.abc.clientecrud.config;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		System.out.println("Filtering on...........................................................");
		final HttpServletResponse response = (HttpServletResponse) res;
		HttpServletRequest request = (HttpServletRequest) req;
		String origin = request.getHeader("Origin");

		response.setHeader("Access-Control-Allow-Credentials", "true");
		response.setHeader("Access-Control-Allow-Origin", origin != null && origin.contains("ws") ? "" : origin);
		response.setHeader("Vary", "Origin");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
		response.setHeader("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Authorization, Content-Type, Accept, X-CSRF-TOKEN");
		response.setHeader("Access-Control-Max-Age", "3600");

		if ("OPTIONS".equalsIgnoreCase(((HttpServletRequest) req).getMethod())) {
			response.setStatus(HttpServletResponse.SC_OK);
		} else {
			chain.doFilter(req, res);
		}
	}

	public void init(FilterConfig filterConfig) {
	}

	public void destroy() {
	}
}
