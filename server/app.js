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

const POS = require("./controllers/controller.js");

app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
})

app.get('/', POS.findAll)

app.delete('/', POS.deleteAll)

app.post('/init', POS.create)