const {getHref, getImgSrc} = require('./utils')
const {openBrowser, goto, $, closeBrowser, near, openTab, closeTab} = require('taiko');
const {repl} = require('taiko/recorder');
const fs = require('fs');


(async () => {
    const listing = []
    const failed = []
    const getImageFromImdb = async listing => {
        try{
            console.log('getting image for for', listing.imdbLink)
            await openTab(listing.imdbLink, {navigationTimeout: 60000})
            const imageUrl = await getImgSrc($('.poster img'))
            await closeTab()
            return imageUrl
        } catch(err) {
            console.log('Did not fetch for url', url)
            failed.push(url)
            return listing.thumbnail
        }
    }

    try {
        await openBrowser();
        await goto("https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250", {navigationTimeout: 60000});
        const allSeries = await $('.lister-list tr').elements();
        await $('.titleColumn', near(allSeries[0])).exists()
        for (var i = 0; i < allSeries.length; i++) {
            const title = await $('.titleColumn', near(allSeries[i])).text();
            console.log('getting for', title)
            const rating = await $('.ratingColumn', near(allSeries[i])).text();
            const thumbnail = await getImgSrc($('.posterColumn img', near(allSeries[i])));
            const imdbLink = await getHref($('.titleColumn a', near(allSeries[i])))
            const id = imdbLink.match(/\/title*\/\S*\//)[0].replace('/title/', '').replace('/', '')
            
            listing.push({
                id,
                title: title.replace(/\d*\.\s*/, ""),
                rating,
                thumbnail,
                imdbLink
            });
        }
        for (var i = 0; i < listing.length; i++) {
            listing[i].imageUrl = await getImageFromImdb(listing[i])
        }
        fs.writeFileSync('./dump/listingNew.json', JSON.stringify(listing));
        fs.writeFileSync('./dump/failedList.json', JSON.stringify(failed));
    } catch (error) {
        console.error(error);
        await repl();
    } finally {
        await closeBrowser();
    }
})();