import User from "../types/user";
import * as fs from "node:fs/promises";
import * as path from "path";

class AuthRepository {
  private userAuthPath: string;

  constructor() {
    this.userAuthPath = path.resolve(__dirname, "../db/users.json");
    this.initializeUsersFile();
  }

  private async initializeUsersFile(): Promise<void> {
    try {
      await fs.access(this.userAuthPath);
    } catch {
      // File doesn't exist, create directory and file
      await fs.mkdir(path.dirname(this.userAuthPath), { recursive: true });
      await fs.writeFile(this.userAuthPath, JSON.stringify([]));
    }
  }

  public async getAuthToken(
    username: string,
    password: string
  ): Promise<string> {
    // Implement authentication logic here

    // Return a JWT token upon successful authentication
    return "auth_token";
  }

  private async getNextId(): Promise<number> {
    const users = await this.getUsers();
    if (users.length === 0) return 1;
    const validIds = users.map(user => user.id).filter(id => id !== undefined);
    return validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
  }

  public async addUser(username: string, password: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const userExists = await this.isUserExist(username);

      if (userExists) {
        return false;
      }

      const newUser: User = {
        id: await this.getNextId(),
        username,
        password,
        authToken: null
      };

      users.push(newUser);
      await fs.writeFile(this.userAuthPath, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  }

  private async getUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.userAuthPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("error reading file", error);
      return [];
    }
  }

  public async getUserById(id: number): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.id === id);
  }

  private async isUserExist(username: string): Promise<boolean> {
    const users = await this.getUsers();
    return users.some((user: User) => user.username === username);
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(user => user.username === username);
  }
}

export default AuthRepository;
