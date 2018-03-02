module.exports = {
    network:{
        news:(type,count,page)=>`https://newsapi.org/v2/${type}?sources=crypto-coins-news&pageSize=${count}&page=${page}`,
        history:(historyType,from,to,exchange,toTime)=>`https://min-api.cryptocompare.com/data/${historyType}?fsym=${from}&tsym=${to}&e=${exchange}&limit=${2000}&toTs=${toTime}`,
        favourites:(fromList,toList,exchange)=>`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromList}&tsyms=${toList}&e=${exchange}`,
        coinList:`https://min-api.cryptocompare.com/data/all/coinlist`,
        socketSubsList:(from,to)=>`https://min-api.cryptocompare.com/data/subs?fsym=${from}&tsyms=${to}`,
        cryptocompareWebSocket:`https://streamer.cryptocompare.com/`,
    },
    values:{
        news:{
            apiKey:'d2a968870c6c41e0b2f172bad1c2ef10',
            everything:'everything',
            headlines:'top-headlines',
            articles:'articles',
        }    
    },
    id:{
        news:{everything:0,headlines:1,articles:'articles'},
        cryptocompare:{
            history:{m:'histominute',h:'histohour',d:'histoday'},
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
        }
    },
    string:{
        invalidRequest:'Invalid Request',
        someWrong:'Woops, something went wrong!',
    },
}