import 'dotenv/config';
import "./aliases"

import Env from '@/core/Env';
import { db } from '@/database';
import { createServer } from '@/server';

import cluster from 'cluster';
import createWorker from '@/core/utils/createWorker';

async function boostrap() {
    const MODE = Env.get('NODE_ENV');

    if (MODE === 'development' || !cluster.isMaster) {
        await db.$connect();

        await createServer();
        // await createWebSocketServer();
        // await Game.start();
    } else if (cluster.isMaster) {
        createWorker();
    }
}

boostrap();
