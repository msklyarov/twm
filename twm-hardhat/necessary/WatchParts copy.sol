// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import {OperatorFilterer} from "closedsea/src/OperatorFilterer.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";

interface ITWMTSource {
    function getStakerTokens(
        address staker
    )
        external
        view
        returns (uint256[] memory, uint256[] memory, uint256[] memory);
}

interface ITWM {
    function walletOfOwner(
        address _owner
    ) external view returns (uint256[] memory);

    function balanceOf(address owner) external view returns (uint256 balance);
}

contract WatchParts is
    ERC721ABurnable,
    ERC721AQueryable,
    OperatorFilterer,
    ERC2981,
    ReentrancyGuard,
    Ownable
{
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";

    // Max number of NFTs
    uint256 public constant MAX_SUPPLY = 11110;
    uint256 public _publicPrice;
    uint256 public _guestPriceForHolder;
    bool public saleIsActive;
    uint256 public maxMintLimit;
    uint256 public reserveMaxLimit;

    // The watchmaker contract
    ITWM public TWM;
    ITWMTSource public STAKING;

    // Stores the number of minted tokens by user
    mapping(address => uint256) public _mintedByAddress;

    mapping(address => bool) public _freeMintedAddress;

    mapping(uint256 => bool) public _v1Status;

    /// @notice Operator filter toggle switch
    bool private operatorFilteringEnabled;

    event TokensMinted(address indexed mintedBy, uint256 indexed tokensNumber);

    constructor(
        string memory _name,
        string memory _symbol,
        address _twm,
        address _staking,
        string memory _initBaseURI
    ) ERC721A(_name, _symbol) {
        TWM = ITWM(_twm);
        STAKING = ITWMTSource(_staking);
        setBaseURI(_initBaseURI);
        maxMintLimit = 10;
        reserveMaxLimit = 50;
        saleIsActive = false;
        _publicPrice = 0.02 ether;
        _guestPriceForHolder = 0.015 ether;

        // Setup filter registry
        _registerForOperatorFiltering();
        operatorFilteringEnabled = true;
        // Setup royalties to 10% (default denominator is 10000)
        _setDefaultRoyalty(_msgSender(), 1000);
    }

    function detectMultiV1(address _minter) public view returns (uint256[] memory) {
        uint256 count = getCount(_minter);
        uint256[] memory tokenIds = new uint256[](count);

        uint256[] memory twmNFTs = TWM.walletOfOwner(_minter);

        (uint256[] memory stakedFirst, , ) = STAKING.getStakerTokens(
            _minter
        );

        uint256 j;
        if(twmNFTs.length != 0) {
            for(uint256 i = 0; i < twmNFTs.length; i++) {
                if(_v1Status[twmNFTs[i]] == true) {
                    tokenIds[j] = (twmNFTs[i]);
                }
            }
        }

        if(stakedFirst.length != 0) {
            for(uint256 i = 0; i < stakedFirst.length; i++) {
                if(_v1Status[stakedFirst[i]] == true) {
                    tokenIds[j] = (stakedFirst[i]);
                }
            }
        }

        return tokenIds;
    }

    function getCount(address _minter) internal view returns (uint) {
        uint count;
        uint256[] memory twmNFTs = TWM.walletOfOwner(_minter);

        (uint256[] memory stakedFirst, , ) = STAKING.getStakerTokens(
            _minter
        );

        if(twmNFTs.length != 0) {
            for(uint256 i = 0; i < twmNFTs.length; i++) {
                if(_v1Status[twmNFTs[i]] == true) {
                    count++;
                }
            }
        }

        if(stakedFirst.length != 0) {
            for(uint256 i = 0; i < stakedFirst.length; i++) {
                if(_v1Status[stakedFirst[i]] == true) {
                    count++;
                }
            }
        }
        return count;
    }

    function presaleMint(uint256 tokensToMint) public nonReentrant {
        require(msg.sender == tx.origin, "Can't mint through another contract");
        uint256[] memory twmNFTs = TWM.walletOfOwner(_msgSender());

        (uint256[] memory stakedFirst, , ) = STAKING.getStakerTokens(
            _msgSender()
        );

        if(twmNFTs.length != 0) {
            for(uint256 i = 0; i < twmNFTs.length; i++) {
                require(_v1Status[twmNFTs[i]] != true, "The V1 NFT can't be used multiple for presale!");
                _v1Status[twmNFTs[i]] = true;
            }
        }

        if(stakedFirst.length != 0) {
            for(uint256 i = 0; i < stakedFirst.length; i++) {
                require(_v1Status[twmNFTs[i]] != true, "The V1 NFT can't be used multiple for presale!");
                _v1Status[stakedFirst[i]] = true;
            }
        }

        uint256 totalOwnedTWMs = twmNFTs.length + stakedFirst.length;

        require(!_freeMintedAddress[_msgSender()], "Already done free mint");

        require(
            totalSupply() + tokensToMint <= MAX_SUPPLY,
            "Mint exceeds total supply"
        );

        require(maxMintLimit >= tokensToMint, "Max Limit is 10");

        require(
            totalOwnedTWMs >= tokensToMint,
            "Overflow The Owned TWM Amount"
        );

        _safeMint(_msgSender(), tokensToMint);
        _mintedByAddress[_msgSender()] += tokensToMint;
        _freeMintedAddress[_msgSender()] = true;

        emit TokensMinted(_msgSender(), tokensToMint);
    }

    function publicMint(uint256 tokensToMint) external payable nonReentrant {
        require(msg.sender == tx.origin, "Can't mint through another contract");

        require(saleIsActive, "The guest/public mode is not started yet");

        uint256[] memory twmNFTs = TWM.walletOfOwner(_msgSender());

        (uint256[] memory stakedFirst, , ) = STAKING.getStakerTokens(
            _msgSender()
        );

        uint256 totalOwnedTWMs = twmNFTs.length + stakedFirst.length;

        require(
            totalSupply() + tokensToMint <= MAX_SUPPLY,
            "Mint exceeds total supply"
        );

        if (totalOwnedTWMs > 0) {
            require(
                _guestPriceForHolder * tokensToMint <= msg.value,
                "Sent incorrect ETH value for guest"
            );
        } else {
            require(
                _publicPrice * tokensToMint <= msg.value,
                "Sent incorrect ETH value for public"
            );
        }

        require(maxMintLimit >= tokensToMint, "Max Limit is 10");

        _safeMint(_msgSender(), tokensToMint);

        _mintedByAddress[_msgSender()] += tokensToMint;

        emit TokensMinted(_msgSender(), tokensToMint);
    }

    function reserveNFTs(address devAddr) public onlyOwner nonReentrant {
        require(
            totalSupply() + reserveMaxLimit <= MAX_SUPPLY,
            "Mint exceeds total supply"
        );

        _safeMint(devAddr, reserveMaxLimit);

        _mintedByAddress[devAddr] += reserveMaxLimit;

        emit TokensMinted(devAddr, reserveMaxLimit);
    }

    function flipSaleIsActive() public onlyOwner nonReentrant {
        saleIsActive = !saleIsActive;
    }

    function updatePublicPrice(uint256 _newPrice) public onlyOwner {
        _publicPrice = _newPrice;
    }

    function updatePublicPriceForHolder(uint256 _newPrice) public onlyOwner {
        _guestPriceForHolder = _newPrice;
    }

    function updateMaxMintLimit(uint256 _newMaxLimit) public onlyOwner {
        maxMintLimit = _newMaxLimit;
    }

    function updateReserveMaxLimit(uint256 _newMaxLimit) public onlyOwner {
        reserveMaxLimit = _newMaxLimit;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    ////////////////
    // tokens
    ////////////////
    /**
     * @dev sets the base uri for {_baseURI}
     */
    function setBaseURI(string memory baseURI_) public onlyOwner nonReentrant {
        baseURI = baseURI_;
    }

    /**
     * @dev See {ERC721-_baseURI}.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721A, IERC721A) returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI_ = _baseURI();
        return
            bytes(baseURI_).length != 0
                ? string(
                    abi.encodePacked(
                        baseURI_,
                        (tokenId + 1).toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721A, IERC721A, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    ////////////////
    // royalty
    ////////////////
    /**
     * @dev See {ERC2981-_setDefaultRoyalty}.
     */
    function setDefaultRoyalty(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    /**
     * @dev See {ERC2981-_deleteDefaultRoyalty}.
     */
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    /**
     * @dev See {ERC2981-_setTokenRoyalty}.
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /**
     * @dev See {ERC2981-_resetTokenRoyalty}.
     */
    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

    ///////////////////
    // operator filter
    ///////////////////

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721A, IERC721A) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(
        address operator,
        uint256 tokenId
    )
        public
        payable
        override(ERC721A, IERC721A)
        onlyAllowedOperatorApproval(operator)
    {
        super.approve(operator, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public payable override(ERC721A, IERC721A) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
