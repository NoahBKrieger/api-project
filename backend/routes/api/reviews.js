const express = require('express');
const router = express.Router();

const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { User } = require('../../db/models');
const { Spot, SpotImage } = require('../../db/models');


const { requireAuth } = require('../../utils/auth');


// get reviews of current user
router.get('/current', requireAuth, async (req, res) => {

    const userReviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                as: 'User',
                attributes: { exclude: 'username email createdAt updatedAt hashedPassword' }
            },
            {
                model: Spot,
                as: 'Spot',
                attributes: { exclude: 'createdAt updatedAt' },
                include: [{
                    model: SpotImage,
                    attributes: ["url"],
                    where: { preview: true },
                    required: false
                }]
            },
            {
                model: ReviewImage,
                as: 'ReviewImages',
                attributes: { exclude: 'reviewId ReviewId createdAt updatedAt' }
            }
        ]
    })



    let resArr = []

    for (let i = 0; i < userReviews.length; i++) {

        let oneReview = {}

        let oneSpot = {}

        oneSpot.id = userReviews[i].Spot.id
        oneSpot.ownerId = userReviews[i].Spot.ownerId
        oneSpot.address = userReviews[i].Spot.address
        oneSpot.city = userReviews[i].Spot.city
        oneSpot.state = userReviews[i].Spot.state
        oneSpot.country = userReviews[i].Spot.country
        oneSpot.lat = userReviews[i].Spot.lat
        oneSpot.lng = userReviews[i].Spot.lng
        oneSpot.name = userReviews[i].Spot.name
        oneSpot.description = userReviews[i].Spot.description
        oneSpot.price = userReviews[i].Spot.price


        // // preview image url

        const prevImg = await SpotImage.findOne({ where: { spotId: oneSpot.id, preview: true } })

        if (prevImg) {
            oneSpot.previewImage = prevImg.url
        } else { oneSpot.previewImage = 'no preview image' }

        oneReview.id = userReviews[i].id
        oneReview.userId = userReviews[i].userId
        oneReview.spotId = userReviews[i].spotId
        oneReview.review = userReviews[i].review
        oneReview.stars = userReviews[i].stars
        oneReview.createdAt = userReviews[i].createdAt
        oneReview.updatedAt = userReviews[i].updatedAt
        oneReview.User = userReviews[i].User
        oneReview.Spot = oneSpot

        oneReview.ReviewImages = userReviews[i].ReviewImages










        resArr.push({ ...oneReview })
    }

    return res.json({ Reviews: resArr })
})



router.post('/:reviewId/images', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    const reviewToCheck = await Review.findOne({ where: { id: reviewId } })

    if (!reviewToCheck) {
        res.statusCode = 404
        return res.json({ message: "Review couldn't be found" })
    }

    if (currentUserId !== reviewToCheck.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    const checkImages = await ReviewImage.findAll({
        where: { reviewId: reviewId }
    })

    if (checkImages.length >= 10) {
        res.statusCode = 403
        return res.json({ message: "Maximum number of images for this resource was reached" })
    }

    const newImg = await ReviewImage.create({ reviewId: reviewId, url })

    const result = {
        'id': newImg.id,
        'url': newImg.url
    }
    return res.json(result);
});

router.put('/:reviewId', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;
    const id = req.params.reviewId;
    const { review, stars } = req.body;

    const reviewToCheck = await Review.findOne({ where: { id } })

    if (!reviewToCheck) {
        res.statusCode = 404
        return res.json({ message: "Review Couldn't be found" })
    }

    if (currentUserId !== reviewToCheck.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    await Review.update({ review, stars }, { where: { id } });

    const updated = await Review.findOne({ where: { id } })
    return res.json(updated);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;
    const id = req.params.reviewId;

    const reviewToCheck = await Review.findByPk(id)

    if (!reviewToCheck) {
        res.statusCode = 404
        return res.json({ message: "Review Couldn't be found" })
    }

    if (currentUserId !== reviewToCheck.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    await Review.destroy({ where: { id } });
    return res.json({ message: "Succesfully deleted" });
});


module.exports = router;
