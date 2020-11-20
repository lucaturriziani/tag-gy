const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express()
const port = 3001

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./mongo");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const POS = require("./controllers/sentences.controller.js");

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


// MongoDB
app.get('/', POS.findAll)

app.put('/', POS.update)

app.delete('/reset', POS.deleteAll)

app.post('/init', POS.create)

app.get('/tags', POS.getAllTag)

app.get('/collections', (req, res) => {
  let colls = [];
  db.mongoose.connection.db.listCollections().toArray(function (err, collectionz) {
    collectionz.forEach(item=>{
      colls.push({
        name: item.name,
        code: item.name
      })
    })
    res.status(200).send(colls);
  });
})
