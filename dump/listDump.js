const { getHref, getImgSrc } = require('./utils')
const { openBrowser, goto, $, text, closeBrowser, evaluate, toLeftOf } = require('taiko');
const { repl } = require('taiko/recorder');
const fs = require('fs');


(async () => {
    const listing = []
    try {
        await openBrowser();
        await goto("https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250");
        const allSeries = await $('.lister-list tr').elements();
        await $('.titleColumn', near(allSeries[0])).exists()
        for (var i = 0; i < allSeries.length; i++) {
            const title = await $('.titleColumn', near(allSeries[i])).text();
            const rating = await $('.ratingColumn', near(allSeries[i])).text();
            const imageUrl = await getImgSrc($('.posterColumn img'));
            const linkElement = await getHref($('.titleColumn a', near(allSeries[i])))
            const id = linkElement.match(/\/title*\/\S*\//)[0].replace('/title/', '').replace('/', '')
            listing.push({
                id,
                title: title.replace(/\d*\.\s*/, ""),
                rating,
                imageUrl
            });
        }
        fs.writeFileSync('./dump/listing.json', JSON.stringify(listing));
    } catch (error) {
        console.error(error);
        await repl();
    } finally {
        await closeBrowser();
    }
})();