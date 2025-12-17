# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "user": { /* user object */ },
  "token": "jwt-token-here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

### Forms

#### Get All Forms (User's forms)
```http
GET /api/forms
Authorization: Bearer <token>
```

Response (200):
```json
[
  {
    "id": "uuid",
    "title": "Customer Feedback Form",
    "description": "Collect customer feedback",
    "userId": "uuid",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "questions": []
  }
]
```

#### Create Form
```http
POST /api/forms
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Customer Feedback Form",
  "description": "Collect customer feedback"
}
```

Response (201):
```json
{
  "id": "uuid",
  "title": "Customer Feedback Form",
  "description": "Collect customer feedback",
  "userId": "uuid",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Form by ID
```http
GET /api/forms/:id
Authorization: Bearer <token>
```

#### Update Form
```http
PUT /api/forms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false
}
```

#### Delete Form
```http
DELETE /api/forms/:id
Authorization: Bearer <token>
```

Response (204 No Content)

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Development Notes

### Project Structure
```
src/server/
├── common/                  # Shared code
│   ├── exceptions/         # Custom exception classes
│   ├── filters/            # Error handlers
│   ├── guards/             # Authorization guards
│   ├── interfaces/         # TypeScript interfaces
│   └── middleware/         # Middleware functions
├── config/                  # Configuration files
├── modules/                 # Feature modules
│   ├── auth/
│   ├── forms/
│   ├── questions/
│   ├── responses/
│   └── users/
└── shared/                  # Shared utilities
    └── utils/
```

### Exception Handling
Controllers don't need try-catch blocks. Just throw exceptions:

```typescript
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Please login');
throw new ForbiddenException('Access denied');
throw new NotFoundException('Resource not found');
throw new ConflictException('Already exists');
```

The `asyncHandler` middleware catches all errors and passes them to error filters.

### Database Models
- User
- Form
- Question
- FormResponse
- Answer

See `prisma/schema.prisma` for full schema.
