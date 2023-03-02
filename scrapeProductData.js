require('dotenv').config()

const load = require('cheerio').load;
const fetch = require('node-fetch').default

/**
 * @param {string}  string - A required string to be transformed.
 * @returns {number} A float number, 0 if regex match is not found
 */
const toFloat = string => parseFloat(string.match(/\d+\.*\d*/)?.at(0) || 0)

/**
 * @returns {Array[{
 *     optionTitle: string,
 *     description: string,
 *     price: number,
 *     discount: number
 * }]} An array of scraped product data, empty array if markup not matched
 */
const getProductDataFromPage = async () => {
    try {
        const response = await fetch(process.env.SCRAPER_URL, {});
        const body = await response.text();
        const $ = load(body);
        const $packages = $('.package');

        let products = []

        // Scrape text data from html elements
        $packages.each((index, element) => {
            const $el = $(element)
            products = [
                ...products,
                {
                    optionTitle: $el.find('.header h3').text(),
                    description: $el.find('.package-description').html().replaceAll('<br>', ' '),
                    price: toFloat($el.find('.price-big').text()),
                    discount: toFloat($el
                        .find('.package-price [style="color: red"]')
                        .text()),
                }]
        })

        // Sort by price in descending order
        return products.sort((a, b) => b.price - a.price)
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    getProductDataFromPage
}