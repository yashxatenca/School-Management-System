import { JwtUser } from "../interface/interface.app";
import { JwtPayload } from "jsonwebtoken";
export {}


declare global{
    namespace Express{
        interface Request{
            user?: JwtPayload & JwtUser
        }
    }
}