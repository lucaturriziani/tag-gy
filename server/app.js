const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express()
const port = 3001

var corsOptions = {
  origin: "http://localhost:3000"
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
const Tags = require("./controllers/tags.controller.js");
const noDb = require("./controllers/nodb.controller.js");

app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
})


// MongoDB
app.get('/', POS.findAll)

app.put('/', POS.update)

app.delete('/reset', POS.deleteAll)

app.post('/init', POS.create)

app.post('/tags', Tags.create)

app.delete('/tags', Tags.delete)

app.get('/tags', Tags.findAll)



// NoDB
app.get('/nodb', noDb.getAll)

app.put('/nodb', noDb.update)