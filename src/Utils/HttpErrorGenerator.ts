/*
This is a tad different to the "Errors.ts" functions due to the fact this is for more complex errors.

Mainly just a function to generate those i.e

{
    "message": "Invalid Form Body",
    "code": 50035,
    "errors": {
        "username": {
            "_errors": [
                {
                    "code": "STRING_TYPE_CONVERT",
                    "message": "Could not interpret \"{}\" as string."
                }
            ]
        }
    }
}
*/

export const generateError = (options: {
    code: number,
    errors: {
        [key: string]: {
            code: string,
            message: string
        }[]
    },
    message: string
}) => {
    return {
        message: options.message,
        code: options.code,
        errors: Object.fromEntries(Object.entries(options.errors).map(([key, value]) => {
            return [key, {
                _errors: value
            }]
        }))
    }
}