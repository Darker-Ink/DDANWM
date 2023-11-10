import { faker } from "@faker-js/faker";
import { UserFlags } from "../../Constants/Flags.js";
import { ApplicationFlags } from "../../Types/Misc/Structures/Bot.type.js";
import { avatarAndBannerHash } from "../Hashes.js";
import { generateBetween } from "../Snowflake.js";

/**
 * The flags bots (/applications) can have.
 */
export const BotFlagsAllowed = [
    ApplicationFlags.ApplicationAutoModerationRuleCreateBadge,
    ApplicationFlags.ApplicationCommandBadge,
    ApplicationFlags.GatewayGuildMembers,
    ApplicationFlags.GatewayMessageContent,
    ApplicationFlags.GatewayPresence
];

/**
 * The public flags bots can have (mainly the verified bot one is important)
 */
export const BotUserFlagsAllowed = [
    UserFlags.BotHTTPInteractions,
    UserFlags.VerifiedBot
]

/**
 * Generates a random list of flags for a bot
 *
 * @param botFlags If the flags should be BotUserFlagsAllowed or BotFlagsAllowed
 * @param nonBot If we should include non bot flags (think the Staff badge etc)
 * @param botVerified If the bot is verified and we should force the verified bot flag
 * @returns The flags
 */
export const randomFlags = (botFlags: boolean = false, nonBot: boolean = false, botVerified: boolean = false): number => {
    let finalFlags = 0;

    for (const flag of botFlags ? BotUserFlagsAllowed : BotFlagsAllowed) {
        const float = faker.number.float({ min: 0, max: 0.5 });
        const floatTwo = faker.number.float({ min: 0, max: 1 });

        if (float > floatTwo || flag === UserFlags.VerifiedBot && botVerified) {
            finalFlags |= flag;
        }
    }

    if (nonBot) {
        for (const [,value] of Object.entries(UserFlags)) {
            const float = faker.number.float({ min: 0, max: 0.5 });
            const floatTwo = faker.number.float({ min: 0, max: 1 });

            if (float > floatTwo) {
                finalFlags |= value;
            }
        }
    }

    return finalFlags;
}

/**
 * Just a simple function for generating the bare minimum of a bot
 *
 * @param avatar If the bot should have an avatar
 * @returns
 */
export const generateBot = (avatar?: boolean): {
    applicationFlags: number;
    avatar: string | null;
    avatar_decoration: string | null;
    bio: string | null;
    bot: true;
    discriminator: string;
    global_name: string | null;
    id: string;
    userFlags: number;
    username: string;
} => {
    return {
        bot: true,
        username: faker.internet.userName(),
        id: generateBetween(1_441_765_848_298, Date.now()),
        // 33% chance of not having an avatar:
        avatar: avatar ? avatarAndBannerHash() : faker.number.float({ min: 0, max: 1 }) > 0.33 ? avatarAndBannerHash() : null,
        global_name: null,
        avatar_decoration: null,
        bio: faker.number.float({ min: 0, max: 1 }) > 0.33 ? faker.person.bio() : null,
        discriminator: faker.number.int({ min: 1, max: 9_999 }).toString().padStart(4, "0"),
        applicationFlags: randomFlags(),
        userFlags: randomFlags(true),
    }
}