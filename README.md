# BitMergeX

clarinet console

(contract-call? stx-wallet deposit u10000)

<!-- Owner deposit to contract -->
```
>> ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM       
tx-sender switched to ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
>> (contract-call? .stx-wallet deposit u10000)
Events emitted
{"type":"stx_transfer_event","stx_transfer_event":{"sender":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","recipient":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet","amount":"10000","memo":""}}
{"type":"contract_event","contract_event":{"contract_identifier":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet","topic":"print","value":"{ amount: u10000, event: \"deposit\", from: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM }"}}
(ok (tuple (amount u10000) (event "deposit") (from ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)))
```

<!-- User deposit to contract  -->
```
>> ::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
tx-sender switched to ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
>> (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet deposit u10000)
Events emitted
{"type":"stx_transfer_event","stx_transfer_event":{"sender":"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5","recipient":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet","amount":"10000","memo":""}}
{"type":"contract_event","contract_event":{"contract_identifier":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet","topic":"print","value":"{ amount: u10000, event: \"deposit\", from: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 }"}}
(ok (tuple (amount u10000) (event "deposit") (from ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)))
```

<!-- Transfer from a user (B) to user (C)  -->

```
>> (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet transfer u10000 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG none)
Events emitted
{"type":"stx_transfer_event","stx_transfer_event":{"sender":"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5","recipient":"ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG","amount":"10000","memo":""}}
{"type":"contract_event","contract_event":{"contract_identifier":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet","topic":"print","value":"{ amount: u10000, event: \"transfer\", from: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5, memo: none, to: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG }"}}
(ok (tuple (amount u10000) (event "transfer") (from ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5) (memo none) (to ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)))
```

<!-- Get balance for owner -->
```
>> (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet get-balance)
(ok u99999999990000)
```

<!-- Get balance for contract -->
```
>> (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet get-contract-balance)
(ok u20000)
```

<!-- Get balance for user -->

<!-- ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM --> Deployer
<!-- ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 -->
<!-- ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG -->


<!-- Off Chain Register User and Create Wallet -->
```
curl -X POST http://localhost:5000/api/v1/auth/register -H "Content-Type: application/json" -d '{ "email": "user@app.com", "name": "UserName","password": "userpassword", "passwordConfirmation": "userpassword" }'
{"success":true,"data":"Account registered and Wallet Created sucessfully"}
```

<!--Off Chain Login User -->
<!--username admin@app.com -->
<!-- password userpassword -->
```
curl -X POST http://localhost:5000/api/v1/auth/login -H "Content-Type: application/json" -d '{ "email": "admin@app.com","password": "userpassword" }'{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmEzNTYyNGQ1NjQxZDg3YTFiNjkyZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI3NjczOTM0LCJleHAiOjE3Mjc2NzQ1MzR9.uHv-0kmYKwv3_fH1k6ZpseX1cGnLck0d0d5HY6g_d0I"}}% 
```

<!-- Off Chain Get Wallet -->
```
curl -X GET "http://localhost:5001/api/v1/stx/wallet" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmEzNTYyNGQ1NjQxZDg3YTFiNjkyZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI3Njc1MjM1LCJleHAiOjE3Mjc2NzU4MzV9.Zg-pU6GFWRhgNCQWuGrakRlkULwdwsyDYzx1cq2hoVY"
{"success":true,"data":{"wallet":{"_id":"66fa35622197db0b18eb59b3","userId":"66fa35624d5641d87a1b692f","name":"Account 1","encryptedSeed":"ea360971050bfd340eb4a987e9d0e3ebb683c99603d8ba5a89af427d2b133cc059e69129b47300071d091250d63a0c9184eb8cdba60fe0efee1473f16567a0d280bd2fab6b5bab1edc1bce2d16653d8a4601167edb16ffc56333aecde3d5ddc6","primaryAddress":"ST3FR5WVC60HF43W88P9B37S7ACBSACA8SJ3RKKS1","accounts":[{"address":"ST3FR5WVC60HF43W88P9B37S7ACBSACA8SJ3RKKS1","accountId":0,"publicKey":"03cb5521a57bf0950fa1a9874ae196864167f1c29deb400e632872d1951857e56b","createdAt":"2024-09-30T05:21:38.853Z","balance":0,"_id":"66fa35622197db0b18eb59b6"}],"createdAt":"2024-09-30T05:21:38.841Z","__v":1}}}
```



<!-- https://stacks.js.org/modules/_stacks_wallet_sdk -->
<!-- // The transit public key is provided in an "authentication request"  -->

Features Added

Generate a wallet from scratch  -> Done
Encrypt a wallet with a password  -> Done
Restore a wallet and associated accounts  -> Done
Generate new accounts in a wallet  -> Done
Sign transactions for the Stacks blockchain  -> Done
Register usernames on BNS, the naming service built into the Stacks Blockchain 