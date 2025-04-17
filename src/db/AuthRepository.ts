import User from "../types/user";
import { getPrismaClient } from "./db";

class AuthRepository {
  constructor() {}




  public async getAuthToken(
    username: string,
    password: string
  ): Promise<string> {
    // Implement authentication logic here

    // Return a JWT token upon successful authentication
    return "auth_token";
  }



  public async addUser(username: string, password: string): Promise<boolean> {
    try {
      const userExists = await this.isUserExist(username);

      if (userExists) {
        return false;
      }

      const prisma = getPrismaClient();
      await prisma.user.create({
        data: {
          email: username, // Using email field for username in Prisma schema
          password
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  }

  private async getUsers(): Promise<User[]> {
    try {
      const prisma = getPrismaClient();
      const dbUsers = await prisma.user.findMany();
      
      // Map Prisma User model to our User type
      return dbUsers.map(user => ({
        id: user.id,
        username: user.email, // Using email field for username
        password: user.password,
        authToken: null
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  public async getUserById(id: number): Promise<User | undefined> {
    try {
      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!user) return undefined;
      
      return {
        id: user.id,
        username: user.email,
        password: user.password,
        authToken: null
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  }

  private async isUserExist(username: string): Promise<boolean> {
    try {
      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { email: username } // Using email field for username
      });
      
      return !!user;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { email: username } // Using email field for username
      });
      
      if (!user) return undefined;
      
      return {
        id: user.id,
        username: user.email,
        password: user.password,
        authToken: null
      };
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }
}

export default AuthRepository;
