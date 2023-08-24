const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SubscribeSchema = new Schema({
    email: {
        type: String,
        required: true,

    }


}, { timestamps: true })


module.exports = mongoose.model('Subscribe', SubscribeSchema);