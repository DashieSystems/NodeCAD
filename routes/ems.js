const express = require('express');
const secured = require('../lib/middleware/secured');
const router = express.Router();

/* GET home page. */
/* GET user profile. */
router.get('/ems', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render('ems', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;