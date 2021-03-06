const network = require('./constants').network;
const id = require('./constants').id;
const values = require('./constants').values;
const string = require('./constants').string;
const utils = require('./utils');
var MongoClient = require('mongodb').MongoClient;


module.exports={
    // for subscribe
    validateOtp(key,otp,callback,mailerCallback){
        this.find(`select * from ${id.database.collection.otp} where _key=${key} and otp=${otp}`,(status,data)=>{
            if(status==values.status.ok){
                if(data!=null && data.length>0 && data[0][id.database.collection.keyList.otp[3]]=='false'){
                    this.deleteWhere(id.database.collection.otp,`_key=${key} and otp = ${otp}`,(status,message)=>{
                        console.log(`validate otp database.js: status:${status}, message:${message}`)
                    })
                    return callback(id.mailer.subscribe.validationSuccess,mailerCallback)
                }else{
                    return callback(id.mailer.subscribe.validationError,mailerCallback)
                }
            }
            return callback(status,data)
        })
    },
    deleteWhere(collection,where,callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `update ${id.database.collection.otp} set is_deleted = true where ${where};`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.subscribe.unsubscribed)
                })
        })
    },
    isSubscribed(email,from,to,mailerCallback){
        this.find(`select * from ${id.database.collection.subscribed} where ${id.database.email}=${email} and ${id.database.from}=${from} and ${id.database.to}=${to} and ${id.database.isDeleted}=false`,(status,data)=>{
            if(status==values.status.ok){
                if(data!=undefined&&data.length>0){
                    return mailerCallback(values.status.ok,true)
                }else{
                    return mailerCallback(values.status.ok,false)
                }
            }
            return mailerCallback(status,data)
        })
    },
    getGoodBadTweets(callback){
        this.find(`select * from ${id.database.collection.goodBadTweets} inner join ${id.database.collection.tweets} on cast(${id.database.collection.goodBadTweets}._id as int)=cast(${id.database.collection.tweets}._id as int) order by ${id.database.collection.goodBadTweets}._id desc`,(status,data)=>{
            if(status==values.status.ok){
                for(var i in data){
                    data[i][id.database.text]=utils.base64Decode(data[i][id.database.text])
                }
            }
            return callback(status,data)
        })
    },
    getGoodBadTweetsFew(count,callback){
        this.find(`select * from ${id.database.collection.goodBadTweets} inner join ${id.database.collection.tweets} on cast(${id.database.collection.goodBadTweets}._id as int)=cast(${id.database.collection.tweets}._id as int) order by ${id.database.collection.goodBadTweets}._id desc limit ${count}`,(status,data)=>{
            if(status==values.status.ok){
                for(var i in data){
                    data[i][id.database.text]=utils.base64Decode(data[i][id.database.text])
                }
            }
            return callback(status,data)
        })
    },
    createSubscribedTable(callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${id.database.collection.subscribed} (
                    _id serial primary key, 
                    email varchar(52), 
                    _from varchar(7), 
                    _to varchar(7), 
                    created_at varchar(13), 
                    is_deleted varchar(13) 
                );`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(id.database.collection.subscribed))
                })
        })
    },
    createOTPTable(callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${id.database.collection.otp} (
                    _id serial primary key, 
                    _key varchar(13), 
                    otp varchar(13), 
                    created_at varchar(13), 
                    is_deleted varchar(13) 
                );`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(id.database.collection.subscribed))
                })
        })
    },
    createCandleStickTable(name,callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${name} (
                    _id char(13), 
                    open varchar(13), 
                    high varchar(13), 
                    low varchar(13), 
                    close varchar(13), 
                    volume varchar(15), 
                    close_time varchar(13), 
                    quote_asset_volume varchar(13), 
                    number_of_trades varchar(10), 
                    taker_buy_base_asset_volume varchar(13), 
                    taker_buy_quote_asset_volume varchar(13), 
                    primary key(_id)
                ) ;`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(name))
                })
        })
    },
    createGoodbadTable(callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${id.database.collection.goodBadTweets} (
                    _id varchar(24),
                    category char(1),
                    probability varchar(8),
                    timestamp varchar(13),
                    primary key(_id)
                );`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(id.database.collection.goodBadTweets))
                })
        })
    },
    createSentimentTrendTable(callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${id.database.collection.sentimentTrend} (
                    _id varchar(24),
                    close varchar(13),
                    high varchar(13),
                    low varchar(13),
                    open varchar(13),
                    time varchar(13),
                    primary key(_id)
                ) ;`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(id.database.collection.sentimentTrend))
                })
        })
    },
    createTweetsTable(callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(
                `create table if not exists ${id.database.collection.tweets} (
                    _id SERIAL PRIMARY KEY,
                    created_at char(32),
                    id_str varchar(20),
                    text text,
                    name varchar(120),
                    screen_name varchar(120),
                    profile_image_url text,
                    timestamp_ms varchar(13)
                );`,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,string.database.create.table(id.database.collection.tweets))
                })
        })
    },

    insert(tableName,keys,_values,callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            var columnName=``
            for(var i in keys){
                columnName+=`${keys[i]},`
            }
            columnName=columnName.substring(0,columnName.length-1)// remove last comma
            columnName=`(${columnName})`
    
    
            var valueString=``
            for(var j in _values){
                var insertString=``
                for(var i in keys){
                    insertString+=`'${_values[j][keys[i]]}',`
                }
                insertString=insertString.substring(0,insertString.length-1)// remove last comma
                insertString=`(${insertString}),`
                valueString+=insertString
            }
            valueString=valueString.substring(0,valueString.length-1) // remove last comma
    
            const finalQ=`insert into ${tableName} ${columnName} values ${valueString};`
            console.log(finalQ)
            const query = client.query(finalQ,(err, res) => {
                if(err){
                    client.end()
                    return callback(values.status.error,err)
                }
                client.end()
                return callback(values.status.ok,string.database.insert.values(_values.length))
            })
        })
    },
    find(_query,callback){
        const pg = require('pg');
        var pool = new pg.Pool(network.database_details)
        pool.connect((err, client, done)=>{
            if(err){
                done()
                return callback(values.status.error,err)
            }
            const query = client.query(_query,(err, res) => {
                    if(err){
                        client.end()
                        return callback(values.status.error,err)
                    }
                    client.end()
                    return callback(values.status.ok,res.rows)
                })
        })
    },

}