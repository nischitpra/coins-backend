module.exports = {
    network:{
        news:(type,count,page)=>`https://newsapi.org/v2/${type}?sources=crypto-coins-news&pageSize=${count}&page=${page}`,
        history:(historyType,from,to,exchange,toTime)=>`https://min-api.cryptocompare.com/data/${historyType}?fsym=${from}&tsym=${to}&e=${exchange}&limit=${2000}&toTs=${toTime}`,
        favourites:(fromList,toList,exchange)=>`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromList}&tsyms=${toList}&e=${exchange}`,
        coinList:`https://min-api.cryptocompare.com/data/all/coinlist`,
        socketSubsList:(from,to)=>`https://min-api.cryptocompare.com/data/subs?fsym=${from}&tsyms=${to}`,
        cryptocompareWebSocket:`https://streamer.cryptocompare.com/`,
        searchTweet:(name,symbol)=>`https://api.twitter.com/1.1/search/tweets.json?q=${name}%20${symbol}%20crypto%blockchain&result_type=mixed`,
    },
    values:{
        baseHeader:{
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
            "Accept": 'application/json',
        },
        news:{
            apiKey:'d2a968870c6c41e0b2f172bad1c2ef10',
            everything:'everything',
            headlines:'top-headlines',
            articles:'articles',
        },
        twitter:{
            consumerKey: 'q3RPMgFxS26kHOUfSl2qOCt3w',
            consumerSecret: 'XfGCLJZFJmDBCEvF0RjlRmd592TS9jWXgXFi6PpddcxCXqEOG5',
            accessTokenKey: '941802374707822592-kLwiBWC7k6Bdqu2Gg5NkFymyKtOJbfU',
            accessTokenSecret: '7HTsCnI7M3IJeb4wkWomngCYQb6AHwyoSilvhLD3kXywH',
        },
    },
    id:{
        news:{everything:0,headlines:1,articles:'articles'},
        cryptocompare:{
            history:{0:'histominute',1:'histohour',2:'histoday'},
            from:'from',
            to:'to',
            exchange:'exchange',
            historyType:'historyType',
            fromTime:'fromTime',
            toTime:'toTime',
            raw:'RAW',
            data:'Data',
            baseImageUrl:'BaseImageUrl',
            trades:'TRADES',
            clientEvent:'clientEvent',
            serverEvent:'serverEvent',
        },
        twitter:{
            symbol:'symbol',
            statuses:'statuses',
            coinName:'coinName',
        }
    },
    string:{
        invalidRequest:'Invalid Request',
        someWrong:'Woops, something went wrong!',
    },
}

