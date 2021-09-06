export CONTRACT_ID=nftspace.near
export CONTRACT_ID=dev-1630847755199-56423796861577

//init
near create_account market.$CONTRACT_ID --masterAccount=$CONTRACT_ID --initial-balance 50

near deploy --accountId=market.$CONTRACT_ID --wasmFile=/var/www/html/nearspace.info/apps/market/out/market.wasm

near deploy --accountId=$CONTRACT_ID --wasmFile=/var/www/html/nearspace.info/apps/nft/out/main.wasm

near call $CONTRACT_ID new '{"owner_id": "'$CONTRACT_ID'","metadata":{"spec":"ns-1","name":"NearSpace","symbol":"NSNFT"},"supply_cap_by_type":{"test": "10000"}, "unlocked": true, "use_storage_fees": false, "free_mints": 3}' --accountId=$CONTRACT_ID

near call market.$CONTRACT_ID new '{"owner_id":  "'$CONTRACT_ID'", "ft_token_ids": [], "use_storage_fees": false}' --accountId=$CONTRACT_ID

// view
near view $CONTRACT_ID nft_tokens '{"from_index": "0", "limit": "100"}'
near view $CONTRACT_ID nft_tokens_for_owner '{"account_id": "zavodil.testnet", "from_index": "0", "limit": 100}'
near view $CONTRACT_ID nft_tokens_for_creator '{"account_id": "'$CONTRACT_ID'", "from_index": "0", "limit": 100}'


// mint
near call $CONTRACT_ID   nft_mint '{"token_id":"token-1-20", "metadata": {"media": "QmPXnCavktwxJ585rNeYREkgTDosYLrdTvRRGQKTPejjeR",    "reference": "pinata",    "title": "NEAR 3rd Anniversary NFT #20",    "description": "NEAR 3rd Anniversary contest: NEAR blockchain advantages #FutureIsNEAR",    "issued_at": "1630878258838",  "extra": "{\"media_lowres\":\"QmRuMZoGewLp5L4a2WadmMQW4pRdA7SAzzazXeUPiBj7uu\", \"media_highres\":\"QmRuMZoGewLp5L4a2WadmMQW4pRdA7SAzzazXeUPiBj7uu\",\"creator_id\":\"nftspace.near\",\"media_size\":3708318,\"media_type\":\"video/mp4\"}"  , "generation": 1},  "perpetual_royalties": {"treasure.rucommunity.near": 900, "biir.near": 100}}' --accountId $CONTRACT_ID --amount 1

near call $CONTRACT_ID  nft_transfer '{"receiver_id": "nitinverma.near", "token_id": "token-1-20"}' --accountId $CONTRACT_ID --amount 0.000000000000000000000001


// upgrade 
near call $CONTRACT_ID   nft_mint '{"token_id":"11", "metadata": {"media": "https://s3.amazonaws.com/appforest_uf/f1630684595516x525774156965649540/_aIqChtzeNrq3dHmxKxGdse1.png",    "reference": "",    "title": "Gen 1 You ARE Crazy?!",    "description": "A Comics Reboot by Molly Jones.",    "issued_at": "1630684610516",    "extra": "", "generation": 1},  "perpetual_royalties": {"dev-test.testnet": 500}}' --accountId $CONTRACT_ID --amount 1 
near call $CONTRACT_ID   nft_mint '{"token_id":"12", "metadata": {"media": "https://s3.amazonaws.com/appforest_uf/f1630684595516x525774156965649540/_aIqChtzeNrq3dHmxKxGdse1.png",    "reference": "",    "title": "Gen 1 Are You Crazy?!",    "description": "A Comics Reboot by Molly Jones.",    "issued_at": "1630684610516",    "extra": "", "generation": 1},  "perpetual_royalties": {"dev-test.testnet": 500}}' --accountId $CONTRACT_ID --amount 1
near call $CONTRACT_ID  nft_transfer '{"receiver_id": "zavodil.testnet", "token_id": "11"}' --accountId $CONTRACT_ID --amount 0.000000000000000000000001
near call $CONTRACT_ID  nft_transfer '{"receiver_id": "zavodil.testnet", "token_id": "12"}' --accountId $CONTRACT_ID --amount 0.000000000000000000000001
near call $CONTRACT_ID   nft_mint '{"token_id":"223", "metadata": {"media": "https://s3.amazonaws.com/appforest_uf/f1620411280411x359179686157744520/Jemisin_ObeliskGate_TP.jpg",    "reference": "",    "title": "Gen 2 2ND GEN",    "description": "Meet N.K. Jemisin!",    "issued_at": "1630684610516",    "extra": "", "generation": 2},  "perpetual_royalties": {"dev-test.testnet": 500}}' --accountId $CONTRACT_ID --amount 1
near call $CONTRACT_ID   nft_upgrade '{"input_token_id1": "11", "input_token_id2": "token-1-1", "output_token_id": "223"}' --accountId zavodil.testnet --amount 0.000000000000000000000001 --gas 200000000000000