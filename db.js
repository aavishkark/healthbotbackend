const mongoose = require('mongoose');
const connection = mongoose.connect("mongodb+srv://aavishkark:RjnOQSkCMrTKC9pv@cluster0.xh8xlzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
module.exports = {
    connection
}