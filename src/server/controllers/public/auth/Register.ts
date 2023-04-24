import { Controller } from '@/core/Controller';
import { HttpContext } from '@/core/HttpContext';
import { generateToken, validatePassword } from '@/core/utils/auth';
import UserService from '@/database/services/UserService';
import RegisterValidator from '@/server/validators/RegisterValidator';

export default class Register extends Controller {
    path = '/auth/register';
    method = Controller.RequestMethod.POST;
    validationSchema = RegisterValidator;

    userService = UserService;

    public async request(ctx: HttpContext) {
        const email = ctx.request.input('email');
        const password = ctx.request.input('password');

        const user = await this.userService.register({
            email,
            password,
        });

        validatePassword(user.password, user.salt, password);
        return generateToken(user.id);
    }
}
