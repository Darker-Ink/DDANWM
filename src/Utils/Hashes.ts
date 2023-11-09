import crypto from "node:crypto";

/**
 * Generates a random user avatar hash.
 *
 * An example one is `04eee2cad7966084f83137ea06a304f3`
 *
 * @since 1.0.0
 */
export const avatarAndBannerHash = () => {
    return crypto.randomBytes(16).toString("hex");
};

/**
 * Session id's are for the WS, I just generate a random 16 byte hex string. I'm not sure if there is a pattern to them.
 */
export const sessionId = () => {
    return crypto.randomBytes(16).toString("hex");
}

/**
 * Generates a random client secret for oauth.
 *
 * Here are two examples `ACkjeCyZ2qacaF-MlkCRFyJn8CIO_Ety` & `K95gKdfCA3O0RGNzWfgkgn27JtN2vDtj`
 *
 * There doesn't seem to be a pattern to them, so I just generate a 16 byte hex string and return it.
 */
export const clientSecret = () => {
    return crypto.randomBytes(16).toString("hex");
}