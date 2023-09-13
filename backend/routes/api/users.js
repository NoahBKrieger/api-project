// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();
const { Op } = require("sequelize")

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');


// const validateSignup = [
//     check('email')
//         .exists({ checkFalsy: true })
//         .isEmail()
//         .withMessage({ 'email': 'Please provide a valid email.' }),
//     check('username')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 4 })
//         .withMessage('Please provide a username with at least 4 characters.'),
//     check('username')
//         .not()
//         .isEmail()
//         .withMessage('Username cannot be an email.'),

//     check('password')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 6 })
//         .withMessage('Password must be 6 characters or more.'),
//     handleValidationErrors
// ];

// Sign up


router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    const checkUniqueUser = await User.findOne({
        where: {
            [Op.or]: [{ email: email }, { username: username },]
        }

    })

    // check if user exists in db
    if (checkUniqueUser) {
        let val
        // let err = new Error()
        res.statusCode = 500
        if (checkUniqueUser.username === username) {
            // err.title = "User already exists"
            // // err.path = "username"
            // err.message = "User with that username already exists"
            // throw err
            val = {
                message: "User already exists",
                errors: {
                    username: "User with that username already exists"
                }
            }

            return res.json(val);
        } else {



            // err.title = "User already exists"
            // err.msg = { email: "User with that email already exists" }
            // throw err

            return res.json({
                message: "User already exists",
                errors: {
                    email: "User with that email already exists"
                }
            })
        }


    }


    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        }
    });
}
);

router.get('/', async (req, res) => {

    if (!req.user) {

        res.statusCode = 200
        return res.json({ User: null })
    }
    const currUser = await User.findOne({
        scope: defaultScope,
        where: { id: req.user.id },

    })



    return res.json(currUser)
}
)

module.exports = router;
