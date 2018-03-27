'use strict';

const path = require('path');
const settings = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/..'),
  port: process.env.PORT || 5000,
  ip: process.env.IP || '0.0.0.0',
  seedDB: false,
  secrets: {
    session: 'bitcoin-win'
  },
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost:27017'
  },

  // data source
  dataSource: {
    base: 'https://api.coindesk.com/v1/bpi/currentprice'
  },

  // oAuth Login
  facebook: {},
  twitter: {},
  google: {}
};

module.exports = settings;