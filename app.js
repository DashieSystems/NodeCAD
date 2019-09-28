const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config.js');
// Load Passport
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emsRouter = require('./routes/ems');
const policeRouter = require('./routes/police');
const fireRouter = require('./routes/fire');
const dispatchRouter = require('./routes/dispatch');
const timesheetRouter = require('./routes/timesheet');

const app = express();

const strategy = new Auth0Strategy(
  {
    domain: config.get('auth_domain'),
    clientID: config.get('auth_id'),
    clientSecret: config.get('auth_secret'),
    callbackURL:
      config.get('callback_url') || 'http://localhost:3000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, { accessToken, profile});
  }
);

passport.use(strategy);




var sess = {
  secret: 'hesns765n5en7m56m54smn867u6757b1654sa3417',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}
// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));


app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', emsRouter);
app.use('/', policeRouter);
app.use('/', dispatchRouter);
app.use('/', fireRouter);
app.use('/', timesheetRouter);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
