import type DDANWM from "../DDANWM/DDANWM.js";
import type WsUser from "./WsUser.js";

class Event {
    protected readonly ddanwm: DDANWM;

    public op: number;

    public authRequired: boolean = true;

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;

        this.op = 0;
    }

    public async handleRequest(ws: WsUser, data: any, rawMessage?: unknown) {
        if (ws || data || rawMessage) {

        }

        throw new Error("Method not implemented.");
    }
}

export default Event;

export { Event };