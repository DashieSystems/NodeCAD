const express = require('express');
const secured = require('../lib/middleware/secured');
const router = express.Router();


/* GET home page. */
router.get('/', secured(), function (req, res, next) {
  res.render('index', { title: 'Auth0 Webapp sample Nodejs' });
});

module.exports = router;