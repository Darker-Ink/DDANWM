import { GatewayOpcodes as Opcodesv10, GatewayDispatchEvents } from "discord-api-types/v10";
import type WsUser from "../WebSocket/WsUser.js";
// import { GatewayOpcodes as Opcodesv9 } from "discord-api-types/v9";
// import type { apiVersions } from "../Types/Misc/DDANWM.type.js";

export const Payloads = {
    hello: (heartbeatInterval: number) => {
        return {
            t: null,
            s: null,
            op: Opcodesv10.Hello,
            d: {
                heartbeat_interval: heartbeatInterval,
                // darkerink: From my "research" bot developers / lib makes shouldn't be depending on this, its just for debugging purposes for discord. So we will just reutn an empty array.
                // if a library depends on it make an issue and I'll generate fake data for it.
                _trace: []
            }
        }
    },
    invalidSession: () => {
        return {
            t: null,
            s: null,
            op: Opcodesv10.InvalidSession,
            d: false
        }
    },
    dispatchReady: (ws: WsUser) => {
        return {
            t: GatewayDispatchEvents.Ready,
            s: ++ws.sequence,
            op: Opcodesv10.Dispatch,
            d: {
                v: 10,
                user_settings: {},
                user: {
                    verified: true,
                    username: ws.bot?.username ?? "Deleted User",
                    mfa_enabled: true,
                    id: ws.bot?.id,
                    global_name: ws.bot?.globalName ,
                    flags: ws.bot?.userFlags.toJSON() ?? 0,
                    email: null,
                    discriminator: ws.bot?.discriminator ?? "0000",
                    bot: true,
                    avatar: ws.bot?.avatar ?? null,
                },
                session_type: "normal",
                session_id: ws.sessionId,
                resume_gateway_url: `ws://${ws.ws.ddanwm.options.ws.host}:${ws.ws.ddanwm.options.ws.port}`,
                relationships: [],
                private_channels: [],
                presences: [],
                guilds: [],
                guild_join_requests: [],
                geo_ordered_rtc_regions: [],
                auth: {},
                application: {
                    id: ws.bot?.id,
                    flags: ws.bot?.applicationFlags.toJSON()
                },
                _trace: []
            }
        }
    },
    heartbeatAck: () => {
        return {
            t: null,
            s: null,
            op: Opcodesv10.HeartbeatAck,
            d: null
        }
    }
}