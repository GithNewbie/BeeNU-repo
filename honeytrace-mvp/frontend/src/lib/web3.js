import { ethers } from 'ethers';

// Contract ABI (would be imported from compiled contract in production)
export const CONTRACT_ABI = [
  "function createBatch(bytes32 batchId, bytes32 ipfsHash) external",
  "function addEvent(bytes32 batchId, bytes32 ipfsHash, string calldata eventType) external",
  "function getBatch(bytes32 batchId) external view returns (address producer, uint256 createdAt, bytes32 ipfsHash, uint256 eventCount)",
  "function getBatchEvents(bytes32 batchId) external view returns (tuple(uint256 timestamp, address actor, bytes32 ipfsHash, string eventType)[])",
  "event BatchCreated(bytes32 indexed batchId, address indexed producer, bytes32 ipfsHash, uint256 timestamp)",
  "event EventAdded(bytes32 indexed batchId, address indexed actor, bytes32 ipfsHash, string eventType, uint256 timestamp)"
];

// Contract address (update after deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Network configuration
export const NETWORKS = {
  hardhat: {
    chainId: 1337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: null
  },
  mumbai: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

/**
 * Get Web3 provider from browser wallet
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('No Web3 provider found. Please install MetaMask.');
};

/**
 * Get signer (user's wallet)
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Get contract instance
 */
export const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Convert string to bytes32
 */
export const stringToBytes32 = (str) => {
  return ethers.id(str);
};

/**
 * Convert bytes32 to string (IPFS hash)
 */
export const bytes32ToString = (bytes32) => {
  return ethers.toUtf8String(bytes32);
};

/**
 * Create a new batch on the blockchain
 */
export const createBatch = async (batchId, ipfsHash) => {
  try {
    const contract = await getContract();
    const batchIdBytes = stringToBytes32(batchId);
    const ipfsHashBytes = stringToBytes32(ipfsHash);
    
    const tx = await contract.createBatch(batchIdBytes, ipfsHashBytes);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error creating batch:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Add an event to an existing batch
 */
export const addEvent = async (batchId, ipfsHash, eventType) => {
  try {
    const contract = await getContract();
    const batchIdBytes = stringToBytes32(batchId);
    const ipfsHashBytes = stringToBytes32(ipfsHash);
    
    const tx = await contract.addEvent(batchIdBytes, ipfsHashBytes, eventType);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error adding event:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get batch details from blockchain
 */
export const getBatchDetails = async (batchId) => {
  try {
    const contract = await getContract();
    const batchIdBytes = stringToBytes32(batchId);
    
    const [producer, createdAt, ipfsHash, eventCount] = await contract.getBatch(batchIdBytes);
    
    return {
      success: true,
      data: {
        producer,
        createdAt: Number(createdAt),
        ipfsHash,
        eventCount: Number(eventCount)
      }
    };
  } catch (error) {
    console.error('Error getting batch:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all events for a batch
 */
export const getBatchEvents = async (batchId) => {
  try {
    const contract = await getContract();
    const batchIdBytes = stringToBytes32(batchId);
    
    const events = await contract.getBatchEvents(batchIdBytes);
    
    return {
      success: true,
      data: events.map(event => ({
        timestamp: Number(event.timestamp),
        actor: event.actor,
        ipfsHash: event.ipfsHash,
        eventType: event.eventType
      }))
    };
  } catch (error) {
    console.error('Error getting events:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Request wallet connection
 */
export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    return {
      success: true,
      address: accounts[0]
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check if wallet is connected
 */
export const checkConnection = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      return { success: false, connected: false };
    }
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    return {
      success: true,
      connected: accounts.length > 0,
      address: accounts[0] || null
    };
  } catch (error) {
    return {
      success: false,
      connected: false,
      error: error.message
    };
  }
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Get network info
 */
export const getNetworkInfo = async () => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    const networkInfo = Object.values(NETWORKS).find(n => n.chainId === chainId);
    
    return {
      success: true,
      chainId,
      name: networkInfo?.name || 'Unknown Network',
      blockExplorer: networkInfo?.blockExplorer
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
