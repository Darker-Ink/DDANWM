export interface UserFlags<T = boolean> {
    activeDeveloper: T;
	bugHunterLevelOne: T;
	bugHunterLevelTwo: T;
	certifiedModerator: T;
	earlyNitroSupporter: T;
	houseBalance: T;
	houseBravery: T;
	houseBrilliance: T;
	hypeSquad: T;
	partner: T;
	staff: T;
	/**
	 * @description If the user is a system user
	 * @deprecated You should not use this, its for internal use only
	 */
    system: T;
    verifiedDeveloper: T;
}

export interface CreateUserOptions {
    /**
     * @description If the user has an avatar, if so we'll generate a random hash
     */
    avatar: boolean;
    /**
     * @description If the user has a avatar decoration, if so we'll generate a random hash
     */
    avatarDecoration: boolean;
    /**
     * @description If the user has a banner, if so we'll generate a random hash
     */
    banner: boolean;
    /**
     * @description If this is null, then we'll assume the user is using the new username system which will force the username to follow discords username rules else we'll generate a random discriminator
     */
    discriminator: string | null;
    email: string;
    flags: Partial<UserFlags>;
    locale: string | "en-GB" | "en-US";
    mfaEnabled: boolean;
    username: string;
}