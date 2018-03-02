const network = require('./constants').network
const values = require('./constants').values
const string = require('./constants').string
const id = require('./constants').id
const fetch = require('node-fetch')

module.exports={
    getNews(type,count,page,callback){
        console.log('fetcing data')
        fetch(network.news(type,count,page),{
            method: 'GET',
            headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
            "X-API-Key": values.news.apiKey
            }
        }).then(response=>{
            console.log('data fetched')
            if(response.ok){
                response.json().then(json=>{
                    console.log('sending data back')
                    callback(json[id.news.articles])
                })
            }
        }).catch((error)=>{
            callback(string.someWrong,string.someWrong)
            console.log(error)
        })
    },

    getHistory(type,from,to,exchange,toTime,callback){
        console.log(network.history(type,from,to,exchange,toTime))
        fetch(network.history(type,from,to,exchange,toTime),{
            method: 'GET',
            headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
            }
        }).then(response=>{
            response.json().then(json=>{
                callback(type,json[id.cryptocompare.data])
            })
        }).catch((error)=>{
            callback(string.someWrong,string.someWrong)
            console.log(error)
        })
    },

    getFavourites(from,to,exchange,callback){
        console.log(network.favourites(from,to,exchange))
        fetch(network.favourites(from,to,exchange),{
            method: 'GET',
            headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
            }
        }).then(response=>{
            response.json().then(json=>{
                callback(json[id.cryptocompare.raw])
            })
        }).catch((error)=>{
            callback(string.someWrong,string.someWrong)
            console.log(error)
        })
    },

    getCoinList(callback){
        console.log(network.coinList)
        fetch(network.coinList,{
            method: 'GET',
            headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
            }
        }).then(response=>{
            response.json().then(json=>{
                callback(Object.values(json[id.cryptocompare.data]),json[id.cryptocompare.baseImageUrl])
            })
        }).catch((error)=>{
            callback(string.someWrong,string.someWrong)
            console.log(error)
        })
    },

    getSocketScubscriptionList(from,to,callback){
        console.log(network.socketSubsList(from,to))
        fetch(network.socketSubsList(from,to),{
            method: 'GET',
            headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
            }
        }).then(response=>{
            response.json().then(json=>{
                callback(json[to][id.cryptocompare.trades])
            })
        }).catch((error)=>{
            callback(string.someWrong,string.someWrong)
            console.log(error)
        })
    },


    

}