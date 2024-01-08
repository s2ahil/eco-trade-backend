import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
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
    identificationProof: String, // You can store an image URL or file path here
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


const Vendor = mongoose.model('Vendor', vendorSchema);


const sellerSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountSetup: {
      username:String,
      location: String,
      expectedQty: Number,
      recycleImage: String, // You can store an image URL or file path here
    },
  });

  const Seller = mongoose.model('Seller', sellerSchema);


  export { Vendor, Seller };