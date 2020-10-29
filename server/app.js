const express = require('express')
const app = express()
const port = 3001

const sentences = ["Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight", "And maybe that's the price you pay for the money and fame at an early age", "But the way that we love in the night gave me life baby, I can't explain", "And now it's clear as this promise that we're making two reflections into one 'cause it's like you're my mirror"]

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send(sentences)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})