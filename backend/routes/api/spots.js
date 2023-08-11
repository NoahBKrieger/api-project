const express = require('express');
const router = express.Router();

const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { Booking } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const { Op } = require("sequelize")

router.get('/', async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    let options = {}

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page) || page < 1) page = 1;
    if (page > 10) size = 10;

    if (Number.isNaN(size) || size > 20) size = 20;
    if (size < 1) size = 1;

    options.limit = size;
    options.offset = size * (page - 1)



    options.where = {}


    if (!minLat) minLat = -999999
    let minLatObj;
    minLat = parseFloat(minLat)
    if (typeof minLat === 'number') {
        minLatObj = { [Op.gte]: minLat }
    }

    if (!maxLat) maxLat = 9999999
    let maxLatObj;
    maxLat = parseFloat(maxLat)
    if (typeof maxLat === 'number') {
        maxLatObj = { [Op.lte]: maxLat }
    }
    options.where.lat = { ...minLatObj, ...maxLatObj }




    if (!minLng) minLng = -9999999
    let minLngObj;
    minLng = parseFloat(minLng)
    if (typeof minLng === 'number') {
        minLngObj = { [Op.gte]: minLng }
    }

    if (!maxLng) maxLng = 9999999
    let maxLngObj;
    maxLng = parseFloat(maxLng)
    if (typeof maxLng === 'number') {
        maxLngObj = { [Op.lte]: maxLng }
    }
    options.where.lng = { ...minLngObj, ...maxLngObj }




    if (!minPrice) minPrice = -9999999
    let minPriceObj;
    minPrice = parseFloat(minPrice)
    if (typeof minPrice === 'number') {
        minPriceObj = { [Op.gte]: minPrice }
    }

    if (!maxPrice) maxPrice = 9999999
    let maxPriceObj;
    maxPrice = parseFloat(maxPrice)
    if (typeof maxPrice === 'number') {
        maxPriceObj = { [Op.lte]: maxPrice }
    }
    options.where.price = { ...minPriceObj, ...maxPriceObj }


    let resArr = []

    // options.include = [{
    //     model: SpotImage,
    //     // where: { preview: true },
    //     attributes: { exclude: 'id spotId createdAt updatedAt' }
    // }]


    const allSpots = await Spot.findAll(options)

    for (let i = 0; i < allSpots.length; i++) {

        let oneSpot = {}

        oneSpot.id = allSpots[i].id
        oneSpot.ownerId = allSpots[i].ownerId
        oneSpot.address = allSpots[i].address
        oneSpot.city = allSpots[i].city
        oneSpot.state = allSpots[i].state
        oneSpot.country = allSpots[i].country
        oneSpot.lat = allSpots[i].lat
        oneSpot.lng = allSpots[i].lng
        oneSpot.name = allSpots[i].name
        oneSpot.description = allSpots[i].description
        oneSpot.price = allSpots[i].price
        oneSpot.createdAt = allSpots[i].createdAt
        oneSpot.updatedAt = allSpots[i].updatedAt



        //review rating average

        const spotsReviews = await Review.findAll({
            where: { spotId: allSpots[i].id }
        })

        if (spotsReviews.length) {

            let sum = 0;

            for (j = 0; j < spotsReviews.length; j++) {
                sum += spotsReviews[j].stars
            }

            let avgStar = sum / spotsReviews.length

            oneSpot.avgRating = avgStar
        } else { oneSpot.avgRating = 'no reviews' }



        // preview image url

        const prevImg = await SpotImage.findOne({ where: { spotId: allSpots[i].id, preview: true } })

        if (prevImg) {
            oneSpot.previewImage = prevImg.url
        } else { oneSpot.previewImage = 'no preview image' }


        resArr.push({ ...oneSpot })
    }






    return res.json({ Spots: resArr, "page": page, "size": size })
})


// find all current users spots

router.get('/current', requireAuth, async (req, res) => {

    const allSpots = await Spot.findAll({
        where: { ownerId: req.user.id }
    })

    let resArr = []

    for (let i = 0; i < allSpots.length; i++) {

        let oneSpot = {}

        oneSpot.id = allSpots[i].id
        oneSpot.ownerId = allSpots[i].ownerId
        oneSpot.address = allSpots[i].address
        oneSpot.city = allSpots[i].city
        oneSpot.state = allSpots[i].state
        oneSpot.country = allSpots[i].country
        oneSpot.lat = allSpots[i].lat
        oneSpot.lng = allSpots[i].lng
        oneSpot.name = allSpots[i].name
        oneSpot.description = allSpots[i].description
        oneSpot.price = allSpots[i].price
        oneSpot.createdAt = allSpots[i].createdAt
        oneSpot.updatedAt = allSpots[i].updatedAt


        //review rating average

        const spotsReviews = await Review.findAll({
            where: { spotId: allSpots[i].id }
        })

        if (spotsReviews.length) {

            let sum = 0;

            for (j = 0; j < spotsReviews.length; j++) {
                sum += spotsReviews[j].stars
            }

            let avgStar = sum / spotsReviews.length

            oneSpot.avgRating = avgStar
        } else { oneSpot.avgRating = 'no reviews' }



        // preview image url

        const prevImg = await SpotImage.findOne({ where: { spotId: allSpots[i].id, preview: true } })

        if (prevImg) {
            oneSpot.previewImage = prevImg.url
        } else { oneSpot.previewImage = 'no preview image' }


        resArr.push({ ...oneSpot })
    }

    return res.json({ Spots: resArr })
})


// get details of a spot by id
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





    let resSpot = {}

    resSpot.id = spot.id
    resSpot.ownerId = spot.ownerId
    resSpot.address = spot.address
    resSpot.city = spot.city
    resSpot.state = spot.state
    resSpot.country = spot.country
    resSpot.lat = spot.lat
    resSpot.lng = spot.lng
    resSpot.name = spot.name
    resSpot.description = spot.description
    resSpot.price = spot.price
    resSpot.createdAt = spot.createdAt
    resSpot.updatedAt = spot.updatedAt


    //review rating average

    const spotsReviews = await Review.findAll({
        where: { spotId: spot.id }
    })

    if (spotsReviews.length) {

        let sum = 0;

        for (j = 0; j < spotsReviews.length; j++) {
            sum += spotsReviews[j].stars
        }

        let avgStar = sum / spotsReviews.length

        resSpot.numReviews = spotsReviews.length
        resSpot.avgStarRating = avgStar
    } else { resSpot.avgRating = 'no reviews' }



    resSpot.SpotImages = spot.SpotImages
    resSpot.Owner = spot.User



    return res.json({ ...resSpot })
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

    if (preview === true) {
        const checkPreviewImg = await SpotImage.findAll({ where: { spotId: id, preview: true } })

        if (checkPreviewImg.length > 0) {
            res.statusCode = 404
            return res.json({ message: 'Spot already has preview image' })
        }
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
