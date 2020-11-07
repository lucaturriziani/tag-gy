const db = require("../mongo");
const pieceOfSpeech = db.sentences;
const fs = require("fs");

exports.create = (req, res) => {
  const rawdata = fs.readFileSync('./resource/POS_init.json');
  const list = JSON.parse(rawdata);
  pieceOfSpeech.insertMany(list)
    .then(data => {
      res.status(200).send({
        message: "Execute " + list.length + " insert"
      });
    })
    .catch(err => {
      console.log(err.message || "Some error occurred.");
      res.status(500).send({
        message: "Error occurred when saving the documents"
      });
    });

};

exports.findAll = (req, res) => {
  pieceOfSpeech.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
};

exports.getAllTag = (req, res) => {
  pieceOfSpeech.find().distinct("spans.label")
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
}

exports.update = (req, res) => {
  pieceOfSpeech.findByIdAndUpdate(req.body._id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update object with id=${id}. Not found!`
        });
      } else res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  pieceOfSpeech.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};