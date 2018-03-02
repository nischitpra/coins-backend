const connection = require('../connection')
const constants = require('../constants')
const id = constants.id
const values = constants.values
const string = constants.string

module.exports={
    getNews(_id,count,page,callback){
        console.log('get news')
        if(_id==id.news.everything){
            connection.getNews(values.news.everything,count,page,callback)
        }else if(_id==id.news.headlines){
            connection.getNews(values.news.headlines,count,page,callback)
        }else{
            callback(string.invalidRequest)
        }
    },
}