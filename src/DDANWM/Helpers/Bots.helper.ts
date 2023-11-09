import { ApplicationFlags, UserFlags } from "discord-api-types/v10";
import Bot from "../../Structures/Bot.js";
import type { BotFlags, CreateBotOptions } from "../../Types/Misc/Helpers/Bots.type.js";
import { generateBot } from "../../Utils/Factories/Bot.factory.js";
import { parseToken } from "../../Utils/Token.js";
import type DDANWM from "../DDANWM.js";

class Bots {
    protected readonly ddanwm: DDANWM;

    protected readonly bots: Map<string, Bot>;

    protected readonly flagsMap: BotFlags<number> = {
        guildMembersGateway: ApplicationFlags.GatewayGuildMembers,
        hasAutoMod: ApplicationFlags.ApplicationAutoModerationRuleCreateBadge,
        hasSlashCommands: ApplicationFlags.ApplicationCommandBadge,
        messageContentGateway: ApplicationFlags.GatewayMessageContent,
        presenceGateway: ApplicationFlags.GatewayPresence,
        verified: UserFlags.VerifiedBot,
        interactionBased: UserFlags.BotHTTPInteractions,
    }

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

            const fixedFlags = {
                applicationFlags: defaultBot.applicationFlags,
                userFlags: defaultBot.userFlags
            };

            for (const [key, value] of Object.entries(options?.flags ?? {})) {
                if (key === "verified") {
                    if (value) {
                        fixedFlags.userFlags |= UserFlags.VerifiedBot;
                    } else {
                        fixedFlags.userFlags &= ~UserFlags.VerifiedBot;
                    }

                    continue;
                }

                if (value) {
                    fixedFlags.applicationFlags |= this.flagsMap[key as keyof BotFlags];
                } else {
                    fixedFlags.applicationFlags &= ~this.flagsMap[key as keyof BotFlags];
                }
            }

            const bot = new Bot(this.ddanwm, {
                bot: true,
                avatar: defaultBot.avatar,
                discriminator: options?.discriminator ?? defaultBot.discriminator,
                username: options?.username ?? defaultBot.username,
                token: options?.token,
                general: options?.general,
                oauth2: options?.oauth2,
                userFlags: fixedFlags.userFlags,
                applicationFlags: fixedFlags.applicationFlags,
            });

            this.bots.set(bot.id, bot);

            this.ddanwm.database.create("bots", [
                BigInt(bot.id),
                bot.username,
                bot.discriminator,
                bot.globalName,
                bot.avatar,
                bot.avatarDecoration,
                bot.applicationFlags.toJSON(),
                bot.userFlags.toJSON(),
                bot.tokens,
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

    /**
     * @description Checks if a token is valid and returns the bot if it is
     */
    public checkAuthenticity(token: string) {
        const parsedToken = parseToken(token);

        if (!parsedToken.date || !parsedToken.id || !parsedToken.hmac) {
            return {
                valid: false,
                bot: null
            }
        }

        const bot = this.bots.get(parsedToken.id);

        if (!bot) {
            return {
                valid: false,
                bot: null
            }
        }


        if (!bot.tokens.includes(token)) {
            return {
                valid: false,
                bot: null
            }
        }

        return {
            valid: true,
            bot
        }
    }
}

export default Bots;

export { Bots };