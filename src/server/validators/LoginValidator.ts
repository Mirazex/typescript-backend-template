import { IUserCreate } from '@/core/@types/auth';
import Joi from 'joi';

export default Joi.object<IUserCreate>({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});
