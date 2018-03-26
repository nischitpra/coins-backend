const network = require('./constants').network
const files = require('./constants').files
const values = require('./constants').values
const string = require('./constants').string
const id = require('./constants').id
const fetch = require('node-fetch')

module.exports={
    getSentimentTrend(callback){
        var spawn = require("child_process").spawn
        var process = spawn(files.python.compiler,[files.buildPath(files.python.sentimentTrend)] )
        console.log('get sentiment trend process spawned')
        process.stdout.on('data', (data)=>{
            console.log('trend returned from python')
            callback(values.status.ok,JSON.parse(data.toString('utf8')))
        })
        process.stderr.on('data',(error)=>{
            console.log('some error occured')
            callback(values.status.error,JSON.parse(error.toString('utf8')))
        })
    },
    getFilteredTweet(tweets,callback){
        var spawn = require("child_process").spawn
        var process = spawn(files.python.compiler,[files.buildPath(files.python.filterTweet),tweets] )
        console.log('get filtered tweet process spawned')
        process.stdout.on('data', (data)=>{
            console.log('trend returned from python')
            callback(values.status.ok,JSON.parse(data.toString('utf8')))
        })

        process.stderr.on('data',(error)=>{
            console.log('some error occured')
            callback(values.status.error,error.toString('utf8'))
        })
    },
    getGoodBadTweet(tweets,callback){
        var spawn = require("child_process").spawn
        var process = spawn(files.python.compiler,[files.buildPath(files.python.goodBadTweet),tweets] )
        console.log('get good bad tweet process spawned')
        process.stdout.on('data', (data)=>{
            console.log('trend returned from python')
            callback(values.status.ok,JSON.parse(data.toString('utf8')))
        })

        process.stderr.on('data',(error)=>{
            console.log('some error occured')
            callback(values.status.error,error.toString('utf8'))
        })
    },
}