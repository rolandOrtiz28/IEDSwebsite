const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/CatchAsync')
const Subscribe = require('../model/Subscribe')

router.post('/subs', catchAsync(async (req, res) => {
    const { email } = req.body;
    const existingEmail = await Subscribe.findOne({ email });

    if (existingEmail) {
        req.flash('error', 'A user with the given email is already subscribed, Please try another email');
        return res.redirect('/');
    }

    const subscriber = new Subscribe({ email });
    await subscriber.save();

    req.flash('success', 'Thank you for subscribing to our newsletter! Stay tuned for the latest updates and news.');
    res.redirect('/');
}));


module.exports = router