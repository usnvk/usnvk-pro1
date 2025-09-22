// backend/models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isVegetarian: { type: Boolean, required: true },
    isNonVegetarian: { type: Boolean, required: true },
    properties: [String], // e.g., ['Hot', 'Easy to Digest']
    tastes: [String], // e.g., ['Sweet', 'Sour']
    allergens: [String], // e.g., ['gluten', 'dairy']
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;