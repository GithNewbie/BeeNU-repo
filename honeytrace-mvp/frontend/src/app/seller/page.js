'use client';

import { useState, useEffect } from 'react';
import { getMockWallet } from '@/lib/mockWallet';
import { getMockBlockchain } from '@/lib/mockBlockchain';

export default function SellerDashboard() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [myInventory, setMyInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Transfer form
  const [transferForm, setTransferForm] = useState({
    tokenId: '',
    toAddress: '',
    locationInfo: ''
  });

  const wallet = getMockWallet();
  const blockchain = getMockBlockchain();

  // Predefined seller addresses for transfer
  const sellerAddresses = [
    { label: 'Seller 2 (Store B)', address: '0x5E11ER2234567890123456789012345678903' },
    { label: 'Seller 1 (Store A)', address: '0x5E11ER1234567890123456789012345678902' }
  ];

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    if (wallet.isConnected()) {
      setConnected(true);
      setAddress(wallet.getSelectedAddress());
      loadData();
    }
  };

  const connectWallet = async () => {
    try {
      const result = await wallet.connect('seller');
      setConnected(true);
      setAddress(result.address);
      
      // Register role
      await blockchain.registerRole(result.address, 'SELLER');
      loadData();
    } catch (error) {
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    setConnected(false);
    setAddress('');
    setAvailableTokens([]);
    setMyInventory([]);
  };

  const loadData = () => {
    const available = blockchain.getAvailableTokens();
    setAvailableTokens(available);
    
    const inventory = blockchain.getMyTokens();
    setMyInventory(inventory);
  };

  const handleBuyHoney = async (tokenId) => {
    setLoading(true);
    setTxHash('');

    try {
      const result = await blockchain.sellerBuyHoney(tokenId);
      setTxHash(result.txHash);
      alert(`Successfully purchased Token #${tokenId}!`);
      loadData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setTxHash('');

    try {
      const result = await blockchain.transferHoney(
        parseInt(transferForm.tokenId),
        transferForm.toAddress,
        transferForm.locationInfo
      );

      setTxHash(result.txHash);
      alert(`Successfully transferred Token #${transferForm.tokenId}!`);
      
      // Reset form
      setTransferForm({
        tokenId: '',
        toAddress: '',
        locationInfo: ''
      });

      loadData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-semibold mb-4">Seller Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to buy and manage honey inventory
          </p>
          <button onClick={connectWallet} className="btn-primary">
            Connect Fake Wallet
          </button>
          <p className="text-sm text-gray-500 mt-4">
            This will simulate a MetaMask connection with a seller role
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏪 Seller Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Connected: <span className="font-mono">{address}</span>
          </p>
        </div>
        <button onClick={disconnectWallet} className="btn-secondary">
          Disconnect Wallet
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('buy')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'buy'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Buy Honey
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'transfer'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Transfer Honey
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'inventory'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Inventory ({myInventory.length})
          </button>
        </div>
      </div>

      {/* Buy Honey Tab */}
      {activeTab === 'buy' && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Available Honey Tokens</h2>
          
          {availableTokens.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No honey tokens available for purchase at the moment.
            </p>
          ) : (
            <div className="space-y-4">
              {availableTokens.map((token) => (
                <div key={token.tokenId} className="p-4 border border-gray-200 rounded-lg hover:border-honey-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Token #{token.tokenId}</h3>
                      <p className="text-sm text-gray-600 mb-3">{token.batchNumber}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <p className="font-medium">{token.originLocation}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <p className="font-medium">{token.weight}g</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Moisture:</span>
                          <p className="font-medium">{token.moisture}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Grade:</span>
                          <p className="font-medium">{token.qualityGrade}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleBuyHoney(token.tokenId)}
                      disabled={loading}
                      className="btn-primary ml-4"
                    >
                      {loading ? 'Buying...' : 'Buy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {txHash && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✅ Purchase successful!</p>
              <p className="text-xs text-green-600 mt-1 font-mono break-all">
                TX: {txHash}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transfer Honey Tab */}
      {activeTab === 'transfer' && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Transfer Honey Token</h2>
          
          {myInventory.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              You don't have any honey tokens to transfer. Buy some first!
            </p>
          ) : (
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Token to Transfer *
                </label>
                <select
                  value={transferForm.tokenId}
                  onChange={(e) => setTransferForm({...transferForm, tokenId: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Choose a token...</option>
                  {myInventory.map((token) => (
                    <option key={token.tokenId} value={token.tokenId}>
                      Token #{token.tokenId} - {token.batchNumber} ({token.weight}g)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer To (Seller Address) *
                </label>
                <select
                  value={transferForm.toAddress}
                  onChange={(e) => setTransferForm({...transferForm, toAddress: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Choose recipient...</option>
                  {sellerAddresses
                    .filter(s => s.address !== address)
                    .map((seller) => (
                      <option key={seller.address} value={seller.address}>
                        {seller.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Info *
                </label>
                <input
                  type="text"
                  value={transferForm.locationInfo}
                  onChange={(e) => setTransferForm({...transferForm, locationInfo: e.target.value})}
                  placeholder="e.g., Transfer from Store A to Store B"
                  className="input-field"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Transferring...' : 'Transfer Token'}
              </button>
            </form>
          )}

          {txHash && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✅ Transfer successful!</p>
              <p className="text-xs text-green-600 mt-1 font-mono break-all">
                TX: {txHash}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">My Inventory</h2>
          
          {myInventory.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Your inventory is empty. Buy some honey tokens to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {myInventory.map((token) => (
                <div key={token.tokenId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">Token #{token.tokenId}</h3>
                      <p className="text-sm text-gray-600">{token.batchNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-honey-100 text-honey-700 rounded-full text-sm font-medium">
                      {token.qualityGrade}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{token.originLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <p className="font-medium">{token.weight}g</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Moisture:</span>
                      <p className="font-medium">{token.moisture}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-medium">{new Date(token.creationTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
