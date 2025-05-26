const mongoose = require('mongoose');

const calorieEntrySchema = new mongoose.Schema({
    foodItem: String,
    foodAmount: String,
    calories: String,
    proteins: String,
    fats: String,
    timestamp: { type: Date, default: Date.now }
  });

const useSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    height:String,
    weight:String,
    gender:String,
    age:String,
    activitylevel:String,
    calories: [calorieEntrySchema]
})

const UserModel = mongoose.model('user', useSchema);

module.exports = {
    UserModel
}