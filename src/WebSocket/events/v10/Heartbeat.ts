import { GatewayOpcodes } from "discord-api-types/gateway/v10";
import type DDANWM from "../../../DDANWM/DDANWM.js";
import { Payloads } from "../../../Utils/Payloads.js";
import Event from "../../Event.js";
import type WsUser from "../../WsUser.js";

export default class Heartbeat extends Event {

    public constructor(ddanwm: DDANWM) {
        super(ddanwm)

        this.op = GatewayOpcodes.Heartbeat;
    }

    public override async handleRequest(ws: WsUser): Promise<void> {
       ws.lastHeartbeat = Date.now();

       ws.send(Payloads.heartbeatAck())
    }
}