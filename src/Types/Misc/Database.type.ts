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
    saveType?: 'binary' | 'json';
}

export interface Column {
    default?: any;
    name: string;
    primary: boolean;
    required?: boolean;
    type: "bigint" | "boolean" | "number" | "string";
}