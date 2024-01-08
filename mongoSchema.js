"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seller = exports.Vendor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const vendorSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    extendedProfile: {
        username: {
            type: String,
        },
        placeToWork: String,
        acceptedItems: [String],
        identificationProof: String,
        priceOfItems: Number,
        contactInfo: {
            phone: String,
            email: String,
        },
        availability: {
            start: String,
            end: String,
        },
    },
});
const Vendor = mongoose_1.default.model('Vendor', vendorSchema);
exports.Vendor = Vendor;
const sellerSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountSetup: {
        username: String,
        location: String,
        expectedQty: Number,
        recycleImage: String, // You can store an image URL or file path here
    },
});
const Seller = mongoose_1.default.model('Seller', sellerSchema);
exports.Seller = Seller;
