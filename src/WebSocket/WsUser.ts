import type { WebSocket } from "ws";
import type Bot from "../Structures/Bot.js";
import type { apiVersions } from "../Types/Misc/DDANWM.type.js";
import { WsErrors } from "../Utils/Errors.js";
import { generateHeartbeatInterval } from "../Utils/HeartbeatInterval.js";
import type WS from "./Ws.js";

class WsUser {
    protected readonly ws: WS;

    private readonly rawWs: WebSocket;

    public bot: Bot | null = null;

    public heartbeatInterval: number = generateHeartbeatInterval();

    public version: apiVersions;

    public authed: boolean = false;

    public constructor(ws: WS, rawWs: WebSocket, version: apiVersions) {
        this.ws = ws;

        this.rawWs = rawWs;

        this.version = version;
    }

    public send(data: any) {
        this.rawWs.send(JSON.stringify(data));
    }

    public authenticate(token: string) {
        const foundBot = this.ws.ddanwm.bots.checkAuthenticity(token);

        if (!foundBot.valid || !foundBot.bot) {
            const wsError = WsErrors.authenticationFailed();

            this.rawWs.close(wsError.code, wsError.response);

            return false;
        }

        return true;
    }
}

export default WsUser;

export { WsUser };