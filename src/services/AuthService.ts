import { GameRoles, RoleCategories } from "../middleware/roles";
import AuthRepository from "../db/AuthRepository";
import * as fs from "node:fs/promises";
import * as path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class AuthService {
  private userAuthPath: string;
  private authRepository: AuthRepository;
  private readonly SALT_ROUNDS = 10;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "default_secret";

  constructor() {
    this.userAuthPath = path.resolve(__dirname, "../db/users.json");
    this.initializeUsersFile();
    this.authRepository = new AuthRepository();
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
    const isValid = await this.validateLogin(username, password);
    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const user = await this.getUser(username);
    const token = jwt.sign(
      {
        username: user.username,
        password: user.password,
      },
      this.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return token;
  }

  public async addUser(username: string, password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    const success = await this.authRepository.addUser(username, hashedPassword);
    
    if (!success) {
        throw new Error("User already exists");
    }

    // Generate token for the newly registered user
    const token = jwt.sign(
        {
            username: username,
            password: hashedPassword,
        },
        this.JWT_SECRET,
        {
            expiresIn: "24h",
        }
    );

    return token;
  }

  private async getUsers(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.userAuthPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("error reading file", error);
      return [];
    }
  }

  private async isUserExist(username: string): Promise<boolean> {
    // Implement logic to check if user exists
    try {
      const users = await this.getUsers();
      if (
        users.find((user: { username: string }) => user.username === username)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("error reading file", error);
      return false;
    }
  }

  private async getUser(username: string): Promise<any> {
    // Implement logic to get user details
    try {
      const users = await this.getUsers();
      return users.find(
        (user: { username: string }) => user.username === username
      );
    } catch (error) {
      console.error("error reading file", error);
      return null;
    }
  }

  private async validateLogin(
    username: string,
    password: string
  ): Promise<boolean> {
    // Implement logic to validate login credentials
    try {
      const user = await this.getUser(username);
      if (user) {
        return await bcrypt.compare(password, user.password);
      } else {
        return false;
      }
    } catch (error) {
      console.error("error reading file", error);
      return false;
    }
  }
}
