import type DDANWM from "../DDANWM/DDANWM";
import type { GeneralBotOptions, OAuth2Options } from "../Types/Misc/Helpers/Bots.type.js";
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

    public oauth2: Partial<OAuth2Options> = {};

    public general: Partial<GeneralBotOptions> = {};

    public tokens: string[];

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

        this.tokens = options?.token ? [options.token] : [generateToken(this.id)];

        this.general = options?.general ?? {
            bio: null,
            interactionUrl: null,
            linkedRolesUrl: null,
            privacyPolicyUrl: null,
            tosUrl: null,
        };

        this.oauth2 = options?.oauth2 ?? {
            redirectUris: [],
            clientId: this.id,
            clientSecret: generateToken(this.id), // darkerink: for now just default to a newly generated token, later though we will generate real client secrets which match discord's
        };

        this.ddanwm.bots.create(this);
    }
}

export default Bot;

export { Bot };