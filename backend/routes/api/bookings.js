const express = require('express');
const router = express.Router();

const { Booking } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

router.get('/current', requireAuth, async (req, res) => {

    const { currentUserId } = req.user.id;

    const userBookings = await Booking.findAll({
        where: {
            userId: currentUserId
        }
    })
    return res.json(userBookings)
})

router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const { id } = req.params.spotId
    const spotBookings = await Booking.findAll({
        where: {
            spotId: id
        }
    })
    return res.json(spotBookings)
})

router.post('./:spotId/bookings', requireAuth, async (req, res) => {

    const { id } = req.params.spotId
    const { startDate, endDate } = req.body

    const newBooking = Booking.create({ spotId: id, startDate, endDate })

    return res.json(newBooking)
})

router.put('/:bookingId', requireAuth, async (req, res) => {

    const { id } = req.params.bookingId;
    const { startDate, endDate } = req.body;

    const updated = await Booking.update({ startDate, endDate },
        { where: { id } });

    return res.json(updated);
});

router.delete('/:bookingid', requireAuth, async (req, res) => {
    const { id } = req.params;
    const deleted = await Booking.destroy({ where: { id } });
    res.json(deleted);
});


module.exports = router;
