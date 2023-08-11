const express = require('express');
const router = express.Router();

const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { User } = require('../../db/models');
const { Spot } = require('../../db/models');


const { requireAuth } = require('../../utils/auth');


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
                attributes: { exclude: 'createdAt updatedAt' }
            },
            {
                model: ReviewImage,
                as: 'ReviewImages',
                attributes: { exclude: 'reviewId ReviewId createdAt updatedAt' }
            }
        ]
    })
    return res.json({ Reviews: userReviews })
})

// router.get('/:spotId/reviews', async (req, res) => {

//     const spotId = req.params.spotId

//     const spotReviews = await Review.findAll({
//         where: {
//             spotId: spotId
//         },
//         include: [
//             {
//                 model: User,
//                 as: 'User',
//                 attributes: { exclude: 'username email createdAt updatedAt hashedPassword' }
//             },
//             {
//                 model: ReviewImage,
//                 as: 'ReviewImages',
//                 attributes: { exclude: 'reviewId createdAt updatedAt' }
//             }
//         ]
//     })
//     return res.json(spotReviews)
// });

// router.post('./:spotId/reviews', requireAuth, async (req, res) => {

//     const id = req.params.spotId;
//     const { review, stars } = req.body;
//     const userId = req.user.id;

//     const newReview = Review.create({ spotId: id, userId: userId, review, stars })

//     return res.json(newReview)
// });

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
