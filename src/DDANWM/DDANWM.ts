import type { DDANWMOptions } from "../Types/Misc/DDANWM.type";
import Database from "../Utils/Database";
import { Tables, type TableColumns } from "../constants/Tables.js";
import Bots from "./Helpers/Bots.helper.js";

class DDANWM {
    protected readonly options: DDANWMOptions;

    public readonly database: Database<TableColumns>;

    public bots: Bots = new Bots(this);

    public constructor(options: DDANWMOptions) {
        this.options = options;

        this.database = new Database(this.options.advanced?.database ?? {
            persistent: false
        });

        if (this.options.advanced?.database?.persistent) {
            // eslint-disable-next-line promise/prefer-await-to-then
            this.database.load().catch(console.error);
        }

        for (const table of Tables) {
            this.database.createTable(table.name, table.columns);
        }
    }
}

export default DDANWM;

export { DDANWM }