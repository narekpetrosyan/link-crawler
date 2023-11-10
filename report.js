function sortPages(pages) {
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b) => b[1] - a[1])
    return pagesArr
}

function printReport(pages) {
    console.log("==========")
    console.log("REPORT")
    console.log("==========")
    const sortedPages = sortPages(pages)
    for (const page of sortedPages) {
        const url = page[0]
        const hits = page[1]
        console.log(`${url} appears ${hits} time`)
    }
    console.log("==========")
    console.log("END REPORT")
    console.log("==========")
}

module.exports = {
    sortPages,
    printReport
}