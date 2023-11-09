import { faker } from "@faker-js/faker";
import { UserFlags } from "../../Constants/Flags.js";
import { ApplicationFlags } from "../../Types/Misc/Structures/Bot.type.js";
import { avatarAndBannerHash } from "../Hashes.js";
import { generateBetween } from "../Snowflake.js";

export const BotFlagsAllowed = [
    ApplicationFlags.ApplicationAutoModerationRuleCreateBadge,
    ApplicationFlags.ApplicationCommandBadge,
    ApplicationFlags.GatewayGuildMembers,
    ApplicationFlags.GatewayMessageContent,
    ApplicationFlags.GatewayPresence
];

export const BotUserFlagsAllowed = [
    UserFlags.BotHTTPInteractions,
    UserFlags.VerifiedBot
]

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