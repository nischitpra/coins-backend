const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const connection = require('../connection')
const db = require('../database')
const pythoninvoker=require('../../routes/pythoninvoker')
const ObjectID = require('mongodb').ObjectID


module.exports={
    getHistory(from,to,type,callback){
        console.log(`getting history for ${name} ${from}`)
        db.findOne(id.database.collection.history,{[id.database.cc.id]:id.database.cc.history_from_to_type(from,to,type)},(status,data)=>{
            if(status==values.status.ok){
                callback(status,data[id.database.cc.history])
            }else{
                callback(status,data)
            }
        })
    },
    
}
