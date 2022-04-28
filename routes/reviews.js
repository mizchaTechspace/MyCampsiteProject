const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const { validateReview, loggedInReview, isReviewAuthor } = require('../middleware')
const campgroundReview = require('../controllers/reviewControl')

router.post('/', loggedInReview, validateReview, catchAsync(campgroundReview.createReview))

router.delete('/:reviewId', loggedInReview, isReviewAuthor, catchAsync(campgroundReview.deleteReview))

module.exports = router;
