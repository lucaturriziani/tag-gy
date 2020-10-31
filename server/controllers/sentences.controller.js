const db = require("../mongo");
const pieceOfSpeech = db.sentences;

const sentences = [
  new pieceOfSpeech({
    text: "Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight",
    spans: []
  }),
  new pieceOfSpeech({
    text: "And maybe that's the price you pay for the money and fame at an early age",
    spans: []
  }),
  new pieceOfSpeech({
    text: "But the way that we love in the night gave me life baby, I can't explain",
    spans: []
  }),
  new pieceOfSpeech({
    text: "And now it's clear as this promise that we're making two reflections into one 'cause it's like you're my mirror",
    spans: []
  })
];

exports.create = (req, res) => {
  sentences.forEach(s => {
    s.save()
      .then(data => {
        console.log("Insert 1 document")
      })
      .catch(err => {
        console.log(err.message || "Some error occurred.");
      });
  })
  res.status(200).send({
    message: "Execute " + sentences.length + " insert"
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