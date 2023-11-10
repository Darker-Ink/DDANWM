/**
 * The options for the fake database class
 */
export interface DatabaseOptions {
    /**
     * The maximum amount of stuff allowed in the "database" (memory) default is unlimited
     */
    max?: {
        bans?: number;
        channels?: number;
        emojis?: number;
        guilds?: number;
        invites?: number;
        messages?: number;
        roles?: number;
        users?: number;
        webhooks?: number;
    },
    /**
     * The path to the database file
     */
    path?: string;
    /**
     * Should it read & write to a file for a "persistent" database
     */
    persistent?: boolean;
    /**
     * If it stores it in binary or json
     */
    saveType?: "binary" | "json";
}

export interface Column<T extends string = string> {
    canBeNull?: boolean;
    default?: any;
    name: T;
    primary?: boolean;
    required?: boolean;
    type: "bigint" | "boolean" | "number" | "string" | "string[]";
}

export type ColumnsMap<T extends readonly { columns: string[], name: string }[]> = {
    [K in T[number]["name"]]: Extract<T[number], { name: K }>["columns"][number];
};


