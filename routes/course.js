const express = require('express');
const router = express.Router();
const { Course, User} = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Returns a list of courses (including the user that owns each course).
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include:[
            {
            model:User,
            attributes: ['firstName', 'lastName', 'emailAddress'],
            },
        ],
    });
    res.json(courses);
}));

// Returns the course (including the user that owns the course) for the provided course ID.
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include:[
            {
            model:User,
            attributes: ['firstName', 'lastName', 'emailAddress'],
            },
        ],
    });
    if(course) {
        res.json(course);
    } else {
        res.status(404).json({
            message: 'Id Not Found.',
        });
    }
}));

// Creates a course, sets the Location header to the URI for the course, and returns no content.
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.location(`/api/courses/${course.id}`);
    res.status(201).end();
}));

// Updates a course and returns no content checks if the course for the provided :id route parameter value is owned by the currently authenticated user.
// Returns a 403 status code if the current user does not own the requested course.
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course = await Course.findByPk(req.params.id);
    console.log(req.body);
    if(course && (user.id === course.userId)) {
        await course.update(req.body);
        res.status(204).end();
    } else if(course && (user.id !== course.userId)) {
        res.status(403).json({
            message: 'You can only update courses that you own.'
        })
    } else {
        res.status(404).json({
            message: `The course with the id ${req.params.id} could not be found.`
        });
    }
}));

// Deletes a course and returns no content.
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course = await Course.findByPk(req.params.id);
    if (course && (user.id === course.userId)) {
        await course.destroy();
        res.status(204).end();
    } else if(course && (user.id !== course.userId)) {
        res.status(403).json({
            message: 'You can only delete courses that you own.'
        }); 
    } else {
        res.status(404).json({
            message: `The course with the id ${req.params.id} could not be found.`
        });
    }
}));


module.exports = router;