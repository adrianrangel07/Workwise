package com.proyectodeaula.proyecto_de_aula.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, SessionAuthenticationFilter sessionFilter) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                //general
                .requestMatchers("/", "/pagina/inicio", "/Estadisticas", "/recursos", "/verificar-correo","/eliminar-cuenta","/logout", "/uploadHDV", "/upload/photo", "/imagen/{id}", "/notificaciones", "/perfil/verHDV", "/postulantes/{id}/verHDV","/api/traducciones/**").permitAll()
                //importaciones
                .requestMatchers("/Css/**", "/js/**", "/Imagenes/**", "/webjars/**", "/admin/**","/api/**").permitAll()
                //prediccion
                .requestMatchers("/api/prediccion/**", "/api/prediccion", "/prediccion").permitAll()
                //personas
                .requestMatchers("/Register/personas", "/login/personas", "/personas/recursos", "/Contrasena-olvidada", "/cambiar-contrasena").permitAll()
                //empresas
                .requestMatchers("/Contraseña-olvidada-empresa", "/Registrar/Empresa", "/login/Empresa", "/cambiar-contrasena-emp", "/verificar-contrasena-eliminar", "/eliminar-cuenta-empresa").permitAll()
                .anyRequest().permitAll()
                )
                .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                .policyDirectives("script-src 'self' https://cdn.jsdelivr.net https://code.jquery.com 'unsafe-inline' 'unsafe-eval';")
                )
                )
                .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
                )
                .csrf(csrf -> csrf.disable())
                .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login/personas?logout=true")
                .logoutSuccessUrl("/login/Empresa?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                )
                .addFilterBefore(sessionFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}
