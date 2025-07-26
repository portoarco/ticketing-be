import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./router/auth.router";

const PORT: string = process.env.PORT || "8000";

class App {
  public app: Application;
  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorMiddleware();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }
  private route(): void {
    // Route Const Management
    const authRouter: AuthRouter = new AuthRouter();
    // Main Page
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>This is Main Page</h1>");
    });

    this.app.use("/auth", authRouter.getRouter());
  }

  // error handler
  private errorMiddleware(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log(error);
        res.status(500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API is Running at http://localhost:${PORT}`);
    });
  }
}

export default App;
