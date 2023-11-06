import crypto from "node:crypto";

/**
 * Generates a random user avatar hash.
 *
 * An example one is `04eee2cad7966084f83137ea06a304f3`
 *
 * @since 1.0.0
 */
export const avatarHash = () => {
    return crypto.randomBytes(16).toString("hex");
};

/**
 * Generates a random banner hash.
 *
 * An example one is `edf8a0dd2c16c7708d88c26143e0cba1`
 *
 * @since 1.0.0
 */
export const bannerHash = () => {
    return crypto.randomBytes(16).toString("hex");
};