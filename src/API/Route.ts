import type { NextFunction, Request, Response } from "express";
import type API from "./API.js";

export type Methods = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type ContentTypes = "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data";

class Route {
    protected readonly api: API;

    public middleware: ((req: Request, res: Response, next: NextFunction) => Promise<void> | void)[];

    public routes: {
        contentType: ContentTypes | "none"  ;
        handler(req: Request, res: Response, next?: NextFunction): void;
        method: Methods;
        path: string;
    }[];

    public constructor(
        api: API
    ) {
        this.api = api;

        this.middleware = [];

        this.routes = [];
    }
}

export default Route;

export { Route };