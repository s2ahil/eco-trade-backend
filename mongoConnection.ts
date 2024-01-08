import mongoose from "mongoose";

// MongoDB Atlas URI with your username, password, and cluster name
const uri:string = "mongodb+srv://sahil:s2ahil@atlascluster.x8tij.mongodb.net/courses";

mongoose.connect(uri,{dbName: "EcoTrade"})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Export the Mongoose connection
const db = mongoose.connection;

export { db };