import numpy as np
import pandas as pd
import random
from scipy.signal import argrelextrema

base_path='/Users/oyo/Desktop/awesome/tweets/'


class CryptoData(object):
    def __init__(self,
                 stock_sym,
                 fsym,
                 tsym,
                 input_size=1,
                 num_steps=30,
                 test_ratio=0.1,
                 normalized=True):
        self.stock_sym = stock_sym
        self.fsym = fsym
        self.tsym = tsym
        self.input_size = input_size
        self.num_steps = num_steps
        self.test_ratio = test_ratio
        self.normalized = normalized



        '''connection = mysql.connector.connect(user='root', database='CryptoCompare', password='xxxx')
        cursor = connection.cursor()

        # Get Data
        query = "SELECT * FROM storage where fsym=%s and tsym=%s order by time asc"
        cursor.execute(query, (self.fsym, self.tsym))
        rows = cursor.fetchall()
        raw_seq = ()
        dates = ()'''
        df = pd.read_csv(base_path+'dataset/csv/good_bad/new_sentiment_trend.csv', sep=',', header=None)
        x = df.iloc[-357:-1,[0,1,2,3,5,6,7]]
        y = df.iloc[-357:-1,4]
        raw_seq = [list(l) for l in x.values]
        dates = list(y)
        for i in range(0,len(raw_seq)):
            for j in range(0,len(raw_seq[i])):
                raw_seq[i][j] = float(raw_seq[i][j])
        '''for row in rows:
            row = list(row)
            row.pop(0)
            dates = (row[0],) + dates
            row[0] = datetime.datetime.combine(row[0].date(), row[0].time()).timestamp()
            row.pop(5)
            row.pop(5)
            row.pop(5)
            row.pop(0)
            row = tuple(row)
            raw_seq = (row,) + raw_seq'''
        raw_seq = np.array(raw_seq)
        dates = np.array(dates)
        raw_seq = feature_normalize(raw_seq)
        num = len(raw_seq)
        train_size = int(num * 0.8)
        dates = dates[train_size + 2:len(raw_seq) ]
        self.dates = np.array(dates)
        self.train_X, self.train_y, self.test_X, self.test_y = self.prepare_data(raw_seq,num,train_size)
        self.local_maxima, self.local_minima = get_maxima_and_minima(np.array(df.iloc[-357:-1,0]))



    def prepare_data(self,seq,num,train_size):
        X_train = seq[0:train_size]
        X_train = X_train.reshape(train_size,1,7)
        X_train = np.array(X_train)
        y_train = seq[1:train_size+1]
        y_train = [[l[i] for i in [0,1,2,3]]for l in y_train]
        y_train = np.array(y_train)
        X_test = seq[train_size+1:len(seq)-1]
        X_test = X_test.reshape(len(X_test),1,7)
        X_test = np.array(X_test)
        y_test = seq[train_size+2:len(seq)]
        y_test = [[l[i] for i in [0,1,2,3]]for l in y_test]
        y_test = np.array(y_test)

        return X_train, y_train, X_test, y_test





    def generate_one_epoch(self, batch_size):
        num_batches = int(len(self.train_X)) // batch_size
        if batch_size * num_batches < len(self.train_X):
            num_batches += 1
        batch_indices = list(range(num_batches))
        random.shuffle(batch_indices)
        for j in batch_indices:
            batch_X = self.train_X[j * batch_size: (j + 1) * batch_size]
            batch_y = self.train_y[j * batch_size: (j + 1) * batch_size]
            #assert set(map(len, batch_X)) == {self.num_steps}
            yield batch_X, batch_y

def feature_normalize(dataset):
    mu = np.mean(dataset,axis=0)
    sigma = np.std(dataset,axis=0)
    return (dataset - mu)/sigma

def get_maxima_and_minima(closingPrices):
    local_minima = []
    local_maxima = []
    local_maxima.append(closingPrices[argrelextrema(closingPrices, np.greater)])
    local_minima.append(closingPrices[argrelextrema(closingPrices, np.less)])
    return local_minima,local_maxima



'''
def append_bias_reshape(features,labels):
    n_training_samples = features.shape[0]
    n_dim = features.shape[1]
    f = np.reshape(np.c_[np.ones(n_training_samples),features],[n_training_samples,n_dim + 1])
    l = np.reshape(labels,[n_training_samples,1])
    return f, l



def useless:
    for row in seq[0:train_size - 1]:
        row = row.reshape(30, row.shape[0])
        X_train = (row,) + X_train
    X_train = np.array(X_train)
    X_test = ()
    for row in seq[train_size:len(seq) - 1]:
        row = row.reshape(30, 1, row.shape[0])
        X_test = (row,) + X_test
    X_test = np.array(X_test)
    y_train = [row[3] for row in seq[1:train_size]]
    y_train = np.array(y_train)
    y_test = [row[3] for row in seq[train_size + 1:num]]
    y_test = np.array(y_test)
    
    
    
    #seq = [np.array(seq[i * self.input_size: (i + 1) * self.input_size])
               #for i in range(len(seq) // self.input_size)]
        #seq = [seq[0] / seq[0][0] - 1.0] + [
         #   curr / seq[i][-1] - 1.0 for i, curr in enumerate(seq[1:])]

        # split into groups of num_steps
        #X = np.array([seq[i: i + self.num_steps] for i in range(len(seq) - self.num_steps)])
        #y = np.array([seq[i + self.num_steps] for i in range(len(seq) - self.num_steps)])
        
        '''