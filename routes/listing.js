const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

router.get("/cookies", (req, res) => {
  // if(!req.isAuthenticated()){
  //   req.flash("error" , "You must be logged In");
  //   return res.redirect("/login");
  // }
  res.render("listings/cookies.ejs");
});


router.get("/cakes", (req, res) => {
  // if(!req.isAuthenticated()){
  //   req.flash("error" , "You must be logged In");
  //   return res.redirect("/login");
  // }
  res.render("listings/cake.ejs");
});


router.get("/ice-cream", (req, res) => {
  // if(!req.isAuthenticated()){
  //   req.flash("error" , "You must be logged In");
  //   return res.redirect("/login");
  // }
  res.render("listings/ice-cream.ejs");
});

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);



//New Route
router.get("/new", isLoggedIn, (req, res) => {
  // if(!req.isAuthenticated()){
  //   req.flash("error" , "You must be logged In");
  //   return res.redirect("/login");
  // }
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" }, })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Rooms You requested for does not exists!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //   throw new ExpressError(400 , "Send valid data for listing") // error handling for new sweets
    // }

    const newListing = new Listing(req.body.listing);

    // if(!newListing.title){
    //   throw new ExpressError(400 , "Name is missing") // schema error handling
    // }
    // if(!newListing.description){
    //   throw new ExpressError(400 , "Description is missing") // schema error handling
    // }
    // if(!newListing.price){
    //   throw new ExpressError(400 , "Price is missing") // schema error handling
    // }
    // if(!newListing.category){
    //   throw new ExpressError(400 , "Category is missing") // schema error handling
    // }
    // if(!newListing.flavor){
    //   throw new ExpressError(400 , "Flavor is missing") // schema error handling
    // }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("Success", "New Room Created! ");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,

  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Room You requested for does not exists!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!currUser && listing.owner.equals(res.locals.currUser._id)){
    //   req.flash("error" , "you don't have permission to edit");
    //   return res.redirect(`/listings/${id}`);
    // }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("Success", "Room Updated! ");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("Success", "Room Deleted! ");
    res.redirect("/listings");
  })
);


// for orering
// router.post(
//   "/:id/order",
//   isLoggedIn, (req,res) => {
  
//     // res.render("order.ejs");
// });


router.get(
  "/:id/order",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      
      res.redirect("/listings");
    }
    req.flash("Thanks! For Booking");
    res.render("listings/order.ejs");
    
  })
);




module.exports = router;
