const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://tempnikhil9887:7orpHQT4MSMR0ed9@cluster0.iyxo6zp.mongodb.net/";
// const MONGO_URL = "mongodb+srv://anshkmr99:ansh123@cluster0.mtiofuo.mongodb.net/";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj , owner : "661b8e3c983e38080d709592"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
