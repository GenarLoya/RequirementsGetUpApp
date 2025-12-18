// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
}

// ============================================================================
// Form Types
// ============================================================================

export interface Form {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  _count?: {
    questions: number;
    responses: number;
  };
}

export interface CreateFormDto {
  title: string;
  description?: string;
}

export interface UpdateFormDto {
  title?: string;
  description?: string;
  isActive?: boolean;
}

// ============================================================================
// Question Types
// ============================================================================

export type QuestionType = 
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'RADIO'
  | 'CHECKBOX'
  | 'SELECT'
  | 'DATE';

export interface Question {
  id: string;
  formId: string;
  text: string;
  type: QuestionType;
  order: number;
  required: boolean;
  options?: {
    choices?: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  required?: boolean;
  options?: {
    choices?: string[];
  };
}

export interface UpdateQuestionDto {
  text?: string;
  type?: QuestionType;
  required?: boolean;
  options?: {
    choices?: string[];
  };
}

export interface ReorderQuestionsDto {
  questionIds: string[];
}

// ============================================================================
// Response Types (for future implementation)
// ============================================================================

export interface FormResponse {
  id: string;
  formId: string;
  userId?: string | null;
  submittedAt: string;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
