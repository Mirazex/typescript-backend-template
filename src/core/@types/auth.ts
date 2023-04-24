import { User } from '@prisma/client';

export interface IUserCreate {
    email: User['email'];
    password: User['password'];
}
