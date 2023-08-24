const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    student: {
        studentNumber: String,
        firstName: String,
        lastName: String,
        age: Number,
        address: String,
        gender: String,
        birthday: Date,
    },
    parents: {
        fatherName: String,
        motherName: String,
        motherOccupation: String,
        fatherOccupation: String,
        phoneNumber: Number
    },
    curriculum: String,
    yearLevel: String
});

module.exports = mongoose.model('Registration', registrationSchema);