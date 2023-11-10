export const Tables = [
    {
        name: "bots",
        columns: [
            {
                name: "id",
                primary: true,
                type: "bigint"
            },
            {
                name: "username",
                type: "string"
            },
            {
                name: "discriminator",
                type: "string"
            },
            {
                name: "global_name",
                type: "string"
            },
            {
                name: "avatar",
                type: "string"
            },
            {
                name: "avatar_decoration",
                type: "string"
            },
            {
                name: "application_flags",
                type: "number"
            },
            {
                name: "flags",
                type: "number"
            },
            {
                name: "tokens",
                type: "string[]"
            },
            {
                name: "bio",
                type: "string"
            },
            {
                name: "interaction_url",
                type: "string"
            },
            {
                name: "linked_roles_url",
                type: "string"
            },
            {
                name: "privacy_policy_url",
                type: "string"
            },
            {
                name: "tos_url",
                type: "string"
            },
            {
                name: "redirect_uris",
                type: "string[]"
            },
            {
                name: "client_secret",
                type: "string"
            }
        ]
    },
    {
        name: "users",
        columns: [
            {
                name: "id",
                primary: true,
                type: "bigint"
            },
            {
                name: "username",
                type: "string"
            },
            {
                name: "discriminator",
                type: "string"
            },
            {
                name: "avatar",
                type: "string"
            },
            {
                name: "avatar_decoration",
                type: "string"
            },
            {
                name: "flags",
                type: "number"
            },
            {
                name: "locale",
                type: "string"
            },
            {
                name: "email",
                type: "string"
            },
            {
                name: "verified",
                type: "boolean"
            },
            {
                name: "mfa_enabled",
                type: "boolean"
            },
            {
                name: "system", // You should not mess with this, internally we have a single system user. When need be as well we may make "Server" users for when publishing messages are made
                type: "boolean"
            },
            {
                name: "banner",
                type: "string"
            },
            {
                name: "accent_color",
                type: "number"
            }
        ]
    }
] as const;

export type TableToColumns<T extends readonly { columns: readonly { name: string, type: string; }[], name: string; }[]> = {
    [K in keyof T]: {
        columns: Extract<T[K]["columns"][number]["name"], string>[],
        name: T[K]["name"];
    }
};

export type TableColumns = TableToColumns<typeof Tables>;

export type Readonlyfy<T> = {
    readonly [K in keyof T]: T[K];
};