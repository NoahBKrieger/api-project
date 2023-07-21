const express = require('express');
const router = express.Router();

const { ReviewImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');



router.delete('/:imageId', requireAuth, (req, res) => {

    const { id } = req.params.imageId;

    const deleted = ReviewImage.destroy({ id })

    return res.json(deleted)
})






module.exports = router;