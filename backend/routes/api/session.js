// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// const { check } = require('express-validator');

// const { handleValidationErrors } = require('../../utils/validation');

// const validateLogin = [
//     check('credential')
//         .exists({ checkFalsy: true })
//         .notEmpty()
//         .withMessage({ credential: 'Please provide a valid email or username.' }),
//     check('password')
//         .exists({ checkFalsy: true })
//         .withMessage({ password: 'Please provide a password.' }),
//     handleValidationErrors
// ];


// backend/routes/api/session.js



// Log in
router.post(
    '/',

    async (req, res, next) => {
        const { credential, password } = req.body;

        let err = new Error;
        err.statuscode = 400
        err.errors = {}
        if (!credential) {
            err.errors.credential = "Email or username is required"
        }

        if (!password) {
            err.errors.passwords = "Password is required"
        }

        if (err.errors.credential || err.errors.password) throw err

        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });

        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            // const err = new Error('Login failed');
            // err.status = 401;
            // err.title = 'Login failed';
            // err.errors = { credential: 'The provided credentials were invalid.' };
            // return next(err);

            res.status(401)
            return res.json({ message: "Invalid credentials" })
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);


// Log out
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
}
);

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
}
);



module.exports = router;
