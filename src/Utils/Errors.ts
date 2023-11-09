import { GatewayCloseCodes as CloseCodesv10 } from "discord-api-types/gateway/v10"

export const Errors = {
    /**
     * @description Returns a 401 error, this is used when authentication fails
     */
    unAuthorized: () => ({
        code: 401,
        response: {
            message: "401: Unauthorized",
            code: 0
        }
    }),
    /**
     * @description Returns a 404 error, this is when a route or resource is not found
     */
    notFound: () => ({
        code: 404,
        response: {
            message: "404: Not Found",
            code: 0
        }
    }),
    /**
     * @description Returns a 405 error, this is when a method is not allowed
     */
    methodNotAllowed: () => ({
        code: 405,
        response: {
            message: "405: Method Not Allowed",
            code: 0
        }
    }),
};

export const WsErrors = {
    authenticationFailed: () => ({
        code: CloseCodesv10.AuthenticationFailed,
        response: "Authentication failed."
    }),
    nolongerSupported: () => ({
        code: CloseCodesv10.InvalidAPIVersion,
        response: "Requested gateway version is no longer supported or invalid."
    }),
    invalidPayload: () => ({
        code: CloseCodesv10.DecodeError,
        response: "Error while decoding payload."
    }),
    notAuthenticated: () => ({
        code: CloseCodesv10.NotAuthenticated,
        response: "Not authenticated."
    }),
    unknownOpCode: () => ({
        code: CloseCodesv10.UnknownOpcode,
        response: "Unknown opcode."
    }),
    disallowedIntents: () => ({
        code: CloseCodesv10.DisallowedIntents,
        response: "Disallowed intent(s)."
    }),
    invalidIntents: () => ({
        code: CloseCodesv10.InvalidIntents,
        response: "Invalid intent(s)."
    }),
}