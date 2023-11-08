import EventEmitter from "node:events";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import type DDANWM from "../DDANWM/DDANWM.js";
import type WsUser from "./WsUser.js";

/**
 * @class WS
 * @extends {EventEmitter}
 * @description The WebSocket server, we have adapted the Subscribe / Publish pattern for this, meaning that you can subscribe to a channel and publish to it, and everyone subscribed to that channel will receive the message
 */
class WS extends EventEmitter {
    protected ddanwm: DDANWM;

    private readonly EventDirectory: string;

    public wss!: WebSocketServer;

    public clients: Map<string, WsUser> = new Map();

    public subscriptions: Map<string, WsUser[]> = new Map();

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

        const events = await this.ddanwm.loadFiles(this.EventDirectory);

        console.log(events);

        this.wss.on("connection", (ws, req) => {
            this.ddanwm.log("debug", "WS connection", req.url as string);

            ws.on("message", (message) => {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                this.ddanwm.log("debug", "WS message", message.toString());
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
                users.push(user);
            }
        } else {
            this.subscriptions.set(channelId, [user]);
        }
    }

    public unsubscribe(channelId: string, user: WsUser) {
        if (this.subscriptions.has(channelId)) {
            const users = this.subscriptions.get(channelId);

            if (users) {
                users.splice(users.indexOf(user), 1);
            }
        }
    }

    public publish(channelId: string, data: any, besides?: WsUser[]) {
        if (this.subscriptions.has(channelId)) {
            const users = this.subscriptions.get(channelId);

            if (users) {
                for (const user of users) {
                    if (besides && besides.includes(user)) {
                        continue;
                    }

                    user.send(data);
                }
            }
        }
    }

    public getSubscriptions(channelId: string) {
        if (this.subscriptions.has(channelId)) {
            const users = this.subscriptions.get(channelId);

            if (users) {
                return users;
            }
        }

        return [];
    }
}

export default WS;

export { WS }