const express = require('express');
const secured = require('../lib/middleware/secured');
const router = express.Router();
const roleLink = 'http://mydl.city/app_metadata';

/* GET home page. */
/* GET user profile. */
router.get('/dispatch', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  if (userProfile){
    if (userProfile.profile._json[roleLink].dispatch === true){
      return res.render('dispatch', {userContent: 'You are Dispatch', title: 'NodeCAD | Dispatch Console'});
    }else{
      return res.status(403).send({
        'code': 1,
        'message': 'You are not dispatch!',
        'moreInfo': 'https://discord.mydl.city'
      });
    }
  }else{
    return res.status(401).send({
      'code': 2,
      'message': 'You are not authenticated',
      'moreInfo': 'https://discord.mydl.city'      
    });
  }
});


module.exports = router;