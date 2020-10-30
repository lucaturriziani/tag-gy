module.exports = mongoose => {
    const tags = mongoose.model(
      "tags",
      mongoose.Schema(
        {
          name: String,
          color: String,
          count: Number
        },
        { timestamps: false }
      )
    );
  
    return tags;
  };