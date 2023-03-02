const getProductDataFromPage = require("./scrapeProductData.js").getProductDataFromPage;

(async () => {
    console.table(await getProductDataFromPage())
})()