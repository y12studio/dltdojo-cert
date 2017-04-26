### 2017-04-26T18:07:42+0800

https://github.com/blockchain-certificates/cert-issuer

```
$ git clone https://github.com/blockchain-certificates/cert-issuer.git && cd cert-issuer
$ docker build -t bc/cert-issuer:1.0 .
bash-4.3# ./regtest_script.sh
bash-4.3# bitcoin-cli getinfo
{
  "version": 130200,
  "protocolversion": 70015,
  "walletversion": 130000,
  "balance": 49.99892160,
  "blocks": 101,
  "timeoffset": 0,
  "connections": 0,
  "proxy": "",
  "difficulty": 4.656542373906925e-10,
  "testnet": false,
  "keypoololdest": 1493204354,
  "keypoolsize": 100,
  "paytxfee": 0.00000000,
  "relayfee": 0.00001000,
  "errors": ""
}
```
