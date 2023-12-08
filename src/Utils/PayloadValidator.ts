import { Buffer } from "node:buffer"
import { inflate } from "pako";

/**
 * @description Checks if the payload is a stringified JSON object
 * @unstable
 * @private
 */
export const isJson = (payload: unknown): boolean => {
    try {
        if (typeof payload !== "string") return false;

        const parse = JSON.parse(payload);

        if (!parse) return false;

        if (typeof parse !== "object") return false;

        return Boolean(parse);
    } catch {
        return false;
    }
}

/**
 * @description Checks if the payload is zlib compressed
 * @unstable
 * @private
 */
export const isZlib = (payload: unknown): boolean => {
    try {
        if (!Buffer.isBuffer(payload)) return false;

        const parse = inflate(payload, { to: "string" });

        return isJson(parse);
    } catch {
        return false;
    }
}

/**
 * @description Checks what type of payload it is
 * @unstable
 * @private
 */
export const payloadType = (payload: any): "json" | "unknown" | "zlib" => {
    if (isJson(payload)) return "json";

    if (isZlib(payload)) return "zlib";

    return "unknown";
}

/**
 * @description Checks if the item is a bigint
 * @unstable
 * @private
 */
export const isBigint = (item: unknown): boolean => {
    const regex = /^\d+n$/;

    if (typeof item !== "string") return false;

    const tested = regex.test(item);

    if (!tested) return false;

    try {
        const parsed = BigInt(item.slice(0, -1)); // Remove the n

        return Boolean(parsed);
    } catch {
        return false;
    }
}