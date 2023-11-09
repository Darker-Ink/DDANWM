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

    public constructor(ddanwm: DDANWM, options?: UserCreateOptions) {
        this.ddanwm = ddanwm;

        const defaultUser = generateUser();

        this.avatar = options?.avatar ?? defaultUser.avatar;

        this.avatarDecoration = options?.avatar_decoration ?? defaultUser.avatar_decoration;

        this.discriminator = options?.discriminator ?? defaultUser.discriminator;

        this.flags = new UserFlagsBitField(options?.flags ?? defaultUser.flags);

        this.globalName = options?.global_name ?? defaultUser.global_name;

        this.id = options?.id ?? defaultUser.id;

        this.username = options?.username ?? defaultUser.username;
    }
}

export default User;

export { User };