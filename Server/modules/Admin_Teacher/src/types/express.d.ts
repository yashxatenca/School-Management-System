import { JwtUser } from "../interfaces/admin.interface";

declare global {
  namespace Express {
    interface Request {
      user: JwtUser;
    }
  }
}

export {};
