const express = require('express');
const secured = require('../lib/middleware/secured');
const router = express.Router();
const roleLink = 'http://mydl.city/app_metadata';

/* GET home page. */
/* GET user profile. */
router.get('/ems', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  if (userProfile){
    if (userProfile.profile._json[roleLink].authorization.roles.includes('EMS') === true){
      return res.render('ems', {userContent: 'You are EMS', title: 'NodeCAD | EMS MDT'});
    }else{
      return res.status(403).send({
        'code': 1,
        'message': 'You are not ems!',
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