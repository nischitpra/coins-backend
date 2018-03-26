const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const connection = require('../connection')
const db = require('../database')
const pythoninvoker=require('../../routes/pythoninvoker')


/** twitter api */
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: values.twitter.consumerKey,
    consumer_secret: values.twitter.consumerSecret,
    access_token_key: values.twitter.accessTokenKey,
    access_token_secret: values.twitter.accessTokenSecret,
});

module.exports={
    getSpecificTweetsDb(name,symbol,callback){
        console.log(`getting tweet for ${symbol}`)
        db.findMany(id.database.collection.tweets,{[id.twitter.tweet.text] : {$regex : new RegExp( `${name}|${symbol}`, 'i')}},(status,data)=>{
            callback(status,data)
        })
    },
    getTweetsDb(callback){
        console.log(`getting home tweets`)
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
            item[id.twitter.tweet.index]=i
            item[id.twitter.tweet.text]=data[i][id.twitter.tweet.text]
            item[id.twitter.tweet.timestamp]=data[i][id.twitter.tweet.createdAt]
            list.push(item)
        }
        return list
    },
    postFilterTweetsList(data,filteredData){
        list=[]
        console.log(`filtered data length: ${filteredData.length}`)
        console.log(`${filteredData}`)
        for(var i in filteredData){
            var item=data[filteredData[i][id.twitter.tweet.index]]
            list.push(item)
        }
        console.log(JSON.stringify(list))
        return list
    },
    getGoodBadTweetsDb(callback){
        console.log(`getting good bad tweet`)
        db.findMany(id.database.collection.goodBadTweets,{},(status,data)=>{
            callback(status,data)
        })
    }
    
}
