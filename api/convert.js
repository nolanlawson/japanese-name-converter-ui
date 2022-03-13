const URL = 'https://jnameconverterapi.nolanlawson.com/JNameConverter'

module.exports = async (req, res) => {
  try {
    const q = req.params.q
    const resp = await fetch(URL, { params: { q } })
    const json = await resp.json()
    res.setHeader('Cache-Control', 'maxage=0');
    res.setHeader('Cache-Control', 's-maxage=604800');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify(json))
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};