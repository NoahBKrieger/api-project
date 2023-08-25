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

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');


// const validateSpot = [
//     check('address')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 2 })
//         .withMessage("Street address is required"),
//     check('city')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 2 })
//         .withMessage("City is required"),
//     check('state')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 2 })
//         .withMessage("State is required"),
//     check('country')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 2 })
//         .withMessage("Country is required"),
//     check('lat')
//         .exists({ checkFalsy: true })
//         .withMessage("Latitude is not valid"),
//     check('lng')
//         .exists({ checkFalsy: true })
//         .withMessage("Longitude is not valid"),
//     check('name')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 1, max: 50 })
//         .withMessage("Name must be less than 50 characters"),
//     check('description')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 6 })
//         .withMessage("Description is required"),
//     check('price')
//         .exists({ checkFalsy: true })
//         .withMessage('Price per day is required'),
//     handleValidationErrors
// ];



router.get('/', async (req, res) => {

    let err = new Error
    err.errors = {}
    err.statusCode = 400

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    let options = {}

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (page < 1) err.errors.page = "Page must be greater than or equal to 1"
    if (page > 10) err.errors.page = 'Page must be less than or equal to 10'

    if (Number.isNaN(size)) size = 20;
    if (size < 1) err.errors.size = "Size must be greater than or equal to 1"
    if (size > 20) err.errors.size = 'Size must be less than or equal to 20'


    options.limit = size;
    options.offset = size * (page - 1)


    options.where = {}

    if (!minLat) minLat = -90
    let minLatObj;
    minLat = parseFloat(minLat)
    if (typeof minLat == 'number' && minLat >= -90 && minLat <= 90) {
        minLatObj = { [Op.gte]: minLat }
    } else err.errors.minLat = "Minimum latitude is invalid"

    if (!maxLat) maxLat = 90
    let maxLatObj;
    maxLat = parseFloat(maxLat)
    if (typeof maxLat === 'number' && maxLat >= -90 && maxLat <= 90) {
        maxLatObj = { [Op.lte]: maxLat }
    } else err.errors.maxLat = "Maximum latitude is invalid"
    options.where.lat = { ...minLatObj, ...maxLatObj }


    if (!minLng) minLng = -180
    let minLngObj;
    minLng = parseFloat(minLng)
    if (typeof minLng === 'number' && minLng >= -180 && minLng <= 180) {
        minLngObj = { [Op.gte]: minLng }
    } else err.errors.minLng = "Minimum longitude is invalid"

    if (!maxLng) maxLng = 180
    let maxLngObj;
    maxLng = parseFloat(maxLng)
    if (typeof maxLng === 'number' && maxLng >= -180 && maxLng <= 180) {
        maxLngObj = { [Op.lte]: maxLng }
    } else err.errors.maxLng = "Maximum longitude is invalid"
    options.where.lng = { ...minLngObj, ...maxLngObj }


    if (!minPrice) minPrice = 0
    let minPriceObj;
    minPrice = parseFloat(minPrice)
    if (typeof minPrice === 'number') {
        minPriceObj = { [Op.gte]: minPrice }
    }
    if (minPrice < 0) err.errors.minPrice = "Minimum price must be greater than or equal to 0"



    if (!maxPrice) maxPrice = 9999999999
    let maxPriceObj;
    maxPrice = parseFloat(maxPrice)
    if (typeof maxPrice === 'number') {
        maxPriceObj = { [Op.lte]: maxPrice }
    }
    if (maxPrice < 0) err.errors.maxPrice = "Maximum price must be greater than or equal to 0"


    options.where.price = { ...minPriceObj, ...maxPriceObj }


    //throw errors
    if (err.errors.page || err.errors.size || err.errors.minPrice || err.errors.maxPrice || err.errors.minLat || err.errors.maxLat || err.errors.minLng || err.errors.maxLng) throw err


    let resArr = []

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
        // attributes: { exclude: 'createdAt updatedAt' },

        include: [{
            model: SpotImage,
            as: 'SpotImages',
            attributes: { exclude: 'spotId createdAt updatedAt' }
        }, {
            model: User,
            as: 'User',
            attributes: { exclude: 'username email createdAt updatedAt hashedPassword' }
        }]
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
    } else { resSpot.numReviews = 'no reviews', resSpot.avgStarRating = 'no reviews' }



    resSpot.SpotImages = spot.SpotImages
    resSpot.Owner = spot.User



    return res.json({ ...resSpot })
})

router.post('/', requireAuth, async (req, res) => {

    const ownerId = req.user.id;

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({
        ownerId: ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

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

    res.statusCode = 200;
    return res.json({ id: newImg.id, url: newImg.url, preview: newImg.preview })
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


    await Spot.update(
        { address, city, state, country, lat, lng, name, description, price },
        { where: { id: spotId }, }
    );

    newOne = await Spot.findByPk(spotId, { attributes: { exclude: 'createdAt updatedAt' } });

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

    return res.json({ Reviews: spotReviews })
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

    if (userId !== checkSpot.ownerId) {

        const spotBookings = await Booking.findAll({
            where: {
                spotId: id
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.json({ Bookings: spotBookings })
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
        return res.json({ Bookings: spotBookings })
    }
})

// create a booking
router.post('/:spotId/bookings', requireAuth, async (req, res) => {

    const id = req.params.spotId
    const { startDate, endDate } = req.body
    const userId = req.user.id;



    let startNum = startDate.split('-').join();
    let endNum = endDate.split('-').join();

    if (endNum <= startNum) {
        res.statusCode = 400
        return res.json({ message: "endDate cannot be on or before startDate" })
    }

    const checkBooking = await Booking.findAll({
        where: {
            spotId: id
        }
    })


    // NEEDS BETTER ERROR HANDLING VVV

    let badDatesErr = new Error

    badDatesErr.errors = {}
    badDatesErr.statusCode = 400

    for (let i = 0; i < checkBooking.length; i++) {
        if (checkBooking[i].startDate.split('-').join() <= startNum && startNum <= checkBooking[i].endDate.split('-').join()) {
            // res.statusCode = 400
            // return res.json({ message: "Start date conflicts with an existing booking" })
            badDatesErr.errors.startDate = "Start date conflicts with an existing booking"
        }
        if (checkBooking[i].startDate.split('-').join() <= endNum && endNum <= checkBooking[i].endDate.split('-').join()) {
            // res.statusCode = 400
            // return res.json({ message: "End date conflicts with an existing booking" })
            badDatesErr.errors.endDate = "End date conflicts with an existing booking"
        }
    };

    if (badDatesErr.errors.startDate || badDatesErr.errors.endDate) throw badDatesErr

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
