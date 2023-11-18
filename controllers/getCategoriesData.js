import { db } from '../app.js'

const getCategoriesData = async (req, res) => {
    const { month } = req.query
    const getCategoriesQuery = `SELECT
                                    category,
                                    COUNT(*) AS item_count
                                FROM product_transactions
                                WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month}
                                GROUP BY category;`
    const categoriesData = await db.all(getCategoriesQuery)
    res.send(categoriesData)
}

export default getCategoriesData