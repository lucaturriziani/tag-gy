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

const POS = require("./controllers/sentence.controller.js");
const img = require("./controllers/image.controller.js");
const usr = require("./controllers/user.controller.js");
const jwt = require("./jwt/jwt.middleware.js");

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


// MongoDB
app.get('/', POS.findAll)
app.get('/img', img.findAll)
app.get('/img/file/:id',img.getImage)

app.put('/', jwt.verifyToken, POS.update)
app.put('/img', jwt.verifyToken, img.update)

app.delete('/reset', POS.deleteAll)
app.delete('/img', img.deleteAll)

app.post('/init', POS.create)
app.post('/img/init', img.create)
app.post('/login', usr.login)
app.post('/register', /*jwt.verifyToken,*/ usr.register)

app.get('/tags', POS.getAllTag)
app.get('/tags/count', POS.getTagAndCount)
app.get('/img/tags', img.getAllTag)
app.get('/img/tags/count', img.getTagAndCount)
app.get('/user/info', jwt.verifyToken, usr.tagCount)
