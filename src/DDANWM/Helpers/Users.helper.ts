import { UserFlags as Flags } from "discord-api-types/v10";
import User from "../../Structures/User.js";
import type { CreateUserOptions, UserFlags } from "../../Types/Misc/Helpers/User.type.js";
import { generateUser } from "../../Utils/Factories/User.factory.js";
import type DDANWM from "../DDANWM.js";

class Users {
    protected readonly ddanwm: DDANWM;

    protected readonly Users: Map<string, User>;

    protected readonly flagsMap: UserFlags<number> = {
        activeDeveloper: Flags.ActiveDeveloper,
        bugHunterLevelOne: Flags.BugHunterLevel1,
        bugHunterLevelTwo: Flags.BugHunterLevel2,
        certifiedModerator: Flags.CertifiedModerator,
        earlyNitroSupporter: Flags.PremiumEarlySupporter,
        houseBalance: Flags.HypeSquadOnlineHouse3,
        houseBravery: Flags.HypeSquadOnlineHouse1,
        houseBrilliance: Flags.HypeSquadOnlineHouse2,
        hypeSquad: Flags.Hypesquad,
        partner: Flags.Partner,
        staff: Flags.Staff,
        verifiedDeveloper: Flags.VerifiedDeveloper,
        system: -0,
    }

    public constructor(
        ddanwm: DDANWM,
    ) {
        this.ddanwm = ddanwm;

        this.Users = new Map();
    }

    public create(options?: Partial<CreateUserOptions> | User) {
        if (options instanceof User) {
            this.Users.set(options.id, options);

            return options;
        } else {
            const defaultUser = generateUser(options?.avatar, options?.avatarDecoration, options?.banner);

            let fixedFlags = 0;

            for (const [key, value] of Object.entries(options?.flags ?? {})) {

                if (key === "system") {
                    defaultUser.system = true;

                    continue;
                }

                if (value) {
                    fixedFlags |= this.flagsMap[key as keyof UserFlags];
                } else {
                    fixedFlags &= ~this.flagsMap[key as keyof UserFlags];
                }
            }

            const CreatedUser = new User(this.ddanwm, {
                avatar: defaultUser.avatar,
                discriminator: options?.discriminator ?? defaultUser.discriminator,
                username: options?.username ?? defaultUser.username,
                flags: fixedFlags,
                email: options?.email ?? defaultUser.email,
                locale: options?.locale ?? defaultUser.locale,
                avatarDecoration: defaultUser.avatarDecoration,
                accentColor: defaultUser.accentColor,
                system: defaultUser.system,
            });

            this.Users.set(CreatedUser.id, CreatedUser);

            this.ddanwm.database.create("users", [
                BigInt(CreatedUser.id),
                CreatedUser.username,
                CreatedUser.discriminator,
                CreatedUser.avatar,
                CreatedUser.avatarDecoration,
                CreatedUser.flags.toJSON(),
                CreatedUser.locale,
                CreatedUser.email,
                CreatedUser.verified,
                CreatedUser.mfaEnabled,
                CreatedUser.system,
                CreatedUser.banner,
                CreatedUser.accentColor,
            ])

            return CreatedUser;
        }
    }

    public delete(id: string) {
        this.Users.delete(id);

        this.ddanwm.database.delete("users", id);

        return this;
    }
}

export default Users;

export { Users };