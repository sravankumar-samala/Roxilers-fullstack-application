import { db } from '../app.js'

const getStatistics = async (req, res) => {
    // const {month} = req.query
    const month = 7
    const getTransactionsQuery = `SELECT 
                                    SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) AS total_sale_amount,
                                    COUNT(CASE WHEN sold = 1 THEN 1 END) AS total_sold_items,
                                    COUNT(CASE WHEN sold = 0 THEN 1 END) AS total_unsold_items
                                  FROM product_transactions
                                  WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month};`

    const transactions = await db.all(getTransactionsQuery)
    res.send(transactions)
}

export default getStatistics