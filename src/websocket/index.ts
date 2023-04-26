import Env from "@/core/Env";
import EventCommand from "@/core/EventCommand";
import { WebSocket } from "@/core/WebSocket";
import loadFiles from "@/core/utils/loadFiles";
import path from "path";

export async function createWebSocketServer() {
    const port = Env.get('WS_PORT');

    const commands = await loadFiles<typeof EventCommand>(path.join(__dirname, '/commands/**/*.{ts,js}'));

    const ws = WebSocket.getInstance(Number(port));
    ws.addCommands(commands);
}
