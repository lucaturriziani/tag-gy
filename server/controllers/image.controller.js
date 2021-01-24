const db = require("../mongo");
const image = db.image;
const user = db.user;
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
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

exports.getTagAndCount = (req, res) => {
  image.aggregate([
    { "$unwind": "$spans" },
    { "$group": { "_id": "$spans.label", "count": { "$sum": 1 } } },
    {
      "$group": {
        "_id": null, "tags": {
          "$push": {
            "tag": "$_id",
            "count": "$count"
          }
        }
      }
    }
  ])
    .then(data => {
      res.send(data[0].tags);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    })
}

exports.update = (req, res) => {
  user.findById(req.userId).then( usr => 
    user.updateOne({_id: req.userId}, {tagCount: usr.tagCount + 1})
  )
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
  // Extract the query-parameter
  const widthString = req.query.width
  const heightString = req.query.height
  // Parse to integer if possible
  let width, height
  if (widthString) {
    width = parseInt(widthString)
  }
  if (heightString) {
    height = parseInt(heightString)
  }
  image.findById(req.params.id).then(data => {
    // Get the resized image
    resize(directoryPath + data.image, width, height).pipe(res)
  }).catch(err => {
    res.status(404).send({
      message: `Cannot find object with id=${req.params.id}. Not found!`
    });
  })
}

function resize(path, width, height) {
  const readStream = fs.createReadStream(path)
  let transform = sharp();

  if (width || height) {
    transform = transform.resize(width, height)
  }

  return readStream.pipe(transform)
}