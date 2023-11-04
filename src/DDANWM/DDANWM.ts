import type { DDANWMOptions } from "../Types/Misc/DDANWM.type";
import Database from "../Utils/Database";

class DDANWM {
    private readonly options: DDANWMOptions;

    private readonly database: Database;

    public constructor(options: DDANWMOptions) {
        this.options = options;

        this.database = new Database(this.options.advanced?.database ?? {
            persistent: false
        });
    }
}

export default DDANWM;

export { DDANWM }