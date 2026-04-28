// base error class
export class BaseError extends Error {
    status: number
    isOperational: boolean
    constructor(message: string, status: number, isOperational = true) {
        super(message)
        this.status = status
        this.isOperational = isOperational
        Object.setPrototypeOf(this, BaseError.prototype)

    }
}

class NotFoundError extends BaseError {
    constructor(message = 'Not Found') {
        super(message, 404)
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
}


// validation error class
class ValidationError extends BaseError {
    errorData: Record<string, string>[]
    constructor(data: Record<string, string>[]) {
        super("Validation Error", 400)
        this.errorData = data
        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}

class BadRequestError extends BaseError {
    constructor(message = 'Bad Request') {
        super(message, 400)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
}

class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}

class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden') {
        super(message, 403)
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}

class InternalServerError extends BaseError {
    constructor(message = 'Internal Server Error') {
        super(message, 500)
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}

export { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError, ValidationError }