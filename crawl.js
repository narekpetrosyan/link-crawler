const {JSDOM} = require("jsdom");
const axios = require("axios");


async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObject = new URL(baseURL)
    const currentURLObject = new URL(currentURL)

    if (baseURLObject.hostname !== currentURLObject.hostname) {
        return pages
    }

    const normalizedCurrentUrl = normalizeUrl(currentURL)

    if (pages[normalizedCurrentUrl] > 0) {
        pages[normalizedCurrentUrl]++
        return pages
    }

    pages[normalizedCurrentUrl] = 1

    try {
        const response = await fetch(currentURL)
        console.log(`Actively crawling ${currentURL}`)

        if (response.status > 399) {
            console.log(`Error in fetch, code: ${response.status}, on page ${currentURL}`)
            return pages
        }

        const contentType = response.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`Non HTML response, on page ${currentURL}`)
            return pages
        }

        const HTMLBody = await response.text()
        const nextUrls = getUrlsFromHTML(HTMLBody, baseURL)

        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseURL, nextUrl, pages)
        }
    }catch (e) {
        console.log(`Fetch error ${e}, on page ${currentURL}`)
    }

    return pages
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