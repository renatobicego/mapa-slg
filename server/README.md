# API Backend de Gestión de Usuarios

Una API backend robusta construida con Express, MongoDB y TypeScript para registro de usuarios y gestión con características basadas en roles.

## Características

- **Registro y Autenticación de Usuarios**: Registro/inicio de sesión seguro con tokens JWT
- **Usuarios Basados en Roles**: Soporte para estudiantes, profesores y empleados con campos específicos por rol
- **Seguridad de Contraseñas**: Hash con bcrypt y salt rounds
- **Almacenamiento de Ubicación**: Coordenadas GeoJSON Point para ubicaciones de usuarios
- **Validación de Entrada**: Validación integral con express-validator
- **Seguridad de Tipos**: Implementación completa en TypeScript
- **Seguridad**: Helmet, CORS, limitación de velocidad y middleware de autenticación
- **Base de Datos**: MongoDB con Mongoose ODM
- **Validación de Token Frontend**: Validación de tokens generados desde el frontend

## Roles de Usuario y Campos

### Campos Comunes (Todos los Usuarios)
- Nombre (obligatorio)
- Email (obligatorio, único)
- Contraseña (obligatoria, hasheada)
- Teléfono (opcional)
- URL de Imagen de Perfil (opcional)
- Coordenadas de ubicación (opcional)

### Campos Específicos de Estudiante
- Año de Graduación (obligatorio)

### Campos Específicos de Profesor/Empleado
- Año de Inicio de Trabajo (obligatorio)
- Año de Fin de Trabajo (opcional)
- Estado de Trabajo Actual (booleano)

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión de usuario
- `POST /api/auth/validate-token` - Validar token del frontend
- `GET /api/auth/profile` - Obtener perfil del usuario actual (protegido)
- `PUT /api/auth/profile` - Actualizar perfil de usuario (protegido)

### Usuarios
- `GET /api/users` - Obtener todos los usuarios con paginación (protegido)
- `GET /api/users/:id` - Obtener usuario por ID (protegido)
- `GET /api/users/location/near` - Encontrar usuarios cercanos por coordenadas (protegido)

### Verificación de Salud
- `GET /health` - Estado de salud del servidor

## Instrucciones de Configuración

1. **Instalar Dependencias**
   ```bash
   npm install
   ```

2. **Configuración del Entorno**
   Copia `.env.example` a `.env` y configura:
   ```env
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=tu-clave-jwt-super-secreta-aqui
   PORT=3001
   NODE_ENV=development
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

3. **Iniciar MongoDB**
   Asegúrate de que MongoDB esté ejecutándose en tu sistema

4. **Ejecutar Servidor de Desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para Producción**
   ```bash
   npm run build
   npm start
   ```

## Ejemplos de Uso de la API

### Registrar un Estudiante
```json
POST /api/auth/register
{
  "name": "Juan Pérez",
  "email": "estudiante@ejemplo.com",
  "password": "ContraseñaSegura123",
  "role": "student",
  "graduationYear": 2025,
  "phone": "+1234567890",
  "location": {
    "longitude": -74.006,
    "latitude": 40.7128
  }
}
```

### Registrar un Profesor
```json
POST /api/auth/register
{
  "name": "María García",
  "email": "profesor@ejemplo.com",
  "password": "ContraseñaSegura123",
  "role": "teacher",
  "workStartYear": 2015,
  "isCurrentlyWorking": true,
  "profileImage": "https://ejemplo.com/perfil.jpg"
}
```

### Iniciar Sesión
```json
POST /api/auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "ContraseñaSegura123"
}
```

### Validar Token del Frontend
```json
POST /api/auth/validate-token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Encontrar Usuarios Cercanos
```
GET /api/users/location/near?longitude=-74.006&latitude=40.7128&radius=5
Authorization: Bearer <tu-token-jwt>
```

## Características de Seguridad

- **Hash de Contraseñas**: Salting bcrypt de 12 rondas
- **Autenticación JWT**: Expiración de token de 7 días
- **Limitación de Velocidad**: 100 solicitudes por 15 minutos por IP
- **Validación de Entrada**: Validación integral de campos
- **Protección CORS**: Orígenes configurables
- **Seguridad Helmet**: Headers de seguridad estándar
- **Validación de Token Frontend**: Validación de tokens generados externamente

## Esquema de Base de Datos

El modelo de Usuario incluye:
- Validación de email y unicidad
- Requisitos de contraseña fuerte
- Validación condicional basada en roles
- Indexación de ubicación GeoJSON para consultas espaciales
- Seguimiento automático de timestamps

## Desarrollo

- **TypeScript**: Seguridad de tipos completa
- **ESLint**: Aplicación de calidad de código
- **Hot Reload**: Servidor de desarrollo con tsx watch
- **Manejo de Errores**: Respuestas de error integrales
- **Logging**: Logging estructurado de consola
- **Mensajes en Español**: Todos los mensajes de error y respuesta en español

## Consideraciones de Producción

- Usar secretos JWT fuertes
- Configurar MongoDB Atlas o hosting de base de datos adecuado
- Configurar variables de entorno correctamente
- Configurar logging adecuado (Winston, etc.)
- Implementar limitación de velocidad de API por usuario
- Agregar documentación de API (Swagger/OpenAPI)
- Configurar monitoreo y verificaciones de salud