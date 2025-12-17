# Swagger UI Documentation

## Access Swagger UI

Once your server is running, visit:
```
http://localhost:3000/api-docs
```

## Features

### Interactive API Testing
- **Try It Out**: Click the "Try it out" button on any endpoint to test it directly from the browser
- **Authorization**: Use the "Authorize" button at the top to set your JWT token for protected endpoints
- **Request/Response Examples**: See example requests and responses for each endpoint
- **Schema Definitions**: View detailed schemas for all data models

### How to Test Protected Endpoints

1. **Register a User**
   - Expand `POST /api/auth/register`
   - Click "Try it out"
   - Fill in the request body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User"
     }
     ```
   - Click "Execute"
   - Copy the `token` from the response

2. **Authorize**
   - Click the green "Authorize" button at the top
   - In the "bearerAuth" field, enter: `Bearer <your-token>`
   - Click "Authorize", then "Close"

3. **Test Protected Endpoints**
   - Now you can test any protected endpoint (Forms, Questions, etc.)
   - The authorization header will be automatically included

## API Documentation Structure

### Tags
- **Auth**: User authentication and management
- **Forms**: Form CRUD operations
- **Questions**: Question management (coming soon)
- **Responses**: Form responses (coming soon)
- **Health**: Server health check

### Common Response Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Customization

The Swagger UI configuration can be modified in:
- `src/server/config/swagger.config.ts` - Main configuration
- `src/server/docs/schemas/` - Schema definitions
- Module files (*.module.ts) - Endpoint documentation

## Adding Documentation to New Endpoints

When adding new endpoints, use JSDoc comments above the route:

```typescript
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Short description
 *     description: Longer description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []  # For protected routes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */
router.post('/endpoint', asyncHandler(controller.method));
```

## Tips

1. **Schema Reusability**: Define common schemas in `src/server/docs/schemas/` and reference them with `$ref`
2. **Security**: Public endpoints should include `security: []` to disable authentication requirement
3. **Examples**: Provide realistic examples in your schemas for better documentation
4. **Descriptions**: Write clear, user-friendly descriptions for all endpoints and fields

## Troubleshooting

### Swagger UI not loading
- Check that the server is running on the correct port
- Ensure helmet middleware has `contentSecurityPolicy: false`
- Check console for any errors

### Documentation not updating
- Restart the server after making changes to Swagger comments
- Clear browser cache
- Check that file paths in `swagger.config.ts` are correct

### Authentication not working
- Ensure you're using `Bearer <token>` format (with "Bearer " prefix)
- Check that the token hasn't expired
- Verify the JWT_SECRET is set correctly in .env
