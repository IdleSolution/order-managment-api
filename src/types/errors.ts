export interface CustomError extends Error {
    statusCode?: number;
}

export class NotFoundError extends Error implements CustomError {
    statusCode = 404;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends Error implements CustomError {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}
