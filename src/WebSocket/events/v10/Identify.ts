import { GatewayOpcodes, type GatewayIdentifyData } from "discord-api-types/gateway/v10";
import type DDANWM from "../../../DDANWM/DDANWM.js";
import { WsErrors } from "../../../Utils/Errors.js";
import { Payloads } from "../../../Utils/Payloads.js";
import T from "../../../Utils/TypeCheck.js";
import Event from "../../Event.js";
import type WsUser from "../../WsUser.js";

/**
 * Discord Identify event really isn't that strict, for example you got to send "properties" but you don't actually got to send any of the properties inside of it.
 * I've decided to make it strict and require all the properties inside of it, and having exact typings (i.e you can only send a string for os, browser, device, etc)
 */
export default class Identify extends Event {

    public constructor(ddanwm: DDANWM) {
        super(ddanwm)

        this.op = GatewayOpcodes.Identify;

        this.authRequired = false;
    }

    public override async handleRequest(ws: WsUser, data: GatewayIdentifyData): Promise<void> {
        if (!T(data.token, "string") || !T(data.intents, "number") ||!T(data.properties, "object")) {
            if (this.ddanwm.options.debug?.ws?.raw) this.ddanwm.log("debug", "Invalid Identify Payload", JSON.stringify(data, null, 4))

            ws.send(Payloads.invalidSession()); // Discord doesn't close the connection, so you can receive this and then send a new Identify payload

            return;
        }

        if (data.large_threshold && !T(data.large_threshold, "number")) {

        }

        if (typeof data.compress !== "undefined" && !T(data.compress, "boolean")) {

        }

        if (data.shard && (!T(data.shard, "array") || (data.shard.length > 2 || data.shard.length < 2))) {

        }

        const authenicated = ws.authenticate(data.token);

        if (!authenicated) {
            const authFailed = WsErrors.authenticationFailed();

            ws.close(authFailed.code, authFailed.response);

            return;
        }

        const setIntents = ws.setIntents(data.intents);

        if (setIntents.invalidIntents) {
            const invalidIntents = WsErrors.invalidIntents();

            ws.close(invalidIntents.code, invalidIntents.response);

            return;
        }

        if (!setIntents.allowed) {
            const disallowedIntents = WsErrors.disallowedIntents();

            ws.close(disallowedIntents.code, disallowedIntents.response);

            return;
        }

        ws.compress = data.compress ?? false;
        ws.properties = data.properties;
        ws.presence = data.presence ?? {};

        if (data.shard) ws.shard = data.shard;

        ws.send(Payloads.dispatchReady(ws))
    }
}