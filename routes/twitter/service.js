const db = require('../database')
const connection = require('../connection')
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const pythoninvoker=require('../../routes/pythoninvoker')

module.exports={
    updateTweetDb(name,symbol){
        presenter.streamTweets(name,symbol)
    },
    updateGoodBadTweets(callback){
        presenter.getTweetsDb((status,data)=>{
            var preparedList=presenter.preFilterTweetsList(data)
            console.log(`${preparedList.length} records`)
            pythoninvoker.getGoodBadTweet(JSON.stringify(preparedList),(status,goodBadData)=>{
                // console.log(`returned good bad data length: ${goodBadData.length}`)
                callback(values.status.ok,goodBadData)
                // goodBadData=presenter.postFilterTweetsList(data,goodBadData)
                // if(goodBadData.length>0){
                //     console.log(`we have ${goodBadData.length} data to insert`)
                //     db.insertMany(id.database.collection.goodBadTweets,goodBadData,(status,message)=>callback(status,message))
                // }else{
                //     console.log(`no data to insert`)
                //     callback(values.status.error,string.database.insert.emptyList)
                // }
            })
        })
        
    }

   
}