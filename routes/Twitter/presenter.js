const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const connection = require('../connection')
const db = require('../database')

/** twitter api */
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: values.twitter.consumerKey,
    consumer_secret: values.twitter.consumerSecret,
    access_token_key: values.twitter.accessTokenKey,
    access_token_secret: values.twitter.accessTokenSecret,
});

module.exports={
    getTweets(name,symbol,callback){
        console.log(`getting tweet for ${symbol}`)
        db.findMany(id.database.collection.tweets,{},(status,data)=>{
            callback(status,data)
        })
    },
    searchTweets(name,symbol,callback){
        console.log(`getting tweet for ${symbol}`)
        connection.searchTweets(client,name,symbol,callback)
    },
    saveTweet(data){

    },
    preFilterTweetsList(data){
        list=[]
        for(var i in data){
            var item={}
            item['text']=data[i]['text']
            item['index']=i
            list.push(item)
        }
        return list
    },
    postFilterTweetsList(data,filteredData){
        return filteredData
        list=[]
        for(var i in filteredData){
            var item=data[filteredData[i]['index']]
            list.push(item)
        }
        return list
    },
   
}
