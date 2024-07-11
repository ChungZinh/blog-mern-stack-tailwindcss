const mongoose = require("mongoose");


class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(process.env.MONGOURI)
      .then(() => {
        console.log(
          `Database connection successful with ${process.env.DB_NAME}`
        );
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
  static getInstance() {
    if (!this.instance) this.instance = new Database();
    return this.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
