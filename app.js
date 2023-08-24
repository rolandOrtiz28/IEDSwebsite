const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const session = require('express-session')
const ejsMate = require('ejs-mate')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash')
const methodOverride = require('method-override')
const MongoDBStore = require("connect-mongo");
const mongoSanitize = require('express-mongo-sanitize');
const catchAsync = require('./utils/CatchAsync')
const nodemailer = require('nodemailer')

const Registration = require('./model/registration')
const Admin = require('./model/admin')

// routes
const studentRoute = require('./routes/registration')
const subscribeRoute = require('./routes/subscribe')
const adminRoute = require('./routes/admin')
const cors = require('cors');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/iedsinternationalschool'


mongoose.connect(dbUrl, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, " connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})
const secret = process.env.SESSION_SECRET

const sessionConfig = {
    secret,
    name: '_rolandOrtiz',
    resave: false,
    saveUninitialized: true,
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(cors({
    origin: ['https://cdn.jsdelivr.net', 'https://kit.fontawesome.com'],
    credentials: true, // Include cookies in the request (if applicable)
}));

app.set('view engine', 'ejs');  // This line sets EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')))

app.use(express.json())
app.use(methodOverride('_method'));
app.use(session(sessionConfig))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
app.use(flash());

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})

app.get('/', async (req, res) => {
    try {
        const stats = await Registration.aggregate([
            { $group: { _id: '$curriculum', count: { $sum: 1 } } }
        ]);

        const curriculumStats = {
            'Khmer Education Program': 0,
            'International English Program': 0,
            'Chinese Language Classes': 0,
            'General English Program': 0
        };

        stats.forEach(stat => {
            if (curriculumStats.hasOwnProperty(stat._id)) {
                curriculumStats[stat._id] = stat.count;
            }
        });

        res.render('home/home', { curriculumStats });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/faculty', (req, res) => {
    res.render('faculties/faculty')
})
app.get('/curriculums', (req, res) => {
    res.render('curriculums/curriculums')
})


app.post('/send', catchAsync(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    // create a mail options object that defines the email content
    const mailOptions = {
        from: `${email}`,
        to: process.env.GMAIL_EMAIL,
        subject: `New contact form submission: ${subject}`,
        html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
    };

    // send the email using the transporter object
    await transporter.sendMail(mailOptions);

    req.flash('success', 'Thank you for your message! We will get back to you soon.');
    res.redirect('/');
}));




app.use('/', studentRoute);
app.use('/', subscribeRoute);
app.use('/', adminRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});