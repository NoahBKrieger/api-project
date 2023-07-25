const express = require('express');
const router = express.Router();

const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { Booking } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (page > 10) size = 10;

    if (Number.isNaN(size) || size > 20) size = 20;
    if (size < 1) size = 1;

    const allSpots = await Spot.findAll({
        limit: size,
        offset: size * (page - 1),
        // where: {},
        include: {
            model: SpotImage,
            // where: { preview: true },
            attributes: { exclude: 'id spotId createdAt updatedAt' }
        }
    })

    return res.json({ Spots: allSpots, "page": page, "size": size })
})

router.get('/current', requireAuth, async (req, res) => {

    const currSpot = await Spot.findAll({
        where: { ownerId: req.user.id }
    })
    return res.json(currSpot)
})

router.get('/:spotId', async (req, res) => {

    const spotId = req.params.spotId

    const spot = await Spot.findOne({

        where: { id: spotId },
        attributes: { exclude: 'createdAt updatedAt' },

        include: [{
            model: SpotImage,
            as: 'SpotImages',
            attributes: { exclude: 'spotId createdAt updatedAt' }
        }, {
            model: User,
            as: 'User',
            attributes: { exclude: 'username email createdAt updatedAt hashedPassword' }
        }

        ]
    })

    return res.json(spot)
})

router.post('/', requireAuth, async (req, res) => {

    const ownerId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({ ownerId: ownerId, address, city, state, country, lat, lng, name, description, price })

    res.statusCode = 201;
    return res.json(newSpot)
})


router.post('/:spotId/images', requireAuth, async (req, res) => {

    const { url, preview } = req.body
    const id = req.params.spotId
    const userId = req.user.id;

    const newOne = await Spot.findByPk(id)

    if (!newOne) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    }

    if (newOne.ownerId !== userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    const newImg = await SpotImage.create({ spotId: id, url, preview })


    return res.json(newImg)
});

router.put('/:spotId', requireAuth, async (req, res) => {

    const spotId = req.params.spotId;
    const userId = req.user.id;

    let newOne = await Spot.findByPk(spotId);

    if (!newOne) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    };
    if (newOne.ownerId !== userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    await Spot.update({ address, city, state, country, lat, lng, name, description, price },
        { where: { id: spotId } });

    newOne = await Spot.findByPk(spotId);

    return res.json(newOne);
});

router.delete('/:spotId', requireAuth, async (req, res) => {

    const spotId = req.params.spotId;
    const userId = req.user.id;

    let validCheck = await Spot.findByPk(spotId);

    if (!validCheck) {

        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found" })

    }
    if (validCheck.ownerId !== userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    await Spot.destroy({ where: { id: spotId } });

    return res.json({ message: 'Succesfully deleted' })
});

//get reviews by spot
router.get('/:spotId/reviews', async (req, res) => {

    const spotId = req.params.spotId

    const checkSpot = await Spot.findByPk(spotId)

    if (!checkSpot) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    }

    const spotReviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                as: 'User',
                attributes: { exclude: 'username email createdAt updatedAt hashedPassword' }
            },
            {
                model: ReviewImage,
                as: 'ReviewImages',
                attributes: { exclude: 'reviewId createdAt updatedAt' }
            }
        ]
    })

    return res.json(spotReviews)
});

router.post('/:spotId/reviews', requireAuth, async (req, res) => {

    const id = req.params.spotId;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const checkSpot = await Spot.findByPk(id)

    if (!checkSpot) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    }

    const checkReviewsOfSpot = await Review.findOne({
        where: {
            userId: userId,
            spotId: id
        }
    })

    if (checkReviewsOfSpot) {
        res.statusCode = 403;
        return res.json({ message: 'User already has a review for this spot' })
    }

    const newReview = await Review.create({ spotId: Number.parseInt(id), userId: userId, review, stars })

    res.statusCode = 201
    return res.json(newReview)
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const id = req.params.spotId;
    const userId = req.user.id;

    const checkSpot = await Spot.findByPk(id)

    if (!checkSpot) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    }

    if (userId === checkSpot.ownerId) {

        const spotBookings = await Booking.findAll({
            where: {
                spotId: id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.json({ Bookings: [spotBookings] })
    } else {
        const spotBookings = await Booking.findAll({
            where: {
                spotId: id
            },
            include: {
                model: User,
                as: 'User',
                attributes: ['id', 'firstName', 'lastName']
            }
        })
        return res.json({ Bookings: [spotBookings] })
    }
})

router.post('/:spotId/bookings', requireAuth, async (req, res) => {

    const id = req.params.spotId
    const { startDate, endDate } = req.body
    const userId = req.user.id;

    let startNum = startDate.split('-').join();
    let endNum = endDate.split('-').join();

    if ((endNum) <= (startNum)) {
        res.statusCode = 400
        return res.json({ message: 'Enddate must be later than startdate' })
    }

    const checkBooking = await Booking.findAll({
        where: {
            spotId: id
        }
    })

    for (let i = 0; i < checkBooking.length; i++) {

        if (checkBooking[i].startDate.split('-').join() <= startNum && startNum <= checkBooking[i].endDate.split('-').join()) {

            res.statusCode = 400
            return res.json({ message: "Start date conflicts with an existing booking" })
        }

        if (checkBooking[i].startDate.split('-').join() <= endNum && endNum <= checkBooking[i].endDate.split('-').join()) {

            res.statusCode = 400
            return res.json({ message: "End date conflicts with an existing booking" })
        }
    };

    const checkSpot = await Spot.findByPk(id)

    if (!checkSpot) {
        res.statusCode = 404
        return res.json({ message: "Spot couldn't be found" })
    }

    if (userId === checkSpot.ownerId) {
        res.statusCode = 400
        return res.json({ message: 'Spot must NOT belong to the current user' })
    }

    await Booking.create({ spotId: id, userId, startDate, endDate })

    const newBooking = await Booking.findAll({ where: { spotId: id, startDate } })

    return res.json(newBooking)
})


module.exports = router;
