module.exports = mongoose => {
    const POS = mongoose.model(
      "sentences",
      mongoose.Schema(
        {
          text: String,
          spans: [
              {
                  start: Number,
                  end: Number,
                  token: String,
                  label: String
              }
          ]
        },
        { timestamps: false }
      )
    );

  
    return POS;
  };