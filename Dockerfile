# Imagen con JDK 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el jar generado por Maven
COPY target/proyecto_aula-0.0.1-SNAPSHOT.jar app.jar

# Puerto que expone Spring Boot
EXPOSE 8080

# Arrancar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
