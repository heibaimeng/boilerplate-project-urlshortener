require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const map = {}
let key = 0


app.all('/api/shorturl/:short_url', function(req, res) {
  const short = req.params.short_url
  if (map[short]) {
    res.redirect(map[short])
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const host = url
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
  dns.lookup(host, function(err) {
    if (err) {
      res.json({ error: 'invalid url' })
    } else if (map[url]) {
      res.json({ original_url: url, short_url : map[url]})
    } else {
      map[key] = url
      res.json({ original_url: url, short_url : key++})
    }
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
