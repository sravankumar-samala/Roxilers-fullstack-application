import { db } from '../app.js'

const getBarChartData = async (req, res) => {
    const month = 7
    const getBarChartDataQuery = `SELECT 
                                    CASE
                                    WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                                    WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                                    WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                                    WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                                    WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                                    WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                                    WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                                    WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                                    WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                                    WHEN price >= 901 THEN '901-above'
                                END AS price_range,
                                COUNT(*) AS item_count
                                FROM product_transactions
                                WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month}
                                GROUP BY price_range;`

    const getPriceRangeData = await db.all(getBarChartDataQuery)
    res.send(getPriceRangeData)
}

export default getBarChartData