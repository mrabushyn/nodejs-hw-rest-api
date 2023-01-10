const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const { tryCatchWrapper } = require("../nodejs-hw-rest-api/helpers/index");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.get(
    "/api/error",
    tryCatchWrapper(async (req, res, next) => {
        throw new Error("Something happened. It's not good.");
    })
);

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({ message: err.message });
    }
    console.error("API error :", err.message);

    res.status(500).json({ message: err.message });
});

module.exports = app;
