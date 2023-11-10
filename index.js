const axios= require('axios');
const { JSDOM } = require("jsdom");
const {crawlPage} = require("./crawl")


async function main() {
    if (process.argv.length < 3) {
        console.log("No web site provided")
        process.exit(1)
    }

    if (process.argv.length > 3) {
        console.log("Too many arguments")
        process.exit(1)
    }

    const baseUrl = process.argv[2]

    console.log("Starting crawling",baseUrl)
    await crawlPage(baseUrl)
}

main()