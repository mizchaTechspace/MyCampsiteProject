
if (process.env.NODE_ENVIRONMENT !== "production") {
    require('dotenv').config()
}
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/projectOne'

// *****DATABASE

const mongoose = require('mongoose');

main().catch((err) => {
    console.log('CONNECTION ERROR...', err)
})

async function main() {
    await mongoose.connect(dbUrl);
    await console.log('DATABASE CONNECTION OPEN...');
}


// *****EXPORTS
const User = require('./models/user');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const secret = process.env.SECRET || 'thisshouldbeabettersecret!'
// **Javascripts validate form in public folder should be first before Error.
// ***Order does matter.


// ******APP

const app = express();
// *****SET

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// *****USE
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

// *****MongoStore
const store = MongoStore.create({
    mongoUrl: dbUrl,
    ttl: 7 * 24 * 60 * 60,
    // = 7 days. Default
    crypto: {
        secret,
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR:", e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// *****Session
app.use(session(sessionConfig))
app.use(flash())

// ******SECURITY

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css",
    "mapbox://styles/mapbox/streets-v11",
    "mapbox://styles/mapbox/light-v10",
    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`
];
const fontSrcUrls = [];

// app.use(helmet({ crossOriginEmbeddedPolicy: false }))

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// ******PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//******session flash must be under passport
app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.warning = req.flash('warning')
    next()
})

// *****ROUTES

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

// *****GET

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/entertainment/scorekeeper', (req, res) => {
    res.render('entertainment/SCkeeper');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
// try{}catch(e){next(e)}
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! Something Went Wrong'
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`APP IS LISTENING TO PORT ${port}... `)
})

