
const app = require('express')();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { db } = require('./mongoConnection');
const { Vendor, Seller } = require('./mongoSchema');



app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))





// secrets
const secret = "myMongoSecretSeller";
const secret2 = "myMongoSecret2vendor";
//

// seller
function generateJwt(user) {
  const payload = { username: user.username };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return token;
}
function authenticateJwt(req, res, next) {
  console.log("check kiya");
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}
//


//  vendor
function generateJwt1(user) {
  const payload = { username: user.username };

  const token = jwt.sign(payload, secret2, { expiresIn: "1h" });

  return token;
}

function authenticateJwt1(req, res, next) {
  console.log("check kiya");
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}
//






app.get("/", (req, res) => {



  res.send("hello")
})


//seller  signup

app.post("/seller/signup", async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await Seller.findOne({ email: email });

    if (user) {
      res.status(403).json({ message: "user already exists" });
    } else {
      const newUser = new Seller({ email, password });
      await newUser.save();

      const token = jwt.sign({ email, role: "seller" }, secret, {
        expiresIn: "1h",
      });
      res.json({ message: "user created successfully", token });
    }
  }
  catch (e) {
    res.json({ message: "exeception happend signup" });
    console.log(e)
  }
  // logic to sign up user
});

app.post("/seller/login", async (req, res) => {

  try {
    const { email, password } = req.headers;
    const user = await Seller.findOne({ email: email, password: password });
    if (user) {
      const token = jwt.sign({ email, role: "seller" }, secret2, {
        expiresIn: "1h",
      });
      res.json({
        message: "Logged in successfully",
        token: token,
      });
    } else {
      res.status(403).json({ message: "Input correct password or username" });
    }
    // logic to log in user
  }
  catch (e) {
    res.json({ message: "exeception happened login" });
    console.log(e)
  }
});

// seller end 


// vendor  signup

app.post("/vendor/signup", async (req, res) => {

  // logic to sign up vendor

  const { email, password } = req.body;
  const vendor = await Vendor.findOne({ email: email });


  if (vendor) {
    res.status(403).json({ message: "vendor already exists" });
  } else {
    const newVendor = new Vendor({ email, password });
    await newVendor.save();

    const token = jwt.sign({ email, role: "vendor" }, secret2, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/vendor/login", async (req, res) => {

  const { email, password } = req.headers;
  const vendor = await Vendor.findOne({ email, password });

  if (vendor) {
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1h",
    });

    res.json({
      message: "Logged in successfully",
      token: token,
    });

  } else {
    res.status(403).json({ message: "Input correct password or username" });
  }

  // logic to log in admin
});

// vendor ends 

app.post("/vendor/profile", async (req, res) => {
  console.log("arha hai", req.body)

  try {
    const {
      username,
      profileImageLink,
      itemsYouTake,
      placeToWork,
      priceOfItems,
      contactInfo,
      availability,
    } = req.body;

    // You can access the authenticated vendor's email from req.user.email
    // const email = req.user.email;

    // Testing purpose
    const email = username;

    // Create or update the vendor's extended profile in the database
    const updatedProfile = {
      username: username,
      placeToWork: placeToWork, // You can keep this empty if not provided in the request
      acceptedItems: [itemsYouTake], // Split items into an array
      identificationProof: profileImageLink,
      priceOfItems: priceOfItems, // Split prices into an array
      contactInfo: { phone: contactInfo },
      availability: { start: availability },
    };

    const vendor = await Vendor.findOne({ email: email });
    console.log(vendor, "find kiya")
    if (vendor) {
      // Vendor exists, update the extended profile
      const updatedVendor = await Vendor.findOneAndUpdate(
        { email: email },
        { $set: { extendedProfile: updatedProfile } },
        { new: true }
      );

      res.json({ message: "Vendor profile updated successfully", data: updatedVendor });
      console.log('updatedd')
    } else {
      res.status(404).json({ message: "Vendor not found" });
      console.log('error 404 ')
    }
  } catch (e) {
    console.error(e,'500');
    res.status(500).json({ message: "Internal server error" });
  }
})


// Add this route to your server.js or app.js
app.get("/vendor/info", async (req, res) => {
  console.log("aya")
  try {
    const vendors = await Vendor.find(); // Fetch all vendors from the database
    res.json(vendors); // Return the vendors as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/seller/profile" ,async (req, res) => {
  console.log("aya")
  try {
    const {
      username,
      location,
      recycleItems,
      itemPictureLink,
      expectedQty,
      phoneNumber,
    } = req.body;

    // You can access the authenticated seller's email from req.user.email
    const email = req.user.email;

    let seller = await Seller.findOne({ email });

    if (!seller) {
      res.status(404).json({ message: "Seller not found" });
    } else {
      // Update seller's profile
      seller.accountSetup = {
        username,
        location,
        expectedQty,
        recycleImage: itemPictureLink,
      };

      await seller.save();
      res.json({ message: "Seller profile updated successfully", data: seller });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// app.post("/seller/profile", async (req, res) => {
//   try {
//     const {
//       username,
//       location,
//       recycleItems,
//       itemPictureLink,
//       expectedQty,
//       phoneNumber,
//     } = req.body;



//     // testing purpose
//     const email = username
//     let profile = await SellerProfile.findOne({ email });

//     if (profile) {
//       // If the profile exists, update it
//       profile = await SellerProfile.findOneAndUpdate(
//         { username },
//         {
//           location,
//           recycleItems,
//           itemPictureLink,
//           expectedQty,
//           phoneNumber,
//         },
//         { new: true }
//       );

//     } else {
//       // If the profile doesn't exist, create a new one
//       profile = new Seller({
//         username,
//         location,
//         recycleItems,
//         itemPictureLink,
//         expectedQty,
//         phoneNumber,
//       });
//       await profile.save();
//     }

//     res.json({ message: 'Seller/Customer profile updated successfully', data: profile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }

// })





app.listen(3000, () => {
  console.log(`server is running on port 3000`)
})