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