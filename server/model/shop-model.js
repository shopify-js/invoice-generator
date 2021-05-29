'use strict';
const Mongoose = require('mongoose')

const Shop = Mongoose.model('Shop', {
    name: { type: String, required: true },
    isActive: { type: Boolean }
});

module.exports = Shop;