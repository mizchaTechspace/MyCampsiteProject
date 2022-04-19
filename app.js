
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


// *****EXPORTS
const User = require('./models/user')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

// **Javascripts validate form in public folder should be first before Error
// Order does matter

// *****DB

const mongoose = require('mongoose');

main().catch((err) => {
    console.log('CONNECTION ERROR')
})

async function main() {
    await mongoose.connect('mongodb://localhost:27017/projectOne');
    await console.log('CONNECTION OPEN');
}

// ******

const app = express();
// *****SET

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// *****USE
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// *****Session

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// *****GET

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/home', (req, res) => {
    res.render('home')
})
app.get('/SCkeeper', (req, res) => {
    res.render('JSreview/SCkeeper');
})

app.get('/TVshow', (req, res) => {
    res.render('JSreview/tvShow');
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
app.listen(3000, () => {
    console.log("APP IS LISTENING TO PORT 3000...")
})

