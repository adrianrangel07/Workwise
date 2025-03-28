package com.proyectodeaula.proyecto_de_aula;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ComponentScan(basePackages = "com.proyectodeaula")
public class ProyectoAulaApplication {
 
	public static void main(String[] args) {
		SpringApplication.run(ProyectoAulaApplication.class, args);
	}
	
}


