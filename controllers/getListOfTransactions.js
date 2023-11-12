import { db } from '../app.js'


const getListOfTransactions = async (req, res) => {
    let { searchValue, month, page } = req.query
    month = month || '3'
    page = page || '1'
    const limit = 3 //default

    let getTotalDataQuery = 'SELECT * FROM product_transactions'

    //price is checked only when searchValue is an integer ${+searchValue}
    const checkPrice = isNaN(searchValue) ? '' : `OR price = ${+searchValue}`

    if (searchValue) {
        // handling single and multiple input values string
        const searchInputs = searchValue.toLowerCase().split(',')
        const searchCondition = searchInputs.map(value =>
            `LOWER(title) LIKE '%${value.toLowerCase()}%' OR LOWER(description) LIKE '%${value.toLowerCase()}%' ${checkPrice}`)
            .join(' OR ')

        getTotalDataQuery += ` WHERE (${searchCondition}) AND CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month}`
    } else {
        // If input isn't empty, then sort transactions only based on month
        getTotalDataQuery += ` WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month}`
    }


    try {
        const totalProducts = await db.all(getTotalDataQuery + ';')
        const totalPages = Math.ceil(totalProducts.length / limit)

        getTotalDataQuery += ` LIMIT ${+limit} OFFSET ${(+page - 1) * limit};`

        const productsPerPage = await db.all(getTotalDataQuery)

        res.json({
            totalProducts: totalProducts.length,
            totalPages,
            currPage: page,
            productsPerCurrPage: productsPerPage.length,
            products: productsPerPage
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

export default getListOfTransactions