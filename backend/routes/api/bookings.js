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

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}${month}${day}`;


    const checkBooking = await Booking.findByPk(id)

    if (!checkBooking) {
        res.statusCode = 404
        return res.json({ message: "Booking couldn't be found" })
    }

    if (currUserId !== checkBooking.userId) {
        res.statusCode = 403
        return res.json({ message: 'Forbidden' })
    }

    if (checkBooking.endDate.split('-').join() < currentDate) {
        console.log(currentDate)
        res.statusCode = 403
        return res.json({ message: "past bookings cannot be modified" })
    }

    await Booking.update({ startDate, endDate }, { where: { id } });

    const updated = await Booking.findByPk(id)

    return res.json(updated);
});

router.delete('/:bookingId', requireAuth, async (req, res) => {

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}${month}${day}`;


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

    if (checkBooking.startDate.split('-').join() < currentDate) {
        res.statusCode = 403
        return res.json({ message: "Bookings that have been started can't be deleted" })
    }
    await Booking.destroy({ where: { id } });

    res.json({ message: "Succesfully deleted" });
});


module.exports = router;
