import EventEmitter from "node:events";
import process from "node:process";
import chalk from "chalk";
import { logColors, type DDANWMOptions, type logTypes } from "../Types/Misc/DDANWM.type.js";
import Database from "../Utils/Database.js";
import { Tables, type TableColumns } from "../constants/Tables.js";
import Bots from "./Helpers/Bots.helper.js";

interface DDANWM {
    emit(event: "log", type: logTypes, ...message: string[]): boolean;
    on(event: "log", listener: (type: logTypes, ...message: string[]) => void): this;
}

class DDANWM extends EventEmitter {
    protected readonly options: DDANWMOptions;

    public readonly database: Database<TableColumns>;

    public bots: Bots = new Bots(this);

    protected shouldLog: boolean = true;

    public constructor(options: DDANWMOptions) {
        super();

        this.options = options;

        this.shouldLog = !this.options.silent;

        this.database = new Database(this.options.advanced?.database ?? {
            persistent: false
        });

        if (this.options.advanced?.database?.persistent) {
            // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
            this.database.load().catch((error) => this.log("error", "Failed to load persistentence", error));

            process.on("exit", () => {
                // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
                this.database.save().catch((error) => this.log("error", "Failed to save persistentence", error));
            });

            this.log("info", 'Loaded the persistent "database"');
        }

        for (const table of Tables) {
            this.database.createTable(table.name, table.columns);

            this.log("info", `Created table "${table.name}" with columns: ${table.columns.map((column) => column.name).join(", ")}`);
        }
    }

    protected log(type: logTypes, ...message: string[]) {
        this.emit("log", type, ...message); // we also emit the log event

        if (!this.shouldLog) return;

        const logColor = logColors[type];

        console.log(chalk.hex(logColor)(`[${type.toUpperCase()}]`), chalk.hex(logColors.date)(`[${new Date().toLocaleString()}]`), ...message);
    }
}

export default DDANWM;

export { DDANWM }