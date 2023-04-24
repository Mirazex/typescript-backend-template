import { User } from '@prisma/client';
import { NextFunction } from 'express';
import { Request } from './Request';
import { Response } from './Response';

type ContextData = Record<string, any> & {
    user: User;
    accessToken: string;
};

export class HttpContext {
    public request: Request;
    public response: Response;
    public next: NextFunction;
    public context: ContextData;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.context = {} as ContextData;
    }
}
