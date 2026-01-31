import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export function CookieMiddleware(req: NextRequest){
    const istoken = req.cookies.has("token")
    if(!istoken){
        return NextResponse.redirect(new URL("/login?role=teacher"))
    }
    
}