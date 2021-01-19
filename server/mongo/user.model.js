module.exports = mongoose => {
    const user = mongoose.model(
      "user",
      mongoose.Schema(
        {
          username: String,
          password: String,
          role: String,
          tagCount: Number
        },
        { timestamps: false }
      )
    );

    return user;
  };