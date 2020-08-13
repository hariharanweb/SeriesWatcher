const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

const listing = require('./dump/listing.json')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/series', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(listing)
})

app.get('/series/:seriesId', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const seriesDetails = require(`./dump/${req.params.seriesId}.json`)
    res.send(seriesDetails)
  } catch (error) {
    res.status(404).send("Sorry can't find that series")
  }
})

app.post('/login', (req, res) => {
  if(req.body.username==='user1' && req.body.password==='password1'){
    const response = {
      token: Buffer.from(Date.now()+'').toString('base64')
    }
    res.send(response)
    return
  }
  res.status(401).send("Unauthorized");
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})