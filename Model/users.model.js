const mongoose = require('mongoose');

const calorieEntrySchema = new mongoose.Schema({
    query: String,
    foodItem: String,
    foodAmount: String,
    calories: String,
    timestamp: { type: Date, default: Date.now }
  });

const useSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    calories: [calorieEntrySchema]
})

const UserModel = mongoose.model('user', useSchema);

module.exports = {
    UserModel
}