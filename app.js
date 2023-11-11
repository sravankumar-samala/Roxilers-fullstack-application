const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

const dbPath = path.join(__dirname, "roxilers.db");
const port = process.env.PORT || 8008;
let db;


(async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        app.listen(port, () => {
            console.log("Server has started...");
        });
    } catch (error) {
        console.log(error.message);
    }
})();
