const express = require('express');
const router = express.Router();

const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');


router.get('/current', requireAuth, async (req, res) => {

    const userReviews = await Review.findAll({
        where: {
            userId: req.user.id
        }
    })
    return res.json(userReviews)
})

router.get('/:spotId/reviews', async (req, res) => {

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    })
    return res.json(spotReviews)
});

router.post('./:spotId/reviews', requireAuth, async (req, res) => {

    const { id } = req.params.spotId;
    const { review, stars } = req.body;
    const { userId } = req.user.id;

    const newReview = Review.create({ spotId: id, userId: userId, review, stars })

    return res.json(newReview)
});

router.post('/:reviewId/images', requireAuth, async (req, res) => {

    const { id } = req.params.reviewId
    const { url } = req.body

    const newImg = await ReviewImage.create({ reviewId: id, url })

    return res.json(newImg);
});

router.put('/:reviewId', requireAuth, async (req, res) => {

    const { currentUserId } = req.user.id;
    const { id } = req.params.reviewId;
    const { review, stars } = req.body;

    const reviewToCheck = await Review.findByPk({ id })

    if (currentUserId !== reviewToCheck.userId) {
        throw new Error('Review must belong to the current user')
    }

    const updated = await Review.update({ review, stars },
        { where: { id } });
    return res.json(updated);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {

    const { currentUserId } = req.user.id;
    const { id } = req.params.reviewId;

    const reviewToCheck = await Review.findByPk({ id })

    if (currentUserId !== reviewToCheck.userId) {
        throw new Error('Review must belong to the current user')
    }

    const deleted = await Review.destroy({ where: { id } });
    return res.json(deleted);
});


module.exports = router;
