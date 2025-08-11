import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface StoredUser {
  username: string;
  password: string;
}

const USERS_STORAGE_KEY = 'job_tracker_users';
const CURRENT_USER_KEY = 'job_tracker_current_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  // Get stored users from localStorage
  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing stored users:', error);
      return [];
    }
  };

  // Save users to localStorage
  const saveUsers = (users: StoredUser[]): void => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  // Save current user to localStorage
  const saveCurrentUser = (userData: User): void => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  };

  const login = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    const users = getStoredUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData = { username: foundUser.username };
      setUser(userData);
      saveCurrentUser(userData);
      return true;
    }
    
    return false;
  };

  const register = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    const users = getStoredUsers();
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
      return false;
    }
    
    // Add new user
    const newUser: StoredUser = { username, password };
    users.push(newUser);
    saveUsers(users);
    
    // Auto-login the new user
    const userData = { username };
    setUser(userData);
    saveCurrentUser(userData);
    
    return true;
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