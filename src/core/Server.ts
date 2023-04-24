import { Controller } from '@/core/Controller';
import ExceptionHandler from '@/core/ExceptionHandler';
import Singleton from '@/core/utils/singleton';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export class Server extends Singleton {
    public express: Application;
    public port: number;

    constructor(port: number) {
        super();

        this.express = express();
        this.port = port;

        this.initialize();
    }

    private initialize(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json({ limit: 1024 }));
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    public async registerControllers(prefix: string = '/api', controllers: (typeof Controller)[]): Promise<void> {
        for (const controller of controllers) {
            const router = controller.register(prefix)
            this.express.use(router);
        }
    }

    public registerErrorHandling() {
        this.express.use(ExceptionHandler);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
