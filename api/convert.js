const { parse } = require('url')
const fetch = require('node-fetch')

const URL = 'https://jnameconverterapi.nolanlawson.com/JNameConverter'

module.exports = async (req, res) => {
  try {
    const { search } = parse(req.url)
    const resp = await fetch(URL + search)
    const text = await resp.text()

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'public,max-age=0,s-maxage=86400')
    res.status(200)
    res.send(text)
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};