import { apiService } from "./ApiServices";


export interface User {
  id: number;
  username: string;
  password: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
}

class UserService {
  private endpoint = '/users';

  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>(this.endpoint);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const users = await apiService.get<User[]>(`${this.endpoint}?username=${username}`);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  async createUser(userData: UserLoginData): Promise<User> {
    return apiService.post<User>(this.endpoint, userData);
  }

  async authenticateUser(username: string, password: string): Promise<UserResponse | null> {
    try {
      const users = await apiService.get<User[]>(`${this.endpoint}?username=${username}&password=${password}`);
      if (users.length > 0) {
        const user = users[0];
        return { id: user.id, username: user.username };
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  async checkUserExists(username: string): Promise<boolean> {
    try {
      const user = await this.getUserByUsername(username);
      return user !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }
}

export const userService = new UserService();