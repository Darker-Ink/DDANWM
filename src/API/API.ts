import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import type DDANWM from "../DDANWM/DDANWM.js";
import { Errors } from "../Utils/Errors.js";
import { Authentication } from "./middleware/Auth.js";
import { RateLimit } from "./middleware/Ratelimiter.js";

class API {
    private readonly RouteDirectory: string;

    public readonly ddanwm: DDANWM;

    private readonly app: express.Application;

    public defaultMiddleware: ((req: Request, res: Response, next: NextFunction) => void)[];

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;

        this.RouteDirectory = this.ddanwm.convertWindowsPath(join(dirname(fileURLToPath(import.meta.url)), "./routes"))

        this.app = express();

        this.app.use(express.json({
            limit: "50mb"
        }))

        this.app.use(express.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 25
        }))

        this.defaultMiddleware = [Authentication(this.ddanwm, {
            type: "required",
            authTypesAllowed: ["bot"]
        }), RateLimit(this.ddanwm, {
            id: "global",
            max: 10_000,
            // one hour
            time: 1_000 * 60 * 60,
            global: true
        })];
        this.app.use((req, res, next) => {
            if (this.ddanwm.options?.debug?.api?.raw) this.ddanwm.log("debug", `API request: ${req.method} ${req.url}`, JSON.stringify(req.body, null, 4), JSON.stringify(req.headers, null, 4));

            if (this.ddanwm.options.debug?.api?.responses) {
                req.on("end", () => {
                    this.ddanwm.log("debug", `API response: ${req.method} ${req.url} - ${res.statusCode}`);
                })
            }

            if (this.ddanwm.options.debug?.api?.requests) this.ddanwm.log("debug", `API request: ${req.method} ${req.url}`);

            next();
        });
    }

    public async start() {
        const routes = await this.ddanwm.loadFiles<"api">(this.RouteDirectory)

        const defaultVersions = routes.filter((route) => route.version === this?.ddanwm?.options?.defaultApiVersion);

        for (const defaultVersion of defaultVersions) {
            this.ddanwm.log("debug", `Registering route "${defaultVersion.versionlessRoute}" (Default API Version)`);

            // darkerink: WARNING (this goes for the routes for loop as well):
            // Discord themselves first checks the method, then runs their header checks. So on discord if you don't provide a authorization header
            // it will return the 405 method not allowed error, not the 401 unauthorised error. Though for this we do the opposite, we first check the header
            // If someone wants to fix this, feel free to do so, but I don't see a reason to do so.
            this.app.all(defaultVersion.versionlessRoute, defaultVersion.default.middleware, (req: Request, res: Response, next: NextFunction) => {
                if (req.method !== defaultVersion.route.method) {
                    const methodNotAllowed = Errors.methodNotAllowed();

                    res.status(methodNotAllowed.code).send(methodNotAllowed.response);

                    return;
                }

                defaultVersion.route.handler(req, res, next); // darkerink: In theory next shouldn't ever be used but in case I think of a reason to use it I'll leave it here
            })
        }

        for (const route of routes) {
            this.ddanwm.log("debug", `Registering route "${route.path}"`);

            this.app.all(route.path, route.default.middleware, (req: Request, res: Response, next: NextFunction) => {
                if (req.method !== route.route.method) {
                    const methodNotAllowed = Errors.methodNotAllowed();

                    res.status(methodNotAllowed.code).send(methodNotAllowed.response);

                    return;
                }

                route.route.handler(req, res, next);
            });
        }

        this.app.all("*", (req, res) => {
            const notfound = Errors.notFound();

            if (!this.ddanwm.options.noWarnings) this.ddanwm.log("warn", "Possible missing endpoint, Please create a github issue if this is an actual endpoint bots can access, output:", req.method, req.url, JSON.stringify(req.body, null, 4), JSON.stringify(req.headers, null, 4));

            res.status(notfound.code).send(notfound.response);
        });

        this.app.listen(this.ddanwm.options.api.port, this.ddanwm.options.api.host, () => {
            this.ddanwm.log("info", `API is now listening on ${this.ddanwm.options.api.host}:${this.ddanwm.options.api.port}`);
        });

        return true;
    }
}

export default API;

export { API };