const db = require("../mongo");
const image = db.image;
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, "../resource/images/");

exports.create = (req, res) => {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan directory: ' + err
      });
    }
    let list = [];
    files.forEach(function (file) {
      if (file.includes(".JPG") || file.includes(".png")
      || file.includes(".PNG") || file.includes(".jpg")) {
        list.push({
          image: file,
          spans: []
        });
      }
    });
    image.insertMany(list)
      .then(data => {
        res.status(200).send({
          message: "Execute " + list.length + " insert"
        });
      })
      .catch(err => {
        console.log(err.message || "Some error occurred.");
        res.status(500).send({
          message: "Error occurred when saving the images"
        });
      });
  });
};

exports.findAll = (req, res) => {
  image.find()
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
  image.find().distinct("spans.label")
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
  image.findByIdAndUpdate(req.body._id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update object with id=${req.body._id}. Not found!`
        });
      } else res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating image with id=" + req.body._id
      });
    });
};

exports.deleteAll = (req, res) => {
  image.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} images were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all images."
      });
    });
};

exports.getImage = (req, res) => {
  image.findById(req.params.id).then(data => {
    res.sendFile(directoryPath+data.image)
  }).catch(err => {
    res.status(404).send({
      message: `Cannot find object with id=${req.params.id}. Not found!`
    });
  })
}