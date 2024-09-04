const app = require("./app")
const cloudinary = require('cloudinary').v2;
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

//create server
app.listen(PORT, () => {
    console.log(`Server is connected with port ${PORT}`);
});
