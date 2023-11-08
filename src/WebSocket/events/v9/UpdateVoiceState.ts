import { GatewayOpcodes, type GatewayVoiceStateUpdateData } from "discord-api-types/gateway/v9";
import type DDANWM from "../../../DDANWM/DDANWM.js";
import type { RecursivePartial } from "../../../Types/Misc/Utils.type.js";
import Event from "../../Event.js";
import type WsUser from "../../WsUser.js";

export default class VoiceState extends Event {

    public constructor(ddanwm: DDANWM) {
        super(ddanwm)

        this.op = GatewayOpcodes.VoiceStateUpdate;
    }

    public override async handleRequest(ws: WsUser, data: RecursivePartial<GatewayVoiceStateUpdateData>): Promise<void> {
        if (ws || data) {

        }
    }
}