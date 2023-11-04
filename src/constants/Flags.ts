export const UserFlags = {
    /**
     * Discord Employee
     */
    Staff: 1,
    /**
     * Partnered Server Owner
     */
    Partner: 2,
    /**
     * HypeSquad Events Member
     */
    Hypesquad: 4,
    /**
     * Bug Hunter Level 1
     */
    BugHunterLevel1: 8,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    MFASMS: 16,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    PremiumPromoDismissed: 32,
    /**
     * House Bravery Member
     */
    HypeSquadOnlineHouse1: 64,
    /**
     * House Brilliance Member
     */
    HypeSquadOnlineHouse2: 128,
    /**
     * House Balance Member
     */
    HypeSquadOnlineHouse3: 256,
    /**
     * Early Nitro Supporter
     */
    PremiumEarlySupporter: 512,
    /**
     * User is a [team](https://discord.com/developers/docs/topics/teams)
     */
    TeamPseudoUser: 1_024,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    HasUnreadUrgentMessages: 8_192,
    /**
     * Bug Hunter Level 2
     */
    BugHunterLevel2: 16_384,
    /**
     * Verified Bot
     */
    VerifiedBot: 65_536,
    /**
     * Early Verified Bot Developer
     */
    VerifiedDeveloper: 131_072,
    /**
     * Moderator Programs Alumni
     */
    CertifiedModerator: 262_144,
    /**
     * Bot uses only [HTTP interactions](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction) and is shown in the online member list
     */
    BotHTTPInteractions: 524_288,
    /**
     * User has been identified as spammer
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    Spammer: 1_048_576,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    DisablePremium: 2_097_152,
    /**
     * User is an [Active Developer](https://support-dev.discord.com/hc/articles/10113997751447)
     */
    ActiveDeveloper: 4_194_304,
    /**
     * User's account has been [quarantined](https://support.discord.com/hc/articles/6461420677527) based on recent activity
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     * @privateRemarks
     *
     * This value would be 1 << 44, but bit shifting above 1 << 30 requires bigints
     */
    Quarantined: 17_592_186_044_416,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     * @privateRemarks
     *
     * This value would be 1 << 50, but bit shifting above 1 << 30 requires bigints
     */
    Collaborator: 1_125_899_906_842_624,
    /**
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     * @privateRemarks
     *
     * This value would be 1 << 51, but bit shifting above 1 << 30 requires bigints
     */
    RestrictedCollaborator: 2_251_799_813_685_248
};

