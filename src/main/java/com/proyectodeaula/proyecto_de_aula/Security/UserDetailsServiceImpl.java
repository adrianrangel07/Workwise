package com.proyectodeaula.proyecto_de_aula.Security;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        List<Map<String, Object>> users = jdbcTemplate.queryForList(
            "SELECT email, contraseña FROM personas WHERE email = ?",
            email
        );

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        Map<String, Object> userData = users.get(0);
        return User.withUsername((String) userData.get("email"))
                   .password((String) userData.get("contraseña"))
                   .roles("USER")
                   .build();
    }

}

