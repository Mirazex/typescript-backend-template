import ApplicationError from '@/core/ApplicationError';
import Env from '@/core/Env';
import { User } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateToken = (id: User['id']) => {
    const ttl = Number.parseInt(Env.get('USER_JWT_EXPIRE'));
    const accessExpireDate = Date.now() + ttl * 1000;

    const payload = { id };

    return {
        expire: accessExpireDate,
        token: jwt.sign(payload, Env.get('USER_JWT_SECRET'), { expiresIn: ttl }),
    };
};

export const hashPassword = (salt: string, password: string) => {
    if (!salt) {
        throw ApplicationError.RequiredAttributes();
    }

    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return password ? hash.digest('hex') : '';
};

export const cryptPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(salt, password);
    return {
        hash,
        salt,
    };
};

export const validatePassword = (hash: string, salt: string, password: string) => {
    if (!password || hash !== hashPassword(salt, password)) {
        throw ApplicationError.InvalidCredentials();
    }
    return true;
};
