import { UserFlagsBitField } from "discord-bitflag";
import type DDANWM from "../DDANWM/DDANWM";
import type { UserCreateOptions } from "../Types/Misc/Structures/User.type.js";
import { generateUser } from "../Utils/Factories/User.factory.js";

class User {
    public avatar: string | null;

    public avatarDecoration: string | null;

    public discriminator: string;

    public flags: UserFlagsBitField;

    public globalName: string | null;

    public id: string;

    public username: string;

    protected readonly ddanwm: DDANWM;

    public locale: string;

    public email: string;

    public verified: boolean;

    public mfaEnabled: boolean;

    public system: boolean;

    public banner: string | null;

    public accentColor: number;

    public constructor(ddanwm: DDANWM, options?: UserCreateOptions) {
        this.ddanwm = ddanwm;

        const defaultUser = generateUser();

        this.avatar = options?.avatar ?? defaultUser.avatar;

        this.avatarDecoration = options?.avatarDecoration ?? defaultUser.avatarDecoration;

        this.discriminator = options?.discriminator ?? defaultUser.discriminator;

        this.flags = new UserFlagsBitField(options?.flags ?? defaultUser.flags);

        this.globalName = options?.globalName ?? defaultUser.globalName;

        this.id = options?.id ?? defaultUser.id;

        this.username = options?.username ?? defaultUser.username;

        this.locale = options?.locale ?? defaultUser.locale;

        this.email = options?.email ?? defaultUser.email;

        this.verified = options?.verified ?? defaultUser.verified;

        this.mfaEnabled = options?.mfaEnabled ?? defaultUser.mfaEnabled;

        this.system = options?.system ?? defaultUser.system;

        this.banner = options?.banner ?? defaultUser.banner;

        this.accentColor = options?.accentColor ?? defaultUser.accentColor;
    }
}

export default User;

export { User };