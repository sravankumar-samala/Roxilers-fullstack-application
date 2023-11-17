import express, { json } from "express";
import sqlite3 from "sqlite3";
import { join, dirname } from "path";
import { open } from "sqlite";
import cors from 'cors';
import { fileURLToPath } from "url";

// apis 
import initializeDatabase from "./controllers/initializeDatabase.js";
import getListOfTransactions from "./controllers/getListOfTransactions.js";
import getStatistics from "./controllers/getStatistics.js";
import getBarChartData from "./controllers/getBarChartData.js";
import getCategoriesData from "./controllers/getCategoriesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

const dbPath = join(__dirname, "roxiler.db");
const port = process.env.PORT || 8008;
let db;

// Set up database and initialize
(async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });


        console.log('CHECK: Initializing Database')
        await initializeDatabase()

        app.listen(port, () => {
            console.log("Server has started...");
        });
    } catch (error) {
        console.log(error.message);
    }
})();


const getAllProductsData = async (req, res) => {
    try {
        const productsData = await db.all('SELECT * FROM product_transactions;');

        res.send(productsData)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

app.get('/all-products', getAllProductsData)
app.get("/list-transactions", getListOfTransactions)
app.get('/statistics', getStatistics)
app.get('/categories-data', getCategoriesData)
app.get('/Bar-chart-stats', getBarChartData)

export { db }