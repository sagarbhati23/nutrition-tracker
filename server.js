const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

dotenv.config();

const db = require("./config/db");
const authRoutes = require("./routes/auth");
const trackerRoutes = require("./routes/tracker");

const app = express();
const PORT = process.env.PORT || 5000;
const frontendPath = path.join(__dirname, "frontend");

app.use(express.json());


// ✅ CORS (frontend ↔ backend communication)
app.use(cors({
    origin: "http://localhost:5000", // IMPORTANT CHANGE (we serve frontend from same server now)
    credentials: true
}));


// ✅ SESSION
app.use(
    session({
        secret: process.env.SESSION_SECRET || "macrotrack_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

function requirePageLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login.html");
    }

    next();
}

function redirectLoggedInUsers(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/dashboard.html");
    }

    next();
}

function sendPage(res, fileName) {
    res.sendFile(path.join(frontendPath, fileName));
}

app.use("/css", express.static(path.join(frontendPath, "css")));
app.use("/js", express.static(path.join(frontendPath, "js")));


// DB CONNECT + TABLE SETUP
db.initDatabase((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("Database connected and tables are ready");
});


// ROUTES
app.use("/auth", authRoutes);
app.use("/tracker", trackerRoutes);


// PUBLIC PAGES
app.get("/", (req, res) => sendPage(res, "index.html"));
app.get("/index.html", (req, res) => sendPage(res, "index.html"));
app.get("/home.html", (req, res) => sendPage(res, "home.html"));
app.get("/login.html", redirectLoggedInUsers, (req, res) => sendPage(res, "login.html"));
app.get("/signup.html", redirectLoggedInUsers, (req, res) => sendPage(res, "signup.html"));

// PRIVATE PAGES
app.get("/dashboard.html", requirePageLogin, (req, res) => sendPage(res, "dashboard.html"));
app.get("/profile.html", requirePageLogin, (req, res) => sendPage(res, "profile.html"));
app.get("/contact.html", requirePageLogin, (req, res) => sendPage(res, "contact.html"));

app.use((req, res) => {
    res.status(404).redirect("/");
});


// SERVER START
app.listen(PORT, () => {

    console.log("");
    // console.log("====================================");
    console.log("🚀 MacroTrack Server Running");
    console.log(`🌐 Open: http://localhost:${PORT}`);
    // console.log("====================================");
    console.log("");

});
