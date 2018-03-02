const id = require('../constants').id
const string = require('../constants').string
const connection = require('../connection')


module.exports={
    getHistory(type,from,to,exchange,fromTime,toTime,callback){
        if(fromTime==null){
            this.getOldHistory(type,from,to,exchange,toTime,callback)
        }else if(toTime==null){
            this.getNewHistory(type,from,to,exchange,fromTime,callback)
        }else{
            callback(string.invalidRequest)
        }
        
    },
    getOldHistory(type,from,to,exchange,toTime,callback){
        connection.getHistory(id.cryptocompare.history[type],from,to,exchange,toTime,callback)
    },
    getNewHistory(_id,from,to,exchange,fromTime,callback){

    },


    getFavourites(from,to,exchange,callback){
        connection.getFavourites(from,to,exchange,callback)
    },
    getCoinList(callback){
        connection.getCoinList(callback)
    },
    getSubsList(from,to,callback){
        connection.getSocketScubscriptionList(from,to,callback)
    },

   
}
