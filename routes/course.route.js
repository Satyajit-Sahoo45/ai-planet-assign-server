const express = require('express');
const { createHackathon, updateHackathon, deleteHackathon, getHackathons } = require('../controllers/hackathonController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const courseRouter = express.Router();

courseRouter.post(
    '/create-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    createHackathon);

courseRouter.post(
    '/update-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    updateHackathon
);

courseRouter.post(
    '/delete-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    deleteHackathon
);

courseRouter.get(
    '/get-hackathon',
    getHackathons
);

module.exports = courseRouter;
