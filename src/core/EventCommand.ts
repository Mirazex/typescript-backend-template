import ApplicationError from "@/core/ApplicationError";
import { TUserClient } from "./WebSocket";
import { WebSocketEvent } from "@/websocket/events";

export default class EventCommand {
    static register<T extends EventCommand>() {
        return new this() as T;
    }

    readonly action: WebSocketEvent = WebSocketEvent['PING'];

    public async execute(client: TUserClient, message: any) {
        throw ApplicationError.MethodNotImplemented('execute');
    }
}
