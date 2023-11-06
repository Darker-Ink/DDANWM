import { ApplicationFlags, UserFlags, type APIUser } from "discord-api-types/v10";
import type { GeneralBotOptions, OAuth2Options } from "../Helpers/Bots.type.js";

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

export type BotCreateOptions = Partial<BaseOptions> & {
    accent_color?: never;
    banner?: never;
    bot: true;
    email?: never;
    general?: Partial<GeneralBotOptions> | undefined;
    locale?: never;
    mfa_enabled?: never;
    oauth2?: Partial<OAuth2Options> | undefined;
    system?: never;
    token?: string | undefined;// ????
    verified?: never;
};

export { ApplicationFlags, type APIUser, UserFlags }