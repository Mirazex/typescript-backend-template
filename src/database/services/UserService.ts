import { IUserCreate } from '@/core/@types/auth';
import ApplicationError from '@/core/ApplicationError';
import { cryptPassword } from '@/core/utils/auth';
import Singleton from '@/core/utils/singleton';
import { db } from '@/database';
import { Prisma, User } from '@prisma/client';

class UserService extends Singleton {
    user = db.user;

    async register(data: IUserCreate) {
        const existUser = await this.user
            .findUnique({
                where: {
                    email: data.email,
                },
            })
            .catch(() => null);

        if (existUser) throw ApplicationError.NotUnique();

        const { salt, hash } = cryptPassword(data.password);

        const user = await this.user
            .create({
                data: {
                    email: data.email,
                    password: hash,
                    salt: salt,
                },
            })
            .catch(() => null);

        if (!user) {
            throw ApplicationError.NotCreated();
        }

        const userWithName = await this.user.update({
            where: { id: user.id },
            data: {
                name: `Anonymous ${user.id}`,
            },
        });

        return userWithName;
    }

    async findOne(where: Partial<User>, secure = true) {
        const query: Prisma.UserFindUniqueArgs = {
            where,
        };

        if (secure) {
            query.select = {
                id: true,
                email: true,
                name: true
            };
        }

        const user = await db.user.findUnique(query).catch(() => null);
        if (!user) {
            throw ApplicationError.NotFound();
        }

        return user;
    }
}

export default UserService.getInstance();
