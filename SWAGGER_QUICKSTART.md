# Swagger UI Quick Reference

## 🚀 Quick Start

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Access Swagger UI**
   ```
   http://localhost:3000/api-docs
   ```

3. **Test an endpoint**
   - Click on any endpoint to expand it
   - Click "Try it out"
   - Fill in the parameters
   - Click "Execute"

## 🔐 Authentication Flow

### Step 1: Register
```bash
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### Step 2: Copy Token
From the response, copy the `token` value

### Step 3: Authorize
1. Click the green **"Authorize"** button at the top
2. Enter: `Bearer <your-token-here>`
3. Click **"Authorize"**, then **"Close"**

### Step 4: Use Protected Endpoints
Now you can test all protected endpoints!

## 📚 Available Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (🔒 protected)

### Forms Endpoints
- `GET /api/forms` - List all forms (🔒 protected)
- `POST /api/forms` - Create form (🔒 protected)
- `GET /api/forms/{id}` - Get form by ID (🔒 protected)
- `PUT /api/forms/{id}` - Update form (🔒 protected)
- `DELETE /api/forms/{id}` - Delete form (🔒 protected)

### Health Check
- `GET /api/health` - Server health status

## 💡 Tips

### Testing Protected Endpoints
Always authorize first! Look for the 🔒 icon on endpoints.

### Response Codes
- ✅ `200/201` - Success
- ❌ `400` - Bad request (check your input)
- ❌ `401` - Not authorized (need to login/authorize)
- ❌ `403` - Forbidden (insufficient permissions)
- ❌ `404` - Not found
- ❌ `409` - Conflict (e.g., email already exists)

### Example Request Bodies

**Register/Login:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "Your Name"
}
```

**Create Form:**
```json
{
  "title": "Customer Feedback",
  "description": "Optional description"
}
```

**Update Form:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false
}
```

## 🛠️ Adding Documentation

When adding new endpoints, use this template:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Short description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/your-endpoint', asyncHandler(controller.method));
```

## 🎨 Customization

### Config Location
`src/server/config/swagger.config.ts`

### Schema Definitions
`src/server/docs/schemas/*.ts`

### Endpoint Documentation
Each module file (`*.module.ts`)

## 🐛 Troubleshooting

**Swagger UI not loading?**
- Check server is running
- Visit http://localhost:3000/api-docs
- Check console for errors

**Can't test protected endpoints?**
- Make sure you clicked "Authorize"
- Token format: `Bearer <token>` (with space)
- Token must be valid (not expired)

**Documentation not updating?**
- Restart the server
- Clear browser cache
- Check JSDoc syntax

## 📖 Full Documentation

See `SWAGGER_GUIDE.md` for comprehensive documentation.
