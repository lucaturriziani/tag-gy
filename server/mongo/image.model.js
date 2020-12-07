module.exports = mongoose => {
    const img = mongoose.model(
      "image",
      mongoose.Schema(
        {
          image: String,
          spans: [
              {
                  label: String,
                  x: Number,
                  y: Number,
                  w: Number,
                  h: Number
              }
          ]
        },
        { timestamps: false }
      )
    );

    return img;
  };