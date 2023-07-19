const express = require('express');

const router = express.Router();

const { Spot } = require('../../db/models');

const { SpotImage } = require('../../db/models');


router.get('/',

    async (req, res) => {

        const allSpots = await Spot.findAll()

        return res.json(allSpots)
    })

router.get('/current', async (req, res) => {

    const currSpot = await Spot.findOne({

        // where: {ownerId = // ???}
    })

    return res.json(currSpot)
})

router.get('/:spotId', async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId)

    return res.json(spot)
})

router.post('/', async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({ address, city, state, country, lat, lng, name, description, price })

    res.statusCode(201)
    return res.json(newSpot)
})


router.post('/:spotId/images', async (req, res) => {

    const { url, preview } = req.body
    const { id } = req.params.spotId

    const newImg = await SpotImage.create({ spotId: id, url, preview })

    return res.json(newImg)

})

router.put('/:spotId', async (req, res) => {

    const { id } = req.params.spotId;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const updated = await Spot.update({ address, city, state, country, lat, lng, name, description, price },
        { where: { id } });

    return res.json(updated);

});

router.delete('/:spotId', async (req, res) => {

    const { id } = req.params.spotId;

    const deleted = await Spot.destroy({ where: { id } });

    return res.json(deleted);
});



module.exports = router;
