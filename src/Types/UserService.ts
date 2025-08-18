interface User {
    id: number;
    username: string;
    password: string;
  }
  
  interface UserCreateData {
    username: string;
    password: string;
  }
  
  class UserService {
    private users: User[] = [];
    private nextId = 1;
  
    constructor() {
      this.initializeUsers();
    }
  
    private initializeUsers() {
      // Load from localStorage if available
      const storedUsers = localStorage.getItem('job_tracker_users');
      const storedNextId = localStorage.getItem('job_tracker_user_next_id');
      
      if (storedUsers) {
        try {
          this.users = JSON.parse(storedUsers);
          this.nextId = storedNextId ? parseInt(storedNextId) : this.users.length + 1;
        } catch (error) {
          console.error('Error loading stored users:', error);
          this.users = [];
          this.nextId = 1;
        }
      }
    }
  
    private saveToStorage() {
      try {
        localStorage.setItem('job_tracker_users', JSON.stringify(this.users));
        localStorage.setItem('job_tracker_user_next_id', this.nextId.toString());
      } catch (error) {
        console.error('Error saving users to storage:', error);
      }
    }
  
    async authenticateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = this.users.find(u => u.username === username && u.password === password);
      
      if (user) {
        return { id: user.id, username: user.username };
      }
      
      return null;
    }
  
    async checkUserExists(username: string): Promise<boolean> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return this.users.some(user => user.username === username);
    }
  
    async createUser(userData: UserCreateData): Promise<Omit<User, 'password'>> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
  
      // Check if user already exists
      const userExists = await this.checkUserExists(userData.username);
      if (userExists) {
        throw new Error('User already exists');
      }
  
      const newUser: User = {
        id: this.nextId++,
        username: userData.username,
        password: userData.password
      };
  
      this.users.push(newUser);
      this.saveToStorage();
  
      return { id: newUser.id, username: newUser.username };
    }
  
    async getUserById(userId: number): Promise<Omit<User, 'password'> | null> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const user = this.users.find(u => u.id === userId);
      
      if (user) {
        return { id: user.id, username: user.username };
      }
      
      return null;
    }
  
    async updateUser(userId: number, updateData: Partial<UserCreateData>): Promise<Omit<User, 'password'>> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
  
      const userIndex = this.users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
  
      if (updateData.username && updateData.username !== this.users[userIndex].username) {
        const usernameExists = await this.checkUserExists(updateData.username);
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      }
  
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateData
      };
  
      this.saveToStorage();
      
      return { id: this.users[userIndex].id, username: this.users[userIndex].username };
    }
  
    async deleteUser(userId: number): Promise<void> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
  
      const userIndex = this.users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
  
      this.users.splice(userIndex, 1);
      this.saveToStorage();
    }
  }
  
  // Export singleton instance
  export const userService = new UserService();