import type { NextFunction, Request, Response } from "express";
import type DDANWM from "../DDANWM/DDANWM.js";

export type Methods = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type ContentTypes = "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data";

class Route {
    protected readonly ddanwm: DDANWM;

    public middleware: ((req: Request, res: Response, next: NextFunction) => Promise<void> | void)[];

    public routes: {
        contentType: ContentTypes | "none"  ;
        handler(req: Request, res: Response, next?: NextFunction): void;
        method: Methods;
        path: string;
    }[];

    public constructor(
        ddanwm: DDANWM
    ) {
        this.ddanwm = ddanwm;

        this.middleware = [];

        this.routes = [];
    }
}

export default Route;

export { Route };