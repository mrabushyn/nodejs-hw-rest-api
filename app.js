const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/user");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Handling errors:", err.message );
    if (err.message.includes("Cast to ObjectId failed for value")) {
        return res.status(400).json({
            message: "id is invalid"
        });
    }
    return res.status(err.status || 500).json(err.message);
});

module.exports = app;
