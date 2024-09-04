const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || 'USER',
            },
        });

        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        let JWTPayload = {
            id: user.id,
            email: email,
            role: user.role
        };
        const accessToken = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user,
            accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

module.exports = { signup, login };
