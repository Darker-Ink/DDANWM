import type Bot from "../Structures/Bot.js";

export const HttpPayloads = {
    fetchSelf: (bot: Bot, withToken: boolean = false) => ({
        id: bot.id,
        username: bot.username,
        avatar: bot.avatar,
        discriminator: bot.discriminator,
        public_flags: 0,
        premium_type: 0,
        flags: 0,
        bot: true,
        banner: null,
        accent_color: null,
        global_name: bot.globalName,
        avatar_decoration_data: null,
        banner_color: null,
        mfa_enabled: true,
        locale: "en-US",
        email: null,
        verified: true,
        ...(withToken ? { token: bot.tokens[0] } : {}),
        bio: bot.general.bio ?? ""
    })
};