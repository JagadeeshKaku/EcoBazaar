package com.ecobazaar.config;

import com.ecobazaar.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
        
        		.cors(cors -> {})
        		.csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                	    .requestMatchers("/login", "/signup", "/css/**").permitAll()
//                	    .requestMatchers("/api/orders/**").permitAll()
                	    .requestMatchers("/api/auth/**").permitAll()
                	    .requestMatchers("/admin/**").hasRole("ADMIN")
                	    .requestMatchers("/seller/**").hasRole("SELLER")
                	    .requestMatchers("/user/**").hasRole("USER")
                	    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                	    
                	    //swagger
                	    .requestMatchers(
                	            "/swagger-ui/**",
                	            "/swagger-ui.html",
                	            "/v3/api-docs/**"
                	    ).permitAll()
                	    
                	    .requestMatchers(HttpMethod.DELETE, "/api/products/admin/**").hasRole("ADMIN")
                	    .requestMatchers(HttpMethod.PUT, "/api/products/admin/**").hasRole("ADMIN")
                	    .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("SELLER")
                	    .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("SELLER")
                	    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("SELLER")

                	    .requestMatchers(HttpMethod.GET, "/api/products/**")
                	    .permitAll()

                	    .requestMatchers("/api/cart/**").permitAll()

                	    .requestMatchers(HttpMethod.POST, "/api/orders/**")
                	    .hasAnyRole("ADMIN","SELLER","USER")

                	    .requestMatchers(HttpMethod.GET, "/api/orders/**")
                	    .hasAnyRole("ADMIN","SELLER","USER")
                	    
                	    .requestMatchers("/leaderboard/**")
                	    .hasAnyRole("ADMIN","SELLER","USER")
                	    
                	    .anyRequest().authenticated()
                	)

                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

        org.springframework.web.cors.CorsConfiguration configuration =
                new org.springframework.web.cors.CorsConfiguration();

        configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
        configuration.setAllowedMethods(java.util.List.of("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}