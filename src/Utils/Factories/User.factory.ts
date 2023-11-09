import { faker } from "@faker-js/faker";
import { UserFlags } from "../../Constants/Flags.js";
import { avatarAndBannerHash } from "../Hashes.js";
import { generateBetween } from "../Snowflake.js";

export const Flags: Record<string, { value: number, weight: number }> = {
    Staff: {
        value: UserFlags.Staff,
        weight: 0.000_1 // 0.001% chance, 1 = 100% chance
    },
    Partner: {
        value: UserFlags.Partner,
        weight: 0.01 // 1% chance
    },
    Hypesquad: {
        value: UserFlags.Hypesquad,
        weight: 0.05 // 5% chance
    },
    BugHunterLevel1: {
        value: UserFlags.BugHunterLevel1,
        weight: 0.05 // 5% chance
    },
    HypeSquadOnlineHouse1: {
        value: UserFlags.HypeSquadOnlineHouse1,
        weight: 0.6 // 60% chance
    },
    HypeSquadOnlineHouse2: {
        value: UserFlags.HypeSquadOnlineHouse2,
        weight: 0.6 // 60% chance
    },
    HypeSquadOnlineHouse3: {
        value: UserFlags.HypeSquadOnlineHouse3,
        weight: 0.4 // 40% chance
    },
    PremiumEarlySupporter: {
        value: UserFlags.PremiumEarlySupporter,
        weight: 0.15 // 15% chance
    },
    BugHunterLevel2: {
        value: UserFlags.BugHunterLevel2,
        weight: 0.02 // 2% chance
    },
    VerifiedDeveloper: {
        value: UserFlags.VerifiedDeveloper,
        weight: 0.15 // 15% chance
    },
    CertifiedModerator: {
        value: UserFlags.CertifiedModerator,
        weight: 0.25 // 25% chance
    },
    ActiveDeveloper: {
        value: UserFlags.ActiveDeveloper,
        weight: 0.6 // 60% chance
    }
};

export const generateFlags = (): number => {
    let flags = 0;

    for (const [, value] of Object.entries(Flags)) {
        const float = faker.number.float({ min: 0, max: 1 });

        // if it already has a house flag, don't add another one (since you can only really have one)
        if (value.value === UserFlags.HypeSquadOnlineHouse1 && (flags & UserFlags.HypeSquadOnlineHouse1)) continue;
        if (value.value === UserFlags.HypeSquadOnlineHouse2 && (flags & UserFlags.HypeSquadOnlineHouse2)) continue;
        if (value.value === UserFlags.HypeSquadOnlineHouse3 && (flags & UserFlags.HypeSquadOnlineHouse3)) continue;

        if (float < value.weight) {
            flags |= value.value;
        }
    }

    return flags;
}

export const generateUser = (avatar?: boolean) => {

    // 93% chance of not having a discriminator:
    // reason: Based off the members of discord api, out of 55k members 50k of them don't have a discriminator and instead use the new username system
    // for that reason thats the % chance we are going based off this, this may be tweakable in the future
    const discriminator = faker.number.float({ min: 0, max: 1 }) > 0.93 ? faker.number.int({ min: 1, max: 9_999 }).toString().padStart(4, "0") : null;

    // now if the discriminator is null, we go based off these rules for the username:
    // Permitted characters for new usernames: Latin characters (a-z), Numbers (0-9), Certain special characters (_ and .)
    const username = discriminator ? faker.internet.userName() : faker.internet.userName().replaceAll(/[^\w.]/g, "");

    return {
        username,
        id: generateBetween(1_441_765_848_298, Date.now()),
        avatar: avatar ? avatarAndBannerHash() : faker.number.float({ min: 0, max: 1 }) > 0.33 ? avatarAndBannerHash() : null,
        global_name: faker.number.float({ min: 0, max: 1 }) > 0.88 ? faker.internet.displayName() : null,
        avatar_decoration: faker.number.float({ min: 0, max: 1 }) > 0.88 ? avatarAndBannerHash() : null,
        discriminator: discriminator ?? "0000",
        flags: generateFlags()
    }
}