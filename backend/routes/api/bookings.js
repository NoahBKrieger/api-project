const express = require('express');
const router = express.Router();

const { Booking } = require('../../db/models');


router.get('/current', async (req, res) => {

    const userBookings = await Booking.findAll({
        where: {
            userId: currentUser// ??!!
        }
    })
    return res.json(userBookings)
})

router.get('/:spotId/bookings', async (req, res) => {

    const { id } = req.params.spotId
    const spotBookings = await Booking.findAll({
        where: {
            spotId: id
        }
    })
    return res.json(spotBookings)
})

router.post('./:spotId/bookings', async (req, res) => {

    const { id } = req.params.spotId
    const { startDate, endDate } = req.body

    const newBooking = Booking.create({ spotId: id, startDate, endDate })

    return res.json(newBooking)
})

router.put('/:bookingId', async (req, res) => {

    const { id } = req.params.bookingId;
    const { startDate, endDate } = req.body;

    const updated = await Booking.update({ startDate, endDate },
        { where: { id } });

    return res.json(updated);
});

router.delete('/:bookingid', async (req, res) => {
    const { id } = req.params;
    const deleted = await Booking.destroy({ where: { id } });
    res.json(deleted);
});


module.exports = router;
