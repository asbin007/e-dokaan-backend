import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

import UserController from "../controllers/userContoller";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Receive token
    const token = req.headers.authorization;

    if (!token) {
      res.status(400).json({
        message: "Token must be provided",
      });
      return;
    }

    // Validate token
    jwt.verify(
      token,
      envConfig.jwtSecreteKey as string,
      async (err, result: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid Token",
          });
          return; // Ensure to return here
        }

        const userData = await User.findByPk(result.userId);
        if (!userData) {
          res.status(404).json({
            message: "No user with that userID",
          });
          return; // Ensure to return here
        }

        // Attach user data to request
        req.user = userData;
        next(); // Proceed to the next middleware or route handler
      }
    );
  }

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      console.log(userRole, "Role");
      if (!roles.includes(userRole)) {
        res.status(400).json({
          message: "You dont have permission ",
        });
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware();
