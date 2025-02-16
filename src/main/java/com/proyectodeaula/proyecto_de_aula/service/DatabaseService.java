package com.proyectodeaula.proyecto_de_aula.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    public boolean connectToDatabase() {
        String url = "jdbc:mysql://localhost:3306/proyecto_aula?serverTimezone=UTC";
        String user = "root";
        String password = "root";

        try {
            // Cargar el driver (necesario en algunas versiones)
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Intentar la conexión
            try (Connection connection = DriverManager.getConnection(url, user, password)) {
                if (connection.isValid(2)) {
                    System.out.println("Conexión exitosa");
                    return true;
                }
            }
        } catch (ClassNotFoundException e) {
            System.out.println("Driver no encontrado: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos: " + e.getMessage());
        }
        return false;
    }
}


