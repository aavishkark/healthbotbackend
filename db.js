require('dotenv').config();
const mongoose = require('mongoose');
const connection = mongoose.connect(`mongodb+srv://aavishkark:${process.env.MONGOOSE_PASSWORD}@cluster0.xh8xlzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
module.exports = {
    connection
}