# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Goerli.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Goerli node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

yarn hardhat run scripts/deploy.js --network goerli

yarn hardhat verify --network goerli <address> <unlock time>


```shell
yarn hardhat run scripts/deploy.js --network goerli
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
yarn hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS [arguments]
```


Token Contract Verification shell
yarn hardhat verify --network goerli "0xD89991DC574d77A49EA698d4A7608ed6dE92F04a" "The Watchmaker Token" "TWT" "0xd3c21bcecceda1000000"


Staking Contract Verification shell
yarn hardhat verify --network goerli "0xb258a1b4621aE6A18eB105BA1c27363ecf228344" "0x93ca0D4Bf2B82d8028Eda52e832B0E7e52400e27" "0xD89991DC574d77A49EA698d4A7608ed6dE92F04a" "0x6F661f14143f06f0E43344975D7f8c26C7556752"


Collection Contract Verification shell
yarn hardhat verify --network goerli "0x148E7CFd1c595Abd105D48dC9014126d17dF16F6" "The Watchmaker Collection" "TWM" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/" "https://bafybeic6dfvh6jg2wa2qwcegpjv6sklbmpqrmuu52j5u6iabgnfye6zehu.ipfs.nftstorage.link/hidden.json"


//First
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 485109750981699824
Selected ChainId: 5
TheWatchmakerCollection address: 0xBDF541Fd99437358DcFBdF4ef8dFfBD2889f7347
hex value for 10 * 24: 0xd3c21bcecceda1000000
TheWatchmakerToken address: 0xB77e09eCE6ce1d0E3175bFd613667b2F1Df2fB7A
TWMStaking address: 0x8664904DB7C8869A97ED0CA4A12b73035cE0eE92

// Second
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 2420720673138548898
Selected ChainId: 5
TheWatchmakerCollection address: 0x148E7CFd1c595Abd105D48dC9014126d17dF16F6
hex value for 10 * 24: 0xd3c21bcecceda1000000
TheWatchmakerToken address: 0x96216D4645BA8f1E5bf608C9B990293DFc0FCBf4
TWMStaking address: 0xeaB8B2Ae13dd571E384Db7f5B835FaC8057393D6

//Third
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 2051114427830796055
Selected ChainId: 5
TheWatchmakerCollection address: 0x93ca0D4Bf2B82d8028Eda52e832B0E7e52400e27
hex value for 10 * 24: 0xd3c21bcecceda1000000
TheWatchmakerToken address: 0xD89991DC574d77A49EA698d4A7608ed6dE92F04a
TWMStaking address: 0xb258a1b4621aE6A18eB105BA1c27363ecf228344


//Fourth
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1519830168488457969
Selected ChainId: 5
TheWatchmakerCollection address: 0x62494743224F0DE8f4C9d07386a292CA688d853e
hex value for 10 * 24: 0x52b7d2dcc80cd2e4000000
TheWatchmakerToken address: 0xfCcEcb592E2d79C8bc1F4D7dB99dF1407B3b5225
TWMStaking address: 0xBF815ED264207c2a6F05d45B1B90695d6dC12185

//Fifth
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1474125911730092460
Selected ChainId: 5
TheWatchmakerCollection address: 0x0b54ef69b740FADf5cc6f1348cce295a9957be82
hex value for 10 * 24: 0x52b7d2dcc80cd2e4000000
TheWatchmakerToken address: 0x582FbEF8FF30ff23730046eA1f075bF8D96152E9
TWMStaking address: 0x1d5408F97347F2Df89661aa4E0B57416C84e7557


2023/03/18 05/09
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1429817350572645597
Selected ChainId: 5
TheWatchmakerCollection address: 0x62a16A73Df1B334acD9ADcEbef4AD0a637B1f2DDg  
TWMStaking address: 0x140386aEBD9c64933eA20a473c54de8f52dA41e4
hex value for 10 * 24: 0x52b7d2dcc80cd2e4000000
TheWatchmakerToken address: 0x28503d6025f947D66B442e538eB2e35902A61380

# Staking Contract Verification Shell
yarn hardhat verify --network goerli "0x140386aEBD9c64933eA20a473c54de8f52dA41e4" "0x62a16A73Df1B334acD9ADcEbef4AD0a637B1f2DD" "0x6F661f14143f06f0E43344975D7f8c26C7556752"

# Token Contract Verification Shell
yarn hardhat verify --network goerli "0x28503d6025f947D66B442e538eB2e35902A61380" "0x140386aEBD9c64933eA20a473c54de8f52dA41e4"

2023/03/21 21/25
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 2406944791780270470
Selected ChainId: 5
TheWatchmakerCollection address: 0xA2B55606Fe72B42e2f79b6CDe2F8b7859B004788
TWMStaking address: 0x51A45E24895C98B0C75817B3c8b1756c66DBF516
hex value for 250 * 10^6 * 10^18: 0xcecb8f27f4200f3a000000
TheWatchmakerToken address: 0x349E6988dd448bB325D3F3846Ad1Dc0794Fc8f51

# Staking Contract Verification Shell
yarn hardhat verify --network goerli "0x51A45E24895C98B0C75817B3c8b1756c66DBF516" "0xA2B55606Fe72B42e2f79b6CDe2F8b7859B004788" "0x6F661f14143f06f0E43344975D7f8c26C7556752"

2023/03/21 21/56
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1657969899082542990
Selected ChainId: 5
TheWatchmakerCollection address: 0x6109351c250DE3fdb6B94B5e50b01a14aC94886a
TWMStaking address: 0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D
hex value for 250 * 10^6 * 10^18: 0xcecb8f27f4200f3a000000
TheWatchmakerToken address: 0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2

# Staking Contract Verification Shell
yarn hardhat verify --network goerli "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x6F661f14143f06f0E43344975D7f8c26C7556752"

# Token Contract Verification Shell
yarn hardhat verify --network goerli "0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D"


2023/04/13 22/21
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 2317274080779884267
Selected ChainId: 5
WatchParts address: 0xee415Cb47D00Db61FD994Cb1E394255b32bE107d

yarn hardhat verify --network goerli "0xee415Cb47D00Db61FD994Cb1E394255b32bE107d" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"

2023/04/15 21/21
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1796255699132258709
Selected ChainId: 5
WatchParts address: 0x3Df206c8f6EEd8353Dd4e03Ec7F6627c66287cA3

yarn hardhat verify --network goerli "0x3Df206c8f6EEd8353Dd4e03Ec7F6627c66287cA3" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"


2023/04/18
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1655124384411681182
Selected ChainId: 5
WatchParts address: 0xd2c8Cd02099BE09D7bD07D1431E58864731FCb69

yarn hardhat verify --network goerli "0xd2c8Cd02099BE09D7bD07D1431E58864731FCb69" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"

2023/04/19

Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1155904250228154389
Selected ChainId: 5
WatchParts address: 0x27c1E83aC381D0Ae40378458AE1544763Be214ce

yarn hardhat verify --network goerli "0x27c1E83aC381D0Ae40378458AE1544763Be214ce" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"

2023/04/20
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1043984203321009588
Selected ChainId: 5
WatchParts address: 0xe39333506e25303FC30477bfb80Ef9852ca65Ad3


yarn hardhat verify --network goerli "0xe39333506e25303FC30477bfb80Ef9852ca65Ad3" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"

2023/04/20 14/50
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1745654636346669102
Done in 18.98s.d: 5
WatchParts address: 0xAfA3302D693095318091C0A99229681e2B3898B2

yarn hardhat verify --network goerli "0xAfA3302D693095318091C0A99229681e2B3898B2" "WatchParts" "WP" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/


2023/04/24 15/10
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1729153730088538656
Selected ChainId: 5
WatchParts address: 0x2021d7DAbB1441587186CA2D5D29f3B7c1f2B20D

yarn hardhat verify --network goerli "0x2021d7DAbB1441587186CA2D5D29f3B7c1f2B20D" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"



2021/04/24 15/30
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1723813127978438651
Selected ChainId: 5
WatchParts address: 0x60D303a3a7823DA8d592244744a1F267cFb456BC

yarn hardhat verify --network goerli "0x60D303a3a7823DA8d592244744a1F267cFb456BC" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/" "https://bafybeic6dfvh6jg2wa2qwcegpjv6sklbmpqrmuu52j5u6iabgnfye6zehu.ipfs.nftstorage.link/hidden.json"


2023/04/24 15/50
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1714576218971845996
Selected ChainId: 5
WatchParts address: 0xB19c0f4Db633414d728E6acb2A9540830638980C

yarn hardhat verify --network goerli "0xB19c0f4Db633414d728E6acb2A9540830638980C" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"


2023/04/26 (goerli)
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1708492584610823780
Selected ChainId: 5
WatchParts address: 0x475d9313F94f4ed16a3672252C62dED4Bc403C4C

yarn hardhat verify --network goerli "0x475d9313F94f4ed16a3672252C62dED4Bc403C4C" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"


0xa9fAfeB15eD502B6f6660EDf5982Df279A0d2Ab8

yarn hardhat verify --network goerli "0xa9fAfeB15eD502B6f6660EDf5982Df279A0d2Ab8" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x13Bbb8482EbE2b752825f797ba1808DeC1a9113D" "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/"




2023/04/27 00/30

bank: 0x19367c16d694ec647d311392090e880d6a92a809
twm2: 0x94cdad0b08cfc45402b7df1f1e543771292d25b9

yarn hardhat verify --network goerli "0x19367c16d694ec647d311392090e880d6a92a809" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x6F661f14143f06f0E43344975D7f8c26C7556752"

yarn hardhat verify --network goerli "0xeb044BC9693A389fD4e23f9e5e3E2bd1CC60588b" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x19367c16d694ec647d311392090e880d6a92a809" "https://bafybeiddawae4j2a2qdy3w2x4cm4cdon534k5ebekiug2wmr4wehxq2uty.ipfs.nftstorage.link/"


2023/04/28 121/16
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 1437500301048616066
Selected ChainId: 5
TWMStaking address: 0xdD46F1e586e27f49D4D91a6025Be0c57cB23963C
TWM2 address: 0x6c8a1019A3E9555e116419EdF9E23A59764F8f0F

yarn hardhat verify --network goerli "0xdD46F1e586e27f49D4D91a6025Be0c57cB23963C" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0x6F661f14143f06f0E43344975D7f8c26C7556752"

yarn hardhat verify --network goerli "0x6c8a1019A3E9555e116419EdF9E23A59764F8f0F" "The Watchmaker 2: Parts Collection" "TWM2" "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a" "0xdD46F1e586e27f49D4D91a6025Be0c57cB23963C" "https://bafybeiddawae4j2a2qdy3w2x4cm4cdon534k5ebekiug2wmr4wehxq2uty.ipfs.nftstorage.link/"

2023/05/24
Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 797765598331277501
Selected ChainId: 5
Casino address: 0x607077F1e6644f8C286905A09d1dd1dC9F173945

yarn hardhat verify --network goerli "0x607077F1e6644f8C286905A09d1dd1dC9F173945" "0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2" "0x6F661f14143f06f0E43344975D7f8c26C7556752"


Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 785415300754496540
Selected ChainId: 5
Casino address: 0x16DbcFc3A87B3c48b180c9fb432A40202e98DbBd

yarn hardhat verify --network goerli "0x16DbcFc3A87B3c48b180c9fb432A40202e98DbBd" "0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2" "0x6F661f14143f06f0E43344975D7f8c26C7556752"


Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 784747224084579310
Selected ChainId: 5
Casino address: 0xd0b9c3d038d482Ea4ACEA739C7d4D14375b99761

yarn hardhat verify --network goerli "0xd0b9c3d038d482Ea4ACEA739C7d4D14375b99761" "0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2" "0x6F661f14143f06f0E43344975D7f8c26C7556752"


Deploying contracts with the account: 0x6F661f14143f06f0E43344975D7f8c26C7556752
Account balance: 779361304402599828
Selected ChainId: 5
Casino address: 0x441Ba1fF8593ae528E4ea4DcD1d53778D3c13682

yarn hardhat verify --network goerli "0x441Ba1fF8593ae528E4ea4DcD1d53778D3c13682" "0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2" "0x6F661f14143f06f0E43344975D7f8c26C7556752"