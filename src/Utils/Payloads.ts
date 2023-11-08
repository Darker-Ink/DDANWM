import { GatewayOpcodes as Opcodesv10 } from "discord-api-types/v10";
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
    }
}