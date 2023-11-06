import { ApplicationFlags, UserFlags, type APIUser } from "discord-api-types/v10";

interface BaseOptions {
    avatar: string | null;
    avatar_decoration: string | null;
    discriminator: string;
    flags: ApplicationFlags | UserFlags;
    global_name: string | null;
    id: string;
    username: string;
}

interface BaseProfile {
    bio: string | null;
}

export type BotProfile = BaseProfile;

export type BotCreateOptions = Partial<BaseOptions> & Partial<BaseProfile> & {
    accent_color?: never;
    banner?: never;
    bot: true;
    email?: never;
    locale?: never;
    mfa_enabled?: never;
    system?: never;
    verified?: never;
};

export { ApplicationFlags, type APIUser, UserFlags }