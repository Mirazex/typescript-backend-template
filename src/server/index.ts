import { Controller } from '@/core/Controller';
import Env from '@/core/Env';
import { Server } from '@/core/Server';
import loadFiles from '@/core/utils/loadFiles';
import path from 'path';

export async function createServer() {
    const port = Env.get('PORT');

    const controllers = await loadFiles<typeof Controller>(path.join(__dirname, '/controllers/**/*.{ts,js}'));

    const server = Server.getInstance(Number(port));

    await server.registerControllers('/api', controllers);
    server.registerErrorHandling();

    server.listen();
}
