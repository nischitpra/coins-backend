import sys
import json
import pandas as pd
import numpy as np
import math
from datetime import datetime
import re
from nltk.corpus import stopwords
from nltk.stem.snowball import EnglishStemmer
import pickle
from pymongo import MongoClient
from bson.objectid import ObjectId


base_path='/Users/oyo/Desktop/awesome/tweets/'
HISTORY_TYPE=1*60*60*24 #1 day


stemmer = EnglishStemmer()
stop_words = stopwords.words('english')
my_stop_words='to and http https com co www'
stop_words=stop_words+my_stop_words.split()

def preprocess(_df):
    if 'text' not in _df:
        return pd.DataFrame({'text':[]})
    _df['text']=_df['text'].apply(lambda tweet:str(tweet).lower() if str(tweet).count('#')<=3 else '')
    _df['text']=_df['text'].apply(lambda tweet:re.sub('[^ ]+\.[^ ]+','',tweet))
#     _df['text']=_df['text'].apply(lambda tweet:re.sub('#[^ ]+','',tweet))
    _df['text']=_df['text'].apply(lambda tweet:re.sub('[^a-z.A-Z0-9.!? ]',' ',(tweet)))
    _df['text']=_df['text'].apply(lambda tweet:' '.join([word for word in tweet.strip().split() if word not in stop_words]))
    _df['text']=_df['text'].apply(lambda tweet:stemmer.stem(tweet.strip()))
    return _df

def time_to_milli(_time):
    return round(_time.timestamp())

def to_time(from_time,window_size):
    return from_time+window_size*HISTORY_TYPE

def slice_tweets(tweets,from_time):
    window_size=1
    return tweets[(tweets['timestamp']>=from_time) & (tweets['timestamp']<to_time(from_time,window_size))]

def sentiment(timestamp,df):
    df=df.set_index(np.arange(df.shape[0]))
    #Preprocess
    p_df=preprocess(df.copy())
    p_df=p_df[p_df['text']!='']
    p_df=p_df[p_df['timestamp']>0]
    if p_df.empty: 
        return None
    probability=classifier.predict_proba(p_df['text'])
    proba_good_tweet_index=[]
    proba_bad_tweet_index=[]
    proba_spam_tweet_index=[]
    for i,row in enumerate(probability):
        if row[0]>0.5 and np.argmax(row)==0:
            proba_good_tweet_index.append(i)
        if row[1]>0.5 and np.argmax(row)==1: 
            proba_bad_tweet_index.append(i)
        if row[2]>0.5 and np.argmax(row)==2:
            proba_spam_tweet_index.append(i)
            
    proba_good_filtered_df=p_df.iloc[proba_good_tweet_index]
    proba_bad_filtered_df=p_df.iloc[proba_bad_tweet_index]
    proba_spam_filtered_df=p_df.iloc[proba_spam_tweet_index]
    
    proba_good_actual_df = df.iloc[proba_good_filtered_df.index]
    proba_bad_actual_df = df.iloc[proba_bad_filtered_df.index]
    proba_spam_actual_df = df.iloc[proba_spam_filtered_df.index]

    proba_good_actual_df['category']=np.zeros(proba_good_actual_df.shape[0])
    proba_bad_actual_df['category']=np.ones(proba_bad_actual_df.shape[0])
    
    proba_good_bad_actual_df=pd.concat([proba_good_actual_df,proba_bad_actual_df],axis=0)
    proba_good_bad_actual_df=proba_good_bad_actual_df.sort_values(['timestamp'], ascending=True)
    
    proba_good_actual_df.to_csv(base_path+'dataset/csv/good_bad/filtered/{}_good.csv'.format(timestamp), sep=',', index=False)
    proba_bad_actual_df.to_csv(base_path+'dataset/csv/good_bad/filtered/{}_bad.csv'.format(timestamp), sep=',', index=False)
    proba_spam_actual_df.to_csv(base_path+'dataset/csv/good_bad/filtered/{}_spam.csv'.format(timestamp), sep=',', index=False)
    
    return [proba_good_bad_actual_df]

# Mongodb settings
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.coins

# Twitter Dataset
l=list(db.good_bad_tweets.find().sort('_id',1))
if len(l)>0:
    lastId=l[-1]['_id']
    main_df=pd.DataFrame(list(db.tweets.find({'_id': {'$gt': ObjectId(lastId)}}).sort('_id',1)))
else:
    main_df=pd.DataFrame(list(db.tweets.find().sort('_id',1)))
    
if main_df.empty:
    print('no values to process')
    sys.exit()
    
main_df=main_df.drop_duplicates(subset=['_id'], keep='first')


tweet_dataset=main_df[['_id','text','created_at']].copy()
tweet_dataset.columns = ['_id', 'text','timestamp']
tweet_dataset['timestamp']=pd.to_datetime(tweet_dataset['timestamp'])
tweet_dataset['timestamp'] = [time_to_milli(_time) for _time in tweet_dataset['timestamp']] 
tweet_df = tweet_dataset.sort_values(['timestamp'], ascending=True)

# Saved Model
classifier = pickle.load(open(base_path+'saved_classifier/good_bad_classifier.sav', 'rb'))

# Main Loop
current_date=tweet_df['timestamp'].iloc[0]
last_date=tweet_df['timestamp'].iloc[-1]
step=HISTORY_TYPE


final_df=pd.DataFrame()

for time_milli in range(current_date,last_date+step,step):
    day_tweets=slice_tweets(tweet_df,current_date)
    x=sentiment(current_date,day_tweets.copy())
    if x!=None:
        [good_bad_df]=x
        final_df=pd.concat([final_df,good_bad_df])
    else:
        current_date=to_time(current_date,1)
        continue
        
final_df=final_df.drop_duplicates(['_id'],keep='first')
final_df=final_df.drop(columns=['text'])
if not final_df.empty:
    db.good_bad_tweets.insert_many(final_df.to_dict(orient='records'))
    print('{} rows filtered'.format(final_df.shape[0]))
else:
    print('no rows filtered')
sys.stdout.flush()