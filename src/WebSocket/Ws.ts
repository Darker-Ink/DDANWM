import { WebSocketServer } from "ws";
import type DDANWM from "../DDANWM/DDANWM.js";

class WS {
    protected ddanwm: DDANWM;

    public wss!: WebSocketServer;

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;
    }

    public async start() {
        this.wss = new WebSocketServer({
            port: this.ddanwm.options.ws.port,
            host: this.ddanwm.options.ws.host
        });

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
}

export default WS;

export { WS }