const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const seedData = require('../Seeds/Data')
const Registration = require('../model/registration')

mongoose.connect('mongodb://127.0.0.1:27017/iedsinternationalschool', {
    // useNewUrlParser: true,
    // // useCreateIndex: true,
    // useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, " connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async (seedData) => {
    await Registration.deleteMany({})
    for (let i = 0; i < 100; i++) {


        const productData = sample(seedData);
        const prod = new Registration({
            studentNumber: productData.studentNumber,
            student: {
                firstName: productData.student.firstName,
                lastName: productData.student.lastName,
                age:productData.student.age,
                address: productData.student.address,
                gender: productData.student.gender,
                birthday: productData.student.birthday
              },
              parents: {
                fatherName: productData.parents.fatherName,
                motherName: productData.parents.motherName,
                motherOccupation: productData.parents.motherOccupation,
                fatherOccupation: productData.parents.fatherOccupation,
                phoneNumber:productData.parents.studentNumber,
              },
              curriculum: productData.curriculum,
              yearLevel: productData.yearLevel
        });
        await prod.save();
    }
};





seedDB(seedData);