const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
// const {tryCatchWrapper} = require("./helpers/index");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.get("/api/error", async (req, res, next) => {
    // some logic...
    try {
        throw new Error("Something happened. It's not good.");
    } catch (error) {
        next(error);
    }
});

// app.get(
//     "/api/error3",
//     tryCatchWrapper(async (req, res, next) => {
//         throw new Error("Something happened. It's not good.");
//     })
// );

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("API error :", err.message);

    res.status(500).json({ message: err.message });
});

module.exports = app;
