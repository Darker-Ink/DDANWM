import type { Request, Response } from "express";
import Errors from "../../../../Constants/Errors.json"
import type DDANWM from "../../../../DDANWM/DDANWM.js";
import { generateError } from "../../../../Utils/HttpErrorGenerator.js";
import { HttpPayloads } from "../../../../Utils/HttpPayloads.js";
import T from "../../../../Utils/TypeCheck.js";
import Route from "../../../Route.js";

export default class AtMe extends Route {
    public constructor(ddanwm: DDANWM) {
        super(ddanwm);

        this.routes = [
            {
                contentType: "none",
                handler: this.fetchMyself.bind(this),
                method: "GET",
                path: "/@me"
            },
            {
                contentType: "application/json",
                handler: this.patchMyself.bind(this),
                method: "PATCH",
                path: "/@me"
            }
        ]

        this.middleware = this.ddanwm.api.defaultMiddleware;
    }

    private fetchMyself(req: Request, res: Response) {
        if (!req.bot) throw new Error("Bot is not satisfied");

        res.json(HttpPayloads.fetchSelf(req.bot))
    }

    private patchMyself(req: Request<any, any, {
        avatar?: unknown,
        username?: unknown
    }>, res: Response) {
        if (!req.bot) throw new Error("Bot is not satisfied");

        if (req.body.username && !T(req.body.username, "string")) {
            const error = Errors.find((e) => e.code === "50035");

            const errorsToSend = generateError({
                code: Number(error?.code) ?? 0,
                message: error?.message ?? "Unknown error",
                errors: {
                    username: [
                        {
                            code: "STRING_TYPE_CONVERT",
                            message: `Could not interpret "${JSON.stringify(req.body.username)}" as a string`
                        }
                    ]
                }
            });

            res.status(400).json(errorsToSend);

            return;
        }

        res.json(HttpPayloads.fetchSelf(req.bot, true))
    }
}