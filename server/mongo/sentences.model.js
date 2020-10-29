module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          text: String,
          spans: [
              {
                  start: Number,
                  end: Number,
                  label: String
              }
          ]
        },
        { timestamps: false }
      );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const POS = mongoose.model("sentences", schema);
    return POS;
  };