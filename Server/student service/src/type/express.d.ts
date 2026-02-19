import { JwtUser } from "../core/interface/interface.app";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUser;
  }
}
