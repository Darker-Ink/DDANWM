import EventEmitter from "node:events";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import API from "../API/API.js";
import RouteBuilder from "../API/Route.js";
import { logColors } from "../Types/Misc/DDANWM.type.js";
import type { DDANWMFile, DDANWMOptions, logTypes } from "../Types/Misc/DDANWM.type.js";
import Database from "../Utils/Database.js";
import Event from "../WebSocket/Event.js";
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

            if (this.options.debug?.ddanwm?.logs) this.log("info", `Created table "${table.name}" with columns: ${table.columns.map((column) => column.name).join(", ")}`);
        }
    }

    public log(type: logTypes, ...message: string[]) {
        this.emit("log", type, ...message); // we also emit the log event

        if (!this.shouldLog) return;

        const logColor = logColors[type];
        const longestLogType = Object.keys(logColors).reduce((a, b) => a.length > b.length ? a : b);
        const fixedType = `[${type.toUpperCase()}]${" ".repeat(longestLogType.length - type.length)}`;

        console.log(chalk.hex(logColor)(fixedType), chalk.hex(logColors.date)(`[${new Date().toLocaleString()}]`), ...message);
    }

    public async start() {
        this.log("info", "Started the API");
        this.log("info", "Started the WS");

        await this.api.start();
        await this.ws.start();

        return true;
    }

    private async walkDirectory(dir: string): Promise<string[]> {
        const Routes = await readdir(dir, { withFileTypes: true });

        const Files: string[] = [];

        for (const Route of Routes) {
            if (Route.isDirectory()) {
                const SubFiles = await this.walkDirectory(join(dir, Route.name));
                Files.push(...SubFiles);
            } else {
                Files.push(join(dir, Route.name));
            }
        }

        return Files;
    }

    /**
     * @private
     * @unstable
     * @description Loads all files in a directory (This is a private method, so you shouldn't use it)
     */
    public async loadFiles(directory: string): Promise<DDANWMFile[]> {
        const Files = await this.walkDirectory(directory);

        const finishedArray: {
            default: Event | RouteBuilder;
            directory: string;
            path?: string;
            route?: RouteBuilder["routes"][number];
            type: "route" | "wsEvent";
            version: string;
            versionlessRoute?: string;
        }[] = [];

        for (const File of Files) {
            if (File.endsWith(".map") || File.endsWith(".d.ts")) {
                continue;
            }

            // ts part is since I test with bun and don't want to recompile each time
            if (!File.endsWith(".js") && !File.endsWith(".ts")) {
                this.log("debug", `Skipping ${File} as it is not a ts/js file`);

                continue;
            }

            const RouteClass = await import(this.convertWindowsPath(File));

            if (!RouteClass.default) {
                this.log("warn", `Skipping ${File} as it does not have a default export`);

                continue;
            }

            const version = /v\d+/g.exec(File)?.[0];

            if (!version) {
                throw new Error(`Failed to get version from ${File}`);
            }

            const FileInstance = new RouteClass.default(this);

            if (FileInstance instanceof RouteBuilder) {
                for (const route of FileInstance.routes) {
                    const fixedRoute = (this.convertWindowsPath(File).split(directory)[1]?.split("/").slice(0, -1).join("/") ?? "") + route.path;

                    finishedArray.push({
                        default: FileInstance,
                        directory: this.convertWindowsPath(File),
                        path: "/api" + fixedRoute.replaceAll(/\[([^\]]+)]/g, ":$1"),  // eslint-disable-line prefer-named-capture-group
                        route,
                        version,
                        versionlessRoute: fixedRoute.replaceAll(`/${version}`, ""),
                        type: "route"
                    });
                }
            } else if (FileInstance instanceof Event) {
                finishedArray.push({
                    default: FileInstance,
                    directory: this.convertWindowsPath(File),
                    version,
                    type: "wsEvent"
                });
            }

        }

        return finishedArray as DDANWMFile[];
    }

    /**
     * @private
     * @unstable
     * @description Converts a windows path to a unix path (This is a private method, so you shouldn't use it)
     */
    public convertWindowsPath(path: string) {
        return path.replace(/^[A-Za-z]:/, "").replaceAll("\\", "/");
    }
}

export default DDANWM;

export { DDANWM };