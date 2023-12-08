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

        this.RouteDirectory = this.ddanwm.convertWindowsPath(join(dirname(fileURLToPath(import.meta.url)), "./routes"));

        this.app = express();

        this.app.use(express.json({
            limit: "50mb"
        }));

        this.app.use(express.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 25
        }));

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
                });
            }

            if (this.ddanwm.options.debug?.api?.requests) this.ddanwm.log("debug", `API request: ${req.method} ${req.url}`);

            next();
        });
    }

    public async start() {
        const routes = await this.ddanwm.loadFiles<"api">(this.RouteDirectory);
        const defaultVersions = routes.filter((route) => route.version === this?.ddanwm?.options?.defaultApiVersion);

        this.app.all("*", async (req, res) => {
            const foundPath = routes.find((route) => {
                const escapedPath = route.path.replaceAll(/[$()*+./?[\\\]^{|}-]/g, "\\$&");
                const regexPath = escapedPath.replaceAll(/:[\dA-Za-z]+/g, "[a-zA-Z0-9]+");
                const regex = new RegExp(`^${regexPath}$`);

                return regex.test(req.path) && req.method === route.route.method;
            }) ?? defaultVersions.find((route) => {
                const escapedPath = route.versionlessRoute.replaceAll(/[$()*+./?[\\\]^{|}-]/g, "\\$&");
                const regexPath = escapedPath.replaceAll(/:[\dA-Za-z]+/g, "[a-zA-Z0-9]+");
                const regex = new RegExp(`^${regexPath}$`);

                const fixedPath = req.path.replace(/^\/api/, "");

                return regex.test(fixedPath) && req.method === route.route.method;
            });

            if (!foundPath) {
                const notfound = Errors.notFound();

                if (!this.ddanwm.options.noWarnings) this.ddanwm.log("warn", "Possible missing endpoint, Please create a github issue if this is an actual endpoint bots can access, output:", req.method, req.url, JSON.stringify(req.body, null, 4), JSON.stringify(req.headers, null, 4));

                res.status(notfound.code).send(notfound.response);

                return;
            }

            let idx = 0;

            async function next() {
                if (!foundPath) return;

                if (idx < foundPath.default.middleware.length) {
                    const middleware = foundPath.default.middleware[idx++];

                    if (!middleware) {
                        throw new Error("Out of bounds middleware, this should never happen 🤔")
                    }

                    await middleware(req, res, next);
                } else if (!res.headersSent) {
                    foundPath.route.handler(req, res);
                }
            }

           return next()
        });

        this.app.listen(this.ddanwm.options.api.port, this.ddanwm.options.api.host, () => {
            this.ddanwm.log("info", `API is now listening on ${this.ddanwm.options.api.host}:${this.ddanwm.options.api.port}`);
        });

        return true;
    }
}

export default API;

export { API };