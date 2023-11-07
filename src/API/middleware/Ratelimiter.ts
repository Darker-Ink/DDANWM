import type { NextFunction, Request, Response } from "express";
import type DDANWM from "../../DDANWM/DDANWM.js";

export const RateLimit = (
    ddanwm: DDANWM,
    options: {
        /**
         * If the rate limit is global or not.
         */
        global?: boolean;
        /**
         * The "bucket id" for the rate limit, this is used to identify the rate limit.
         */
        id: string;
        /**
         * The maximum amount of requests that can be made before the rate limit is triggered.
         */
        max: number;
        /**
         * The amount of time in milliseconds before the rate limit is reset.
         */
        time: number;
    }
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req || res || ddanwm || options) {

        }

        next();
    }
}