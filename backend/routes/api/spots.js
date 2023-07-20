const express = require('express');
const router = express.Router();

const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {

    const allSpots = await Spot.findAll()

    return res.json(allSpots)
})

router.get('/current', requireAuth, async (req, res) => {

    const currSpot = await Spot.findAll({
        where: { ownerId: req.user.id }
    })
    return res.json(currSpot)
})

router.get('/:spotId', async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId)

    return res.json(spot)
})

router.post('/', requireAuth, async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({ address, city, state, country, lat, lng, name, description, price })

    res.statusCode(201)
    return res.json(newSpot)
})


router.post('/:spotId/images', requireAuth, async (req, res) => {

    const { url, preview } = req.body
    const { id } = req.params.spotId

    const newImg = await SpotImage.create({ spotId: id, url, preview })

    return res.json(newImg)

})

router.put('/:spotId', requireAuth, async (req, res) => {

    const { id } = req.params.spotId;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const updated = await Spot.update({ address, city, state, country, lat, lng, name, description, price },
        { where: { id } });

    return res.json(updated);

});

router.delete('/:spotId', requireAuth, async (req, res) => {

    const { id } = req.params.spotId;

    const deleted = await Spot.destroy({ where: { id } });

    return res.json(deleted);
});



module.exports = router;
