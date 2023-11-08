import type { Request, Response } from "express";
import type DDANWM from "../../../../DDANWM/DDANWM.js";
import Route from "../../../Route.js";

export default class Bot extends Route {
    private readonly options: { maxConcurrency: number; remaining: number; resetAfter: number; total: number; };

    public constructor(ddanwm: DDANWM) {
        super(ddanwm);

        this.routes = [
            {
                contentType: "application/json",
                handler: this.botResponse.bind(this),
                method: "GET",
                path: "/bot"
            }
        ]

        this.middleware = this.ddanwm.api.defaultMiddleware;

        this.options = {
            maxConcurrency: 1,
            remaining: 1_000,
            resetAfter: 0,
            total: 1_000
        }
    }

    private botResponse(_: Request, res: Response) {
        res.send({
            url: `ws://${this.ddanwm.options.ws.host}:${this.ddanwm.options.ws.port}`,
            session_start_limit: this.options,
            shards: 1
        })
    }
}