import sys
import pandas as pd
import json

path='/Users/oyo/Desktop/awesome/tweets/dataset/csv/good_bad/sentiment_trend.csv'

sentiment_df=pd.read_csv(path,encoding = 'utf8')
print(sentiment_df.to_json(orient='records'))
sys.stdout.flush()