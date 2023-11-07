import type { Request, Response } from "express";
import type API from "../../../API.js";
import Route from "../../../Route.js";

export default class Bot extends Route {
    private readonly options: { maxConcurrency: number; remaining: number; resetAfter: number; total: number; };

    public constructor(api: API) {
        super(api);

        this.routes = [
            {
                contentType: "application/json",
                handler: this.botResponse.bind(this),
                method: "GET",
                path: "/bot"
            }
        ]

        this.middleware = this.api.defaultMiddleware;

        this.options = {
            maxConcurrency: 1,
            remaining: 1_000,
            resetAfter: 0,
            total: 1_000
        }
    }

    private botResponse(_: Request, res: Response) {
        res.send({
            url: `ws://${this?.api?.ddanwm?.options?.ws?.host}:${this.api.ddanwm.options.ws.port}`,
            session_start_limit: this.options,
            shards: 1
        })
    }
}