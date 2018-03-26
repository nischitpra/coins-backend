var express = require('express');
var router = express.Router();
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const WebSocket = require('ws')
const pythoninvoker=require('../../routes/pythoninvoker')
const service = require('./service')

/* GET search tweets. */
// router.get('/q', function(req, res, next) {
//     const symbol=req.query[id.twitter.symbol]
//     const coinName=req.query[id.twitter.coinName]
//     presenter.searchTweets(coinName,symbol,
//         (status,data)=>{
//             var preparedList=presenter.preFilterTweetsList(data)
//             pythoninvoker.getFilteredTweet(JSON.stringify(preparedList),(status,filteredData)=>{
//                 res.json({
//                     status: status,
//                     message: presenter.postFilterTweetsList(data,filteredData)
//                 })
//             })
//         }
//     )
// });

router.get('/q', function(req, res, next) {
    const symbol=req.query[id.twitter.symbol]
    const coinName=req.query[id.twitter.coinName]
    presenter.getTweets(coinName,symbol,(status,data)=>{
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

router.get('/updateDb',function(req, res, next) {
    service.updateTweetDb((status,data)=>{
        res.json({
            status:status,
            message: data
        })
    })
});

module.exports = router;