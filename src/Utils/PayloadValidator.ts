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
