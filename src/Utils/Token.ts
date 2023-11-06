import { Buffer } from "node:buffer";
import crpyto from "node:crypto";

const initialEpoch = 1_293_840_000;

/**
 * Generates a token for a specific user and at a specific date
 *
 * We are going based off discords old(?) format
 *
 * Here's an example token: `MjM4NDk0NzU2NTIxMzc3Nzky.CunGFQ.wUILz7z6HoJzVeq6pyHPmVgQgV4`
 *
 * The first part `MjM4NDk0NzU2NTIxMzc3Nzky` is the user id in base64 format
 *
 * The second part `CunGFQ` is the creation date of the token in base64 format which then you add 1293840000 to it to get the timestamp
 *
 * The last part is just a HMAC component, I'm assuming its a mix of the user id and the creation date though not sure
 */
export const generateToken = (id: string, date?: Date) => {
    const dateToUse = Math.round(date ? date.getTime() / 1_000 : Date.now() / 1_000) - initialEpoch;

    const timestamp = Buffer.alloc(4);

    timestamp.writeUInt32BE(dateToUse);

    const base64Id = Buffer.from(id).toString("base64url");
    const base64Timestamp = timestamp.toString("base64url");

    const hmac = crpyto.createHmac("sha256", base64Id);

    hmac.update(base64Timestamp);

    const base64Hmac = hmac.digest("base64url");

    return `${base64Id}.${base64Timestamp}.${base64Hmac}`;
}

/**
 * Parses a token and returns the id, date and if the hmac is valid
 */
export const parseToken = (token: string) => {
    const [id, timestamp, hmac] = token.split(".");

    if (!id || !timestamp || !hmac) {
        return {
            id: undefined,
            date: undefined,
            hmac: false
        }
    }

    const base64Id = Buffer.from(id, "base64url").toString();
    const base64Timestamp = Buffer.from(timestamp, "base64url").toString();

    const hmacToCheck = crpyto.createHmac("sha256", base64Id);

    hmacToCheck.update(base64Timestamp);

    const base64Hmac = hmacToCheck.digest("base64url");

    const date = new Date((Number.parseInt(base64Timestamp, 10) + initialEpoch) * 1_000);

    if (base64Hmac !== hmac) {
        return {
            id: base64Id,
            date,
            hmac: false
        }
    }


    return {
        id: base64Id,
        date,
        hmac: true
    }
}