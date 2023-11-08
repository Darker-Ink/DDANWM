import type { WebSocket } from "ws";
import type WS from "./Ws.js";

class WsUser {
    protected readonly ws: WS;

    private readonly rawWs: WebSocket;

    public constructor(ws: WS, rawWs: WebSocket) {
        this.ws = ws;

        this.rawWs = rawWs;
    }

    public send(data: any) {
        this.rawWs.send(JSON.stringify(data));
    }
}

export default WsUser;

export { WsUser };