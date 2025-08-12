import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { userService } from "../Services/UserServices";


interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const CURRENT_USER_KEY = 'job_tracker_current_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save current user to localStorage
  const saveCurrentUser = (userData: User): void => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    try {
      const authenticatedUser = await userService.authenticateUser(username, password);
      
      if (authenticatedUser) {
        const userData = { id: authenticatedUser.id, username: authenticatedUser.username };
        setUser(userData);
        saveCurrentUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    try {
      // Check if user already exists
      const userExists = await userService.checkUserExists(username);
      if (userExists) {
        return false;
      }
      
      // Create new user
      const newUser = await userService.createUser({ username, password });
      
      // Auto-login the new user
      const userData = { id: newUser.id, username: newUser.username };
      setUser(userData);
      saveCurrentUser(userData);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};