const joi = require("joi"); // for db schema validation such as  if any feild is missing 

module.exports.listingSchema = joi.object({
    listing : joi.object({
        tittle : joi.string().required(),
        description : joi.string().required(),
        price: joi.number().required().min(0),
        category: joi.string().required(),
        flavor: joi.string().required(),
        image : joi.string().allow("" , null)
    }).required()
})


module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).min(5),
        comment : joi.string().required(),
    }).required()
})