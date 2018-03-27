const Rate = require('./../../models/rate');
const config = require('../../config');
const Axios = require('axios');
const _ = require('lodash');

module.exports = {
  create: function(req, res) {
    const rate = new Rate({
      code: req.body.code,
      old_rate: req.body.rate,
      old_rate_float: req.body.rate_float,
      rate: req.body.rate,
      rate_float: req.body.rate_float,
      description: req.body.description,
      updated: req.body.updated
    });

    rate.save(function(err) {
      if (err) {
        res.json({
          status: 'error',
          error: err
        });
      } else {
        res.json({
          status: 'successful',
          data: rate
        });
      }
    });
  },

  index: function(req, res) {
    Rate.find({}, function(err, rate) {
      if (err) {
        res.json({
          status: 'error',
          error: err
        });
      } else {
        res.json(rate);
      }
    });
  },

  findRateByCode: function(req, res) {
    const code = req.params.code;

    Rate.findOne({ code: code }, function(err, rate) {
      if (err) {
        res.json({
          status: 'error',
          error: err
        });
      } else {
        res.json(rate);
      }
    });
  },

  seedRates: function(req, res) {
    const _obj = this;
    const searchRates = function(collection, code) {
      return _.find(collection, function(rate){
        return rate.code === code;
      });
    };

    Axios.get(config.dataSource.base + '/AUD.json', {
      headers: {}
    })
      .then(function(response) {
        // get old data before removing it
        Rate.find({}, function(err, oldRate) {
          const oldRateCollection = oldRate;
          console.log('oldRateCollection: ', oldRateCollection);

          Rate.remove({}, function(err){
            console.log('Rate collection is dropped.', err);
          });

          Object.keys(response.data.bpi).forEach(function(key) {
            const rate = new Rate({
              code: response.data.bpi[key].code,
              old_rate: searchRates(oldRateCollection, key).rate,
              rate: response.data.bpi[key].rate,
              old_rate_float: searchRates(oldRateCollection, key).rate_float,
              rate_float: response.data.bpi[key].rate_float,
              description: response.data.bpi[key].description,
              updated: response.data.time.updated
            });

            rate.save(function(err) {
              if (err) {
                console.log('callback error: ', err);
                return handleError(err);
              }
              return;
            });
          });

          if (err) console.log('Retrieve old rate error: ', err);
        });

        if (res !== null) res.send(response.data);
      })
      .catch(function (error) {
        console.log('axios error: ', error);
      });
  },

  tickerUpdate: function() {
    const _obj = this;
    var count = 0;
    setInterval(function () {
      _obj.seedRates(null, null);
      console.log('updated at ' + new Date().toLocaleString() + ' ticker: ', count++);
    }, 60000);  // update the db every two minutes
  }
};