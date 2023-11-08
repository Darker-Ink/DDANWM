import EventEmitter from "node:events";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import type DDANWM from "../DDANWM/DDANWM.js";
import type { apiVersions } from "../Types/Misc/DDANWM.type.js";
import { WsErrors } from "../Utils/Errors.js";
import { parseUrl } from "../Utils/ParseUrl.js";
import { Payloads } from "../Utils/Payloads.js";
import { SupportedAPiVersions } from "../constants/Misc.js";
import WsUser from "./WsUser.js";

/**
 * @class WS
 * @extends {EventEmitter}
 * @description The WebSocket server, we have adapted the Subscribe / Publish pattern for this, meaning that you can subscribe to a channel and publish to it, and everyone subscribed to that channel will receive the message
 */
class WS extends EventEmitter {
    public ddanwm: DDANWM;

    private readonly EventDirectory: string;

    public wss!: WebSocketServer;

    public clients: Map<string, WsUser[]> = new Map();

    public subscriptions: Map<string, {
        user: WsUser,
        version: apiVersions
    }[]> = new Map();

    public constructor(ddanwm: DDANWM) {
        super();

        this.ddanwm = ddanwm;

        this.EventDirectory = this.ddanwm.convertWindowsPath(join(dirname(fileURLToPath(import.meta.url)), "./events"))
    }

    public async start() {
        this.wss = new WebSocketServer({
            port: this.ddanwm.options.ws.port,
            host: this.ddanwm.options.ws.host
        });

        const events = await this.ddanwm.loadFiles<"ws">(this.EventDirectory)
        const unknownOp = WsErrors.unknownOpCode();
        const notAuthenticated = WsErrors.notAuthenticated();
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
            const payloadsMatchingVersion = events.filter((event) => event.version === newUser.version);

            this.clients.set(parsedUrl.v, [newUser]);

            newUser.send(Payloads.hello(newUser.heartbeatInterval)); // initial hello payload

            ws.on("message", (message) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- cool, will be caught by the catch block
                    const parsedMessage = JSON.parse(message.toString()) as {
                        d: any;
                        op: number;
                    }

                    if (this.ddanwm.options.debug?.ws?.raw) this.ddanwm.log("debug", "WS message", "Raw", JSON.stringify(parsedMessage, null, 4));

                    const event = payloadsMatchingVersion.find((event) => event.default.op === parsedMessage.op);

                    if (!event) { // why does discord send the not authenticated op code when you send a invalid op code? who knows but we will handle it the same
                        if (newUser.authed) {
                            ws.close(unknownOp.code, unknownOp.response);
                        } else {
                            ws.close(notAuthenticated.code, notAuthenticated.response);
                        }

                        return;
                    }

                    if (event.default.authRequired && !newUser.authed) {
                        ws.close(notAuthenticated.code, notAuthenticated.response);

                        return;
                    }

                    if (this.ddanwm.options.debug?.ws?.opcodes) this.ddanwm.log("debug", "WS message", "Opcode", parsedMessage.op);
                    if (this.ddanwm.options.debug?.ws?.payloads) this.ddanwm.log("debug", "WS message", "Payload", JSON.stringify(parsedMessage.d, null, 4));

                    void event.default.handleRequest(newUser, parsedMessage.d);
                } catch {
                    const invalidPayloadError = WsErrors.invalidPayload();

                    ws.close(invalidPayloadError.code, invalidPayloadError.response);

                    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- ignored as its fine here
                    this.ddanwm.log("debug", "WS message", "Invalid payload", message.toString());
                }
            });


            ws.on("close", (code, reason) => {
                this.ddanwm.log("debug", "WS close", String(code), reason.toString());

                this.clients.get(parsedUrl.v)?.splice(this.clients.get(parsedUrl.v)?.indexOf(newUser) ?? 0, 1);
            });

            ws.on("error", console.error)
        });

        this.wss.on("listening", () => {
            this.ddanwm.log("info", `WS is now listening on ${this.ddanwm.options.ws.host}:${this.ddanwm.options.ws.port}`);
        })


        return true;
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
}

export default WS;

export { WS }