import type DDANWM from "../DDANWM/DDANWM";
import type { BotCreateOptions } from "../Types/Misc/Structures/Bot.type";
import { generateBot } from "../Utils/Factories/Bot.factory.js";
import { generateToken } from "../Utils/Token.js";

class Bot {
    public avatar: string | null;

    public avatarDecoration: string | null;

    public discriminator: string;

    public flags: number;

    public globalName: string | null;

    public id: string;

    public username: string;

    protected token: string;

    protected readonly ddanwm: DDANWM;

    public constructor(ddanwm: DDANWM, options?: BotCreateOptions) {

        const defaultBot = generateBot();

        this.ddanwm = ddanwm;

        this.avatar = options?.avatar ?? defaultBot.avatar;

        this.avatarDecoration = options?.avatar_decoration ?? defaultBot.avatar_decoration;

        this.discriminator = options?.discriminator ?? defaultBot.discriminator;

        this.flags = options?.flags ?? defaultBot.flags;

        this.globalName = options?.global_name ?? defaultBot.global_name;

        this.id = options?.id ?? defaultBot.id;

        this.username = options?.username ?? defaultBot.username;

        this.token = generateToken(this.id);

        // this.ddanwm.bots.set(this.id, this);
    }
}

export default Bot;

export { Bot };