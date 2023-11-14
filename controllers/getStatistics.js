import { db } from '../app.js'

const getStatistics = async (req, res) => {
  let { month } = req.query
  month = +month || 3
  const getStatisticsQuery = `SELECT 
                                    SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) AS total_sale_amount,
                                    COUNT(CASE WHEN sold = 1 THEN 1 END) AS total_sold_items,
                                    COUNT(CASE WHEN sold = 0 THEN 1 END) AS total_unsold_items
                                  FROM product_transactions
                                  WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month};`
  try {
    const statistics = await db.all(getStatisticsQuery)
    res.send(statistics)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default getStatistics