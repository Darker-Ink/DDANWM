import { GatewayOpcodes, type GatewayRequestGuildMembersData } from "discord-api-types/gateway/v9";
import type DDANWM from "../../../DDANWM/DDANWM.js";
import type { RecursivePartial } from "../../../Types/Misc/Utils.type.js";
import Event from "../../Event.js";
import type WsUser from "../../WsUser.js";

export default class RequestGuildMembers extends Event {

    public constructor(ddanwm: DDANWM) {
        super(ddanwm)

        this.op = GatewayOpcodes.RequestGuildMembers;
    }

    public override async handleRequest(ws: WsUser, data: RecursivePartial<GatewayRequestGuildMembersData>): Promise<void> {
        if (ws || data) {

        }
    }
}