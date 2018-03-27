const Rate = require('./../../models/rate');
const config = require('../../config');
const Axios = require('axios');

module.exports = {
  create: function(req, res) {
    const rate = new Rate({
      code: req.body.code,
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
    //Truncate the collection first
    Rate.remove({}, function(err){
      console.log('Rate collection is dropped.', err);
    });

    Axios.get(config.dataSource.base + '/AUD.json', {
      headers: {

      }
    })
      .then(function(response) {
        Object.keys(response.data.bpi).forEach(function(key) {
          const rate = new Rate({
            code: response.data.bpi[key].code,
            rate: response.data.bpi[key].rate,
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

        res.send(response.data);
      })
      .catch(function (error) {
        console.log('axios error: ', error);
      });
  }
};