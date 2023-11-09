import EventEmitter from "node:events";
import { dirname, join } from "node:path";
import { setInterval } from "node:timers";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import { SupportedAPiVersions } from "../Constants/Misc.js";
import type DDANWM from "../DDANWM/DDANWM.js";
import type { WsEventType, apiVersions } from "../Types/Misc/DDANWM.type.js";
import { WsErrors } from "../Utils/Errors.js";
import { parseUrl } from "../Utils/ParseUrl.js";
import { isJson } from "../Utils/PayloadValidator.js";
import { Payloads } from "../Utils/Payloads.js";
import WsUser from "./WsUser.js";

/**
 * @class WS
 * @extends {EventEmitter}
 * @description The WebSocket server, we have adapted the Subscribe / Publish pattern for this, meaning that you can subscribe to a channel and publish to it, and everyone subscribed to that channel will receive the message
 */
class WS extends EventEmitter {
    public ddanwm: DDANWM;

    private readonly EventDirectory: string;

    private events!: WsEventType[];

    public wss!: WebSocketServer;

    public clients: Map<string, WsUser[]> = new Map();

    public subscriptions: Map<string, {
        user: WsUser,
        version: apiVersions;
    }[]> = new Map();

    private readonly heartbeatInterval: number = 5_000; // We check heartbeat statuses every 5 seconds

    public constructor(ddanwm: DDANWM) {
        super();

        this.ddanwm = ddanwm;

        this.EventDirectory = this.ddanwm.convertWindowsPath(join(dirname(fileURLToPath(import.meta.url)), "./events"));
    }

    public async start() {
        this.wss = new WebSocketServer({
            port: this.ddanwm.options.ws.port,
            host: this.ddanwm.options.ws.host
        });

        this.wss.on("listening", () => {
            this.ddanwm.log("info", `WS is now listening on ${this.ddanwm.options.ws.host}:${this.ddanwm.options.ws.port}`);

            setInterval(() => this.startHeartbeatCheck(), this.heartbeatInterval)
        });

        this.events = await this.ddanwm.loadFiles<"ws">(this.EventDirectory);

        const invalidApiVersionError = WsErrors.nolongerSupported();

        this.wss.on("connection", (ws, req) => {
            this.ddanwm.log("debug", "WS connection", req.url as string);

            const parsedUrl = parseUrl(req.url ?? "/");

            if (!SupportedAPiVersions.includes(`v${parsedUrl.v}` as apiVersions)) {
                ws.close(invalidApiVersionError.code, invalidApiVersionError.response);

                this.ddanwm.log("debug", "WS connection", "Invalid API version", parsedUrl.v as string);

                return;
            }

            const newUser = new WsUser(this, ws, `v${parsedUrl.v}` as apiVersions);

            this.clients.set(parsedUrl.v, [newUser]);

            newUser.send(Payloads.hello(newUser.heartbeatInterval)); // initial hello payload

            ws.on("message", async (message) => {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string -- ignored as its fine here
                const stringedMessage = message.toString();

                if (!isJson(stringedMessage)) {
                    const invalidPayloadError = WsErrors.invalidPayload();

                    ws.close(invalidPayloadError.code, invalidPayloadError.response);

                    this.ddanwm.log("debug", "WS message", "Invalid payload", stringedMessage);

                    return;
                }

                await this.onMessage(JSON.parse(stringedMessage), newUser);
            });


            ws.on("close", (code, reason) => {
                this.ddanwm.log("debug", "WS close", String(code), reason.toString());

                this.clients.get(parsedUrl.v)?.splice(this.clients.get(parsedUrl.v)?.indexOf(newUser) ?? 0, 1);
            });

            ws.on("error", console.error);
        });

        return true;
    }

    public async onMessage(message: {
        d: any;
        op: number;
    }, ws: WsUser) {
        const unknownOp = WsErrors.unknownOpCode();
        const notAuthenticated = WsErrors.notAuthenticated();

        if (this.ddanwm.options.debug?.ws?.raw) this.ddanwm.log("debug", "WS message", "Raw", JSON.stringify(message, null, 4));
        if (this.ddanwm.options.debug?.ws?.opcodes) this.ddanwm.log("debug", "WS message", "Opcode", message.op);
        if (this.ddanwm.options.debug?.ws?.payloads) this.ddanwm.log("debug", "WS message", "Payload", JSON.stringify(message.d, null, 4));

        const event = this.events.find((event) => event.default.op === message.op && event.version === ws.version);

        if (!event) { // why does discord send the not authenticated op code when you send a invalid op code? who knows but we will handle it the same
            if (ws.authed) {
                if (this.ddanwm.options.debug?.ws?.opcodes) this.ddanwm.log("debug", "WS message", "Unknown opcode", message.op);

                ws.close(unknownOp.code, unknownOp.response);
            } else {
                if (this.ddanwm.options.debug?.ws?.opcodes) this.ddanwm.log("debug", "WS message", "Not authenticated & Unknown Op Code", message.op);

                ws.close(notAuthenticated.code, notAuthenticated.response);
            }

            return;
        }

        if (event.default.authRequired && !ws.authed) {
            if (this.ddanwm.options.debug?.ws?.opcodes) this.ddanwm.log("debug", "WS message", "Not authenticated & Auth required", message.op);

            ws.close(notAuthenticated.code, notAuthenticated.response);

            return;
        }

        void event.default.handleRequest(ws, message.d, message);
    }

    public subscribe(channelId: string, user: WsUser) {
        if (this.subscriptions.has(channelId)) {
            const users = this.subscriptions.get(channelId);

            if (users) {
                users.push({
                    user,
                    version: user.version
                });
            }
        } else {
            this.subscriptions.set(channelId, [{
                user,
                version: user.version
            }]);
        }
    }

    public unsubscribe(channelId: string, user: WsUser) {
        if (this.subscriptions.has(channelId)) {
            const clients = this.subscriptions.get(channelId);

            if (clients) {
                clients.splice(clients.indexOf({
                    user,
                    version: user.version
                }), 1);
            }
        }
    }

    public publish(channelId: string, data: any, besides?: WsUser[]) {
        if (this.subscriptions.has(channelId)) {
            const client = this.subscriptions.get(channelId);

            if (client) {
                for (const user of client) {
                    if (besides && besides.includes(user.user)) {
                        continue;
                    }

                    user.user.send(data);
                }
            }
        }
    }

    public getSubscriptions(channelId: string) {
        if (this.subscriptions.has(channelId)) {
            const clients = this.subscriptions.get(channelId);

            if (clients) {
                return clients;
            }
        }

        return [];
    }

    public startHeartbeatCheck() {
        for (const [, clients] of this.clients) {
            for (const client of clients) {
                // darkerink: We give them one interval loop of leeway
                if (client.lastHeartbeat + client.heartbeatInterval < (Date.now() - this.heartbeatInterval)) {
                    client.close(1_000, "", true);

                    this.ddanwm.log("debug", "WS heartbeat", "Heartbeat failed", client.bot?.username ?? "Unknown bot");
                }
            }
        }
    }
}

export default WS;

export { WS };