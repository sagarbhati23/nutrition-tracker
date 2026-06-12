const express = require("express");
const db = require("../config/db");

const router = express.Router();


// =======================
// SET GOAL
// =======================
router.post("/goal", (req, res) => {

    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const {
        calories_goal,
        protein_goal,
        carbs_goal,
        fats_goal
    } = req.body;

    const caloriesGoal = Number(calories_goal);
    const proteinGoal = Number(protein_goal);
    const carbsGoal = Number(carbs_goal);
    const fatsGoal = Number(fats_goal);

    if (
        !Number.isFinite(caloriesGoal) ||
        !Number.isFinite(proteinGoal) ||
        !Number.isFinite(carbsGoal) ||
        !Number.isFinite(fatsGoal) ||
        caloriesGoal <= 0 ||
        proteinGoal < 0 ||
        carbsGoal < 0 ||
        fatsGoal < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid macro goals"
        });
    }

    const sql = `
        INSERT INTO goals
        (user_id, calories_goal, protein_goal, carbs_goal, fats_goal)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [userId, caloriesGoal, proteinGoal, carbsGoal, fatsGoal],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to save goal",
                    error: err.sqlMessage
                });
            }

            res.status(201).json({
                message: "Goal saved successfully"
            });
        }
    );
});


// =======================
// LOG FOOD
// =======================
router.post("/log", (req, res) => {

    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const { calories, protein, carbs, fats } = req.body;

    const caloriesValue = Number(calories);
    const proteinValue = Number(protein);
    const carbsValue = Number(carbs);
    const fatsValue = Number(fats);

    if (
        !Number.isFinite(caloriesValue) ||
        !Number.isFinite(proteinValue) ||
        !Number.isFinite(carbsValue) ||
        !Number.isFinite(fatsValue) ||
        caloriesValue < 0 ||
        proteinValue < 0 ||
        carbsValue < 0 ||
        fatsValue < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid food values"
        });
    }

    const sql = `
        INSERT INTO food_logs
        (user_id, calories, protein, carbs, fats, log_date)
        VALUES (?, ?, ?, ?, ?, CURDATE())
    `;

    db.query(sql,
        [userId, caloriesValue, proteinValue, carbsValue, fatsValue],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to log food",
                    error: err.sqlMessage
                });
            }

            res.status(201).json({
                message: "Food logged successfully"
            });
        }
    );
});


// =======================
// DASHBOARD TODAY
// =======================
router.get("/today", (req, res) => {

    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const foodQuery = `
        SELECT 
            IFNULL(SUM(calories), 0) AS calories,
            IFNULL(SUM(protein), 0) AS protein,
            IFNULL(SUM(carbs), 0) AS carbs,
            IFNULL(SUM(fats), 0) AS fats
        FROM food_logs
        WHERE user_id = ? AND log_date = CURDATE()
    `;

    const goalQuery = `
        SELECT calories_goal, protein_goal, carbs_goal, fats_goal
        FROM goals
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(foodQuery, [userId], (err, foodResult) => {

        if (err) {
            return res.status(500).json({
                message: "Error fetching food data"
            });
        }

        db.query(goalQuery, [userId], (err, goalResult) => {

            if (err) {
                return res.status(500).json({
                    message: "Error fetching goal data"
                });
            }

            if (goalResult.length === 0) {
                return res.status(404).json({
                    message: "No goals found"
                });
            }

            const food = foodResult[0];
            const goal = goalResult[0];

            res.json({
                calories: {
                    consumed: food.calories,
                    goal: goal.calories_goal,
                    remaining: goal.calories_goal - food.calories
                },
                protein: {
                    consumed: food.protein,
                    goal: goal.protein_goal,
                    remaining: goal.protein_goal - food.protein
                },
                carbs: {
                    consumed: food.carbs,
                    goal: goal.carbs_goal,
                    remaining: goal.carbs_goal - food.carbs
                },
                fats: {
                    consumed: food.fats,
                    goal: goal.fats_goal,
                    remaining: goal.fats_goal - food.fats
                }
            });
        });
    });
});

router.delete("/today", (req, res) => {

    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const sql = `
        DELETE FROM food_logs
        WHERE user_id = ? AND log_date = CURDATE()
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to delete today's food"
            });
        }

        res.status(200).json({
            message: "Today's food deleted successfully"
        });
    });

});

module.exports = router;
