const joi=require("joi");
module.exports.listingSchema=joi.object({
        listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        contactinfo:joi.string().required(),
        image:joi.string().allow("",null),
        category:joi.string().required(),
        booking:joi.string().required(),       
    }).required(),
});
module.exports.reviewSchema=joi.object({
    review: joi.object({
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required(),
}).required(),
});

module.exports.ticketSchema=joi.object({
    ticket: joi.object({
    name:joi.string().required(),
    Quantity:joi.number().required().min(1),
    entrydate:joi.date().required().min('now').message('Exit date must be greater than or equal to today.'),
    exitdate:joi.date().required().min('now').message('Exit date must be greater than or equal to today.'),     
}).required(),
});
