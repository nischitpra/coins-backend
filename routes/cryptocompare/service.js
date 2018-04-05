const db = require('../database')
const connection = require('../connection')
const presenter = require('./presenter')
const id = require('../constants').id
const values = require('../constants').values
const string = require('../constants').string
const pythoninvoker=require('../../routes/pythoninvoker')

module.exports={
    updateHistory(type,from,to,exchange,callback){
        const toTime=Math.round(new Date().getTime()/1000)
        presenter.getHistory(type,from,to,exchange,null,toTime,(status,data)=>{
                if(status==values.status.ok){
                    data={[id.database.cc.id]:id.database.cc.history_from_to_type(from,to,type),[id.database.cc.history]:data}
                    
                    
                    
                    // this is a hack that should be removed
                    db.dropCollection(id.database.collection.history)
                    
                    
                    
                    
                    db.insertOne(id.database.collection.history,data,(status,message)=>{
                        console.log(message)
                        callback(status,message)
                    })
                }else{
                    callback(status,data)
                }
                
            }
        )
    },
    
}