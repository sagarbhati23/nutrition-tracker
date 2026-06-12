const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.get("/register", (req, res) => {
    res.send("Register Route Working");
});

router.post("/register", async (req, res) => {
    console.log("POST REGISTER HIT");

    try {
        const {
            name,
            email,
            password,
            age,
            weight,
            height,
            activity_level
        } = req.body;

        const ageNumber = Number(age);
        const weightNumber = Number(weight);
        const heightNumber = Number(height);
        const validLevels = ["Sedentary", "Light", "Moderate", "Active"];

        if (
            !name ||
            name.trim().length < 3 ||
            !email ||
            !email.includes("@") ||
            !password ||
            password.length < 6 ||
            ageNumber < 10 ||
            ageNumber > 100 ||
            weightNumber <= 0 ||
            heightNumber <= 0 ||
            !validLevels.includes(activity_level)
        ) {
            return res.status(400).json({
                message: "Please enter valid signup details"
            });
        }

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email.trim().toLowerCase()],
            async (err, results) => {

                if (err) {
                    return res.status(500).json({
                        message: "Server error"
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "Email already registered"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO users
                    (name, email, password, age, weight, height, activity_level)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        name.trim(),
                        email.trim().toLowerCase(),
                        hashedPassword,
                        ageNumber,
                        weightNumber,
                        heightNumber,
                        activity_level
                    ],
                    (err, result) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Registration failed"
                            });
                        }

                        req.session.regenerate((sessionErr) => {
                            if (sessionErr) {
                                return res.status(500).json({
                                    message: "Account created, but login failed"
                                });
                            }

                            req.session.userId = result.insertId;

                            res.status(201).json({
                                message: "User registered and logged in successfully"
                            });
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email.trim().toLowerCase()],
        async (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Server error"
                });
            }

            if (results.length === 0) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            req.session.regenerate((sessionErr) => {
                if (sessionErr) {
                    return res.status(500).json({
                        message: "Login failed"
                    });
                }

                req.session.userId = user.id;

                res.status(200).json({
                    message: "Login successful"
                });
            });
        }
    );
});
router.get("/profile", (req, res) => {

    if (!req.session.userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    db.query(
        `SELECT id, name, email, age, weight, height, activity_level
         FROM users
         WHERE id = ?`,
        [req.session.userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Server error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json(results[0]);
        }
    );
});
router.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logged out successfully"
        });
    });

});
module.exports = router;
