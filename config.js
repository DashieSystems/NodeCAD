const convict = require('convict');

// Define the parameters
const config = convict ({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  auth_id: {
    doc: 'Auth0 Client ID',
    format: String,
    default: 'Q549C637469d2TTnGUBSFoxZsSFUziz5',
    env: 'AUTH0_CLIENT_ID'
  },
  auth_secret:{
    doc: 'Auth0 tenant secret key',
    format: String,
    default: '2oGaOYx6d4zC7j3NjQQ7igVsCEMFWhNuhSEwVPtLpPYS2vnyY8z6VMGKghL8BHu9',
    env: 'AUTH0_CLIENT_SECRET'
  },
  auth_domain: {
    doc: 'Auth0 tenant domain name',
    format: String,
    default: 'nodecad.auth0.com',
    env: 'AUTH0_DOMAIN'
  },
  callback_url: {
    doc: 'Call back url to app',
    format: String,
    default: 'http://localhost:3000/callback',
    env: 'AUTH0_CALLBACK_URL'
  }
});

// Load environment dependent configuration
//const env = config.get('env');
//config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;