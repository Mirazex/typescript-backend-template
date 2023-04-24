import { CookieOptions, Response as ExpressResponse } from 'express';

export class Response {
    constructor(private response: ExpressResponse) {}

    public setCookie(name: string, value: string, options: CookieOptions) {
        this.response.cookie(name, value, options);
    }

    public clearCookie(name: string) {
        this.response.clearCookie(name);
    }
}
