import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { User, LoginDto, RegisterDto, AuthResponse } from '../types';

/**
 * Authentication hook using TanStack Query
 * - Manages user authentication state
 * - Handles login, register, logout operations
 * - Automatically fetches current user on mount
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Query to fetch current user (from /api/auth/me)
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      try {
        const { data } = await api.get<User>('/api/auth/me');
        return data;
      } catch (err: any) {
        // If 401, user is not authenticated (return null, don't throw)
        if (err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false, // Don't retry failed auth checks
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // Update the user query cache with the logged-in user
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterDto) => {
      const { data } = await api.post<AuthResponse>('/api/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      // Update the user query cache with the registered user
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout');
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(['auth', 'user'], null);
      // Clear all queries to reset app state
      queryClient.clear();
    },
  });

  return {
    // Current user state
    user,
    isAuthenticated: !!user,
    isLoading,
    error,

    // Mutations
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Mutation states (for UI feedback)
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
