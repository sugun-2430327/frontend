# Policy API Guide

## Base URL
```
http://localhost:8090/api/policies
```

## Overview
The Policy API provides endpoints for managing insurance policies and policy templates. It includes both protected endpoints (requiring authentication) and public endpoints for viewing policy templates.

## Authentication
Most endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Create Policy Template (Admin Only)

### Endpoint
```http
POST /api/policies
```

### Description
Create a new policy template. Only administrators can create policy templates.

### Authentication Required
Yes - Admin role only

### Content Type
```
application/json
```

### Request Body
```json
{
  "policyNumber": "POL-AUTO-001",
  "vehicleType": "2023 Honda Civic, License: ABC123",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "policyStatus": "ACTIVE"
}
```

### Request Schema
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `policyNumber` | String | Yes | Unique identifier |
| `vehicleType` | String | Yes | Vehicle information |
| `coverageAmount` | BigDecimal | Yes | > 0 |
| `coverageType` | String | Yes | Type of coverage |
| `premiumAmount` | BigDecimal | Yes | > 0 |
| `startDate` | Date | Yes | Policy start date |
| `endDate` | Date | Yes | Must be in future |
| `policyStatus` | String | Yes | ACTIVE, INACTIVE, etc. |
| `policyHolderId` | Long | No | Optional for templates |

### Request Example (cURL)
```bash
curl -X POST "http://localhost:8090/api/policies" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-AUTO-001",
    "vehicleType": "2023 Honda Civic, License: ABC123",
    "coverageAmount": 100000.00,
    "coverageType": "Comprehensive",
    "premiumAmount": 1200.00,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "policyStatus": "ACTIVE"
  }'
```

### Success Response
```json
HTTP Status: 201 Created
Content-Type: application/json

{
  "policyId": 1,
  "policyNumber": "POL-AUTO-001",
  "vehicleType": "2023 Honda Civic, License: ABC123",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "policyStatus": "ACTIVE",
  "policyHolderName": null
}
```

---

## 2. Update Policy Template (Admin Only)

### Endpoint
```http
PUT /api/policies/{policyId}
```

### Description
Update an existing policy template. Only administrators can update policies.

### Authentication Required
Yes - Admin role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyId` | Long | ID of the policy to update |

### Request Body
Same as create policy request

### Request Example (cURL)
```bash
curl -X PUT "http://localhost:8090/api/policies/1" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-AUTO-001-UPDATED",
    "vehicleType": "2023 Honda Civic, License: ABC123",
    "coverageAmount": 120000.00,
    "coverageType": "Comprehensive Plus",
    "premiumAmount": 1400.00,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "policyStatus": "ACTIVE"
  }'
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "policyId": 1,
  "policyNumber": "POL-AUTO-001-UPDATED",
  "vehicleType": "2023 Honda Civic, License: ABC123",
  "coverageAmount": 120000.00,
  "coverageType": "Comprehensive Plus",
  "premiumAmount": 1400.00,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "policyStatus": "ACTIVE",
  "policyHolderName": null
}
```

---

## 3. Get All Policies (Protected)

### Endpoint
```http
GET /api/policies
```

### Description
Retrieve all policies based on user role:
- **Admin**: Returns all policies in the system
- **Customer**: Returns only policies the user is enrolled in

### Authentication Required
Yes - Admin or Customer role

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Request Example (JavaScript)
```javascript
const response = await fetch('http://localhost:8090/api/policies', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const policies = await response.json();
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

[
  {
    "policyId": 1,
    "policyNumber": "POL-AUTO-001",
    "vehicleType": "2023 Honda Civic, License: ABC123",
    "coverageAmount": 100000.00,
    "coverageType": "Comprehensive",
    "premiumAmount": 1200.00,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "policyStatus": "ACTIVE",
    "policyHolderName": "John Doe"
  }
]
```

---

## 4. Get Policy by ID (Protected)

### Endpoint
```http
GET /api/policies/{policyId}
```

### Description
Retrieve a specific policy by ID with access control:
- **Admin**: Can access any policy
- **Customer**: Can only access policies they are enrolled in

### Authentication Required
Yes - Admin or Customer role

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyId` | Long | ID of the policy to retrieve |

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies/1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "policyId": 1,
  "policyNumber": "POL-AUTO-001",
  "vehicleType": "2023 Honda Civic, License: ABC123",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "policyStatus": "ACTIVE",
  "policyHolderName": "John Doe"
}
```

---

## 5. Delete Policy (Admin Only)

### Endpoint
```http
DELETE /api/policies/{policyId}
```

### Description
Delete a policy template. Only administrators can delete policies.

### Authentication Required
Yes - Admin role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyId` | Long | ID of the policy to delete |

### Request Example (cURL)
```bash
curl -X DELETE "http://localhost:8090/api/policies/1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: text/plain

"Policy deleted successfully"
```

---

## 6. Get Policy by Policy Number (Protected)

### Endpoint
```http
GET /api/policies/number/{policyNumber}
```

### Description
Retrieve a specific policy by policy number with same access control as get by ID.

### Authentication Required
Yes - Admin or Customer role

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyNumber` | String | Policy number to retrieve |

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies/number/POL-AUTO-001" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Success Response
Same as get by ID response

---

## Public Endpoints (No Authentication Required)

## 7. Get All Policy Templates (Public)

### Endpoint
```http
GET /api/policies/public
```

### Description
Retrieve all available policy templates for public viewing (product catalog).

### Authentication Required
No

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies/public"
```

### Request Example (JavaScript)
```javascript
const response = await fetch('http://localhost:8090/api/policies/public', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const policyTemplates = await response.json();
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

[
  {
    "policyId": 1,
    "policyNumber": "POL-AUTO-001",
    "vehicleDetails": "Auto Insurance Template",
    "coverageAmount": 100000.00,
    "coverageType": "Comprehensive",
    "premiumAmount": 1200.00,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "policyStatus": "ACTIVE",
    "policyHolderName": null
  }
]
```

---

## 8. Get Policy Template by ID (Public)

### Endpoint
```http
GET /api/policies/public/{policyId}
```

### Description
Retrieve a specific policy template by ID for public viewing.

### Authentication Required
No

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyId` | Long | ID of the policy template |

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies/public/1"
```

### Success Response
Same format as protected get by ID, but `policyHolderName` will be null for templates

---

## 9. Get Policy Template by Policy Number (Public)

### Endpoint
```http
GET /api/policies/public/number/{policyNumber}
```

### Description
Retrieve a specific policy template by policy number for public viewing.

### Authentication Required
No

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyNumber` | String | Policy number of the template |

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/policies/public/number/POL-AUTO-001"
```

---

## Deprecated Endpoints

### 10. Enroll in Policy (Deprecated)

### Endpoint
```http
POST /api/policies/{policyTemplateId}/enroll
```

### Status
**Deprecated** - Use PolicyEnrollment API instead

### Response
```json
HTTP Status: 301 Moved Permanently
Location: /api/enrollments/{templateId}/enroll

"This endpoint has moved. Please use /api/enrollments/{templateId}/enroll"
```

---

## Error Responses

### Common Error Codes
| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request data, validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions (role-based) |
| 404 | Not Found | Policy not found |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "timestamp": "2024-01-01T10:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Policy not found with ID: 999",
  "path": "/api/policies/999"
}
```

---

## Role-Based Access Control

| Endpoint | Admin | Customer | Public |
|----------|-------|----------|--------|
| POST /policies | ✅ | ❌ | ❌ |
| PUT /policies/{id} | ✅ | ❌ | ❌ |
| DELETE /policies/{id} | ✅ | ❌ | ❌ |
| GET /policies | ✅ (all) | ✅ (own) | ❌ |
| GET /policies/{id} | ✅ (any) | ✅ (own) | ❌ |
| GET /policies/number/{num} | ✅ (any) | ✅ (own) | ❌ |
| GET /policies/public/* | ✅ | ✅ | ✅ |

---

## Best Practices

### 1. Policy Numbers
- Use consistent naming convention (e.g., `POL-{TYPE}-{NUMBER}`)
- Ensure uniqueness across the system
- Consider human-readable formats

### 2. Date Handling
- Use ISO 8601 format: `YYYY-MM-DD`
- Ensure end date is after start date
- Consider timezone implications

### 3. Currency/Amounts
- Use BigDecimal for precision
- Always validate positive amounts
- Consider currency codes for international support

### 4. Error Handling
- Always check HTTP status codes
- Implement proper error handling in clients
- Log errors for debugging

### 5. Security
- Always validate JWT tokens
- Implement proper role-based access control
- Use HTTPS in production
- Validate all input data

---

## Testing Examples

### Postman Collection Variables
```json
{
  "baseUrl": "http://localhost:8090",
  "token": "{{jwt_token_from_login}}"
}
```

### Test Scenarios

1. **Admin Creates Policy Template**
   - Login as admin user
   - Create policy template with POST /policies
   - Verify template in public catalog

2. **Customer Views Available Policies**
   - Access public endpoints without authentication
   - Login as customer
   - View enrolled policies only

3. **Access Control Testing**
   - Try accessing admin endpoints as customer (should fail)
   - Try accessing customer data as different customer (should fail)

---

## Related APIs

- **PolicyEnrollment API**: For enrolling customers in policy templates
- **Claims API**: For managing insurance claims
- **User Management API**: For managing user accounts
- **File Upload API**: For managing policy documents
