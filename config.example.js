const convict = require('convict');

// Define the parameters
const config = convict ({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV'
  },
  auth_id: {
    doc: 'Auth0 Client ID',
    format: String,
    default: 'YOUR_CLIENT_ID_HERE',
    env: 'AUTH0_CLIENT_ID'
  },
  auth_secret:{
    doc: 'Auth0 tenant secret key',
    format: String,
    default: 'YOUR_SECRET_KEY_HERE',
    env: 'AUTH0_CLIENT_SECRET'
  },
  auth_domain: {
    doc: 'Auth0 tenant domain name',
    format: String,
    default: 'YOUR_TENANT_DOMAIN_HERE',
    env: 'AUTH0_DOMAIN'
  },
  callback_url: {
    doc: 'Call back url to app',
    format: String,
    default: 'YOUR_CALLBACK_URL_HERE',
    env: 'AUTH0_CALLBACK_URL'
  }
});

// Load environment dependent configuration
//const env = config.get('env');
//config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;