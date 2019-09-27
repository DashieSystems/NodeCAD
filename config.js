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
    doc: 'ALasVGn642CxICoW7rOSojAgoveIBwFo',
    format: String,
    default: 'ALasVGn642CxICoW7rOSojAgoveIBwFo',
    env: 'AUTH0_CLIENT_ID'
  },
  auth_secret:{
    doc: 'Auth0 tenant secret key',
    format: String,
    default: 'VHmnVj880Wu-jUIwKQgyq9Xq-UhTlRaG9xubVs-ub2-NWd_NfVKnNtdKtInTQafJ',
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