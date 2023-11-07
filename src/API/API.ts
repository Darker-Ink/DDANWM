import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import type DDANWM from "../DDANWM/DDANWM.js";
import { Errors } from "../Utils/Errors.js";
import { Route as RouteBuilder } from "./Route.js";
import { Authentication } from "./middleware/Auth.js";
import { RateLimit } from "./middleware/Ratelimiter.js";

class API {
    private RouteDirectory: string = this.convertWindowsPath(join(dirname(fileURLToPath(import.meta.url)), "./routes"));

    public readonly ddanwm: DDANWM;

    private readonly app: express.Application;

    public defaultMiddleware: ((req: Request, res: Response, next: NextFunction) => void)[];

    public constructor(ddanwm: DDANWM) {
        this.ddanwm = ddanwm;

        this.app = express();

        this.defaultMiddleware = [Authentication(this.ddanwm, {
            type: "required"
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
        const routes = await this.loadRoutes();

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

        this.app.all("*", (_, res) => {
            const notfound = Errors.notFound();

            res.status(notfound.code).send(notfound.response);
        });

        this.app.listen(this.ddanwm.options.api.port, this.ddanwm.options.api.host, () => {
            this.ddanwm.log("info", `API is now listening on ${this.ddanwm.options.api.host}:${this.ddanwm.options.api.port}`);
        });

        return true;
    }

    private async walkDirectory(dir: string): Promise<string[]> {
        const Routes = await readdir(dir, { withFileTypes: true });

        const Files: string[] = [];

        for (const Route of Routes) {
            if (Route.isDirectory()) {
                const SubFiles = await this.walkDirectory(join(dir, Route.name));
                Files.push(...SubFiles);
            } else {
                Files.push(join(dir, Route.name));
            }
        }

        return Files;
    }

    private async loadRoutes() {
        const Routes = await this.walkDirectory(this.RouteDirectory);

        const routes = [];

        for (const Route of Routes) {
            if (Route.endsWith(".map") || Route.endsWith(".d.ts")) {
                continue;
            }

            // ts part is since I test with bun and don't want to recompile each time
            if (!Route.endsWith(".js") && !Route.endsWith(".ts")) {
                this.ddanwm.log("debug", `Skipping ${Route} as it is not a route file`);

                continue;
            }

            const RouteClass = await import(this.convertWindowsPath(Route));

            if (!RouteClass.default) {
                this.ddanwm.log("warn", `Skipping ${Route} as it does not have a default export`);

                continue;
            }

            const version = /v\d+/g.exec(Route)?.[0];

            if (!version) {
                throw new Error(`Failed to get version from ${Route}`);
            }

            const RouteInstance = new RouteClass.default(this);

            if (!(RouteInstance instanceof RouteBuilder)) {
                this.ddanwm.log("warn", `Skipping ${Route} as it does not extend Route`);

                continue;
            }

            for (const route of RouteInstance.routes) {
                const fixedRoute =(this.convertWindowsPath(Route).split(this.RouteDirectory)[1]?.split("/").slice(0, -1).join("/") ?? "") + route.path

                routes.push({
                    default: RouteInstance,
                    directory: this.convertWindowsPath(Route),
                    path: "/api" + fixedRoute.replaceAll(/\[([^\]]+)]/g, ":$1"),  // eslint-disable-line prefer-named-capture-group
                    route,
                    version,
                    versionlessRoute: fixedRoute.replaceAll(`/${version}`, "")
                });
            }
        }

        return routes;
    }

    private convertWindowsPath(path: string) {
        return path.replace(/^[A-Za-z]:/, "").replaceAll("\\", "/");
    }
}

export default API;

export { API };