async function main() {
  const [deployer] = await ethers.getSigners();
  const twmSigner = "0xB82B9b7344f9d18dE0D462E91e0EFE4b74a63708";

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/26t6Od2wqkhFyeYUyM9wUH1k9T-nMx_J");


  const { chainId } = await provider.getNetwork();
  console.log("Selected ChainId:", chainId);

  if (chainId == 5) {
    // const TheWatchmakerCollection = await ethers.getContractFactory("The_Watchmaker");
    // const theWatchmakerCollection = await TheWatchmakerCollection.deploy("The Watchmaker Collection", "TWM", "https://bafybeigbejipi42z4vynzdq5mckdjwmzhfv5p7hg2bft6kg7z2nqh6dype.ipfs.nftstorage.link/", "https://bafybeic6dfvh6jg2wa2qwcegpjv6sklbmpqrmuu52j5u6iabgnfye6zehu.ipfs.nftstorage.link/hidden.json");

    // console.log("TheWatchmakerCollection address:", theWatchmakerCollection.address);

    // const TWMStaking = await ethers.getContractFactory("TWMStaking");
    // const twmStaking = await TWMStaking.deploy("0x6109351c250DE3fdb6B94B5e50b01a14aC94886a", deployer.address);

    // console.log("TWMStaking address:", twmStaking.address);

    // const TheWatchmakerToken = await ethers.getContractFactory("TheWatchmakerToken");
    // const theWatchmakerToken = await TheWatchmakerToken.deploy(twmStaking.address);

    // console.log("hex value for 250 * 10^6 * 10^18:", ethers.utils.hexlify(ethers.utils.parseUnits("250000000", 18)));

    // console.log("TheWatchmakerToken address:", theWatchmakerToken.address);

    // TWM Bank:  0x19367c16d694Ec647D311392090E880D6A92a809
    // const SecondCollection = await ethers.getContractFactory("WatchParts");
    // const secondCollection = await SecondCollection.deploy("The Watchmaker 2: Parts Collection", "TWM2", "0x6109351c250DE3fdb6B94B5e50b01a14aC94886a", twmStaking.address, "https://bafybeiddawae4j2a2qdy3w2x4cm4cdon534k5ebekiug2wmr4wehxq2uty.ipfs.nftstorage.link/");
    // console.log("TWM2 address:", secondCollection.address);

    // Casino
    // const Casino = await ethers.getContractFactory("Casino");
    // const casino = await Casino.deploy("0x2EE8CdA853903aF5e2e5b3e16f4dcA0537A504d2", deployer.address);
    // console.log("Casino address:", casino.address);

  } else if (chainId == 1) {
    // TWM V1: 0x64f1489229061f3B515fAe43C6f91A49FdCE5424
    // const TWMStaking = await ethers.getContractFactory("TWMStaking");
    // const twmStaking = await TWMStaking.deploy("0x64f1489229061f3B515fAe43C6f91A49FdCE5424", twmSigner);

    // console.log("TWMStaking address:", twmStaking.address);

    // const TheWatchmakerToken = await ethers.getContractFactory("TheWatchmakerToken");
    // const theWatchmakerToken = await TheWatchmakerToken.deploy(twmStaking.address);

    // console.log("hex value for 250 * 10^6 * 10^18:", ethers.utils.hexlify(ethers.utils.parseUnits("250000000", 18)));

    // console.log("TheWatchmakerToken address:", theWatchmakerToken.address);

    // const SecondCollection = await ethers.getContractFactory("WatchParts");
    // const secondCollection = await SecondCollection.deploy("The Watchmaker 2: Parts Collection", "TWM2", "0x64f1489229061f3B515fAe43C6f91A49FdCE5424", twmStaking.address, "https://bafybeiddawae4j2a2qdy3w2x4cm4cdon534k5ebekiug2wmr4wehxq2uty.ipfs.nftstorage.link/");
    // console.log("WatchParts address:", secondCollection.address);
    // 0xdac17f958d2ee523a2206206994597c13d831ec7 : USDT
    // const Casino = await ethers.getContractFactory("Casino");
    // const casino = await Casino.deploy("0xD88f0726dfb175e534213619C4C4A686D09cA743", twmSigner);
    // console.log("Casino address:", casino.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });