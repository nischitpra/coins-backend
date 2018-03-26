const db = require('../database')
const connection = require('../connection')
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const pythoninvoker=require('../../routes/pythoninvoker')

module.exports={
    updateTweetDb(callback){
        presenter.searchTweets('btc','bitcoin',(status,data)=>{
            var preparedList=presenter.preFilterTweetsList(data)
            pythoninvoker.getFilteredTweet(JSON.stringify(preparedList),(status,filteredData)=>{
                db.insertMany(id.database.collection.tweets,filteredData,(status,message)=>callback(status,message))
            })
        })
    },
}