const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./SchemaValidate')
const Campground = require('./models/campground');
const Review = require('./models/review')

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // if this is true, use returnTo behavior to store the requested url
        req.session.returnTo = req.originalUrl
        req.flash('warning', 'You must be signed in first!')
        return res.redirect('/login')
        // Must return this or otherwise the code below will still run
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Must be the author to edit or delete.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.loggedInReview = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!req.isAuthenticated()) {
        req.session.returnTo = `/campgrounds/${campground._id}`
        req.flash('warning', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Must be the author to delete.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
