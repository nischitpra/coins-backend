var news = require('./News/news')

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('getting from homepage')
  news.getNews(req.query.i,req.query.c,req.query.p, (data)=>
    res.json({
      status:'200',
      message: data
    })
  )
});

module.exports = router;
