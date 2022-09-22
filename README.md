# GasBuddy 😉🛠️

Get gas prices and gas estimates for your smart contract function on NEAR.

Sample cURL command: 

```bash
curl --location --request POST 'https://api.gasbuddy.tech/profile' \
--header 'Content-Type: application/json' \
--data-raw '{
    "contract_account_id": "smallgb.idea404.testnet",
    "method": "add_message",
    "args": {
        "text": "Hi!"
    }
}'
```

Get more info: 

```bas
curl https://api.gasbuddy.tech/
```
