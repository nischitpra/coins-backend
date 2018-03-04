var express = require('express');
var router = express.Router();
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const WebSocket = require('ws')


/* GET search tweets. */
router.get('/q', function(req, res, next) {
    const symbol=req.query[id.twitter.symbol]
    const coinName=req.query[id.twitter.coinName]

    presenter.searchTweets(coinName,symbol,
        (data)=>res.json({
            status:'200',
            [id.twitter.symbol]:symbol,
            message: data[id.twitter.statuses]
        })
    )
});


  



module.exports = router;