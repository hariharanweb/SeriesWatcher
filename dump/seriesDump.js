const { openBrowser, goto, dropDown, $, closeBrowser, currentURL } = require('taiko');
const { repl } = require('taiko/recorder');
const { getImgSrc, getHref } = require('./utils');
const fs = require('fs');

const getTimeForEpisode = async url => {
    await closeBrowser()
    await openBrowser()
    await goto(url, { navigationTimeout: 60000 });
    const time = await $('.title_wrapper time').text();
    return time.trim()
}
(async () => {
    const failedURLs = [];
    const getSeasonDetails = async (season, seriesId) => {
        await closeBrowser();
        await openBrowser();
        await goto(`https://www.imdb.com/title/${seriesId}/episodes`, {navigationTimeout: 60000});
        await dropDown("Season:").select(season);
        const seasonName = await $('#episode_top').text()
        const episodeElements = await $('.list_item').elements()
        const episodes = []
        for (var i = 0; i < episodeElements.length; i++) {
            const episodeName = await evaluate(episodeElements[i], elem => elem.querySelector('strong').textContent)
            const imageUrl = await getImgSrc(image(toLeftOf(episodeName)))
            const airDate = await $(".airdate", toRightOf(episodeName)).text()
            const episodeRating = await $(".ipl-rating-star__rating", below(episodeName)).text()
            const imdbLink = await getHref(await link(episodeName))
            episodes.push({
                episodeName,
                imageUrl,
                airDate: airDate.trim(),
                episodeRating,
                imdbLink,
                runTime: null
            })
        }
        for (let i=0; i< episodes.length; i++){
            try {
                const runTime = await getTimeForEpisode(episodes[i].imdbLink);
                episodes[i].runTime = runTime;
            }
            catch (error) {
                failedURLs.push(episodes[i].imdbLink)
                console.log("***** Failed for episode ", episodes[i].imdbLink)
            }
        }
        return {
            season: seasonName,
            episodes
        }
    }
    const seriesId = process.argv[4]
    try {
        await openBrowser();
        await goto(`https://www.imdb.com/title/${seriesId}/episodes`);
        const allSeasonString = await dropDown("Season:").text();
        const seasons = allSeasonString.split("\n")
        const name = await $('.subpage_title_block h3 a').text()
        const details = {
            name,
            seasons: []
        }
        for (var i = seasons.length - 1; i >= 0; i--) {
            const seasonDetails = await getSeasonDetails(seasons[i], seriesId)
            details.seasons.push(
                seasonDetails
            )
        }
        fs.writeFileSync(`./dump/${seriesId}.json`, JSON.stringify(details));
        fs.writeFileSync(`./dump/failed${seriesId}.json`, JSON.stringify(failedURLs));
    } catch (error) {
        console.error(error)
        console.error("Failed for series",seriesId);
        await repl();
    } finally {
        await closeBrowser();
    }
})();