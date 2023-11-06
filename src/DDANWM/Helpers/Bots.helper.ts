import Bot from "../../Structures/Bot.js";
import type { CreateBotOptions } from "../../Types/Misc/Helpers/Bots.type.js";
import { generateBot } from "../../Utils/Factories/Bot.factory.js";
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

    public create(options?: Bot | Partial<CreateBotOptions>) {
        if (options instanceof Bot) {
            this.bots.set(options.id, options);

            return options;
        } else {
            const defaultBot = generateBot(options?.avatar);

            const bot = new Bot(this.ddanwm, {
                bot: true,
                avatar: defaultBot.avatar,
                discriminator: options?.discriminator ?? defaultBot.discriminator,
                username: options?.username ?? defaultBot.username,
                token: options?.token,
                general: options?.general,
                oauth2: options?.oauth2
            });

            this.bots.set(bot.id, bot);

            this.ddanwm.database.create("bots", [
                BigInt(bot.id),
                bot.username,
                bot.discriminator,
                bot.globalName,
                bot.avatar,
                bot.avatarDecoration,
                bot.flags,
                [bot.token],
                bot.general.bio,
                bot.general.interactionUrl,
                bot.general.linkedRolesUrl,
                bot.general.privacyPolicyUrl,
                bot.general.tosUrl,
                bot.oauth2.redirectUris,
                bot.oauth2.clientSecret
            ])

            return bot;
        }
    }

    public delete(id: string) {
        this.bots.delete(id);

        this.ddanwm.database.delete("bots", id);

        return this;
    }
}

export default Bots;

export { Bots };