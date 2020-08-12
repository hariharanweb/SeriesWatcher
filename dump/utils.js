const { evaluate } = require("taiko")

module.exports.getImgSrc = async element => {
    return await evaluate(element, elem => { return elem.src })
}

module.exports.getHref = async element => {
    return await evaluate(element, elem => { return elem.href })
}

// getHref = async element => { return await evaluate(element, elem => { return elem.href })}