const db = require("../mongo");
const pieceOfSpeech = db.sentences;

const sentences = [
    new pieceOfSpeech({
      text:"Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight",
      spans: null
    }), 
    new pieceOfSpeech({
      text:"And maybe that's the price you pay for the money and fame at an early age",
      spans: null
    }),
    new pieceOfSpeech({
      text:"But the way that we love in the night gave me life baby, I can't explain",
      spans: null
    }),
    new pieceOfSpeech({
      text:"And now it's clear as this promise that we're making two reflections into one 'cause it's like you're my mirror",
      spans: null
    })
];

// Create and Save a new Tutorial
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
    message: "Execute "+sentences.length+" insert"
  });
};

// Retrieve all Tutorials from the database.
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

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  
};

// Delete all Tutorials from the database.
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