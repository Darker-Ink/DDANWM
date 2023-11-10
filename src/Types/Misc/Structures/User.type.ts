import { UserFlags, type APIUser } from "discord-api-types/v10";

export interface BaseUserOptions {
    avatar: string | null;
    avatarDecoration: string | null;
    discriminator: string;
    flags: UserFlags;
    globalName: string | null;
    id: string;
    username: string;
}

export type UserCreateOptions = Partial<BaseUserOptions> & {
    accentColor?: number;
    banner?: string;
    email?: string;
    locale?: string;
    mfaEnabled?: boolean;
    system?: boolean;
    verified?: boolean;
};

export { type APIUser, UserFlags }