import { URLSearchParams } from "node:url";
import type { GatewayURLQuery } from "discord-api-types/v10.js";

/**
 * An example URL is /?v=10&encoding=json
 */
export const parseUrl = (url: string): GatewayURLQuery => {
    const query: GatewayURLQuery = {
        v: "0", // should get disconnected after parsing
        encoding: "json"
    };

    // We remove the first two characters because they are always /?
    const querystring = new URLSearchParams(url.slice(2));

    if (querystring.has("v")) {
        query.v = querystring.get("v")!;
    }

    if (querystring.has("encoding")) {
        const encoding = querystring.get("encoding")!;

        if (encoding === "json" || encoding === "etf") {
            query.encoding = encoding;
        }
    }

    if (querystring.has("compress")) {
        const compress = querystring.get("compress")!;

        if (compress === "zlib-stream") {
            query.compress = compress;
        }
    }

    return query;
};