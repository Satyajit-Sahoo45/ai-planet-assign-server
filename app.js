const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/auth');
const courseRouter = require('./routes/course.route');
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://ai-assign-client.vercel.app"],
        credentials: true,
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});

app.use("/api", router, courseRouter);

module.exports = app;
