export interface BotFlags {
    guildMembersGateway: boolean;
    /**
     * @description If the bot should have the auto moderation rule create badge
     */
    hasAutoMod: boolean;
    /**
     * @description If the bot has the slash commands badge
     */
    hasSlashCommands: boolean;
    /**
     * @deprecated You should instead add an interaction URL to your create bot options
     * @description If the bot is HTTP interaction based and doesn't connect to the gateway (for presence stuff)
     */
    interactionBased: boolean;
    messageContentGateway: boolean;
    presenceGateway: boolean;
    verified: boolean;
}

export interface OAuth2Options {
    clientId: string;
    clientSecret: string;
    redirectUris: string[];
}

export interface GeneralBotOptions {
    /**
     * @description The bots bio, not important but in case at some point if discord lets us see it / edit it
     */
    bio: string | null;
    /**
     * @description The url interactions will be sent to
     */
    interactionUrl: string | null;
    /**
     * @description The url linked role stuff will be sent to
     */
    linkedRolesUrl: string | null;
    privacyPolicyUrl: string | null;
    tosUrl: string | null;
}

export interface CreateBotOptions {
    /**
     * @default null
     * @description If the bot has an avatar, if so we'll generate a random hash
     */
    avatar: boolean;
    /**
     * @default string
     * @description If this is null, then we'll assume the bot is using the new username system which will force the username to follow discords username rules else we'll generate a random discriminator
     */
    discriminator: string | null;
    flags: Partial<BotFlags>;
    general?: Partial<GeneralBotOptions>;
    oauth2?: Partial<OAuth2Options>;
    owner: never;
    /**
     * @descript The token to use for the bot, if this is null we'll generate a random token
     */
    token?: string;
    username: string;
}