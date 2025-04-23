import { GameRoles, RoleCategories } from "../middleware/roles";
import AuthRepository from "../db/AuthRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class AuthService {
  private authRepository: AuthRepository;
  private readonly SALT_ROUNDS = 10;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "default_secret";

  constructor() {
    this.authRepository = new AuthRepository();
  }


  public async getAuthToken(
    username: string,
    password: string,
  ): Promise<string> {
    const isValid = await this.validateLogin(username, password);
    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const user = await this.getUser(username);
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
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

    const user = await this.getUser(username);
    const token = jwt.sign(
        {
            userId: user.id,
            username: username,
        },
        this.JWT_SECRET,
        {
            expiresIn: "24h",
        }
    );

    return token;
  }

  private async isUserExist(username: string): Promise<boolean> {
    const user = await this.authRepository.getUserByUsername(username);
    return !!user;
  }

  public async getUser(username: string): Promise<any> {
    try {
      const user = await this.authRepository.getUserByUsername(username);
      return user || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  private async validateLogin(
    username: string,
    password: string
  ): Promise<boolean> {
    // Implement logic to validate login credentials
    console.log("Validating login for user:", username);
    try {
      const user = await this.getUser(username);
      if (user) {
        return await bcrypt.compare(password, user.password);
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error during login validation:", error);
      return false;
    }
  }
}
