# Authentication API Guide

## Base URL
```
http://localhost:8090/api/auth
```

## Overview
The Authentication API provides endpoints for user registration and login. It supports JWT-based authentication with role-based access control.

---

## 1. User Registration (Multipart Form)

### Endpoint
```http
POST /api/auth/register
```

### Description
Register a new user with optional file upload for ID proof. Age field is optional.

### Content Type
```
multipart/form-data
```

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | String | Yes | Username (3-20 characters) |
| `password` | String | Yes | Password (6-40 characters) |
| `email` | String | Yes | Valid email address |
| `role` | String | No | User role: CUSTOMER or ADMIN (default: CUSTOMER) |
| `age` | Integer | No | User age (optional, 1-150 years) |
| `idProof` | File | No | ID proof document (optional) |

### Request Example (cURL)
```bash
curl -X POST "http://localhost:8090/api/auth/register" \
  -F "username=johndoe" \
  -F "password=securepass123" \
  -F "email=john@example.com" \
  -F "role=CUSTOMER" \
  -F "age=30" \
  -F "idProof=@/path/to/document.pdf"
```

### Request Example (JavaScript Fetch)
```javascript
const formData = new FormData();
formData.append('username', 'johndoe');
formData.append('password', 'securepass123');
formData.append('email', 'john@example.com');
formData.append('role', 'CUSTOMER'); // Optional: CUSTOMER or ADMIN
formData.append('age', '30'); // Optional
formData.append('idProof', fileInput.files[0]); // Optional

const response = await fetch('http://localhost:8090/api/auth/register', {
  method: 'POST',
  body: formData
});
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: text/plain

"User johndoe registered successfully as CUSTOMER!"
```

### Error Response
```json
HTTP Status: 400 Bad Request
Content-Type: text/plain

"Registration failed: Username is already taken!"
```

### Role Validation Error
```json
HTTP Status: 400 Bad Request
Content-Type: text/plain

"Invalid role. Only CUSTOMER and ADMIN roles are allowed"
```

---

## 2. User Registration (JSON Only)

### Endpoint
```http
POST /api/auth/register-json
```

### Description
Register a new user using JSON payload (without file upload capability).

### Content Type
```
application/json
```

### Request Body
```json
{
  "username": "johndoe",
  "password": "securepass123",
  "email": "john@example.com",
  "role": "CUSTOMER",
  "age": 30
}
```

### Request Schema
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | String | Yes | 3-20 characters |
| `password` | String | Yes | 6-40 characters |
| `email` | String | Yes | Valid email format |
| `role` | String | No | CUSTOMER or ADMIN (default: CUSTOMER) |
| `age` | Integer | No | 1-150 years |

### Request Example (cURL)
```bash
curl -X POST "http://localhost:8090/api/auth/register-json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepass123",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "age": 30
  }'
```

### Request Example (JavaScript)
```javascript
const response = await fetch('http://localhost:8090/api/auth/register-json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'securepass123',
    email: 'john@example.com',
    role: 'CUSTOMER',
    age: 30
  })
});
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: text/plain

"User johndoe registered successfully as CUSTOMER!"
```

---

## 3. User Login

### Endpoint
```http
POST /api/auth/login
```

### Description
Authenticate user and receive JWT token for subsequent API calls.

### Content Type
```
application/json
```

### Request Body
```json
{
  "usernameOrEmail": "johndoe",
  "password": "securepass123"
}
```

### Request Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `usernameOrEmail` | String | Yes | Username or email address |
| `password` | String | Yes | User password |

### Request Example (cURL)
```bash
curl -X POST "http://localhost:8090/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "securepass123"
  }'
```

### Request Example (JavaScript)
```javascript
const response = await fetch('http://localhost:8090/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    usernameOrEmail: 'johndoe',
    password: 'securepass123'
  })
});

const data = await response.json();
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `token` | String | JWT access token |
| `type` | String | Token type (always "Bearer") |
| `id` | Long | User ID |
| `username` | String | Username |
| `email` | String | User email |
| `role` | String | User role (CUSTOMER or ADMIN) |

### Error Response
```json
HTTP Status: 401 Unauthorized
Content-Type: application/json

{
  "message": "Authentication failed: Invalid credentials"
}
```

---

## Authentication Usage

### Using JWT Token
Include the JWT token in the Authorization header for protected endpoints:

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const response = await fetch('http://localhost:8090/api/policies', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Token Storage
Store the JWT token securely:
- **Web Apps**: Use httpOnly cookies or secure localStorage
- **Mobile Apps**: Use secure storage (Keychain/Keystore)
- **Never** store tokens in plain text

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `CUSTOMER` | Regular user | View own policies, enroll in policies, manage claims |
| `ADMIN` | Administrator | Full access to all resources, manage policies and users |

---

## Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request data, validation errors |
| 401 | Unauthorized | Authentication failed, invalid credentials |
| 403 | Forbidden | Access denied, insufficient permissions |
| 409 | Conflict | Username or email already exists |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Currently no rate limiting is implemented, but consider implementing it for production:
- Registration: 5 attempts per hour per IP
- Login: 10 attempts per hour per IP

---

## Security Notes

1. **HTTPS Required**: Always use HTTPS in production
2. **Password Requirements**: Minimum 6 characters (consider stronger requirements)
3. **Token Expiration**: JWT tokens have expiration (configure as needed)
4. **CORS**: Currently allows all origins (`*`) - restrict in production
5. **File Upload**: ID proof files are stored securely with validation

---

## Testing Examples

### Postman Collection
Import these requests into Postman for testing:

1. **Register User**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/register-json`
   - Body: raw JSON with user data

2. **Login User**
   - Method: POST
   - URL: `{{baseUrl}}/api/auth/login`
   - Body: raw JSON with credentials

3. **Set Environment Variable**
   - Create variable `token` with the received JWT token
   - Use `Bearer {{token}}` in Authorization header
