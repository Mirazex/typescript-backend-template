import Singleton from './utils/singleton';
import { WebSocketEvent } from '@/websocket/events';
import { User } from '@prisma/client';
import ws from "ws";
import ApplicationError from './ApplicationError';
import SocketClient from './SocketClient';
import EventCommand from './EventCommand';
import { unique } from 'radash';

export type TUserClient = ws.WebSocket & {
    user?: User;
    authToken: string;
    pinger: NodeJS.Timer
    sendEvent(action: WebSocketEvent | string, message?: any): void
}

export class WebSocket extends Singleton {
    public wss: ws.Server;
    public port: number;
    public commands = new Map<WebSocketEvent, EventCommand>();

    constructor(port: number) {
        super();

        this.port = port;
        this.wss = new ws.Server({
            port: port,
            path: "/connect",
        })

        this.addServerEvents();
    }

    public addCommands(commands: typeof EventCommand[]) {
        const events = unique(commands.map((command) => command.register()), (command) => command.action).filter(event => event.action)
        for (const event of events) {
            this.commands.set(event.action, event)
        }
    }

    private addServerEvents() {
        SocketClient.setClients(this.wss.clients as any)

        this.wss.on('connection', async (client: TUserClient, req: any) => {
            client.sendEvent = function (action: WebSocketEvent, message: any) {
                this.send(JSON.stringify({ action, message }));
            };

            client.pinger = setInterval(socket => {
                socket.sendEvent("ping");
            }, 30000, client);

            this.subscribeEvents(client)
        });

        this.wss.on('close', () => {
            console.log('Websocket server was closed');
        });

        this.wss.on('error', err => {
            console.error(`Websocket server fired error: ${err}`);
        });
    }

    private subscribeEvents(client: TUserClient) {
        client.on('message', async (data) => {
            try {
                const payload = JSON.parse(data.toString());
                const command = this.commands.get(payload.action?.toLowerCase());

                if (!command) {
                    return client.sendEvent("error", "Message can not be handled, as no handler exists for it");
                }

                try {
                    await command.execute(client, payload.message);
                } catch (e) {
                    console.error(e);
                    if (e instanceof ApplicationError) {
                        return client.sendEvent("error", {
                            code: e.code,
                            message: e.message
                        });
                    } else {
                        console.log(e);
                    }
                }
            } catch (err) {
                return client.sendEvent("error", "Can't parse message");
            }
        });

        client.on('close', async (code, reason) => {
            console.log(`closed`, code, reason, reason.toString(), (client as any).name);
        });

        client.on('error', err => {
            console.error(`Websocket connection fired error: ${err}`);
        });
    }
}
