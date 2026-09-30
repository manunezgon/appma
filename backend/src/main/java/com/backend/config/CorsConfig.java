package com.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")

                        /*
                         * ======================================================
                         * 🟢🟢🟢 MODO DESARROLLO (AHORA MISMO - EXPO / LOCAL)
                         * ======================================================
                         *
                         * - Expo Go en móvil
                         * - React / frontend en localhost
                         * - pruebas en red local (IP del PC)
                         *
                         * ⚠️ IMPORTANTE:
                         * Esto es lo que está activo AHORA.
                         */
                        .allowedOrigins(
                                "http://localhost:8081",
                                "http://192.168.1.8:8081"
                        )

                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )

                        .allowedHeaders("*")

                        /*
                         * ⚠️ SOLO necesario si usas cookies/sesión.
                         * Tú usas JWT → normalmente NO es necesario en producción.
                         */
                        .allowCredentials(true)

                        .maxAge(3600);


                /*
                 * ======================================================
                 * 🔴🔴🔴 MODO PRODUCCIÓN (FUTURO - APP REAL)
                 * ======================================================
                 *
                 * CUANDO tengas:
                 * - app en App Store / Play Store
                 * - frontend en dominio real (Vercel, web, etc.)
                 *
                 * 👉 ENTONCES reemplazas TODO el bloque anterior por esto:
                 */

                /*
                registry.addMapping("/**")
                        .allowedOrigins(
                                "https://tu-dominio.com"
                                // Ejemplo:
                                // "https://app.miempresa.com"
                        )
                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )
                        .allowedHeaders("*")
                        // 🔴 En producción normalmente se recomienda quitar esto si usas JWT
                        .allowCredentials(false)
                        .maxAge(3600);
                */

            }
        };
    }
}