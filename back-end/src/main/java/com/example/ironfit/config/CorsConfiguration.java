package com.example.ironfit.config;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

public class CorsConfiguration {

    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/localhost:3000/**")
                .allowedOrigins("*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") 
                .allowCredentials(true);
    }
    
}