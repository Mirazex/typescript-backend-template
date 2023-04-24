import { ValueOf } from '@/core/@types';
import ApplicationError from '@/core/ApplicationError';
import { HttpContext } from '@/core/HttpContext';
import { Middleware } from '@/core/Middleware';
import { Request } from '@/core/Request';
import { Response } from '@/core/Response';
import express, { Router } from 'express';
import Joi from 'joi';
import path from 'path';

export type ControllerValidation = Joi.Schema;

export class Controller {
    static RequestMethod = {
        GET: 'get',
        POST: 'post',
        PATCH: 'patch',
        PUT: 'put',
        DELETE: 'delete',
    } as const;

    public router = Router();
    public path = '/';
    public method: ValueOf<typeof Controller.RequestMethod> = Controller.RequestMethod.GET;
    public middlewares: (typeof Middleware)[] = [];
    public validationSchema?: ControllerValidation;

    public request(ctx: HttpContext) {
        throw ApplicationError.MethodNotImplemented('request');
    }

    private async validate(ctx: HttpContext) {
        if (!this.validationSchema || !Joi.isSchema(this.validationSchema)) return;

        const objectToValidate = this.method === Controller.RequestMethod.GET ? ctx.request.qs : ctx.request.input();

        try {
            const value = await this.validationSchema.validateAsync(objectToValidate, { stripUnknown: true });

            const object = this.method === Controller.RequestMethod.GET ? '_query' : '_body';
            ctx.request[object] = value;
        } catch (e) {
            if (e instanceof Joi.ValidationError) {
                const message = e.details.map((i) => i.message).join(`,`);
                throw ApplicationError.JsonValidation(message);
            }
        }
    }

    private async handle(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const request = new Request(req);
            const response = new Response(res);

            const ctx = new HttpContext(request, response, next);
            
            await this.validate(ctx);
            await Promise.all(this.middlewares.map(middleware => middleware.register(ctx)))
            
            const data = await this.request(ctx);
            if (!res.headersSent) {
                return res.status(200).json({
                    success: true,
                    statusCode: 200,
                    data,
                });
            }
        } catch (e) {
            next(e);
        }
    }

    static register(prefix: string) {
        const controller = new this();
        const route = path.join(prefix, controller.path)
        controller.router[controller.method](route, controller.handle.bind(controller));
        console.log(`added '${controller.method.toUpperCase()}' controller for route '${route}'`);
        return controller.router;
    }
}
