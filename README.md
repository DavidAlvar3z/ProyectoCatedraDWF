# PROYECTOCATEDRADWF
**Bryceling Investigación Proyecto Cátedra DWF (Descripción)**

---

## Insignias
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Primeros Pasos](#primeros-pasos)
- [Prerrequisitos](#prerrequisitos)
- [Lenguaje de Programación](#lenguaje-de-programación)
- [Gestor de Paquetes](#gestor-de-paquetes)
- [Instalación](#instalación)
- [Configurar la Base de Datos](#configurar-la-base-de-datos)
- [Navegar al Directorio del Proyecto](#navegar-al-directorio-del-proyecto)
- [Uso](#uso)
- [Pruebas](#pruebas)
- [Limpieza](#limpieza)

## Descripción General

**ProyectoCatedraDWF** es una API REST basada en Spring Boot diseñada para la creación empresarial de usuarios y productos de calidad con funcionalidades usando Spring Boot y Maven. Proporciona un backend integral con gestión de identidades, gestión de roles, gestión de productos y capacidades de gestión de datos.

### ¿Por qué ProyectoCatedraDWF?

Este proyecto tiene como objetivo proporcionar un desarrollo Spring Boot con proyectos de calidad y gestión de datos.

**Características Principales:**
- 🔐 **Seguridad y Autenticación**: Implementa seguridad basada en JWT para autenticación de usuarios segura y sin estado
- 👥 **Gestión de Roles**: Admite control de acceso basado en roles con usuarios ADMIN y USER por defecto
- 🛍️ **Gestión de Productos**: Operaciones CRUD completas para artículos de ropa con precios
- 💳 **Sistema de Compras**: Maneja transacciones de usuarios e historial de pedidos
- 🌐 **Soporte Cross-Origin**: CORS configurado para integración perfecta con frontend
- 📊 **Persistencia de Datos**: Proporciona gestión integral de datos con integridad referencial

## Primeros Pasos

### Prerrequisitos
- Java 17 o superior
- Maven 3.6 o superior
- Entorno de desarrollo Spring Boot

### Lenguaje de Programación
Java

### Gestor de Paquetes
Maven

## Instalación

Clona el repositorio y ejecuta la aplicación Spring:

```bash
git clone [repository-url]
```

### Configurar la Base de Datos

Configura tu archivo `application.properties` con las siguientes configuraciones:

```properties
# Nombre de la aplicacion
spring.application.name=InvestigacionDwf

# Configuración de la base de datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/pruebaseguridad
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración JPA Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Configuración de JWT
jwt.secret=claveSuperSeguraDeAlMenos32CaracteresParaJWT
jwt.expiration=86400000

# Configuración de puerto y otras propiedades
server.port=8080

# Configuración de seguridad logs detallados
logging.level.org.springframework.security=DEBUG
```

### Navegar al Directorio del Proyecto

```bash
cd PROYECTOCATEDRADWF
```

Instalar las dependencias:

```bash
mvn clean install
```

Iniciar la aplicación:

```bash
mvn spring-boot:run
```

## Uso

La API proporciona los siguientes endpoints:

**Autenticación:**
- `POST /auth/register` - Registrar un nuevo usuario
- `POST /auth/login` - Inicio de sesión de usuario

**Productos (Ropa):**
- `GET /auth/ropa` - Obtener todos los artículos de ropa (público)
- `POST /auth/ropa` - Crear artículo de ropa (solo ADMIN)
- `PUT /auth/ropa/{id}` - Actualizar artículo de ropa (solo ADMIN)
- `DELETE /auth/ropa/{id}` - Eliminar artículo de ropa (solo ADMIN)

**Compras:**
- `GET /auth/compras` - Obtener todas las compras
- `POST /auth/compras` - Crear nueva compra
- `PUT /auth/compras/{id}` - Actualizar compra
- `DELETE /auth/compras/{id}` - Eliminar compra

## Pruebas

Ejecutar pruebas usando Maven:

```bash
mvn test
```

## Limpieza

Para limpiar el proyecto:

```bash
mvn clean
```

## Integrantes

- **David Alejandro Alvarez Moreira** – AM240104
- **Rene Osmin Aparicio Ruiz** - AR240329
- **Ever Gabriel Cabezas Alfaro** - CA240297
- **Christian Javier Rosales Palacios** - RP241102
- **Ashley Gabriela Valdez González** - VG240979

---

*© 2024 PROYECTOCATEDRADWF - Desarrollo Web Frontend*
