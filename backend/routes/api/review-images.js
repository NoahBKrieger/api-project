const express = require('express');
const router = express.Router();

const { ReviewImage } = require('../../db/models');
const { Review } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');



router.delete('/:imageId', requireAuth, async (req, res) => {

    const id = req.params.imageId;
    const currUserId = req.user.id;

    const checkImage = await ReviewImage.findByPk(id)

    if (!checkImage) {
        res.statusCode = 404
        return res.json({ message: "Review Image couldn't be found" })
    }

    const checkReviewOwner = await Review.findOne({
        where: { id: checkImage.reviewId }
    })

    if (currUserId !== checkReviewOwner.userId) {
        res.statusCode = 400
        return res.json({ message: 'Forbidden' })
    }

    await ReviewImage.destroy({ where: { id: id } });

    return res.json({ message: "Successfully deleted" });
})






module.exports = router;
