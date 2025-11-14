'use client';

import { useState, useEffect } from 'react';
import { getMockWallet } from '@/lib/mockWallet';
import { getMockBlockchain } from '@/lib/mockBlockchain';

export default function FactoryDashboard() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [myTokens, setMyTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    batchNumber: '',
    originLocation: '',
    moisture: '',
    weight: '',
    qualityGrade: 'Premium'
  });

  const wallet = getMockWallet();
  const blockchain = getMockBlockchain();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    if (wallet.isConnected()) {
      setConnected(true);
      setAddress(wallet.getSelectedAddress());
      loadMyTokens();
    }
  };

  const connectWallet = async () => {
    try {
      const result = await wallet.connect('factory');
      setConnected(true);
      setAddress(result.address);
      
      // Register role
      await blockchain.registerRole(result.address, 'FACTORY');
      loadMyTokens();
    } catch (error) {
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    setConnected(false);
    setAddress('');
    setMyTokens([]);
  };

  const loadMyTokens = () => {
    const tokens = blockchain.getMyTokens();
    setMyTokens(tokens);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    setTxHash('');

    try {
      const result = await blockchain.createHoney(
        formData.batchNumber,
        formData.originLocation,
        parseInt(formData.moisture),
        parseInt(formData.weight),
        formData.qualityGrade
      );

      setTxHash(result.txHash);
      alert(`Honey token created! Token ID: ${result.tokenId}`);
      
      // Reset form
      setFormData({
        batchNumber: '',
        originLocation: '',
        moisture: '',
        weight: '',
        qualityGrade: 'Premium'
      });

      // Reload tokens
      loadMyTokens();
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
          <div className="text-6xl mb-4">🏭</div>
          <h2 className="text-2xl font-semibold mb-4">Factory Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start creating honey tokens
          </p>
          <button onClick={connectWallet} className="btn-primary">
            Connect Fake Wallet
          </button>
          <p className="text-sm text-gray-500 mt-4">
            This will simulate a MetaMask connection with a factory role
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
            🏭 Factory Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Connected: <span className="font-mono">{address}</span>
          </p>
        </div>
        <button onClick={disconnectWallet} className="btn-secondary">
          Disconnect Wallet
        </button>
      </div>

      {/* Create Honey Form */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Register New Honey Token</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number *
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                placeholder="e.g., BATCH-2025-001"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin Location *
              </label>
              <input
                type="text"
                name="originLocation"
                value={formData.originLocation}
                onChange={handleInputChange}
                placeholder="e.g., Napa Valley, CA"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moisture (%) *
              </label>
              <input
                type="number"
                name="moisture"
                value={formData.moisture}
                onChange={handleInputChange}
                placeholder="e.g., 17"
                min="0"
                max="100"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (grams) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 500"
                min="1"
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Grade *
              </label>
              <select
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="Premium">Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Token...' : 'Register Honey Token'}
          </button>
        </form>

        {txHash && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Transaction successful!
            </p>
            <p className="text-xs text-green-600 mt-1 font-mono break-all">
              TX: {txHash}
            </p>
          </div>
        )}
      </div>

      {/* My Created Tokens */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">My Created Honey Tokens</h2>
        
        {myTokens.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No tokens created yet. Use the form above to create your first honey token.
          </p>
        ) : (
          <div className="space-y-4">
            {myTokens.map((token) => (
              <div key={token.tokenId} className="p-4 border border-gray-200 rounded-lg hover:border-honey-300">
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
                <div className="mt-3 text-xs text-gray-500">
                  Owner: <span className="font-mono">{token.currentOwner}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
