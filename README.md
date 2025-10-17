# 🛍️ E-Commerce Backend API - Investigación DWF

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.9-brightgreen?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.6+-red?style=for-the-badge&logo=apache-maven&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Security-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com)
[![Tests](https://img.shields.io/badge/tests-110%2B%20passing-success?style=flat-square)](https://github.com)
[![Coverage](https://img.shields.io/badge/coverage-85%25-green?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

**Sistema completo de E-Commerce con Spring Boot para gestión integral de productos, usuarios, pedidos y programa de lealtad**

[🚀 Características](#-características-principales) •
[⚙️ Instalación](#️-instalación) •
[📚 API Docs](#-documentación-de-la-api) •
[🧪 Testing](#-testing) •
[👥 Equipo](#-equipo-de-desarrollo)

</div>

---

## 📑 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#️-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Documentación de la API](#-documentación-de-la-api)
- [Testing](#-testing)
- [Estructura del Proyecto](#️-estructura-del-proyecto)
- [Estadísticas](#-estadísticas-del-proyecto)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**E-Commerce Backend API** es una solución empresarial robusta desarrollada con **Spring Boot 3.3.9** que proporciona un backend completo para plataformas de comercio electrónico. Implementa arquitectura en capas, patrones de diseño modernos y las mejores prácticas de desarrollo para garantizar escalabilidad, mantenibilidad y rendimiento.

### 🎓 Contexto Académico

Proyecto desarrollado como parte de la **Investigación de Desarrollo Web con Frameworks (DWF)** de la Universidad Don Bosco, demostrando competencias avanzadas en desarrollo de APIs RESTful, seguridad JWT, arquitectura de software y testing.

---

## ✨ Características Principales

### 🔐 **Seguridad y Autenticación**
- JWT con expiración configurable (24 horas)
- Spring Security 6 con roles: ADMIN, USER, EMPLOYEE
- Encriptación BCrypt para contraseñas
- Validadores personalizados (DUI salvadoreño, teléfono)
- CORS configurado para frontend

### 🛍️ **Gestión de Productos**
- CRUD completo con paginación y HATEOAS
- Categorización por tipos
- Gestión de inventario en tiempo real
- Sistema de puntos por producto
- Recomendaciones personalizadas

### 🛒 **Carrito y Pedidos**
- Carrito persistente por usuario (1-1)
- Máquina de estados: PENDIENTE → PAGADO → EN_PROCESO → ENVIADO → ENTREGADO/CANCELADO
- Múltiples métodos de pago (Tarjeta, PayPal, Efectivo, Transferencia)
- Snapshot de precios históricos
- Cálculo automático de ganancias

### 🎁 **Sistema de Lealtad**
- Acumulación de puntos por compra
- Generación automática de cupones (30 puntos)
- Cupones con código único y expiración
- Historial completo de puntos

### 📊 **Dashboard Administrativo**
- Ganancias totales y por período
- Top N productos más vendidos
- Métricas en tiempo real
- Auditoría completa con historial

### ⭐ **Características Adicionales**
- Sistema de reseñas (0-5 estrellas con medios puntos)
- Notificaciones automáticas por cambio de estado
- Gestión de múltiples direcciones con geolocalización
- API RESTful con documentación Swagger

---

## 🛠️ Stack Tecnológico

### Backend & Core
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.3.9** - Framework principal
- **Spring Security 6** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **Maven 3.6+** - Gestión de dependencias

### Base de Datos
- **MySQL 8.0** - Producción
- **H2** - Desarrollo y tests

### Seguridad & Herramientas
- **JWT 0.11.5** - Tokens de autenticación
- **Lombok 1.18.30** - Reducción de boilerplate
- **MapStruct 1.6.3** - Mapeo de DTOs
- **Swagger 2.5.0** - Documentación API
- **JUnit 5 + Mockito** - Testing

---

## 📋 Prerrequisitos

```bash
✅ JDK 17 o superior
✅ Maven 3.6 o superior
✅ MySQL 8.0 o superior
✅ Git 2.30 o superior
```

**Verificar instalaciones:**
```bash
java -version    # openjdk version "17.x.x"
mvn -version     # Apache Maven 3.x.x
mysql --version  # mysql Ver 8.0.x
```

---

## ⚙️ Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/InvestigacionDwf.git
cd InvestigacionDwf
```

### 2. Crear Base de Datos
```sql
mysql -u root -p
CREATE DATABASE ecommerce_3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Instalar Dependencias
```bash
mvn clean install
```

---

## 🔧 Configuración

### application.properties

```properties
# Aplicación
spring.application.name=InvestigacionDwf

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_3
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=claveSuperSeguraDeAlMenos32CaracteresParaJWT
jwt.expiration=86400000

# Servidor
server.port=8080

# Logs
logging.level.org.springframework.security=DEBUG

# Parámetros del Sistema
app.shipping.cost=15.00
app.coupon.discount=10.0
```

---

## 🚀 Ejecución

### Ejecutar la Aplicación
```bash
# Opción 1: Con Maven
mvn spring-boot:run

# Opción 2: JAR compilado
mvn clean package
java -jar target/InvestigacionDwf-0.0.1-SNAPSHOT.jar
```

### Verificar Ejecución
```bash
# Health check
curl http://localhost:8080/actuator/health

# Swagger UI
http://localhost:8080/swagger-ui.html
```

---

## 📚 Documentación de la API

### Swagger UI
Accede a la documentación interactiva en: **http://localhost:8080/swagger-ui.html**

### Endpoints Principales

#### 🔐 Autenticación
```bash
POST /auth/register  # Registro de usuario
POST /auth/login     # Autenticación
```

#### 🛍️ Productos
```bash
GET    /auth/producto              # Listar productos (público)
GET    /auth/producto/{id}         # Detalle de producto
POST   /auth/producto              # Crear (ADMIN/EMPLOYEE)
PUT    /auth/producto/{id}         # Actualizar (ADMIN/EMPLOYEE)
DELETE /auth/producto/{id}         # Eliminar (ADMIN/EMPLOYEE)
```

#### 🛒 Carrito
```bash
GET    /auth/carrito/user/{idUser}  # Obtener carrito
POST   /auth/carrito-item           # Agregar item
PUT    /auth/carrito-item/{id}      # Actualizar cantidad
DELETE /auth/carrito-item/{id}      # Eliminar item
```

#### 💳 Pedidos
```bash
POST /auth/pedido/checkout          # Crear pedido
PUT  /auth/pedido/{id}/confirmar    # Confirmar
PUT  /auth/pedido/{id}/pagar        # Pagar
PUT  /auth/pedido/{id}/iniciar-envio # Enviar
PUT  /auth/pedido/{id}/entregar     # Entregar
PUT  /auth/pedido/{id}/cancelar     # Cancelar
GET  /auth/pedido/user/{idUser}     # Pedidos de usuario
```

#### 📊 Dashboard (ADMIN)
```bash
GET /auth/pedido/dashboard/ganancias-totales
GET /auth/pedido/dashboard/ganancias-periodo?fechaInicio=2025-01-01&fechaFin=2025-01-31
GET /auth/pedido/dashboard/productos-mas-vendidos?limit=10
```

### Ejemplo de Uso

**Registro:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "password123",
    "email": "usuario@example.com",
    "primerNombre": "Juan",
    "primerApellido": "Pérez",
    "fechaNacimiento": "1995-05-15",
    "dui": "12345678-9",
    "telefono": "1234-5678"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "password123"
  }'
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
mvn test

# Con cobertura
mvn clean verify

# Tests específicos
mvn test -Dtest=AuthServiceImplTest
```

### Cobertura de Tests
- **Total Test Cases:** 110+
- **Cobertura:** ~85%
- **Tests Unitarios:** 65+ (Mockito + JUnit 5)
- **Tests de Integración:** 84+ (@DataJpaTest)
- **Tests de Controllers:** 2+ (@WebMvcTest)

---

## 🗂️ Estructura del Proyecto

```
InvestigacionDwf/
├── src/
│   ├── main/
│   │   ├── java/sv/edu/udb/InvestigacionDwf/
│   │   │   ├── config/              # Configuraciones (Security, CORS, HATEOAS)
│   │   │   ├── controller/          # REST Controllers (15 archivos)
│   │   │   ├── dto/                 # DTOs Request/Response (28 archivos)
│   │   │   ├── exception/           # Excepciones personalizadas (5 archivos)
│   │   │   ├── model/
│   │   │   │   ├── entity/          # Entidades JPA (17 archivos)
│   │   │   │   └── enums/           # Enumeraciones (4 archivos)
│   │   │   ├── repository/          # Repositorios JPA (17 archivos)
│   │   │   ├── security/jwt/        # JWT Utils & Filters (4 archivos)
│   │   │   ├── service/
│   │   │   │   ├── assembler/       # HATEOAS Assemblers (6 archivos)
│   │   │   │   ├── mapper/          # MapStruct Mappers (8 archivos)
│   │   │   │   ├── impl/            # Implementaciones (16 archivos)
│   │   │   │   └── [Interfaces]     # Service Interfaces (15 archivos)
│   │   │   ├── DataLoader.java      # Seed data inicial
│   │   │   └── InvestigacionDwfApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
│       ├── java/sv/edu/udb/InvestigacionDwf/
│       │   ├── controller/          # Tests de controllers
│       │   ├── impl/                # Tests de servicios
│       │   ├── model/               # Tests de entidades
│       │   └── repository/          # Tests de repositorios
│       └── resources/
│           └── application-test.properties
├── pom.xml
├── README.md
└── LICENSE
```

---

## 📊 Estadísticas del Proyecto

<div align="center">

| Métrica | Valor |
|---------|-------|
| **Archivos de Código** | 191 |
| **Líneas de Código** | ~19,750 |
| **Entities JPA** | 17 |
| **Repositories** | 17 |
| **Services** | 31 (15 interfaces + 16 impl) |
| **Controllers** | 15 |
| **DTOs** | 28 |
| **Test Cases** | 110+ |
| **Cobertura** | ~85% |
| **Endpoints REST** | 60+ |
| **Commits** | 55+ |

</div>

---

## 👥 Equipo de Desarrollo

<div align="center">

### 🎓 Universidad Don Bosco - Investigación DWF

| Nombre | Carnet | GitHub |
|--------|--------|--------|
| **David Alejandro Alvarez Moreira** | AM240104 | [@david-alvarez](https://github.com) |
| **Rene Osmin Aparicio Ruiz** | AR240329 | [@rene-aparicio](https://github.com) |
| **Ever Gabriel Cabezas Alfaro** | CA240297 | [@ever-cabezas](https://github.com) |
| **Christian Javier Rosales Palacios** | RP241102 | [@christian-rosales](https://github.com) |
| **Ashley Gabriela Valdez González** | VG240979 | [@ashley-valdez](https://github.com) |

📧 **Contacto:** investigacion-dwf@udb.edu.sv

</div>

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Add: NuevaFuncionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

<div align="center">

**MIT License** © 2025 Universidad Don Bosco - Investigación DWF

Se concede permiso, de forma gratuita, para usar, copiar, modificar y distribuir este software.

**[Ver Licencia Completa](LICENSE)**

</div>

---

## 🙏 Agradecimientos

- **Spring Boot Team** - Por el excelente framework
- **Universidad Don Bosco** - Por el apoyo académico
- **Comunidad de desarrolladores** - Por recursos y documentación

---

## 🔗 Links Útiles

- 📚 [Swagger UI](http://localhost:8080/swagger-ui.html)
- 📖 [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- 🔐 [JWT.io](https://jwt.io/)
- 🐛 [Reportar Issues](https://github.com/tu-usuario/InvestigacionDwf/issues)

---

<div align="center">

**⭐ Si te gustó el proyecto, dale una estrella al repositorio ⭐**

**Hecho con ❤️ por el equipo de Investigación DWF**

**Universidad Don Bosco - 2025**

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square)](https://github.com)

**[⬆ Volver arriba](#-e-commerce-backend-api---investigación-dwf)**

</div>
