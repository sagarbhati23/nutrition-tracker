const mysql = require("mysql2");

const dbName = process.env.DB_NAME || "macrotrack";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

function runSetupQueries(callback) {
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            age INT NOT NULL,
            weight DECIMAL(6,2) NOT NULL,
            height DECIMAL(6,2) NOT NULL,
            activity_level VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS goals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            calories_goal INT NOT NULL,
            protein_goal INT NOT NULL,
            carbs_goal INT NOT NULL,
            fats_goal INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS food_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            calories INT NOT NULL,
            protein INT NOT NULL,
            carbs INT NOT NULL,
            fats INT NOT NULL,
            log_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
    ];

    let index = 0;

    function next(err) {
        if (err || index === queries.length) {
            callback(err);
            return;
        }

        connection.query(queries[index], (queryErr) => {
            index += 1;
            next(queryErr);
        });
    }

    next();
}

connection.initDatabase = function initDatabase(callback) {
    connection.connect((err) => {
        if (err) {
            callback(err);
            return;
        }

        connection.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(dbName)}`, (createErr) => {
            if (createErr) {
                callback(createErr);
                return;
            }

            connection.changeUser({ database: dbName }, (changeErr) => {
                if (changeErr) {
                    callback(changeErr);
                    return;
                }

                runSetupQueries(callback);
            });
        });
    });
};

module.exports = connection;
