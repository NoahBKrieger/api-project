const express = require('express');
const router = express.Router();

const { Booking, Spot, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
// const { handleValidationErrors } = require('../../utils/validation');

router.get('/current', requireAuth, async (req, res) => {

    const currentUserId = req.user.id;

    const userBookings = await Booking.findAll({
        where: {
            userId: currentUserId
        },
        include: {
            model: Spot,
            as: 'Spot',
            attributes: { exclude: 'createdAt updatedAt' },
            include: {
                model: SpotImage,
                attributes: ['url'],
                where: { preview: true },
                required: false
            }
        }
    })
    return res.json({ Bookings: userBookings })
})


router.put('/:bookingId', requireAuth, async (req, res) => {

    const id = req.params.bookingId
    const { startDate, endDate } = req.body
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


    let badDatesErr = new Error('Bad request')

    badDatesErr.errors = {}
    badDatesErr.statusCode = 400

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
        return res.json({ message: "past bookings cannot be modified" })
    }


    if (endNum <= startNum) {
        res.statusCode = 400
        return res.json({ message: "endDate cannot be on or before startDate" })
    }

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
        res.statusCode = 400
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
