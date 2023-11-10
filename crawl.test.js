const {normalizeUrl, getUrlsFromHTML} = require("./crawl")
const {test, expect, describe} = require("@jest/globals")

describe("Normalize URL", () => {
    test("Remove http(s)", () => {
        const input = 'https://blog.boot.dev/path'
        expect(normalizeUrl(input)).toEqual("blog.boot.dev/path")
    })

    test("Remove trailing slash", () => {
        const input = 'https://blog.boot.dev/path/'
        expect(normalizeUrl(input)).toEqual("blog.boot.dev/path")
    })

    test("Remove capitals", () => {
        const input = 'https://BLOG.boot.dev/path/'
        expect(normalizeUrl(input)).toEqual("blog.boot.dev/path")
    })

    test("Another protocol", () => {
        const input = 'http://blog.boot.dev/path/'
        expect(normalizeUrl(input)).toEqual("blog.boot.dev/path")
    })
})

describe("Get URLs", () => {
    test("No URLs on page", () => {
        const html = `
        <html>
            <body>
            </body>
        </html>
        `

        const baseUrl = "http://blog.boot.dev/path"
        expect(getUrlsFromHTML(html, baseUrl)).toEqual([])
    })

    test("Finds absolute URLs", () => {
        const html = `
        <html>
            <body>
                <a href="http://blog.boot.dev/path">Some URL</a>
            </body>
        </html>
        `

        expect(getUrlsFromHTML(html)).toEqual(["http://blog.boot.dev/path"])
    })

    test("Finds relative URLs", () => {
        const html = `
        <html>
            <body>
                <a href="/path">Some URL</a>
            </body>
        </html>
        `

        const baseUrl = "http://blog.boot.dev"
        expect(getUrlsFromHTML(html, baseUrl)).toEqual(["http://blog.boot.dev/path"])
    })

    test("Finds relative and absolute URLs", () => {
        const html = `
        <html>
            <body>
                <a href="/path">Some URL</a>
                <a href="/path2">Some URL 2</a>
                <a href="http://blog.boot.dev/path3">Some URL 3</a>
            </body>
        </html>
        `

        const baseUrl = "http://blog.boot.dev"
        expect(getUrlsFromHTML(html, baseUrl)).toEqual(["http://blog.boot.dev/path", "http://blog.boot.dev/path2", "http://blog.boot.dev/path3"])
    })

    test("Invalid URL", () => {
        const html = `
        <html>
            <body>
                <a href="path">Some URL</a>
                <a href="/path2">Some URL 2</a>
            </body>
        </html>
        `

        const baseUrl = "http://blog.boot.dev"
        expect(getUrlsFromHTML(html, baseUrl)).toEqual([undefined, "http://blog.boot.dev/path2"])
    })
})