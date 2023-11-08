export type Transform<T> = T extends { columns: infer C, name: infer N }[]
    ? { columns: Extract<C, { name: string }>["name"][], name: N }[]
    : never;

export type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object | undefined ? RecursivePartial<T[P]> :
      T[P];
  };
