# coins-backend

- `git clone blabla`
- `git pull`
- `cd coins`
- `git checkout twitter_api`
- `nodemon coins`

### API list

### favourites:
`http://${value.ipAddress}/cc/favourites?from=${fromList}&to=${toList}&exchange=${exchange}`
- fromList,toList: XRP,BTC,EOS... etc (multiple elements are comma separated, no spaces)
- exchange: CCCAGG, Binance(Binance is for crypto to crypto) .  (dont use others)

### history:
`http://${value.ipAddress}/cc/history?historyType=${historyType}&from=${from}&to=${to}&exchange=${exchange}&toTime=${toTime}`
- historyType (0,1,2) [histominute, histohour, histoday]
- from,to,exchange: same as above
- toTime: any time in mills/1000 i.e epoch time

### coinList:
`http://${value.ipAddress}/cc/coinlist`
- ipaddress:3001

### live trading prices:
`http://${value.ipAddressSocket}`
- ipaddress:3002
- emit value to `clientEvent` from any socket.io tester to api.
- listern to `serverEvent` from socket.io tester api.

### subscription list for socket prices:
`http://${value.ipAddress}/cc/subs?from=${from}&to=${to}`
- this will return a string of values for coin from_to which should be emitted to clientEvent.

### news:
`http://${value.ipAddress}?i=${type}&c=${count}&p=${page}`
- type: (0,1) [everything, headlines]
- count: number of items to return
- page: number of api request to get indexed offset for count

### coinTweet:
`http://localhost:3001/twitter/q?coinName=${coinName}&symbol=${symbol}`
- coinName: Ripple
- symbol: XRP

### post:
`https://twitter.com/statuses/${postId}`
- used to open post in browser from postId received rom coinTweet
