const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb+srv://tempnikhil9887:7orpHQT4MSMR0ed9@cluster0.iyxo6zp.mongodb.net/";

// const MONGO_URL = "mongodb+srv://anshkmr991:ansh@123456@cluster0.mtiofuo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const dburl = process.env.ATLASDB_URL;

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitiatized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge :  7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// app.post("/order", (req, res) => {
//   res.redirect("form for order");
// });
// your cahages start here

// app.get("/order" , (req,res) => {
//   res.render("./includes/order.ejs");
// })

// your cahages ends here

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //for checking that is that the same user
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res ,next) => {
  res.locals.success = req.flash("Success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser" , async (req,res)  => {
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "student",
//   })

//  let registeredUser =  await User.register(fakeUser , "helloworld");
//  res.send(registeredUser);
// })

// const validateListing = (req,res,next) => {
//   let {error} = listingSchema.validate(req.body);

//   if(error){
//     let errMsg = error.details.map((el) => el.message).join(",")
//     throw new ExpressError(400 , errMsg);
//   }
//   else{
//     next();
//   }
// }

// //Index Route
// app.get("/listings",wrapAsync( async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));

// //New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// //Show Route
// app.get("/listings/:id",wrapAsync( async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// }));

// //Create Route
// app.post("/listings",
// wrapAsync( async (req, res , next) => {
//   // if(!req.body.listing){
//   //   throw new ExpressError(400 , "Send valid data for listing") // error handling for new sweets
//   // }

//     const newListing = new Listing(req.body.listing);

//     // if(!newListing.title){
//     //   throw new ExpressError(400 , "Name is missing") // schema error handling
//     // }
//     // if(!newListing.description){
//     //   throw new ExpressError(400 , "Description is missing") // schema error handling
//     // }
//     // if(!newListing.price){
//     //   throw new ExpressError(400 , "Price is missing") // schema error handling
//     // }
//     // if(!newListing.category){
//     //   throw new ExpressError(400 , "Category is missing") // schema error handling
//     // }
//     // if(!newListing.flavor){
//     //   throw new ExpressError(400 , "Flavor is missing") // schema error handling
//     // }
//     await newListing.save();
//     res.redirect("/listings");
//   })
// );

// //Edit Route
// app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// app.put("/listings/:id", wrapAsync( async (req, res) => {

//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// }));

// review route
// post route

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);
// app.post("/listings/:id/reviews" , async (req,res) =>{
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview)
//   await newReview.save();
//   await listing.save();
//  res.redirect(`/listings/${listing._id}`)
// })

// // app.get("/testListing", async (req, res) => {
// //   let sampleListing = new Listing({
// //     title: "My New Villa",
// //     description: "By the beach",
// //     price: 1200,
// //     location: "Calangute, Goa",
// //     country: "India",
// //   });

// //   await sampleListing.save();
// //   console.log("sample was saved");
// //   res.send("successful testing");
// // });

// // delete rote for comment
// app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async (req,res) =>{
//   let {id , reviewId} = req.params;

//   await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
//   await Review.findByIdAndDelete(reviewId);

//   res.redirect(`/listings/${id}`);
// }))

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found! "));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somethig went Wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(9090, () => {
  console.log("server is listening to port 9090");
});
