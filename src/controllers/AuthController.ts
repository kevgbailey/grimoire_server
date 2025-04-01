import { Router, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RoleCategories } from "../middleware/roles";

export class AuthController {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", this.registerUser.bind(this));
    this.router.post("/login", this.loginUser.bind(this));
    // Add more routes as needed
  }

  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }

        try {
            const token = await this.authService.addUser(username, password);
            res.status(201).json({ message: "User registered successfully", token });
        } catch (error) {
            if (error instanceof Error && error.message === "User already exists") {
                res.status(409).json({ message: error.message });
                return;
            }
            throw error;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: errorMessage });
    }
}

  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }
      const token = await this.authService.getAuthToken(username, password);
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ message: errorMessage });
    }
  }
}
