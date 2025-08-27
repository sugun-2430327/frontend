# Policy Enrollment API Guide

## Base URL
```
http://localhost:8090/api/enrollments
```

## Overview
The Policy Enrollment API manages customer enrollment in insurance policy templates. It provides endpoints for enrollment, approval/decline workflows, and enrollment management with role-based access control.

## Authentication
All endpoints require JWT authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Enroll in Policy Template (Customer Only)

### Endpoint
```http
POST /api/enrollments/{policyTemplateId}/enroll
```

### Description
Allows customers to enroll in an available policy template. Creates a pending enrollment that requires admin approval. Optionally accepts vehicle details in the request body.

### Authentication Required
Yes - Customer role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-----------|
| `policyTemplateId` | Long | ID of the policy template to enroll in |

### Request Body (Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `vehicleDetails` | String | No | Customer's specific vehicle information (e.g., "2023 Honda Civic, License: ABC123, VIN: 1234567") |

### Request Examples

#### Simple Enrollment (No Body)
```bash
curl -X POST "http://localhost:8090/api/enrollments/1/enroll" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Enrollment with Vehicle Details
```bash
curl -X POST "http://localhost:8090/api/enrollments/1/enroll" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"vehicleDetails": "2023 Honda Civic, License: ABC123, VIN: 1HGCM82633A123456"}'
```

#### JavaScript Examples
```javascript
// Simple enrollment
const response = await fetch(`http://localhost:8090/api/enrollments/${policyTemplateId}/enroll`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Enrollment with vehicle details
const responseWithDetails = await fetch(`http://localhost:8090/api/enrollments/${policyTemplateId}/enroll`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    vehicleDetails: "2023 Honda Civic, License: ABC123, VIN: 1HGCM82633A123456"
  })
});

const enrollment = await response.json();
```

### Success Response
```json
HTTP Status: 201 Created
Content-Type: application/json

{
  "enrollmentId": 1,
  "policyTemplateId": 1,
  "policyTemplateNumber": "POL-AUTO-001",
  "customerName": "johndoe",
  "customerEmail": "john@example.com",
  "enrollmentStatus": "PENDING",
  "enrolledDate": "2024-01-01T10:00:00",
  "approvedDate": null,
  "declinedDate": null,
  "adminNotes": null,
  "generatedPolicyNumber": null,
  "vehicleDetails": "2023 Honda Civic, License: ABC123",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00
}
```

---

## 2. Check Enrollment Eligibility (Customer Only)

### Endpoint
```http
GET /api/enrollments/{policyTemplateId}/eligibility
```

### Description
Check detailed enrollment eligibility for a specific policy template, including reasons why enrollment might not be allowed.

### Authentication Required
Yes - Customer role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `policyTemplateId` | Long | ID of the policy template to check |

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/enrollments/1/eligibility" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "canEnroll": true,
  "reason": "Eligible for enrollment",
  "policyTemplateId": 1,
  "customerHasEnrollment": false,
  "existingEnrollmentStatus": null
}
```

### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| `canEnroll` | Boolean | Whether customer can enroll |
| `reason` | String | Explanation for eligibility status |
| `policyTemplateId` | Long | ID of the policy template |
| `customerHasEnrollment` | Boolean | If customer already has enrollment |
| `existingEnrollmentStatus` | String | Status of existing enrollment (if any) |

---

## 3. Simple Enrollment Check (Customer Only)

### Endpoint
```http
GET /api/enrollments/{policyTemplateId}/can-enroll
```

### Description
Simple boolean check if customer can enroll in a specific policy template.

### Authentication Required
Yes - Customer role only

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

true
```

---

## 4. Get My Enrollments (Customer Only)

### Endpoint
```http
GET /api/enrollments/my-enrollments
```

### Description
Retrieve all enrollments for the authenticated customer.

### Authentication Required
Yes - Customer role only

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/enrollments/my-enrollments" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

[
  {
    "enrollmentId": 1,
    "policyTemplateId": 1,
    "policyTemplateNumber": "POL-AUTO-001",
    "customerName": "johndoe",
    "customerEmail": "john@example.com",
    "enrollmentStatus": "PENDING",
    "enrolledDate": "2024-01-01T10:00:00",
    "approvedDate": null,
    "declinedDate": null,
    "adminNotes": null,
    "generatedPolicyNumber": null,
    "vehicleDetails": "2023 Honda Civic",
    "coverageAmount": 100000.00,
    "coverageType": "Comprehensive",
    "premiumAmount": 1200.00
  }
]
```

---

## 5. Get All Enrollments (Admin Only)

### Endpoint
```http
GET /api/enrollments
```

### Description
Retrieve all enrollments in the system with comprehensive details. Admin-only access.

### Authentication Required
Yes - Admin role only

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/enrollments" \
  -H "Authorization: Bearer <your-admin-jwt-token>"
```

### Success Response
Same format as customer enrollments but includes all customers' enrollments.

---

## 6. Get Pending Enrollments (Admin Only)

### Endpoint
```http
GET /api/enrollments/pending
```

### Description
Retrieve all pending enrollments that require admin approval.

### Authentication Required
Yes - Admin role only

### Request Example (cURL)
```bash
curl -X GET "http://localhost:8090/api/enrollments/pending" \
  -H "Authorization: Bearer <your-admin-jwt-token>"
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

[
  {
    "enrollmentId": 1,
    "policyTemplateId": 1,
    "policyTemplateNumber": "POL-AUTO-001",
    "customerName": "johndoe",
    "customerEmail": "john@example.com",
    "enrollmentStatus": "PENDING",
    "enrolledDate": "2024-01-01T10:00:00",
    "approvedDate": null,
    "declinedDate": null,
    "adminNotes": null,
    "generatedPolicyNumber": null,
    "vehicleDetails": "2023 Honda Civic",
    "coverageAmount": 100000.00,
    "coverageType": "Comprehensive",
    "premiumAmount": 1200.00
  }
]
```

---

## 7. Approve Enrollment (Admin Only)

### Endpoint
```http
PUT /api/enrollments/{enrollmentId}/approve
```

### Description
Approve a pending customer enrollment. Generates a policy number and activates the enrollment.

### Authentication Required
Yes - Admin role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `enrollmentId` | Long | ID of the enrollment to approve |

### Request Body (Optional)
```json
"Admin approval notes: Customer documentation verified."
```

### Request Example (cURL)
```bash
curl -X PUT "http://localhost:8090/api/enrollments/1/approve" \
  -H "Authorization: Bearer <your-admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '"Admin approval notes: Customer documentation verified."'
```

### Request Example (JavaScript)
```javascript
const response = await fetch(`http://localhost:8090/api/enrollments/${enrollmentId}/approve`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify('Approved after document verification')
});

const approvedEnrollment = await response.json();
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "enrollmentId": 1,
  "policyTemplateId": 1,
  "policyTemplateNumber": "POL-AUTO-001",
  "customerName": "johndoe",
  "customerEmail": "john@example.com",
  "enrollmentStatus": "APPROVED",
  "enrolledDate": "2024-01-01T10:00:00",
  "approvedDate": "2024-01-01T14:30:00",
  "declinedDate": null,
  "adminNotes": "Admin approval notes: Customer documentation verified.",
  "generatedPolicyNumber": "POL-AUTO-001-CUST-001",
  "vehicleDetails": "2023 Honda Civic",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00
}
```

---

## 8. Decline Enrollment (Admin Only)

### Endpoint
```http
PUT /api/enrollments/{enrollmentId}/decline
```

### Description
Decline a pending customer enrollment with an optional reason.

### Authentication Required
Yes - Admin role only

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `enrollmentId` | Long | ID of the enrollment to decline |

### Request Body (Optional)
```json
"Incomplete documentation provided. Please resubmit with valid ID proof."
```

### Request Example (cURL)
```bash
curl -X PUT "http://localhost:8090/api/enrollments/1/decline" \
  -H "Authorization: Bearer <your-admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '"Incomplete documentation provided. Please resubmit with valid ID proof."'
```

### Success Response
```json
HTTP Status: 200 OK
Content-Type: application/json

{
  "enrollmentId": 1,
  "policyTemplateId": 1,
  "policyTemplateNumber": "POL-AUTO-001",
  "customerName": "johndoe",
  "customerEmail": "john@example.com",
  "enrollmentStatus": "DECLINED",
  "enrolledDate": "2024-01-01T10:00:00",
  "approvedDate": null,
  "declinedDate": "2024-01-01T14:30:00",
  "adminNotes": "Incomplete documentation provided. Please resubmit with valid ID proof.",
  "generatedPolicyNumber": null,
  "vehicleDetails": "2023 Honda Civic",
  "coverageAmount": 100000.00,
  "coverageType": "Comprehensive",
  "premiumAmount": 1200.00
}
```

---

## 9. Withdraw Enrollment (Coming Soon)

### Endpoint
```http
PUT /api/enrollments/{enrollmentId}/withdraw
```

### Description
Allow customers to withdraw their pending enrollment.

### Status
**Not Implemented** - Feature coming soon

### Current Response
```json
HTTP Status: 501 Not Implemented
Content-Type: text/plain

"Enrollment withdrawal feature coming soon"
```

---

## Enrollment Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Enrollment submitted, awaiting admin approval |
| `APPROVED` | Enrollment approved, policy active |
| `DECLINED` | Enrollment declined by admin |
| `WITHDRAWN` | Enrollment withdrawn by customer (future feature) |

---

## Error Responses

### Common Error Codes
| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request data, already enrolled |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Policy template or enrollment not found |
| 409 | Conflict | Customer already enrolled in this policy |
| 500 | Internal Server Error | Server error |

### Error Response Examples

**Already Enrolled:**
```json
HTTP Status: 409 Conflict
Content-Type: application/json

{
  "timestamp": "2024-01-01T10:00:00.000+00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Customer already has an enrollment for this policy template",
  "path": "/api/enrollments/1/enroll"
}
```

**Policy Template Not Found:**
```json
HTTP Status: 404 Not Found
Content-Type: application/json

{
  "timestamp": "2024-01-01T10:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Policy template not found with ID: 999",
  "path": "/api/enrollments/999/enroll"
}
```

---

## Role-Based Access Control

| Endpoint | Admin | Customer | Public |
|----------|-------|----------|--------|
| POST /{id}/enroll | ❌ | ✅ | ❌ |
| GET /{id}/eligibility | ❌ | ✅ | ❌ |
| GET /{id}/can-enroll | ❌ | ✅ | ❌ |
| GET /my-enrollments | ❌ | ✅ | ❌ |
| GET / | ✅ (all) | ❌ | ❌ |
| GET /pending | ✅ | ❌ | ❌ |
| PUT /{id}/approve | ✅ | ❌ | ❌ |
| PUT /{id}/decline | ✅ | ❌ | ❌ |
| PUT /{id}/withdraw | ❌ | ✅ (coming soon) | ❌ |

---

## Workflow Example

### Customer Enrollment Flow
1. **Browse Policy Templates**: Use Policy API public endpoints
2. **Check Eligibility**: `GET /enrollments/{id}/eligibility`
3. **Enroll**: `POST /enrollments/{id}/enroll` (optionally with vehicle details)
4. **Track Status**: `GET /enrollments/my-enrollments`

### Admin Approval Flow
1. **View Pending**: `GET /enrollments/pending`
2. **Review Details**: Check customer information and policy details
3. **Approve/Decline**: `PUT /enrollments/{id}/approve` or `PUT /enrollments/{id}/decline`
4. **Monitor All**: `GET /enrollments`

---

## Best Practices

### For Customers
1. **Check Eligibility First**: Always check if you can enroll before attempting
2. **Track Status**: Regularly check your enrollment status
3. **One Enrollment Per Template**: You can only have one enrollment per policy template

### For Admins
1. **Review Thoroughly**: Check customer information and policy details before approval
2. **Provide Clear Notes**: Include helpful notes when approving/declining
3. **Monitor Pending**: Regularly check for pending enrollments requiring attention

### For Developers
1. **Handle Conflicts**: Implement proper handling for enrollment conflicts
2. **Status Updates**: Provide real-time updates on enrollment status changes
3. **Error Handling**: Implement comprehensive error handling for all scenarios

---

## Testing Scenarios

### Customer Testing
1. **Successful Enrollment**
   - Check eligibility (should return true)
   - Enroll in policy template
   - Verify pending status

2. **Duplicate Enrollment**
   - Try to enroll in same template twice
   - Should receive 409 Conflict error

3. **Invalid Template**
   - Try to enroll in non-existent template
   - Should receive 404 Not Found error

### Admin Testing
1. **Approval Process**
   - Get pending enrollments
   - Approve with notes
   - Verify generated policy number

2. **Decline Process**
   - Decline enrollment with reason
   - Verify status change

3. **Access Control**
   - Try customer endpoints as admin (should work)
   - Try admin endpoints as customer (should fail)

---

## Related APIs

- **Policy API**: For viewing available policy templates
- **Claims API**: For managing claims on approved enrollments
- **Support API**: For getting help with enrollment issues
- **Authentication API**: For user login and JWT tokens
