const network = require('./constants').network;
const id = require('./constants').id;
const values = require('./constants').values;
const string = require('./constants').string;
var MongoClient = require('mongodb').MongoClient;

module.exports={
    insertOne(collection,value){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).insertOne(value, (err, res)=>{
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        })
    },
    insertMany(collection,value){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).insertMany(value, (err, res)=>{
                if (err) throw err;
                console.log(`${value.length} document inserted`);
                db.close();
            });
        })
    },
    findOne(collection,query,callback){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).findOne(query,(err, result)=>{
                if (err) throw err;
                console.log(result)
                if(result!=null){
                    callback(true)
                }else{
                    callback(false)
                }
                db.close();
            });
        });
    },
    findMany(collection,query){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).find(query).toArray((err, result)=>{
                if (err) throw err;
                db.close();
            });
        });
    },
    // dont use this. use soft delete instead.
    // remove(collection,query){
    //     MongoClient.connect(network.database, function(err, db) {
    //         if (err) throw err;
    //         db.collection(collection).remove(query, function(err, obj) {
    //           if (err) throw err;
    //           console.log(obj.result.n + " document(s) deleted");
    //           db.close();
    //         });
    //       });
    // },

    dropCollection(collection){
        MongoClient.connect(network.database, (err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).drop((err, delOK)=>{
                if (err) throw err;
                if (delOK) console.log("Collection deleted");
                db.close();
            });
        });
    },

    // for subscribe
    validateOtp(collection,key,otp,callback,mailerCallback){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).findOne({[key]:otp},(err, result)=>{
                if (err) throw err;
                console.log(result)
                if(result!=null&& !result.isDeleted){
                    this.delete(id.database.collection.otp,{[key]:otp},undefined)
                    callback(id.mailer.subscribe.validationSuccess,mailerCallback)
                }else{
                    callback(id.mailer.subscribe.validationError,mailerCallback)
                }
                db.close();
            });
        });
    },
    delete(collection,query,callback){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(collection).updateOne(query,{$set:{[id.database.isDeleted]:true}},(err, result)=>{
                if (err) throw err;
                console.log(result)
                if(callback!=undefined){
                    callback(values.status.ok,string.subscribe.unsubscribed)
                }
                db.close();
            });
        });
    },
    isSubscribed(email,from,to,mailerCallback){
        MongoClient.connect(network.database,(err, db)=>{
            if (err) throw err;
            var dbo = db.db(id.database.name);
            dbo.collection(id.database.collection.subscribed).findOne({[id.database.email]:email,[id.database.from]:from,[id.database.to]:to,[id.database.isDeleted]:false},(err, result)=>{
                if (err) throw err;
                console.log(result)
                if(result!=null && !result.isDeleted){
                    mailerCallback(values.status.ok,true)
                }else{
                    mailerCallback(values.status.ok,false)
                }
                db.close();
            });
        });
    },

}