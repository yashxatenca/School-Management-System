import { JwtUser } from "../interface/interface.app";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export {};
