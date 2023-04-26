import { User } from '@prisma/client';
import Singleton from './utils/singleton';
import { TUserClient } from './WebSocket';

class SocketClient extends Singleton {
    private _clients = new Set<TUserClient>();

    get clients() {
        return Array.from(this._clients);
    }
    get guests() {
        return this.clients.filter((client) => !client.user);
    }

    setClients(clients: Set<TUserClient>) {
        this._clients = clients;
    }
    
    getUserClient(user?: User) {
        const client = this.clients.find((client) => client.user?.id === user?.id);
        if (!client) return;
        return client;
    }

    getNotUserClients(user?: User) {
        return this.clients.filter((client) => client.user?.id === user?.id);
    }
}

export default SocketClient.getInstance();
