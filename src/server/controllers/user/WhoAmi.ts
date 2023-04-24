import { Controller } from '@/core/Controller';
import { HttpContext } from '@/core/HttpContext';
import CheckAuth from '@/server/middlewares/CheckAuth';

export default class WhoAmi extends Controller {
    path = '/user/whoami';
    method = Controller.RequestMethod.GET;
    middlewares = [CheckAuth];

    public request(ctx: HttpContext) {
        return ctx.context.user;
    }
}
