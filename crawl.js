const {JSDOM} = require("jsdom");
const axios = require("axios");

async function crawlPage(url) {
    try {
        const data = await axios.get(url)

        if (data.status > 399) {
            console.log(`Error in fetch, code: ${data.status}, on page ${url}`)
            return
        }

        const contentType = data.headers["content-type"]

        if (!contentType.includes("text/html")) {
            console.log(`Non HTML response, on page ${url}`)
            return
        }

        return data.data
    }catch (e) {
        console.log(`Fetch error ${e}, on page ${url}`)
    }
}

function getUrlsFromHTML(htmlBody, baseUrl = '') {
    const urls = []

    const dom = new JSDOM(htmlBody)

    const anchorElements = dom.window.document.querySelectorAll("a")

    anchorElements.forEach(el => {
        if (el.href.slice(0, 1) === "/") {
            try {
                const urlObject = new URL(baseUrl + el.href)
                urls.push(urlObject.href)
            } catch (e) {
                urls.push(undefined)
            }
        } else {
            try {
                const urlObject = new URL(el.href)
                urls.push(urlObject.href)
            } catch (e) {
                urls.push(undefined)
            }
        }
    })

    return urls
}

function normalizeUrl(url) {
    const urlObject = new URL(url)

    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
        return hostPath.slice(0, -1)
    }

    return hostPath
}

module.exports = {
    normalizeUrl,
    getUrlsFromHTML,
    crawlPage
}