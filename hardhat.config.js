require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Validate private key or use undefined
const getPrivateKey = () => {
  const key = process.env.PRIVATE_KEY;
  if (!key || key === 'your_private_key_here' || key.length < 64) {
    return undefined;
  }
  return key.startsWith('0x') ? key : '0x' + key;
};

const privateKey = getPrivateKey();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: privateKey ? [privateKey] : [],
      chainId: 80001
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: privateKey ? [privateKey] : [],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};