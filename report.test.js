const {describe, test, expect} = require("@jest/globals");
const {sortPages} = require("./report");

describe("Sort pages", () => {
    test("Returns empty array", () => {
        const input = {}
        expect(sortPages(input)).toEqual([])
    })

    test("Returns sorted array", () => {
        const input = {
            'https:/wagslane.dev': 3,
            'https:/wagslane.dev/path': 2,
        }
        expect(sortPages(input)).toEqual([['https:/wagslane.dev', 3],['https:/wagslane.dev/path',2]])
    })
})