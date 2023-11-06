export type Transform<T> = T extends { columns: infer C, name: infer N }[]
    ? { columns: Extract<C, { name: string }>["name"][], name: N }[]
    : never;