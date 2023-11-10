import type Route from "../../API/Route.js";
import type Event from "../../WebSocket/Event.js";
import type { DatabaseOptions } from "./Database.type";

export type apiVersions = "v9" | "v10"

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
            /**
             * @description If we should log any debug messages from DDANWM (This includes the API & WS)
             */
            logs?: boolean;
            /**
             * @description If we should log the tables being created
             */
            tableLogs?: boolean;
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
    defaultApiVersion: apiVersions;
    /**
     * @description removes any warnings about missing endpoints / gateway events
     */
    noWarnings?: boolean;
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

export interface RouteType {
    default: Route;
    directory: string;
    path: string;
    route: Route["routes"][number];
    type: "route";
    version: string;
    versionlessRoute: string;
}

export interface WsEventType {
    default: Event;
    directory: string;
    type: "wsEvent";
    version: string;
}

export type DDANWMFile<T = "api" | "ws"> = T extends "ws" ? WsEventType : RouteType;