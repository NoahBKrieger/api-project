const express = require('express');
const router = express.Router();

const { Booking, Spot, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;

    const userBookings = await Booking.findAll({
        where: {
            userId: currentUserId
        },
        include: {
            model: Spot,
            as: 'Spot',
            attributes: { exclude: 'createdAt updatedAt description' }
        }
    })

    let resArr = []

    for (let i = 0; i < userBookings.length; i++) {

        let oneBooking = {}
        let oneSpot = {}

        //spot object
        oneSpot.id = userBookings[i].Spot.id
        oneSpot.ownerId = userBookings[i].Spot.ownerId
        oneSpot.address = userBookings[i].Spot.address
        oneSpot.city = userBookings[i].Spot.city
        oneSpot.state = userBookings[i].Spot.state
        oneSpot.country = userBookings[i].Spot.country
        oneSpot.lat = userBookings[i].Spot.lat
        oneSpot.lng = userBookings[i].Spot.lng
        oneSpot.name = userBookings[i].Spot.name
        oneSpot.price = userBookings[i].Spot.price

        // // preview image url
        const prevImg = await SpotImage.findOne({ where: { spotId: oneSpot.id, preview: true } })

        if (prevImg) {
            oneSpot.previewImage = prevImg.url
        } else { oneSpot.previewImage = 'no preview image' }

        //booking object
        oneBooking.id = userBookings[i].id
        oneBooking.spotId = userBookings[i].spotId
        oneBooking.Spot = oneSpot
        oneBooking.userId = userBookings[i].userId
        oneBooking.startDate = userBookings[i].startDate
        oneBooking.endDate = userBookings[i].endDate
        oneBooking.createdAt = userBookings[i].createdAt
        oneBooking.updatedAt = userBookings[i].updatedAt


        resArr.push({ ...oneBooking })
    }
    return res.json({ Bookings: resArr })
})


router.put('/:bookingId', requireAuth, async (req, res) => {

    const id = req.params.bookingId
    let { startDate, endDate } = req.body
    const currUserId = req.user.id;

    if (!startDate) startDate = ''
    if (!endDate) endDate = ''

    const checkBooking = await Booking.findByPk(id)

    if (!checkBooking) {
        res.statusCode = 404
        return res.json({ message: "Booking couldn't be found" })
    }

    if (currUserId !== checkBooking.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }


    let badDatesErr = new Error

    badDatesErr.errors = {}
    badDatesErr.status = 403
    badDatesErr.title = "Sorry, this spot is already booked for the specified dates"

    const checkBookings = await Booking.findAll({
        where: { spotId: checkBooking.spotId }
    })

    let startNum = startDate.split('-').join();
    let endNum = endDate.split('-').join();

    for (let i = 0; i < checkBookings.length; i++) {
        if (checkBookings[i].startDate.split('-').join() <= startNum && startNum <= checkBookings[i].endDate.split('-').join()) {
            badDatesErr.errors.startDate = "Start date conflicts with an existing booking"
        }
        if (checkBookings[i].startDate.split('-').join() <= endNum && endNum <= checkBookings[i].endDate.split('-').join()) {
            badDatesErr.errors.endDate = "End date conflicts with an existing booking"
        }
        if (checkBookings[i].startDate.split('-').join() >= startNum && endNum >= checkBookings[i].endDate.split('-').join()) {
            badDatesErr.errors.startDate = "Start date conflicts with an existing booking"
            badDatesErr.errors.endDate = "End date conflicts with an existing booking"
        }
    };

    if (badDatesErr.errors.startDate || badDatesErr.errors.endDate) throw badDatesErr

    let q = new Date();
    let m = q.getMonth();
    let d = q.getDate();
    let y = q.getFullYear();

    let today = new Date(y, m, d);
    let checkEnd = new Date(checkBooking.endDate);

    if (checkEnd < today) {
        res.statusCode = 403
        return res.json({ message: "Past bookings cannot be modified" })
    }


    if (startDate !== '' && endDate !== '' && endNum < startNum) {
        res.statusCode = 400
        return res.json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }

    // if no errors
    await Booking.update({ startDate, endDate }, { where: { id } });
    const updated = await Booking.findByPk(id)
    return res.json(updated);
});

router.delete('/:bookingId', requireAuth, async (req, res) => {

    const id = req.params.bookingId
    const currUserId = req.user.id;

    const checkBooking = await Booking.findByPk(id)

    if (!checkBooking) {
        res.statusCode = 404
        return res.json({ message: "Booking couldn't be found" })
    }

    if (currUserId !== checkBooking.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    let q = new Date();
    let m = q.getMonth();
    let d = q.getDate();
    let y = q.getFullYear();

    let today = new Date(y, m, d);
    let checkStart = new Date(checkBooking.startDate);

    if (checkStart <= today) {
        res.statusCode = 403
        return res.json({ message: "Bookings that have been started can't be deleted" })
    }

    await Booking.destroy({ where: { id } });

    res.json({ message: "Succesfully deleted" });
});


module.exports = router;
