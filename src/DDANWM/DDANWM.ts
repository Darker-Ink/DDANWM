import type { DDANWMOptions } from "../Types/Misc/DDANWM.type";
import Database from "../Utils/Database";
import Bots from "./Helpers/Bots.helper.js";

class DDANWM {
    private readonly options: DDANWMOptions;

    private readonly database: Database;

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
    }
}

export default DDANWM;

export { DDANWM }