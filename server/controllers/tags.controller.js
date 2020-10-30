const db = require("../mongo");
const tags = db.tags;

exports.create = (req, res) => {
  const toInsert = new tags({
    name: req.body.name,
    color: req.body.color,
    count: req.body.count
  });
  toInsert.save(toInsert)
    .then(data => {
      console.log("Insert 1 tag")
      res.status(200).send(data)
    })
    .catch(err => {
      console.log(err.message || "Some error occurred.");
      res.status(500).send();
    });
};

exports.findAll = (req, res) => {
  tags.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
}

exports.delete = (req, res) => {
  const toDelete = req.body;
  toDelete.forEach( item => {
    tags.deleteMany({_id: item._id})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
  })
  res.status(200).send();
}