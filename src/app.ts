import 'dotenv/config';
import "./aliases"

import Env from '@/core/Env';
import { db } from '@/database';
import { createServer } from '@/server';

import cluster from 'cluster';
import createWorker from '@/core/utils/createWorker';
import { createWebSocketServer } from './websocket';

async function boostrap() {
    const MODE = Env.get('NODE_ENV');

    if (MODE === 'development' || !cluster.isMaster) {
        await db.$connect();

        await createServer();
        await createWebSocketServer();
    } else if (cluster.isMaster) {
        createWorker();
    }
}

boostrap();
