"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// MongoDB Atlas URI with your username, password, and cluster name
const uri = "mongodb+srv://sahil:s2ahil@atlascluster.x8tij.mongodb.net/courses";
mongoose_1.default.connect(uri, { dbName: "EcoTrade" })
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
// Export the Mongoose connection
const db = mongoose_1.default.connection;
exports.db = db;
