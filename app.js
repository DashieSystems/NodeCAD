const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const config = require('./config.js');
// Load Passport
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const mysql = require('mysql2/promise');
const userInViews = require('./lib/middleware/userInViews');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emsRouter = require('./routes/ems');
const policeRouter = require('./routes/police');
const fireRouter = require('./routes/fire');
const dispatchRouter = require('./routes/dispatch');
const timesheetRouter = require('./routes/timesheet');
const mapRouter = require('./routes/map');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://a3999ff08ad941938586a62bcd96cdbf@sentry.io/1770284' });

const log = console.log;
const dir = console.dir;


// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.get('jwksUri')
  }),
    // Validate the audience and the issuer.
    audience: config.get('auth0Audience'),
    issuer: config.get('auth0Issuer'),
    algorithms: ['RS256']
  });

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

(async () =>{
  //MySQL setup
  log('Connecting to MySQL...')
  myCon = await mysql.createPool({
      host: config.get('mysqlHost'),
      user: config.get('mysqlUser'),
      password: config.get('mysqlPassword'),
      database: config.get('mysqlDatabase'),
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
  });
  dir('Connected to the MySQL server!');
})()

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', emsRouter);
app.use('/', policeRouter);
app.use('/', dispatchRouter);
app.use('/', fireRouter);
app.use('/', timesheetRouter);
app.use('/', mapRouter);

app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.post('/api/911', checkJwt, async function(req, res) {
  try {
    const idSql = 'SELECT `identifier` FROM `users` WHERE `phone_number` = ?';
    let idInserts = [req.body.phone];
    userId = await myCon.execute(idSql, idInserts);
    let finalUserId = userId[0][0].identifier;
    const insId = 'INSERT INTO `dispatch_history` (identifier, message, phone) VALUES (?, ?, ?)';
    let insIdInserts = [finalUserId, req.body.message, req.body.phone];
    await myCon.execute(insId, insIdInserts);
    return res.send('okay')
  } catch (error) {
    dir(error);
  } finally {
    await myCon.release();
  }
});

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