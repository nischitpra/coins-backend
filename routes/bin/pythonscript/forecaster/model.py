import sys
import tensorflow as tf
from getData import CryptoData
from model_rnn import LstmRNN
from sklearn.model_selection import train_test_split
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from pymongo import MongoClient


# database connection
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.coins



flags = tf.app.flags
flags.DEFINE_integer("crypto_count", 1, "Crypto count [1]")
flags.DEFINE_integer("input_size", 7, "Input size [4]")
flags.DEFINE_integer("output_size", 4, "Output size [1]")
flags.DEFINE_integer("num_steps", 1, "Num of steps [30]")
flags.DEFINE_integer("num_layers", 1, "Num of layer [1]")
flags.DEFINE_integer("lstm_size", 128, "Size of one LSTM cell [128]")
flags.DEFINE_integer("batch_size", 62, "The size of batch images [64]")
flags.DEFINE_float("keep_prob", 0.8, "Keep probability of dropout layer. [0.8]")
flags.DEFINE_float("init_learning_rate", 0.001, "Initial learning rate at early stage. [0.001]")
flags.DEFINE_float("learning_rate_decay", 0.99, "Decay rate of learning rate. [0.99]")
flags.DEFINE_integer("init_epoch", 5, "Num. of epoches considered as early stage. [5]")
flags.DEFINE_integer("max_epoch", 1000, "Total training epoches. [50]")
flags.DEFINE_integer("embed_size", None, "If provided, use embedding vector of this size. [None]")
flags.DEFINE_string("stock_symbol", None, "Target stock symbol [None]")
flags.DEFINE_integer("sample_size", 4, "Number of stocks to plot during training. [4]")
flags.DEFINE_boolean("train", False, "True for training, False for testing [False]")

FLAGS = flags.FLAGS

def load_data(input_size, num_steps, fsym, tsym, target_symbol=None, test_ratio=0.05):
        return [
            CryptoData(
                target_symbol,
                fsym=fsym,
                tsym=tsym,
                input_size=input_size,
                num_steps=num_steps,
                test_ratio=test_ratio)
        ]

def main(_):
    history_df=pd.DataFrame(db.history.find({'_id':sys.argv[1]}).next()['history'])
    history_df['senti']=np.zeros(history_df.shape[0])
    # sentiment_df=pd.DataFrame(list(db.sentiment_trend.find()))

    df=history_df.copy()
    with tf.Session() as sess:
        rnn_model = LstmRNN(
            sess,
            FLAGS.crypto_count,
            lstm_size=FLAGS.lstm_size,
            num_layers=FLAGS.num_layers,
            num_steps=FLAGS.num_steps,
            input_size=FLAGS.input_size,
            embed_size=FLAGS.embed_size,
            output_size=FLAGS.output_size
        )
        coin_data_list4 = load_data(
            FLAGS.input_size,
            FLAGS.num_steps,
            'BTC',
            'USD',
            target_symbol=FLAGS.stock_symbol
        )
    if FLAGS.train:
        rnn_model.train(coin_data_list4, FLAGS,'BTC',1)
    else:
        modelExists, counter, result = rnn_model.load(df)
    
    res_df=pd.DataFrame()
    res_df['close']=result[0]
    res_df['high']=result[1]
    res_df['open']=result[2]
    res_df['low']=result[3]
    if not res_df.empty:
        db.forecast.insert_many({'_id':sys.argv[1],'history':res_df.to_dict(orient='records')})
        print('forecast added to db'.format(res_df.shape[0]))
    else:
        print('could not forecast')

    sys.stdout.flush()




tf.app.run(main=main)