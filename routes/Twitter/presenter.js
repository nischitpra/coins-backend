const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const connection = require('../connection')

/** twitter api */
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: values.twitter.consumerKey,
    consumer_secret: values.twitter.consumerSecret,
    access_token_key: values.twitter.accessTokenKey,
    access_token_secret: values.twitter.accessTokenSecret,
});

module.exports={
    searchTweets(name,symbol,callback){
        console.log(`getting tweet for ${symbol}`)
        connection.searchTweets(client,name,symbol,callback)
    },
   
}
