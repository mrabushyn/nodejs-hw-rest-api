function tryCatchWrapper(endpointFn) {
    return async (req, res, next) => {
        try {
            await endpointFn(req, res, next);
        } catch (error) {
            return next(error);
        }
    };
}

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.err = new Error(message);
        this.err.status = status;
        return this.err;
    }
}

module.exports = {
    tryCatchWrapper,
    HttpError,
};
