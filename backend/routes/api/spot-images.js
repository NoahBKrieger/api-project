const express = require('express');
const router = express.Router();

const { SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');


router.delete('/:imageId', requireAuth, (req, res) => {

    const { id } = req.params.imageId;

    const deleted = SpotImage.destroy({ id });

    return res.json(deleted);
});



module.exports = router;
