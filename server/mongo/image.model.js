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
                  h: Number,
                  coords:
                    {
                      bl: {
                        x: Number,
                        y: Number
                      },
                      br: {
                        x: Number,
                        y: Number
                      },
                      tl: {
                        x: Number,
                        y: Number
                      },
                      tr: {
                        x: Number,
                        y: Number
                      }
                    }
              }
          ]
        },
        { timestamps: false }
      )
    );

    return img;
  };