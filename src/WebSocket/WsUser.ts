import { UserFlags, type GatewayIdentifyProperties, type GatewayPresenceUpdateData, ApplicationFlags } from "discord-api-types/v10";
import { IntentFlagsBitField, IntentFlags } from "discord-bitflag";
import type { WebSocket } from "ws";
import type Bot from "../Structures/Bot.js";
import type { apiVersions } from "../Types/Misc/DDANWM.type.js";
import type { RecursivePartial } from "../Types/Misc/Utils.type.js";
import { WsErrors } from "../Utils/Errors.js";
import { sessionId } from "../Utils/Hashes.js";
import { generateHeartbeatInterval } from "../Utils/HeartbeatInterval.js";
import type WS from "./Ws.js";

class WsUser {
    public readonly ws: WS;

    private readonly rawWs: WebSocket;

    public bot: Bot | null = null;

    public heartbeatInterval: number = generateHeartbeatInterval();

    public version: apiVersions;

    public authed: boolean = false;

    public intents: number = 0;

    public largeThreshold: number = 50;

    public compress: boolean = false;

    public shard: [number, number] = [0, 0];

    public presence: RecursivePartial<GatewayPresenceUpdateData> = {}

    public properties: RecursivePartial<GatewayIdentifyProperties> = {};

    public sessionId: string = sessionId();

    public sequence: number = 0;

    public lastHeartbeat: number = Date.now();

    public closedAt: number | null = null;

    public resumeable: boolean = false;

    public constructor(ws: WS, rawWs: WebSocket, version: apiVersions) {
        this.ws = ws;

        this.rawWs = rawWs;

        this.version = version;
    }

    public send(data: any) {
        this.rawWs.send(JSON.stringify(data));
    }

    public close(code: number, reason: string, resumeable: boolean = false) {
        this.rawWs.close(code, reason);

        this.closedAt = Date.now();
        this.resumeable = resumeable;
    }

    /**
     * Authenticates the user with the token they provided, This SHOULD only be called once in the Identify event else it will return false
     *
     * @param token The token to authenticate with
     * @returns If the authentication was successful
     */
    public authenticate(token: string) {
        if (this.authed) return false;

        const foundBot = this.ws.ddanwm.bots.checkAuthenticity(token);

        if (!foundBot.valid || !foundBot.bot) {
            const wsError = WsErrors.authenticationFailed();

            this.close(wsError.code, wsError.response);

            return false;
        }

        this.bot = foundBot.bot;
        this.authed = true;

        return true;
    }

    /**
     * Sets the intents for the bot, If we return false then disconnect the client as they are not allowed to use the intents they requested
     *
     * @param intents The intents to set
     * @returns If the intents were set successfully
     */
    public setIntents(intents: number) {
        const endingValue = {
            allowed: false,
            intents: 0,
            invalidIntents: false
        }

        if (!this.bot) return endingValue; // we return false since the bot isn't set yet, and so we can't validate they are allowed to use the intents

        const intentFields = new IntentFlagsBitField(intents);

        if (!this.bot.userFlags.has(UserFlags.VerifiedBot)) {
            this.intents = intents; // Verified bots can use any intent

            endingValue.allowed = true;
            endingValue.intents = intents;

            return endingValue;
        }

        if (!this.bot.applicationFlags.has(ApplicationFlags.GatewayGuildMembers) && intentFields.has(IntentFlags.GuildMembers as bigint)) {
            return endingValue
        }

        if (!this.bot.applicationFlags.has(ApplicationFlags.GatewayPresence) && intentFields.has(IntentFlags.GuildPresences as bigint)) {
            return endingValue
        }

        if (!this.bot.applicationFlags.has(ApplicationFlags.GatewayMessageContent) && intentFields.has(IntentFlags.MessageContent as bigint)) {
            return endingValue
        }

        let doubleIntents = 0n;

        for (const [_, value] of Object.entries(IntentFlags)) {
            if (intentFields.has(value as bigint)) {
                doubleIntents |= value;
            }
        }

        if (doubleIntents !== BigInt(intents)) {
            endingValue.invalidIntents = true;

            return endingValue;
        }

        this.intents = intents;
        endingValue.allowed = true;
        endingValue.intents = intents;

        return endingValue;
    }
}

export default WsUser;

export { WsUser };