import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId
import sys
import json
base_path='/Users/oyo/Desktop/awesome/tweets/'
window_size=60*60 # per hour

client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.coins

# Loading data and preparation
last_insert=list(db.sentiment_trend.find().sort('time',-1).limit(1))
if len(last_insert)>0:
    cursor=db.good_bad_tweets.aggregate([{'$match': { '_id':{'$gte':last_insert[0]['_id']} }},
                                         {'$lookup':{
                                             'from': "tweets",
                                             'localField': "_id",
                                             'foreignField': "_id",
                                             'as': "tweet"
                                         }},
                                         {'$sort':{'timestamp':1}}
                                        ])
else:
    cursor=db.good_bad_tweets.aggregate([
                                         {'$lookup':{
                                             'from': "tweets",
                                             'localField': "_id",
                                             'foreignField': "_id",
                                             'as': "tweet"
                                         }},
                                         {'$sort':{'timestamp':1}}
                                        ],allowDiskUse=True)
m_df=pd.DataFrame(list(cursor))

if m_df.empty:
    print("no good bad tweets found")
    sys.exit(0)
df=pd.DataFrame()
df['category']=m_df['category'].copy()
df['timestamp']=m_df['timestamp']
df['_id']=m_df['_id']

# Main
endTime=df['timestamp'].iloc[0]+window_size
open_list=[]
close_list=[]
high_list=[]
low_list=[]
time_list=[]
id_list=[]
if len(last_insert)==0:
    opn=0.0
    close=0.0
    high=0.0
    low=0.0
else:
    opn=last_insert[0]['close']
    close=opn
    high=opn
    low=opn
checkpoint_id=0.0
for i in range(df.shape[0]):
    if df['timestamp'].iloc[i]>=endTime:
        checkpoint_id=df['_id'].iloc[i]
        id_list.append(checkpoint_id)
        open_list.append(opn)
        close_list.append(close)
        high_list.append(high)
        low_list.append(low)
        time_list.append(endTime)
        endTime+=window_size
        opn=close
        close=opn
        high=opn
        low=opn
    close+=1.0 if df['category'].iloc[i]==0 else -1.0
    low=close if close<low else low
    high=close if close>high else high

senti_df=pd.DataFrame()    
senti_df['open']=open_list
senti_df['high']=high_list
senti_df['low']=low_list
senti_df['close']=close_list
senti_df['time']=time_list
senti_df['_id']=id_list

if not senti_df.empty:
    db.sentiment_trend.insert_many(senti_df.to_dict(orient='records'))
    print('{} rows added'.format(senti_df.shape[0]))
else:
    print('no rows filtered')
sys.stdout.flush()