import type Bot from "../../Structures/Bot.js";
import type { CreateBotOptions } from "../../Types/Misc/Helpers/Bots.type.js";
import type DDANWM from "../DDANWM.js";

class Bots {
    protected readonly ddanwm: DDANWM;

    protected readonly bots: Map<string, Bot>;

    public constructor(
        ddanwm: DDANWM,
    ) {
        this.ddanwm = ddanwm;

        this.bots = new Map();
    }

    public async create(options?: Partial<CreateBotOptions>) {

    }
}

export default Bots;

export { Bots };