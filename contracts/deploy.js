// Script de deploy para Hardhat
const { ethers } = require("hardhat");

async function main() {
    // Deploy NFT Contract
    console.log("Deploying PurePixNFT...");
    const PurePixNFT = await ethers.getContractFactory("PurePixNFT");
    const nftContract = await PurePixNFT.deploy();
    await nftContract.deployed();
    console.log("PurePixNFT deployed to:", nftContract.address);

    // Deploy Marketplace Contract
    console.log("Deploying PurePixMarketplace...");
    const PurePixMarketplace = await ethers.getContractFactory("PurePixMarketplace");
    const marketplaceContract = await PurePixMarketplace.deploy(nftContract.address);
    await marketplaceContract.deployed();
    console.log("PurePixMarketplace deployed to:", marketplaceContract.address);

    console.log("\n=== DIRECCIONES PARA ACTUALIZAR EN blockchain.ts ===");
    console.log(`export const NFT_CONTRACT_ADDRESS = '${nftContract.address}';`);
    console.log(`export const MARKETPLACE_CONTRACT_ADDRESS = '${marketplaceContract.address}';`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });