const express = require('express');
const { createHackathon, updateHackathon, deleteHackathon, getHackathons, getHackathonById } = require('../controllers/hackathonController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const courseRouter = express.Router();

courseRouter.post(
    '/create-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    createHackathon);

courseRouter.put(
    '/update-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    updateHackathon
);

courseRouter.delete(
    '/delete-hackathon',
    isAuthenticated,
    authorizeRoles("ADMIN"),
    deleteHackathon
);

courseRouter.get(
    '/get-hackathon',
    getHackathons
);

courseRouter.get('/get-hackathon/:id', getHackathonById);

module.exports = courseRouter;
