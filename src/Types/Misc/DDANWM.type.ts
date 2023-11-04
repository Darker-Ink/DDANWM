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
    /**
     * The default API version to use when no version is specified, Discord's default is v6, though we do not plan on supporting that version (unless someone plans to make a PR for it)
     */
    defaultApiVersion: 'v9' | 'v10';
    ws: {
        host: string;
        /**
         * The maximum amount of connections allowed at a time, when this is reached the server will stop accepting new connections until a connection is closed
         */
        maxConnections: number;
        port: number;
    };
}