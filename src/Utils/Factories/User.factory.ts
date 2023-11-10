import { faker } from "@faker-js/faker";
import { UserFlags } from "../../Constants/Flags.js";
import { avatarAndBannerHash } from "../Hashes.js";
import { generateBetween } from "../Snowflake.js";

/**
 * The flags users can have with a attached weight
 * 1 = 100% chance
 * 0.1 = 10% chance
 *
 * Overall this is a bit of a mess, but for now it works. Tuning the weights will soon be possible later down the line
 */
export const Flags = {
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
} satisfies Record<string, { value: number, weight: number }>;

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

/**
 * Generates a bare minimum user, we include a email due to oauth2 scopes but for the most part you'll never see / be able to accses it
 *
 * @param avatar If the user should have an avatar
 * @param avatarDecoration If the user should have an avatar decoration
 * @param banner If the user should have a banner
 * @returns
 */
export const generateUser = (avatar?: boolean, avatarDecoration?: boolean, banner?: boolean) => {

    // 93% chance of not having a discriminator:
    // reason: Based off the members of discord api, out of 55k members 50k of them don't have a discriminator and instead use the new username system
    // for that reason thats the % chance we are going based off this, this may be tweakable in the future
    const discriminator = faker.number.float({ min: 0, max: 1 }) > 0.93 ? faker.number.int({ min: 1, max: 9_999 }).toString().padStart(4, "0") : null;

    // now if the discriminator is null, we go based off these rules for the username:
    // Permitted characters for new usernames: Latin characters (a-z), Numbers (0-9), Certain special characters (_ and .)
    const username = discriminator ? faker.internet.userName() : faker.internet.userName().replaceAll(/[^\w.]/g, "").toLowerCase();

    return {
        username,
        id: generateBetween(1_441_765_848_298, Date.now()),
        avatar: avatar ? avatarAndBannerHash() : faker.number.float({ min: 0, max: 1 }) > 0.33 ? avatarAndBannerHash() : null,
        globalName: faker.number.float({ min: 0, max: 1 }) > 0.88 ? faker.internet.displayName() : null,
        avatarDecoration: avatarDecoration ? avatarAndBannerHash() : faker.number.float({ min: 0, max: 1 }) > 0.88 ? avatarAndBannerHash() : null,
        discriminator: discriminator ?? "0000",
        flags: generateFlags(),
        email: faker.internet.email(),
        locale: faker.location.countryCode(), // darkerink: for now just using this, not sure what else to use if there even is something else to use
        accentColor: faker.number.int({ min: 0, max: 0xFFFFFF }),
        banner: banner ? avatarAndBannerHash() : faker.number.float({ min: 0, max: 1 }) > 0.88 ? avatarAndBannerHash() : null,
        // 96% chance of being verified, defo on the lowend since I bet most people got their email verified
        verified: faker.number.float({ min: 0, max: 1 }) < 0.96,
        // random percent chance I choose, feel free to pr a new one (or make it dynamic)
        mfaEnabled: faker.number.float({ min: 0, max: 1 }) < 0.54,
        // obviously not a system user, needs to be messed with on its own
        system: false,
    }
}