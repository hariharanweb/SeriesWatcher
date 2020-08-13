const express = require('express')
const bodyParser = require('body-parser')
const {tokenUtils} = require('./tokenUtils');
const app = express()
const port = process.env.PORT || 3000

const listing = require('./dump/listing.json')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const isAuthorized = req => {
    return req.headers["x-authorization-token"] && tokenUtils.isTokenValid(req.headers["x-authorization-token"])
}

app.get('/series', (req, res) => {
    if (!isAuthorized(req)) {
        res.status(401).send("Unauthorized")
        return
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(listing)
})

app.get('/series/:seriesId', (req, res) => {
    if (!isAuthorized(req)) {
        res.status(401).send("Unauthorized")
        return
    }
    res.setHeader('Content-Type', 'application/json');
    try {
        const seriesDetails = require(`./dump/${req.params.seriesId}.json`)
        res.send(seriesDetails)
    } catch (error) {
        res.status(404).send("Sorry can't find that series")
    }
})

app.post('/login', (req, res) => {
    if (req.body.username === 'user1' && req.body.password === 'password1') {
        const response = {
            token: tokenUtils.getToken()
        }
        res.send(response)
        return
    }
    res.status(401).send("Unauthorized");
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})