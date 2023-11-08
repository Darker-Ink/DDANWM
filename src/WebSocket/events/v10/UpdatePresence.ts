import { GatewayOpcodes, type GatewayPresenceUpdateData } from "discord-api-types/gateway/v10";
import type DDANWM from "../../../DDANWM/DDANWM.js";
import type { RecursivePartial } from "../../../Types/Misc/Utils.type.js";
import Event from "../../Event.js";
import type WsUser from "../../WsUser.js";

export default class Presence extends Event {

    public constructor(ddanwm: DDANWM) {
        super(ddanwm)

        this.op = GatewayOpcodes.PresenceUpdate;
    }

    public override async handleRequest(ws: WsUser, data: RecursivePartial<GatewayPresenceUpdateData>): Promise<void> {
        if (ws || data) {

        }
    }
}