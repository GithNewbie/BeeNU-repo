/**
 * Mock Wallet Provider - Simulates MetaMask functionality for MVP testing
 */

class MockWalletProvider {
  constructor() {
    this.connected = false;
    this.address = null;
    this.chainId = 1337; // Local network
    this.listeners = {};
  }

  // Connect wallet (fake)
  async connect(role = 'factory') {
    // Generate fake address based on role
    const addresses = {
      factory: '0xF4C70RY1234567890123456789012345678901',
      seller: '0x5E11ER1234567890123456789012345678902',
      seller2: '0x5E11ER2234567890123456789012345678903',
      consumer: '0xC0N5UMER123456789012345678901234567904'
    };

    this.address = addresses[role] || addresses.factory;
    this.connected = true;
    this.role = role;

    // Emit account changed event
    this.emit('accountsChanged', [this.address]);

    return { address: this.address, role: this.role };
  }

  // Disconnect wallet
  disconnect() {
    this.address = null;
    this.connected = false;
    this.role = null;
    this.emit('accountsChanged', []);
  }

  // Get accounts
  async getAccounts() {
    return this.connected ? [this.address] : [];
  }

  // Get selected address
  getSelectedAddress() {
    return this.address;
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }

  // Get role
  getRole() {
    return this.role;
  }

  // Event listener methods
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Request method (MetaMask compatible)
  async request({ method, params }) {
    switch (method) {
      case 'eth_requestAccounts':
        if (!this.connected) {
          throw new Error('User rejected request');
        }
        return [this.address];
      
      case 'eth_accounts':
        return this.connected ? [this.address] : [];
      
      case 'eth_chainId':
        return `0x${this.chainId.toString(16)}`;
      
      default:
        console.warn(`Mock wallet: Method ${method} not implemented`);
        return null;
    }
  }
}

// Singleton instance
let mockWalletInstance = null;

export function getMockWallet() {
  if (!mockWalletInstance) {
    mockWalletInstance = new MockWalletProvider();
  }
  return mockWalletInstance;
}

export default MockWalletProvider;
