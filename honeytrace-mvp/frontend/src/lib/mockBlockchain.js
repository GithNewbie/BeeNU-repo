/**
 * Mock Blockchain Provider - Simulates contract interactions for MVP
 */

import { getMockWallet } from './mockWallet';

class MockBlockchainProvider {
  constructor() {
    this.tokens = new Map();
    this.tokenCounter = 0;
    this.traces = new Map();
    this.roles = new Map();
    
    // Initialize with some test data
    this.initializeTestData();
  }

  initializeTestData() {
    // Pre-register some roles
    this.roles.set('0xF4C70RY1234567890123456789012345678901', 'FACTORY');
    this.roles.set('0x5E11ER1234567890123456789012345678902', 'SELLER');
    this.roles.set('0x5E11ER2234567890123456789012345678903', 'SELLER');
    this.roles.set('0xC0N5UMER123456789012345678901234567904', 'CONSUMER');
  }

  // Generate fake transaction hash
  generateTxHash() {
    return '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Simulate transaction delay
  async simulateTransaction() {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }

  // Register role
  async registerRole(address, role) {
    this.roles.set(address, role);
    return {
      success: true,
      txHash: this.generateTxHash()
    };
  }

  // Get role
  getRole(address) {
    return this.roles.get(address) || 'NONE';
  }

  // Create honey token (Factory only)
  async createHoney(batchNumber, originLocation, moisture, weight, qualityGrade) {
    const wallet = getMockWallet();
    
    if (!wallet.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const role = this.getRole(wallet.getSelectedAddress());
    if (role !== 'FACTORY') {
      throw new Error('Unauthorized: Only factory can create honey');
    }

    await this.simulateTransaction();

    const tokenId = this.tokenCounter++;
    const timestamp = Date.now();

    // Create token
    const token = {
      tokenId,
      batchNumber,
      originLocation,
      creationTime: timestamp,
      currentOwner: wallet.getSelectedAddress(),
      exists: true,
      moisture,
      weight,
      qualityGrade
    };

    this.tokens.set(tokenId, token);

    // Create trace event
    const traceEvent = {
      eventType: 'CREATED',
      actor: wallet.getSelectedAddress(),
      from: null,
      to: wallet.getSelectedAddress(),
      timestamp,
      locationInfo: originLocation
    };

    this.traces.set(tokenId, [traceEvent]);

    return {
      success: true,
      tokenId,
      txHash: this.generateTxHash(),
      token
    };
  }

  // Seller buys honey
  async sellerBuyHoney(tokenId) {
    const wallet = getMockWallet();
    
    if (!wallet.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const role = this.getRole(wallet.getSelectedAddress());
    if (role !== 'SELLER') {
      throw new Error('Unauthorized: Only seller can buy honey');
    }

    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token does not exist');
    }

    await this.simulateTransaction();

    const previousOwner = token.currentOwner;
    token.currentOwner = wallet.getSelectedAddress();
    const timestamp = Date.now();

    // Add trace event
    const traceEvent = {
      eventType: 'SELLER_BUY',
      actor: wallet.getSelectedAddress(),
      from: previousOwner,
      to: wallet.getSelectedAddress(),
      timestamp,
      locationInfo: 'Marketplace Purchase'
    };

    this.traces.get(tokenId).push(traceEvent);

    return {
      success: true,
      txHash: this.generateTxHash(),
      token
    };
  }

  // Transfer honey between sellers
  async transferHoney(tokenId, toAddress, locationInfo) {
    const wallet = getMockWallet();
    
    if (!wallet.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const role = this.getRole(wallet.getSelectedAddress());
    if (role !== 'SELLER') {
      throw new Error('Unauthorized: Only seller can transfer honey');
    }

    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token does not exist');
    }

    if (token.currentOwner !== wallet.getSelectedAddress()) {
      throw new Error('Not token owner');
    }

    const toRole = this.getRole(toAddress);
    if (toRole !== 'SELLER') {
      throw new Error('Recipient must be seller');
    }

    await this.simulateTransaction();

    const previousOwner = token.currentOwner;
    token.currentOwner = toAddress;
    const timestamp = Date.now();

    // Add trace event
    const traceEvent = {
      eventType: 'TRANSFER',
      actor: wallet.getSelectedAddress(),
      from: previousOwner,
      to: toAddress,
      timestamp,
      locationInfo
    };

    this.traces.get(tokenId).push(traceEvent);

    return {
      success: true,
      txHash: this.generateTxHash(),
      token
    };
  }

  // Consumer buys honey
  async consumerBuyHoney(tokenId) {
    const wallet = getMockWallet();
    
    if (!wallet.isConnected()) {
      throw new Error('Wallet not connected');
    }

    const role = this.getRole(wallet.getSelectedAddress());
    if (role !== 'CONSUMER') {
      throw new Error('Unauthorized: Only consumer can buy honey');
    }

    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token does not exist');
    }

    const sellerRole = this.getRole(token.currentOwner);
    if (sellerRole !== 'SELLER') {
      throw new Error('Can only buy from seller');
    }

    await this.simulateTransaction();

    const previousOwner = token.currentOwner;
    token.currentOwner = wallet.getSelectedAddress();
    const timestamp = Date.now();

    // Add trace event
    const traceEvent = {
      eventType: 'CONSUMER_BUY',
      actor: wallet.getSelectedAddress(),
      from: previousOwner,
      to: wallet.getSelectedAddress(),
      timestamp,
      locationInfo: 'Consumer Purchase'
    };

    this.traces.get(tokenId).push(traceEvent);

    return {
      success: true,
      txHash: this.generateTxHash(),
      token
    };
  }

  // Get token details
  getToken(tokenId) {
    const token = this.tokens.get(tokenId);
    if (!token) {
      return null;
    }
    return { ...token };
  }

  // Get trace history
  getTrace(tokenId) {
    const trace = this.traces.get(tokenId);
    if (!trace) {
      return [];
    }
    return [...trace];
  }

  // Get all tokens for current user
  getMyTokens() {
    const wallet = getMockWallet();
    if (!wallet.isConnected()) {
      return [];
    }

    const myAddress = wallet.getSelectedAddress();
    return Array.from(this.tokens.values())
      .filter(token => token.currentOwner === myAddress);
  }

  // Get all available tokens for sale (owned by factory or other sellers)
  getAvailableTokens() {
    const wallet = getMockWallet();
    if (!wallet.isConnected()) {
      return [];
    }

    const myAddress = wallet.getSelectedAddress();
    return Array.from(this.tokens.values())
      .filter(token => {
        const ownerRole = this.getRole(token.currentOwner);
        return token.currentOwner !== myAddress && 
               (ownerRole === 'FACTORY' || ownerRole === 'SELLER');
      });
  }

  // Get all tokens (for admin/viewing)
  getAllTokens() {
    return Array.from(this.tokens.values());
  }
}

// Singleton instance
let mockBlockchainInstance = null;

export function getMockBlockchain() {
  if (!mockBlockchainInstance) {
    mockBlockchainInstance = new MockBlockchainProvider();
  }
  return mockBlockchainInstance;
}

export default MockBlockchainProvider;
