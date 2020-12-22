'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
        id: user.id,
    });
}));

// Creates an user, sets the "Location" header to "/", returns no content
router.post('/', asyncHandler(async (req, res, next) => {
        if (req.body.password){
           req.body.password = bcrypt.hashSync(req.body.password, 10); 
        }
        await User.create(req.body);
        res.location('/');
        res.status(201).end();
        // If the above fails it is caught by the ayncHandler helper function and passed to the global handler
}));

module.exports = router;