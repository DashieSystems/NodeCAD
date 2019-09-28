const express = require('express');
const secured = require('../lib/middleware/secured');
const router = express.Router();
const roleLink = 'http://mydl.city/app_metadata';

/* GET home page. */
/* GET user profile. */
router.get('/timesheet', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  if (userProfile){
    if (userProfile.profile._json[roleLink].timesheet === true){
      return res.render('timesheet', {userContent: 'You are allowed to view the timesheet', title: 'NodeCAD | Timesheet'});
    }else{
      return res.send(403,{
        'status': 403,
        'code': 1,
        'message': 'You are not authorized!',
        'moreInfo': 'https://discord.mydl.city'
      });
    }
  }else{
    return res.send(401,{
      'status': 401,
      'code': 2,
      'message': 'You are not authenticated',
      'moreInfo': 'https://discord.mydl.city'      
    });
  }
});


module.exports = router;