import sys
import json
import pandas as pd
import numpy as np
import math
from datetime import datetime
import time
import re
from nltk.corpus import stopwords
from nltk.stem.snowball import EnglishStemmer
import pickle


base_path='/Users/oyo/Desktop/awesome/tweets/'
HISTORY_TYPE=1*60*60*24 #1 day


stemmer = EnglishStemmer()
stop_words = stopwords.words('english')
my_stop_words='to and http https com co www'
stop_words=stop_words+my_stop_words.split()

def preprocess(_df):
    _df['text']=_df['text'].apply(lambda tweet:str(tweet).lower() if str(tweet).count('#')<=3 else '')
    _df['text']=_df['text'].apply(lambda tweet:re.sub('[^ ]+\.[^ ]+','',tweet))
#     _df['text']=_df['text'].apply(lambda tweet:re.sub('#[^ ]+','',tweet))
    _df['text']=_df['text'].apply(lambda tweet:re.sub('[^a-zA-Z0-9.!? ]',' ',(tweet)))
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

def sentiment(timestamp,df,opn):
    df=df.set_index(np.arange(df.shape[0]))
    p_df=preprocess(df.copy())
    p_df=p_df[p_df['text']!='']
    if df.empty: 
        return None
    probability=classifier.predict_proba(p_df['text'])
    proba_good_tweet_index=[]
    proba_bad_tweet_index=[]
    for i,row in enumerate(probability):
        if row[0]>0.5:
            proba_good_tweet_index.append(i)
        if row[1]>0.5: 
            proba_bad_tweet_index.append(i)
            
    proba_good_filtered_df=p_df.iloc[proba_good_tweet_index]
    proba_bad_filtered_df=p_df.iloc[proba_bad_tweet_index]
    
    proba_good_actual_df = df.iloc[proba_good_filtered_df.index]
    proba_bad_actual_df = df.iloc[proba_bad_filtered_df.index]

    proba_good_actual_df['category']=np.zeros(proba_good_actual_df.shape[0])
    proba_bad_actual_df['category']=np.ones(proba_bad_actual_df.shape[0])
    
    proba_good_bad_actual_df=pd.concat([proba_good_actual_df,proba_bad_actual_df],axis=0)
    proba_good_bad_actual_df=proba_good_bad_actual_df.sort_values(['timestamp'], ascending=True)

    g = opn + proba_good_actual_df['timestamp'].value_counts().sum()
    b = opn + proba_bad_actual_df['timestamp'].value_counts().sum()

    close = opn + g - b
    high = max(g, close, opn)
    low = min(b, close, opn)

    opn=close

    if proba_good_bad_actual_df.empty:
        return None

    return [proba_good_bad_actual_df,high,low,close]

# Twitter Dataset
# tweet_dataset=pd.read_csv('dataset/csv/filter_dataset/proba_filtered_dataset.csv',encoding = 'utf8')
tweet_dataset=pd.read_json(sys.argv[1],encoding = 'utf8')
# tweet_dataset=pd.read_json('[{"text":"CBOE Nudges SEC to Allow Bitcoin ETFs in New Letter","timestamp":"Tue Mar 27 13:39:58 +0000 2018","index":0}]',encoding = 'utf8')
tweet_dataset['timestamp'] = [time_to_milli(_time) for _time in tweet_dataset['timestamp']] 
tweet_df = tweet_dataset.sort_values(['timestamp'], ascending=True)
# Saved Model
classifier = pickle.load(open(base_path+'saved_classifier/good_bad_classifier.sav', 'rb'))

# Main Loop
current_date=tweet_df['timestamp'].iloc[0]
last_date=tweet_df['timestamp'].iloc[-1]
step=HISTORY_TYPE

senti_close=[]
senti_open=[]
senti_high=[]
senti_low=[]
time_list=[]
opn=0
close=0

final_df=pd.DataFrame()

for time_milli in range(current_date,last_date+step,step):
    day_tweets=slice_tweets(tweet_df,current_date)
    #Preprocess
    day_tweets=preprocess(day_tweets)
    day_tweets=day_tweets[day_tweets['text']!='']
    day_tweets=day_tweets[day_tweets['timestamp']>0]

    
    x=sentiment(current_date,day_tweets.copy(),opn)

    if x!=None:
        [good_bad_df,high,low,close]=x
    else:
        current_date=to_time(current_date,1)
        continue
        
    final_df=pd.concat([final_df,good_bad_df])
    
    senti_open.append(opn)
    senti_high.append(high)
    senti_low.append(low)
    senti_close.append(close)
    opn=close
    
    time_list.append(current_date)
    current_date=to_time(current_date,1)
    
# Saving Data
senti_df = pd.DataFrame({'close':senti_close})
senti_df['open'] = senti_open
senti_df['high'] = senti_high
senti_df['low'] = senti_low
senti_df['time'] = time_list
senti_df.to_csv(base_path+'dataset/csv/good_bad/sentiment_trend.csv', sep=',', index=False)

final_df.to_csv(base_path+'dataset/csv/good_bad/gb_filter/{}.csv'.format(round(time.time())), sep=',', index=False)

print('{} tweets filtered.'.format(final_df.shape[0]))
sys.stdout.flush()