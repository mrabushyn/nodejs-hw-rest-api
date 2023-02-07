const sgMail = require('@sendgrid/mail');

const { SEND_GRID_KEY_NODE, EMAIL_FROM } = process.env;

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

async function sendMail({ to, subject, text, html }) {
    try {
        sgMail.setApiKey(SEND_GRID_KEY_NODE);
        const msg = { from: EMAIL_FROM, to, subject, html };
        await sgMail.send(msg);
    } catch (error) {
        console.error('App error:', error);
    }
}

module.exports = {
    tryCatchWrapper,
    HttpError,
    sendMail,
};
