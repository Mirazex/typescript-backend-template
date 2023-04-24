import { Controller } from '@/core/Controller';
import { HttpContext } from '@/core/HttpContext';
import { generateToken, validatePassword } from '@/core/utils/auth';
import UserService from '@/database/services/UserService';
import LoginValidator from '@/server/validators/LoginValidator';
import RegisterValidator from '@/server/validators/RegisterValidator';

export default class Login extends Controller {
    path = '/auth/login';
    method = Controller.RequestMethod.POST;
    validationSchema = LoginValidator;

    userService = UserService;

    public async request(ctx: HttpContext) {
        const email = ctx.request.input('email');
        const password = ctx.request.input('password');

        const user = await this.userService.findOne({ email }, false);

        validatePassword(user.password, user.salt, password);
        return generateToken(user.id);
    }
}
