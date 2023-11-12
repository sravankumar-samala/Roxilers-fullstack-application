import fetch from 'node-fetch';
import { db } from '../app.js'

export default async function initializeDatabase() {
    const checkTableExistQuery = `SELECT name
                                  FROM sqlite_master
                                  WHERE type='table' AND name='product_transactions';`

    const productsTable = await db.get(checkTableExistQuery)
    // console.log(productsTable)

    if (!productsTable) {
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
    }

    // check if table has data?
    const dataInTable = await db.get(`SELECT * FROM product_transactions WHERE id=${1};`)
    // console.log(dataInTable) 

    // if there is no data then data is fetched from url and inserted into db 
    if (!dataInTable) {
        const thirdPartyDataUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
        try {
            const response = await fetch(thirdPartyDataUrl)
            if (!response.ok) throw new Error('Something goes wrong dealing with third party data fetching.')

            const data = await response.json()
            const insertDataQuery = `INSERT INTO product_transactions 
                                (id, title, price, description, category, image, sold, dateOfSale)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

            for (let eachObj of data) {
                await db.run(insertDataQuery, [
                    eachObj.id,
                    eachObj.title,
                    eachObj.price,
                    eachObj.description,
                    eachObj.category,
                    eachObj.image,
                    eachObj.sold,
                    eachObj.dateOfSale
                ]);
            }

        } catch (error) {
            console.log(error.message)
        }
    }
    // console.log('Initialization success')
}