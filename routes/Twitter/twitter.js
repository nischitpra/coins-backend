var express = require('express');
var router = express.Router();
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const WebSocket = require('ws')
const pythoninvoker=require('../../routes/pythoninvoker')
const service = require('./service')

// for general search tweets
router.get('/q', function(req, res, next) {
    const symbol=req.query[id.twitter.symbol]
    const coinName=req.query[id.twitter.coinName]
    presenter.getSpecificTweetsDb(coinName,symbol,(status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});

// for home tweets
router.get('/h', function(req, res, next) {
    presenter.getTweetsDb((status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});

router.get('/sentiment',function(req, res, next) {
    pythoninvoker.getSentimentTrend((status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});

// update tweet (after removing spams)
router.get('/ut',function(req, res, next) {
    var symbol=req.query[id.twitter.symbol]
    var coinName=req.query[id.twitter.coinName]
    if(symbol==undefined||symbol==null) symbol="btc"
    if(coinName==undefined||coinName==null) symbol="bitcoin"
    service.updateTweetDb(coinName,symbol)
    
});


// update good bad tweet
router.get('/ugb', function(req, res, next) {
    service.updateGoodBadTweets((status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});
// get good bad tweets
router.get('/ggb', function(req, res, next) {
    presenter.getGoodBadTweetsDb((status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});

module.exports = router;