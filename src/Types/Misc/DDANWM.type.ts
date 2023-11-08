import type Route from "../../API/Route.js";
import type { DatabaseOptions } from "./Database.type";

/**
 * The options for the DDANWM class
 */
export interface DDANWMOptions {
    advanced?: {
        database?: DatabaseOptions;
    },
    api: {
        host: string;
        port: number;
    };
    debug?: {
        api?: {
            raw?: boolean;
            requests?: boolean;
            responses?: boolean;
        },
        ddanwm?: {
            logs?: boolean;
        },
        ws?: {
            heartbeats?: boolean;
            messages?: boolean;
            opcodes?: boolean;
            payloads?: boolean;
            raw?: boolean;
        }
    },
    /**
     * @description The default API version to use when no version is specified, Discord's default is v6, though we do not plan on supporting that version (unless someone plans to make a PR for it)
     */
    defaultApiVersion: "v9" | "v10";
    /**
     * @description If we don't log anything to the console
     */
    silent?: boolean;
    ws: {
        host: string;
        /**
         * @description The maximum amount of connections allowed at a time, when this is reached the server will stop accepting new connections until a connection is closed
         */
        maxConnections: number;
        port: number;
    };
}

export type logTypes = "debug" | "error" | "info" | "warn"

export const logColors: Record<logTypes | "date", string> = {
    debug: "6b00cf",
    error: "880808",
    info: "268bf0",
    warn: "bdbd00",
    date: "4fbd00"
}

interface RouteType {
    default: Route;
    directory: string;
    path: string;
    route: Route["routes"][number];
    type: "route";
    version: string;
    versionlessRoute: string;
}

interface WsEventType {
    default: Event;
    directory: string;
    type: "wsEvent";
    version: string;
}

export type DDANWMFile = RouteType | WsEventType;