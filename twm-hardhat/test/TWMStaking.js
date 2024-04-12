const { expect } = require("chai");
const { Promise } = require("bluebird");
const { BigNumber } = require("ethers");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const addresses = {
  nft: '0x64f1489229061f3B515fAe43C6f91A49FdCE5424',
  token: '0xD88f0726dfb175e534213619C4C4A686D09cA743',
  bank: '0x8030D42D81409E9737a3e025A412c24B3F252fc2'
};

const tokenTraits = {
  1: ethers.utils.hexlify(0),
  2: ethers.utils.hexlify(ethers.utils.parseUnits((100).toString(), 18)),
  3: ethers.utils.hexlify(ethers.utils.parseUnits((150).toString(), 18)),
  4: ethers.utils.hexlify(ethers.utils.parseUnits((100).toString(), 18)),
  5: ethers.utils.hexlify(ethers.utils.parseUnits((200).toString(), 18)),
  6: ethers.utils.hexlify(ethers.utils.parseUnits((120).toString(), 18)),
  7: ethers.utils.hexlify(ethers.utils.parseUnits((180).toString(), 18)),
  8: ethers.utils.hexlify(ethers.utils.parseUnits((300).toString(), 18)),
  9: ethers.utils.hexlify(0),
  10: ethers.utils.hexlify(ethers.utils.parseUnits((370).toString(), 18)),
}

describe("The Watchmaker Collection", function () {
  it("Checking mint", async function () {
    const [owner] = await ethers.getSigners();

    const nft = new ethers.Contract(
      addresses.nft,
      [
        'function balanceOf(address owner) external view returns (uint256 balance)',
        'function mintToInv(address invAddr) public',
        'function totalSupply() external view returns (uint256)'
      ],
      owner
    );

    const txx = await nft.mintToInv(owner.address);
    const receipt = await txx.wait();
    console.log(`mint tx: https://goerli.etherscan.io/tx/${receipt.logs[1].transactionHash}`);

    const ownerBalance = await nft.balanceOf(owner.address);
    expect(await nft.totalSupply()).to.equal(ownerBalance);
  });
});

describe("The Bank", function () {
  it("launch staking", async function () {
    const [owner] = await ethers.getSigners();

    const bank = new ethers.Contract(
      addresses.bank,
      [
        'function stakingLaunched() public view returns (bool)',
        'function launchStaking() public'
      ],
      owner
    );

    if (await bank.stakingLaunched() == false) {
      const txx = await bank.launchStaking();
      const receipt = await txx.wait();
      console.log(`launch staking tx: https://etherscan.io/tx/${receipt.transactionHash}`);
    }
  });

  it("Checking deposit", async function () {
    const [owner] = await ethers.getSigners();

    const bank = new ethers.Contract(
      addresses.bank,
      [
        'function deposit(address contractAddress,uint256[] memory tokenIds,uint256[] memory tokenTraits,bytes calldata signature) public',
        'function getStakerYield(address staker) public view returns (uint256)',
        'function launchStaking() public',
        'function stakingLaunched() public view returns (bool)'
      ],
      owner
    );

    const nft = new ethers.Contract(
      addresses.nft,
      [
        'function isApprovedForAll(address owner, address operator) public view returns (bool)',
        'function setApprovalForAll(address operator, bool approved) public'
      ],
      owner
    );

    if (await bank.stakingLaunched() == false) {
      const txx = await bank.launchStaking();
      const receipt = await txx.wait();
      console.log(`launch staking tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
    }

    if (!await nft.isApprovedForAll(owner.address, addresses.bank)) {
      const txx = await nft.setApprovalForAll(addresses.bank, true);
      const receipt = await txx.wait();
      console.log(`setApprovalForAll tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);
    }

    let message = ethers.utils.solidityPack(["address", "uint256[]", "uint256[]"], [addresses.nft, [ethers.utils.hexlify(1), ethers.utils.hexlify(2), ethers.utils.hexlify(3)], [tokenTraits[1], tokenTraits[2], tokenTraits[3]]]);

    message = ethers.utils.solidityKeccak256(["bytes"], [message]);
    const signature = await owner.signMessage(ethers.utils.arrayify(message));

    const txx = await bank.deposit(addresses.nft, [ethers.utils.hexlify(1), ethers.utils.hexlify(2), ethers.utils.hexlify(3)], [tokenTraits[1], tokenTraits[2], tokenTraits[3]], signature);
    const receipt = await txx.wait();
    console.log(`deposit tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);

    const currentStakerYield = await bank.getStakerYield(owner.address);
    console.log("currentStakerYield:", currentStakerYield);
  });

  it("Checking Reward", async function () {
    const [owner] = await ethers.getSigners();

    const bank = new ethers.Contract(
      addresses.bank,
      [
        'function getAccumulatedAmount(address staker) public view returns (uint256)'
      ],
      owner
    );

    let accumulatedAmount = await bank.getAccumulatedAmount(owner.address);
    console.log("Accumulated Amount before claim: ", accumulatedAmount);
  });

  it("Checking withdraw", async function () {
    const [owner] = await ethers.getSigners();

    const bank = new ethers.Contract(
      addresses.bank,
      [
        'function withdraw(address contractAddress,uint256[] memory tokenIds) public',
        'function getStakerTokens(address staker) public view returns (uint256[] memory, uint256[] memory, uint256[] memory)',
        'function getStakerYield(address staker) public view returns (uint256)'
      ],
      owner
    );

  let tokens = await bank.getStakerTokens(owner.address);
  console.log("Staker tokens before withdraw: ", tokens)

  const txx = await bank.withdraw(addresses.nft, [ethers.utils.hexlify(1), ethers.utils.hexlify(2), ethers.utils.hexlify(3)]);
  const receipt = await txx.wait();
  console.log(`withdraw tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);

    let afterTokens = await bank.getStakerTokens(owner.address);
    console.log("Staker tokens after withdraw: ", afterTokens);

    const currentStakerYield = await bank.getStakerYield(owner.address);
    console.log("currentStakerYield:", currentStakerYield);
  });

  it("Checking twmt balance", async function () {
    const [owner] = await ethers.getSigners();

    const twmt = new ethers.Contract(
      addresses.token,
      [
        'function getUserBalance(address user) public view returns (uint256)'
      ],
      owner
    );

    const balance = await twmt.getUserBalance(owner.address);

    console.log("TWMT Balance: ", balance);
  });

  it("Checking deposit TWMT", async function () {
    const [owner] = await ethers.getSigners();

    const token = new ethers.Contract(
      addresses.token,
      [
        'function balanceOf(address account) external view returns (uint256)',
        'function depositTWMT(uint256 amount) public',
        'function isDepositPaused() public view returns (bool)',
        'function isPaused() public view returns (bool)',
        'function getUserBalance(address user) public view returns (uint256)',
        'function pauseGameTWMT(bool _pause) public'
      ],
      owner
    );

    let balanceTokenOwner = await token.balanceOf(owner.address);
    console.log("The balance of TWMT token for owner: ", balanceTokenOwner);

    const balance = await token.getUserBalance(owner.address);

    console.log("TWMT Game Balance: ", balance);

    if (await token.isDepositPaused()) {
      console.log("Deposit Paused!");
    } else {
      console.log("Deposit Enable!");
    }

    if (await token.isPaused()) {
      console.log("Transfers paused!");
      let txxx = await token.pauseGameTWMT(false);
      const receiptx = await txxx.wait();
      console.log(`pauseGameTWMT tx: https://goerli.etherscan.io/tx/${receiptx.transactionHash}`);
    } else {
      console.log("Transfers enable!");
    }

    let txx = await token.depositTWMT(balanceTokenOwner.div(250));
    const receipt = await txx.wait();
    console.log(`deposit twmt tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);

    console.log("The balance of TWMT token for owner after deposit: ", await token.balanceOf(owner.address));

    console.log("TWMT Game Balance after deposit: ", await token.getUserBalance(owner.address));

  });

  it("Checking twmt mint", async function () {
    const [owner] = await ethers.getSigners();

    const twmt = new ethers.Contract(
      addresses.token,
      [
        'function balanceOf(address account) external view returns (uint256)',
        'function mintFor(address user, uint256 amount) external'
      ],
      owner
    );

    let balanceTokenOwner = await twmt.balanceOf(owner.address);
    console.log("The balance of TWMT token for owner: ", balanceTokenOwner);

    let txx = await twmt.mintFor(owner.address, balanceTokenOwner.div(249));
    const receiptx = await txx.wait();
    console.log(`mintFor tx: https://goerli.etherscan.io/tx/${receiptx.transactionHash}`);

    console.log("The balance of TWMT token for owner after mintFor: ", await twmt.balanceOf(owner.address));
  });

  it("Checking withdrawTWMT", async function () {
    const [owner] = await ethers.getSigners();

    const token = new ethers.Contract(
      addresses.token,
      [
        'function isWithdrawPaused() public view returns (bool)',
        'function withdrawTWMT(uint256 amount) public',
        'function pauseWithdraw(bool _pause)',
        'function getUserBalance(address user) public view returns (uint256)'
      ],
      owner
    );

    if (await token.isWithdrawPaused()) {
      console.log("Withdraw Paused")
      let txxx = await token.pauseWithdraw(false);
      const receiptx = await txxx.wait();
    console.log(`pauseWithdraw tx: https://goerli.etherscan.io/tx/${receiptx.transactionHash}`);
    } else {
      console.log("Withdraw Enabled")
    }

    const balance = await token.getUserBalance(owner.address);

    console.log("balance twmt on game:", balance);

    const txx = await token.withdrawTWMT(balance);
    const receipt = await txx.wait();
    console.log(`withdrawTWMT tx: https://goerli.etherscan.io/tx/${receipt.transactionHash}`);

    console.log("The balance twmt on game for owner after withdraw: ", await token.getUserBalance(owner.address));
  });

  it("transfer ownership", async function () {
    const [owner] = await ethers.getSigners();
    const newOwner = "0x57dca3a419b39BaD30751593ef8BDACBA3e0ECfb"

    const bank = new ethers.Contract(
      addresses.bank,
      [
        'function transferOwnership(address newOwner) public'
      ],
      owner
    );

    const token = new ethers.Contract(
      addresses.token,
      [
        'function transferOwnership(address newOwner) public'
      ],
      owner
    );

    const txToken = await token.transferOwnership(newOwner);
    const receiptToken = await txToken.wait();
    console.log(`twmt transfer ownership tx: https://etherscan.io/tx/${receiptToken.transactionHash}`);
    const txBank = await bank.transferOwnership(newOwner);
    const receiptBank = await txBank.wait();
    console.log(`bank transfer ownership tx: https://etherscan.io/tx/${receiptBank.transactionHash}`);
  });
});