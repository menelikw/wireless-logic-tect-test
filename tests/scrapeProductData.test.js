jest.mock('node-fetch')
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch")

const getProductDataFromPage = require("../scrapeProductData.js").getProductDataFromPage;
const mockProductPageHTML = fs.readFileSync(path.resolve(__dirname, './mock-data/mock-product-page.html'), 'utf8')
const mockEmptyPageHTML = fs.readFileSync(path.resolve(__dirname, 'mock-data/mock-empty-page.html'), 'utf8')

describe('scrapeProductData', () => {
    describe('when page has matching elements', () => {
        it('scrapes product html and transforms it to json ordered by descending price', async () => {
            fetch.mockResolvedValueOnce({text: () => Promise.resolve(mockProductPageHTML)});

            expect(await getProductDataFromPage()).toMatchSnapshot()
        })
    })

    describe('when there are no matching elements', () => {
        it('returns an empty array', async () => {
            fetch.mockResolvedValueOnce({text: () => Promise.resolve(mockEmptyPageHTML)});

            expect(await getProductDataFromPage()).toStrictEqual([])
        })
    })
});