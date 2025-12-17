# Form Builder Backend - Implementation Complete

## Overview
A NestJS-style Express backend for creating and managing requirement gathering forms, built with TypeScript, Prisma, and PostgreSQL.

## Features Implemented

### Core Architecture
- ✅ NestJS-like modular structure
- ✅ Clean exception handling (no try-catch in controllers!)
- ✅ Fatal error handler with graceful shutdown
- ✅ Async handler middleware for cleaner code
- ✅ JWT-based authentication
- ✅ Role-based access control (guards)
- ✅ Request validation with Zod
- ✅ Prisma ORM with PostgreSQL

### Modules Implemented
1. **Auth Module** - User registration, login, JWT tokens
2. **Forms Module** - CRUD operations for forms

### Error Handling
The application features a robust 3-layer error handling system:

1. **HTTP Exceptions** - Custom exception classes that can be thrown anywhere
   ```typescript
   throw new BadRequestException('Invalid input');
   throw new UnauthorizedException('Please login');
   throw new ForbiddenException('Access denied');
   throw new NotFoundException('Not found');
   throw new ConflictException('Already exists');
   ```

2. **Prisma Error Filter** - Converts Prisma errors to HTTP exceptions
   - P2002 → ConflictException (unique constraint)
   - P2025 → NotFoundException (record not found)
   - P2003 → BadRequestException (foreign key)

3. **Fatal Error Filter** - Handles uncaught exceptions and unhandled promise rejections
   - Logs error details
   - Performs graceful shutdown
   - Closes database connections
   - Different behavior for dev vs production

### Project Structure
```
src/server/
├── common/
│   ├── exceptions/          # Custom HTTP exceptions
│   │   ├── http-exception.ts
│   │   ├── bad-request.exception.ts
│   │   ├── unauthorized.exception.ts
│   │   ├── forbidden.exception.ts
│   │   ├── not-found.exception.ts
│   │   └── conflict.exception.ts
│   ├── filters/             # Error handlers
│   │   ├── error-handler.filter.ts
│   │   ├── prisma-error.filter.ts
│   │   └── fatal-error.filter.ts
│   ├── guards/              # Authorization guards
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── middleware/          # Express middleware
│   │   ├── async-handler.middleware.ts  # ⭐ Key feature!
│   │   ├── auth.middleware.ts
│   │   └── logger.middleware.ts
│   └── interfaces/
│       ├── express.d.ts
│       └── jwt-payload.interface.ts
├── config/
│   ├── database.config.ts   # Prisma singleton
│   ├── jwt.config.ts
│   └── env.config.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts        # Router with dependencies
│   │   ├── auth.controller.ts    # Route handlers
│   │   ├── auth.service.ts       # Business logic
│   │   └── dto/                  # Data validation
│   │       └── index.ts
│   └── forms/
│       ├── forms.module.ts
│       ├── forms.controller.ts
│       ├── forms.service.ts
│       ├── forms.repository.ts   # Prisma queries
│       └── dto/
│           └── index.ts
├── shared/
│   └── utils/
│       ├── bcrypt.util.ts
│       ├── jwt.util.ts
│       └── logger.util.ts
└── main.ts                  # Application entry point
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  forms         Form[]
  formResponses FormResponse[]
}

model Form {
  id          String   @id @default(uuid())
  title       String
  description String?
  userId      String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  questions Question[]
  responses FormResponse[]
}

model Question {
  id       String       @id @default(uuid())
  formId   String
  text     String
  type     QuestionType @default(TEXT)
  order    Int
  required Boolean      @default(false)
  options  Json?
  
  form    Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  answers Answer[]
}

model FormResponse {
  id          String   @id @default(uuid())
  formId      String
  userId      String?
  submittedAt DateTime @default(now())
  
  form    Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  user    User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  answers Answer[]
}

model Answer {
  id         String @id @default(uuid())
  responseId String
  questionId String
  value      String
  
  response FormResponse @relation(fields: [responseId], references: [id], onDelete: Cascade)
  question Question      @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

enum QuestionType {
  TEXT
  TEXTAREA
  NUMBER
  EMAIL
  RADIO
  CHECKBOX
  SELECT
  DATE
}
```

## Setup Instructions

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

2. **Install Dependencies** (Already done)
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Create database migration
   npx prisma migrate dev --name init
   
   # Generate Prisma client
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Forms
- `GET /api/forms` - Get all user's forms (protected)
- `POST /api/forms` - Create new form (protected)
- `GET /api/forms/:id` - Get form by ID (protected)
- `PUT /api/forms/:id` - Update form (protected)
- `DELETE /api/forms/:id` - Delete form (protected)

### Health Check
- `GET /api/health` - Server health status

See `API_GUIDE.md` for detailed API documentation with examples.

## Key Features

### 1. Clean Controllers (No Try-Catch!)
```typescript
// ❌ Old way
async create(req, res) {
  try {
    const data = await service.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ New way
create = async (req: Request, res: Response) => {
  const data = await this.service.create(req.body);
  res.json(data);
};
// asyncHandler middleware catches errors automatically!
```

### 2. NestJS-Style Exception Throwing
```typescript
// Just throw exceptions anywhere!
if (!user) {
  throw new NotFoundException('User not found');
}

if (!isValid) {
  throw new BadRequestException('Invalid data');
}
```

### 3. Module Pattern
Each module is self-contained:
- **Module** - Wires up dependencies and exports router
- **Controller** - Handles HTTP requests
- **Service** - Business logic
- **Repository** - Database queries
- **DTOs** - Request validation

### 4. Fatal Error Handling
Automatically handles:
- Uncaught exceptions
- Unhandled promise rejections
- Graceful shutdown on SIGTERM/SIGINT
- Database connection cleanup

## Next Steps (To Complete)

### Required Modules
1. **Questions Module** - CRUD for form questions
2. **Responses Module** - Submit and view form responses
3. **Users Module** - User management

### Example Question Module Structure
```typescript
// modules/questions/dto/index.ts
export const createQuestionSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'RADIO', 'CHECKBOX', 'SELECT', 'DATE']),
  order: z.number(),
  required: z.boolean(),
  options: z.any().optional(),
});

// modules/questions/questions.controller.ts
create = async (req: Request, res: Response) => {
  const { formId } = req.params;
  const result = createQuestionSchema.safeParse(req.body);
  
  if (!result.success) {
    throw new BadRequestException(result.error.issues[0].message);
  }
  
  const question = await this.questionsService.create(formId, result.data);
  res.status(201).json(question);
};
```

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Create a Form
```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Customer Feedback","description":"Collect feedback"}'
```

## Technologies Used
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Validation
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## Architecture Highlights

1. **Separation of Concerns** - Controller → Service → Repository
2. **Dependency Injection** - Manual DI pattern (simple, no libraries)
3. **Error Handling** - Centralized, consistent error responses
4. **Validation** - Zod schemas for type-safe validation
5. **Security** - JWT auth, password hashing, helmet, CORS
6. **Logging** - Request/response logging, fatal error logging
7. **Scalability** - Modular structure, easy to add new features

## Development Tips

1. **Adding a New Module**
   - Copy the `forms` module structure
   - Create controller, service, repository
   - Define DTOs with Zod
   - Export router from module file
   - Import in `main.ts`

2. **Adding New Exceptions**
   - Create new exception class in `common/exceptions`
   - Extend `HttpException`
   - Export from `index.ts`

3. **Database Changes**
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name your_change_name`
   - Run `npx prisma generate`

## License
MIT
