const express = require('express');
const router = express.Router();

const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');


router.delete('/:imageId', requireAuth, async (req, res) => {

    const id = req.params.imageId;
    const currUserId = req.user.id;

    const checkImage = await SpotImage.findByPk(id)

    if (!checkImage) {
        res.statusCode = 404
        return res.json({ message: "Spot Image couldn't be found" })
    }

    const checkSpotOwner = await Spot.findOne({
        where: { id: checkImage.spotId }
    })

    if (currUserId !== checkSpotOwner.ownerId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    await SpotImage.destroy({ where: { id: id } });

    return res.json({ message: "Successfully deleted" });
});



module.exports = router;
