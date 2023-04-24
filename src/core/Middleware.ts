import ApplicationError from '@/core/ApplicationError';
import {HttpContext} from '@/core/HttpContext';

export class Middleware {
    public use(ctx: HttpContext) {
        throw ApplicationError.MethodNotImplemented('use');
    }
    
    static async register(ctx: HttpContext) {
        const middleware = new this();
        await middleware.use(ctx);
    }
}
