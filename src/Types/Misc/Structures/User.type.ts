import { UserFlags, type APIUser } from "discord-api-types/v10";

export interface BaseUserOptions {
    avatar: string | null;
    avatar_decoration: string | null;
    discriminator: string;
    flags: UserFlags;
    global_name: string | null;
    id: string;
    username: string;
}

export type UserCreateOptions = Partial<BaseUserOptions> & {
    accent_color?: never;
    banner?: never;
    bot: true;
    email?: never;
    locale?: never;
    mfa_enabled?: never;
    system?: never;
    verified?: never;
};

export { type APIUser, UserFlags }