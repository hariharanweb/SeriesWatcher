const { openBrowser, goto, $, closeBrowser } = require('taiko');
const { repl } = require('taiko/recorder');
const listing = require('./listing');

(async () => {
    const getTimeForEpisode = async url => {
        await goto(url);     
        const time = await $('.title_wrapper time').text();
        return time.trim()
    }

    try {
        await openBrowser();


        // const ids = ['tt0052520','tt0111893','tt0296310','tt0795176','tt1355642','tt1806234','tt5491994','tt7920978', 'tt0071075','tt0141842','tt0306414','tt0903747','tt1475582','tt1877514','tt6769208','tt8420184','tt0081846','tt0185906','tt0417299','tt0944947','tt1533395','tt2395695','tt7366338','tt9253866']
        const ids = ['tt0052520']
        const idsPromise = ids.map(async id => {
            const series = require(`./${id}.json`)
            const seasonsPromise = series.seasons.map(async season => {
                const episodePromises = season.episodes.map(async episode => {
                    const runTime = await getTimeForEpisode(episode.imdbLink);
                    return {
                        ...episode,
                        runTime
                    }
                })
                await Promise.all(episodePromises)
                console.log(episodePromises)
            })
            await Promise.all(seasonsPromise)
        })
        await Promise.all(idsPromise)
        // const timeForEpisode = await getTimeForEpisode(episodeUrl);
        // const episodeTimeMap = {}
        // episodeTimeMap[episodeUrl] = timeForEpisode
        // console.log(JSON.stringify(episodeTimeMap))
	
    } catch (error) {
        console.error(error);
        await repl();
    } finally {
        await closeBrowser();
    }
})();