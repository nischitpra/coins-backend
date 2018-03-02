var express = require('express');
var router = express.Router();
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const WebSocket = require('ws')


/* GET home page. */
router.get('/history', function(req, res, next) {
    const from=req.query[id.cryptocompare.from]
    const to=req.query[id.cryptocompare.to]
    const exchange=req.query[id.cryptocompare.exchange]
    const historyType=req.query[id.cryptocompare.historyType]
    const fromTime=req.query[id.cryptocompare.fromTime]
    const toTime=req.query[id.cryptocompare.toTime]

    presenter.getHistory(historyType,from,to,exchange,fromTime,toTime,
        (type,data)=>res.json({
            status:'200',
            [id.cryptocompare.historyType]:type,
            message: data
        })
    )
});


/* GET favourites. */
router.get('/favourites', function(req, res, next) {
    const from=req.query[id.cryptocompare.from]
    const to=req.query[id.cryptocompare.to]
    const exchange=req.query[id.cryptocompare.exchange]

    presenter.getFavourites(from,to,exchange,
        (data)=>res.json({
            status:'200',
            message: data
        })
    )
});


/* GET coinlist. */
router.get('/coinlist', function(req, res, next) {
    presenter.getCoinList(
        (data,baseImageUrl)=>res.json({
            status:'200',
            message: data,
            baseImageUrl:baseImageUrl,
        })
    )
});


/* GET socket subscription list. */
router.get('/subs', function(req, res, next) {
    const from=req.query[id.cryptocompare.from]
    const to=req.query[id.cryptocompare.to]

    presenter.getSubsList(from,to,
        (data,baseImageUrl)=>res.json({
            status:'200',
            message: data,
        })
    )
});


  



module.exports = router;