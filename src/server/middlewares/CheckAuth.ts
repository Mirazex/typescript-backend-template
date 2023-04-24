import ApplicationError from "@/core/ApplicationError";
import Env from "@/core/Env";
import { HttpContext } from '@/core/HttpContext';
import { Middleware } from '@/core/Middleware';
import UserService from "@/database/services/UserService";
import jwt from "jsonwebtoken";

export default class CheckAuth extends Middleware {
    userService = UserService;
    
    public async use(ctx: HttpContext) {
        const header = ctx.request.header(`authorization`);
        
        if (!header || !header.trim()) {
            throw ApplicationError.NoAuthHeader();
        }
        
        const accessToken = header.split(` `)[1];
        ctx.context.accessToken = accessToken
        
        // Check User
        try {
            const userJwt: any = jwt.verify(accessToken, Env.get("USER_JWT_SECRET"));
            const user = await this.userService.findOne({ id: userJwt.id })
            
            ctx.context.user = user;
        } catch (e) {
            throw ApplicationError.BadUserToken()
        }
        
    }
}
