const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("cloudinary");

// Create Hackathon
const createHackathon = async (req, res) => {
    try {
        const { name, startDate, endDate, description, image, level, organizerId } = req.body;
        if (image) {
            let thumb = {};
            try {
                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "courses",
                });

                thumb = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };

                console.log(thumb, "uploaded image")

            } catch (error) {
                console.log(error)
            }
        }
        const hackathon = await prisma.hackathon.create({
            data: {
                name,
                startDate,
                endDate,
                description,
                thumb,
                level,
                organizer: { connect: { id: organizerId } }
            }
        });
        res.status(201).json(hackathon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Hackathon
const updateHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, description, image, level } = req.body;
        const hackathon = await prisma.hackathon.update({
            where: { id: parseInt(id) },
            data: {
                name,
                startDate,
                endDate,
                description,
                image,
                level
            }
        });
        res.status(200).json(hackathon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Hackathon
const deleteHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.hackathon.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHackathons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const [hackathons, totalCount] = await Promise.all([
            prisma.hackathon.findMany({
                skip,
                take: limit,
            }),
            prisma.hackathon.count(),
        ]);

        res.json({
            hackathons,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createHackathon,
    updateHackathon,
    deleteHackathon,
    getHackathons
};
