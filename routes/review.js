const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


router.post("/" ,isLoggedIn, async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();
    req.flash("Success" , "New Review Created! ")
   res.redirect(`/listings/${listing._id}`)
  })
  
  // app.get("/testListing", async (req, res) => {
  //   let sampleListing = new Listing({
  //     title: "My New Villa",
  //     description: "By the beach",
  //     price: 1200,
  //     location: "Calangute, Goa",
  //     country: "India",
  //   });
  
  //   await sampleListing.save();
  //   console.log("sample was saved");
  //   res.send("successful testing");
  // });
  
  
  // delete rote for comment
  router.delete("/:reviewId" , isLoggedIn ,isReviewAuthor ,  wrapAsync(async (req,res) =>{
    let {id , reviewId} = req.params;
  
  
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success" , "Review Deleted! ")
    res.redirect(`/listings/${id}`);
  }));


  module.exports = router;