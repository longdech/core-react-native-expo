import { createContext, ReactNode, useState } from 'react';

import { User } from '@/types/models/user';

const USERS: User[] = [
  {
    id: '1',
    email: 'test@test.com',
    name: 'John Doe',
    emailVerified: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DUMMY_TOKENS: {
  accessToken: string;
  refreshToken: string;
} = {
  accessToken: '1234567890',
  refreshToken: '1234567890',
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  _isHydrated: boolean;
  isPending: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, password: string, confirmPassword: string) => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  _isHydrated: false,
  isPending: false,
  register: async () => {},
  login: async () => {},
  verifyEmail: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  }>({ accessToken: '', refreshToken: '' });
  const [isPending, setIsPending] = useState(false);

  const register = async (name: string, email: string, password: string) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser: User = {
      id: (USERS.length + 1).toString(),
      name,
      email,
      emailVerified: false,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    USERS.push(newUser);
    setIsPending(false);
  };

  const login = async (email: string, password: string) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = USERS.find((user) => user.email === email);
    if (!user) {
      setIsPending(false);
      throw new Error('Invalid email or password');
    }
    setIsAuthenticated(true);
    setUser(user);
    setTokens(DUMMY_TOKENS);
    setIsPending(false);
  };

  const verifyEmail = async (email: string, token: string) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = USERS.find((user) => user.email === email);
    if (!user) {
      setIsPending(false);
      throw new Error('Token is invalid');
    }
    user.emailVerified = true;
    USERS[USERS.indexOf(user)] = user;
    setUser(user);
    setIsPending(false);
  };

  const logout = async () => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticated(false);
    setUser(null);
    setTokens({ accessToken: '', refreshToken: '' });
    setIsPending(false);
  };

  const forgotPassword = async (email: string) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = USERS.find((user) => user.email === email);
    if (!user) {
      setIsPending(false);
      throw new Error('Email is not registered');
    }
    setIsPending(false);
  };

  const resetPassword = async (email: string, password: string, confirmPassword: string) => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = USERS.find((user) => user.email === email);
    if (!user) {
      setIsPending(false);
      throw new Error('Email is not registered');
    }
    setIsPending(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        tokens,
        _isHydrated: true,
        isPending,
        register,
        login,
        verifyEmail,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
