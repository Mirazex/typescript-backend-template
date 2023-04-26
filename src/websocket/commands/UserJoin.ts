import ApplicationError from '@/core/ApplicationError';
import Env from '@/core/Env';
import EventCommand from '@/core/EventCommand';
import { TUserClient } from '@/core/WebSocket';
import UserService from '@/database/services/UserService';
import { WebSocketEvent } from '@/websocket/events';
import jwt from 'jsonwebtoken';

type TMessage = {
    authToken: string;
};

export default class UserJoin extends EventCommand {
    action = WebSocketEvent.USER_JOIN;

    userService = UserService;

    public async execute(client: TUserClient, message: TMessage) {
        if (!message.authToken) {
            throw ApplicationError.NoAuthHeader();
        }

        try {
            const userJwt: any = jwt.verify(message.authToken, Env.get('USER_JWT_SECRET'));
            client.authToken = message.authToken;
            client.user = await this.userService.findOne({ id: userJwt.id });
        } catch (e) {
            throw ApplicationError.BadUserToken();
        }

        client.sendEvent(this.action, client.user);
    }
}
