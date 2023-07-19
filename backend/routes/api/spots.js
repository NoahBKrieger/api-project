const express = require('express');

const router = express.Router();

const { Spot } = require('../../db/models');


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

    const spot = await Spot.findByPk(req.params.spotId, {

    })

    return res.json(spot)
})

router.post('/', async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({ address, city, state, country, lat, lng, name, description, price })

    res.statusCode(201)
    return res.json(newSpot)
})




module.exports = router;
