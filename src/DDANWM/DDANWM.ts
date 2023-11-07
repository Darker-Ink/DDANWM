import EventEmitter from "node:events";
import chalk from "chalk";
import API from "../API/API.js";
import { logColors, type DDANWMOptions, type logTypes } from "../Types/Misc/DDANWM.type.js";
import Database from "../Utils/Database.js";
import WS from "../WebSocket/Ws.js";
import { Tables, type TableColumns } from "../constants/Tables.js";
import Bots from "./Helpers/Bots.helper.js";

interface DDANWM {
    emit(event: "log", type: logTypes, ...message: string[]): boolean;
    on(event: "log", listener: (type: logTypes, ...message: string[]) => void): this;
}

class DDANWM extends EventEmitter {
    public readonly options: DDANWMOptions;

    public readonly database: Database<TableColumns>;

    public readonly api: API;

    public readonly ws: WS;

    public bots: Bots = new Bots(this);

    protected shouldLog: boolean = true;

    public constructor(options: DDANWMOptions) {
        super();

        this.options = options;

        this.shouldLog = !this.options.silent;

        this.database = new Database(this.options.advanced?.database ?? {
            persistent: false
        });

        this.api = new API(this);

        this.ws = new WS(this);

        if (this.options.advanced?.database?.persistent) {
            // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
            this.database.load().catch((error) => this.log("error", "Failed to load persistentence", error));

            this.log("info", 'Loaded the persistent "database"');
        }

        for (const table of Tables) {
            this.database.createTable(table.name, table.columns);

            this.log("info", `Created table "${table.name}" with columns: ${table.columns.map((column) => column.name).join(", ")}`);
        }
    }

    public log(type: logTypes, ...message: string[]) {
        this.emit("log", type, ...message); // we also emit the log event

        if (!this.shouldLog) return;

        const logColor = logColors[type];
        const longestLogType = Object.keys(logColors).reduce((a, b) => a.length > b.length ? a : b);
        const fixedType = `[${type.toUpperCase()}]${" ".repeat(longestLogType.length - type.length)}`

        console.log(chalk.hex(logColor)(fixedType), chalk.hex(logColors.date)(`[${new Date().toLocaleString()}]`), ...message);
    }

    public async start() {
        this.log("info", "Started the API");
        this.log("info", "Started the WS");

        await this.api.start();
        await this.ws.start();

        return true;
    }
}

export default DDANWM;

export { DDANWM }