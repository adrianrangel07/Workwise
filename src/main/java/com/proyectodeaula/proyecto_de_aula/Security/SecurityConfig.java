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
                .requestMatchers("/", "/Nosotros", "/Estadisticas", "/Register/personas", "/login/personas", "/Registrar/Empresa", "/login/Empresa","/pagina/inicio").permitAll()
                .requestMatchers("/Contrasena-olvidada", "/verificar-correo", "/perfil/verHDV", "/uploadHDV", "/upload/photo", "/imagen/{id}", "/cambiar-contrasena").permitAll()
                .requestMatchers("/Css/**", "/js/**", "/Imagenes/**", "/webjars/**","/favicon.ico").permitAll()
                .anyRequest().authenticated()
                )
                .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                .policyDirectives("script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval'; ")
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
