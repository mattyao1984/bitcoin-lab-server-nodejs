var express = require('express');
var RateController = require('./rate.controller');
var router = express.Router();

module.exports = function(app) {
  app.get('/api/rates', RateController.index);
  app.get('/api/rates/:code', RateController.findRateByCode);
  app.get('/api/rates-update', RateController.seedRates);
};