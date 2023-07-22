const express = require('express');
const router = express.Router();

const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');


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
            attributes: { exclude: 'createdAt updatedAt' }
        }
    })
    return res.json({ Bookings: [userBookings] })
})

// router.get('/:spotId/bookings', requireAuth, async (req, res) => {

//     const id = req.params.spotId
//     const spotBookings = await Booking.findAll({
//         where: {
//             spotId: id
//         }
//     })
//     return res.json(spotBookings)
// })

// router.post('./:spotId/bookings', requireAuth, async (req, res) => {

//     const { id } = req.params.spotId
//     const { startDate, endDate } = req.body

//     const newBooking = Booking.create({ spotId: id, startDate, endDate })

//     return res.json(newBooking)
// })

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
        res.statusCode = 400
        return res.json({ message: 'Booking must belong to the current user' })
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
        return res.json({ message: 'Booking must belong to the current user' })
    }
    await Booking.destroy({ where: { id } });

    res.json({ message: "Succesfully deleted" });
});


module.exports = router;
