import type { NextFunction, Request, Response } from "express";
import type DDANWM from "../../DDANWM/DDANWM.js";
import { Errors } from "../../Utils/Errors.js";

export const Authentication = (
    ddanwm: DDANWM,
    options: {
        authTypesAllowed:  ("bot" | "oauth2" | "webhook")[],
        /**
         * The type of authentication that is required
         * `none` - The user does not need to be authenticated to access the route and the route will fail if the user is authenticated.
         * `optional` - The user can be authenticated to access the route.
         * `required` - The user must be authenticated to access the route.
         */
        type?: "none" | "optional" | "required"
    }) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const botOrBearer = authHeader?.split(" ")[0] as "Bearer" | "Bot" | undefined;

        const error = Errors.unAuthorized();

        if (!authHeader || !botOrBearer) {
            if (options.type === "optional") {
                next();

                return;
            }

            ddanwm.log("debug", `API Request for ${req.url} (${req.method}) failed due to missing authorization header`)

            res.status(error.code).send(error.response);

            return;
        }

        if (options.type === "none") {
            ddanwm.log("debug", `API Request for ${req.url} (${req.method}) failed due to authorization header being present`)

            res.status(error.code).send(error.response);

            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            ddanwm.log("debug", `API Request for ${req.url} (${req.method}) failed due to missing token`)

            res.status(error.code).send(error.response);

            return;
        }

        if (botOrBearer === "Bot" && options.authTypesAllowed.includes("bot")) {
            const foundBot = ddanwm.bots.checkAuthenticity(token);

            if (!foundBot.valid || !foundBot.bot) {
                ddanwm.log("debug", `API Request for ${req.url} (${req.method}) failed due to invalid token`)

                res.status(error.code).send(error.response);

                return;
            }

            req.bot = foundBot.bot;

            next();

            return;
        }

        ddanwm.log("debug", "Temporarily log here");
    }
}