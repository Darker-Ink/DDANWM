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
                name: "flags",
                type: "bigint"
            },
            {
                name: "tokens",
                type: "string[]"
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