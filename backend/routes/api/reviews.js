const express = require('express');

const router = express.Router();

const { Review } = require('../../db/models');

const { ReviewImage } = require('../../db/models');


router.get('/current', async (req, res) => {

    const userReviews = await Review.findAll({
        where: {
            userId: currentUser // ??
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
})

router.post('./:spotId/reviews', async (req, res) => {

    const { id } = req.params.spotId
    const { review, stars } = req.body

    const newReview = Review.create({ spotId: id, review: review, stars: stars })

    return res.json(newReview)
})

router.post('/:reviewId/images', async (req, res) => {

    const { id } = req.params.reviewId
    const { url } = req.body

    const newImg = await ReviewImage.create({ reviewId: id, url })

    return res.json(newImg);
});

router.put('/:reviewId', async (req, res) => {

    const { id } = req.params.reviewId;
    const { review, stars } = req.body;

    const updated = await Review.update({ review, stars },
        { where: { id } });

    return res.json(updated);
});

router.delete('/:reviewid', async (req, res) => {
    const { id } = req.params;
    const deleted = await Review.destroy({ where: { id } });
    res.json(deleted);
});


module.exports = router;
