import { Buffer } from "node:buffer";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { deflate, inflate } from "pako";
import type { Column, ColumnsMap, DatabaseOptions } from "../Types/Misc/Database.type";


class Database<T extends readonly { columns: string[], name: string }[]> {
    private options: DatabaseOptions;

    /**
     * The first Map string is the table name, the
     */
    private database: Record<string, {
        columns: Column[];
        rows: Map<string, any>;
    }> = {};

    public constructor(options: DatabaseOptions) {
        this.options = options;

        this.database = {};
    }

    public getOptions() {
        return this.options;
    }

    public setOptions(options: DatabaseOptions) {
        this.options = options;
    }

    public async save() {
        if (!this.options.persistent) throw new Error("Cannot save a non-persistent database");

        const data = this.options.saveType === "binary" ? this.binarify() : JSON.stringify(Object.entries(this.database));

        const path = join(process.cwd(), this.options.path ?? "./", `database.${this.options.saveType === "binary" ? "dmc" : "json"}`);

        await writeFile(path, data);

        return true;
    }

    public async load() {
        if (!this.options.persistent) throw new Error("Cannot load a non-persistent database");

        const path = join(process.cwd(), this.options.path ?? "./", `database.${this.options.saveType === "binary" ? "dmc" : "json"}`);

        const data = await readFile(path);

        if (this.options.saveType === "binary") {
            this.database = this.debinarify(data as unknown as string);
        } else {
            this.database = Object.fromEntries(JSON.parse(data.toString()));
        }

        return true;
    }

    /**
     * @description Turns all the data in the `database` property into binary data which is pretty much just zlib compressed json with some extra steps to convert a map into a easily parseable format
     * @returns The binary data
     */
    private binarify() {
        if (this.options.saveType !== "binary") throw new Error("Cannot binarify a non-binary database");

        const data = Object.entries(this.database).map(([key, value]) => {
            const data2 = [...value.rows.entries()].map(([key2, value2]) => {
                const data3: Record<string, any> = {};

                for (const column of value.columns) {
                    data3[column.name] = value2[value.columns.findIndex(column2 => column2.name === column.name)];
                }

                return [key2, data3];
            });

            const data4: Record<string, any> = {};

            for (const column of value.columns) {
                data4[column.name] = column;
            }

            return [key, [data4, data2]];
        });

        return deflate(JSON.stringify(data));
    }

    /**
     * @description Turns binary data into a usable format for the `database` property
     * @param data The binary data
     * @returns The parsed data
     */
    private debinarify(data: string) {
        if (this.options.saveType !== "binary") throw new Error("Cannot debinarify a non-binary database");

        const string = inflate(Buffer.from(data, "base64"), { to: "string" });

        const parsedData = JSON.parse(string);
        const newData: Record<string, any> = {};

        for (const [key, value] of parsedData) {
            const columns: Column[] = [];

            for (const data of Object.entries(value[0])) {
                columns.push(data[1] as Column);

            }

            const rows = new Map();

            for (const [key2, value2] of value[1]) {
                rows.set(key2, Object.values(value2));
            }

            newData[key] = {
                columns,
                rows
            };
        }

        return newData;
    }

    /**
     * @description Fixes the name of a table or column to be more usable (turning it into snake_case)
     * @param name The name to fix
     * @returns
     */
    private nameFix(name: string) {
        // sneks the name
        // eslint-disable-next-line prefer-named-capture-group -- I hate regex eslint rules
        return name.replaceAll(/([A-Z])/g, " $1").split(" ").join("_").toLowerCase();
    }

    /**
     * @description Creates a table (Do not use this unless you know what you are doing)
     * @unstable
     */
    public createTable<Z extends T[number]["name"] = "">(name: Z, columns: readonly Column<ColumnsMap<T>[Z]>[]) {
        if (["__proto__", "constructor", "prototype"].includes(name)) return false; // This protects against prototype pollution

        const fixedColumns = columns.map(column => {
            if (["__proto__", "constructor", "prototype"].includes(column.name)) throw new Error(`Invalid colum name ${column.name}`); // This protects against prototype pollution

            return {
                required: true,
                canBeNull: true,
                ...column,
                name: this.nameFix(column.name)
            };
        });

        this.database[this.nameFix(name)] = {
            columns: fixedColumns,
            rows: new Map()
        };

        return true;
    }

    /**
     * @description Deletes a table (Do not use this unless you know what you are doing)
     * @unstable
     */
    public deleteTable<Z extends T[number]["name"] = "">(name: Z) {
        if (["__proto__", "constructor", "prototype"].includes(name)) return false; // This protects against prototype pollution

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- this is safe
        delete this.database[this.nameFix(name)];

        return true;
    }

    public getTable<Z extends T[number]["name"] = "">(name: Z) {
        if (["__proto__", "constructor", "prototype"].includes(name)) return false; // This protects against prototype pollution

        return this.database[this.nameFix(name)];
    }

    /**
     * @description Creates a row in a table
     * @param tableName The name of the table to create the row in
     * @param data The data to create, in the near future I would like this to be typed better, so if the tbale has a [string, string, number] type, then it would be [string, string, number] and not any[]
     */
    public create<Z extends T[number]["name"] = "", D extends Record<string, any> = {}>(tableName: Z, data: any[]): D | null {
        if (["__proto__", "constructor", "prototype"].includes(tableName)) return null; // This protects against prototype pollution

        const table = this.database[this.nameFix(tableName)];

        if (!table) return null;

        const tableIndex = table.columns.findIndex(column => column.primary);

        const primaryKey = data[tableIndex];

        if (!primaryKey) throw new Error("Primary key not provided");

        const notRequiredOptions = table.columns.filter(column => !column.required);

        for (const option of notRequiredOptions) {
            const index = table.columns.findIndex(column => column.name === option.name);

            if (data[index] === undefined) {
                data[index] = option.default ?? null;
            }
        }

        for (const item of data) {
            const index = data.indexOf(item);

            const column = table.columns[index];

            if (!column) throw new Error("Invalid column");

            if (item === null && column.required && !column.canBeNull) throw new Error(`Required column not provided, column: ${column.name}`);

            if (item === null && (!column.required || column.canBeNull)) {
                data[index] = column.default ?? null;

                continue;
            }

            if (column.type === "string[]") {
                if (!Array.isArray(item)) throw new Error(`Invalid type for column ${column.name} (${item})`);

                for (const item2 of item) {
                    if (typeof item2 !== "string") throw new Error(`Invalid type for column ${column.name} (${item})`);
                }

                continue;
            }

            // eslint-disable-next-line valid-typeof -- these are fine, but we jsut don't use all types
            if (typeof item !== column.type) throw new Error(`Invalid type for column ${column.name} (${item})`);
        }

        table.rows.set(primaryKey, data);

        const dataToReturn: Record<string, any> = {};

        for (const column of table.columns) {
            dataToReturn[column.name] = data[table.columns.findIndex(column2 => column2.name === column.name)];
        }

        return dataToReturn as D;
    }

    public delete<Z extends T[number]["name"] = "">(name: Z, primaryKey: string) {
        if (["__proto__", "constructor", "prototype"].includes(name)) return false; // This protects against prototype pollution

        const table = this.database[this.nameFix(name)];

        if (!table) return false;

        return table.rows.delete(primaryKey);
    }

    public get<Z extends T[number]["name"] = "", D extends Record<string, any> = {}>(name: Z, primaryKey: any): D | null | undefined {
        if (["__proto__", "constructor", "prototype"].includes(name)) return null; // This protects against prototype pollution

        const table = this.database[this.nameFix(name)];

        if (!table) return null;

        const data = table.rows.get(primaryKey);

        if (!data) return null;

        const dataToReturn: Record<string, any> = {};

        for (const column of table.columns) {
            dataToReturn[column.name] = data[table.columns.findIndex(column2 => column2.name === column.name)];
        }

        return dataToReturn as D;
    }
}

export default Database;

export { Database };