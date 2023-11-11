const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");
const cors = require('cors');
const fetch = require('node-fetch');


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


        // console.log('Initializing Database')
        await initializeDatabase()

        app.listen(port, () => {
            console.log("Server has started...");
        });
    } catch (error) {
        console.log(error.message);
    }
})();

app.get('/', (req, res) => {
    res.send('Serives are started.')
})

async function initializeDatabase() {
    const checkTableExistQuery = `SELECT name
                                  FROM sqlite_master
                                  WHERE type='table' AND name='product_transactions';`

    const isTableExists = await db.get(checkTableExistQuery)
    console.log(isTableExists)

    if (!isTableExists) {
        // create table if table doesn't exists 
        await db.run(
            `CREATE TABLE product_transactions (
                id INTEGER PRIMARY KEY,
                title TEXT,
                price REAL,
                description TEXT,
                category TEXT,
                image TEXT,
                sold BOOLEAN,
                dateOfSale TEXT
            );`
        );


        const thirdPartyDataUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
        try {
            const response = await fetch(thirdPartyDataUrl)
            if (!response.ok) throw new Error('Something goes wrong dealing with third party data fetching.')

            const data = await response.json()
            const insertDataQuery = `INSERT INTO product_transactions 
                                (id, title, price, description, category, image, sold, dateOfSale)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

            for (let eachItem of data) {
                await db.run(insertDataQuery,
                    [eachItem.id,
                    eachItem.title,
                    eachItem.price,
                    eachItem.description,
                    eachItem.category,
                    eachItem.image,
                    eachItem.sold,
                    eachItem.dateOfSale]
                )
            }

        } catch (error) {
            console.log(error.message)
        }
    }
    // console.log('Initialized Database')
}

app.get('/products', async (reqest, response) => {
    const productsData = await db.all('SELECT * FROM product_transactions;');
    response.send(productsData)
})
