// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PurePixMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    
    IERC721 public nftContract;
    Counters.Counter private _auctionIdCounter;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 minPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bidRefunds;

    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionCreated(uint256 indexed auctionId, uint256 indexed tokenId, address indexed seller);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Contract not approved");
        require(price > 0, "Price must be greater than 0");

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit NFTListed(tokenId, msg.sender, price);
    }

    function purchaseNFT(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "NFT not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        listing.active = false;

        nftContract.transferFrom(seller, msg.sender, tokenId);

        // Send payment to seller
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "Payment failed");

        // Refund excess payment
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }

        emit NFTSold(tokenId, msg.sender, price);
    }

    function giftNFT(uint256 tokenId, address recipient) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(recipient != address(0), "Invalid recipient");

        nftContract.transferFrom(msg.sender, recipient, tokenId);
    }

    function createAuction(uint256 tokenId, uint256 duration, uint256 minPrice) external returns (uint256) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Contract not approved");
        require(duration > 0, "Duration must be greater than 0");

        uint256 auctionId = _auctionIdCounter.current();
        _auctionIdCounter.increment();

        auctions[auctionId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            minPrice: minPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            ended: false
        });

        emit AuctionCreated(auctionId, tokenId, msg.sender);
        return auctionId;
    }

    function placeBid(uint256 auctionId) external payable nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value >= auction.minPrice, "Bid below minimum price");
        require(msg.value > auction.highestBid, "Bid too low");
        require(!auction.ended, "Auction already ended");

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            bidRefunds[auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            // Transfer NFT to winner
            nftContract.transferFrom(auction.seller, auction.highestBidder, auction.tokenId);

            // Pay seller
            (bool success, ) = payable(auction.seller).call{value: auction.highestBid}("");
            require(success, "Payment to seller failed");

            emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
        } else {
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }

    function withdrawBidRefund(uint256 auctionId) external nonReentrant {
        uint256 refund = bidRefunds[auctionId][msg.sender];
        require(refund > 0, "No refund available");

        bidRefunds[auctionId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: refund}("");
        require(success, "Refund failed");
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }

    function getAuction(uint256 auctionId) external view returns (Auction memory) {
        return auctions[auctionId];
    }
}