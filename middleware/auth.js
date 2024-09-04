const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({ message: 'Please login to access this resource' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'User not found, please login again' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Access token is not valid', error: error.message });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

            if (roles.includes(decoded.role)) {
                next();
            } else {
                res.status(403).json({ message: 'Access forbidden: insufficient role' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Access token is not valid', error: error.message });
        }
    };
};

module.exports = {
    isAuthenticated,
    authorizeRoles
};