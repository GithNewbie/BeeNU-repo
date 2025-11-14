'use client';

import { useState, useEffect } from 'react';
import { getMockWallet } from '@/lib/mockWallet';
import { getMockBlockchain } from '@/lib/mockBlockchain';

export default function ConsumerPage() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [token, setToken] = useState(null);
  const [trace, setTrace] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [txHash, setTxHash] = useState('');

  const wallet = getMockWallet();
  const blockchain = getMockBlockchain();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    if (wallet.isConnected()) {
      setConnected(true);
      setAddress(wallet.getSelectedAddress());
    }
  };

  const connectWallet = async () => {
    try {
      const result = await wallet.connect('consumer');
      setConnected(true);
      setAddress(result.address);
      
      // Register role
      await blockchain.registerRole(result.address, 'CONSUMER');
    } catch (error) {
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    setConnected(false);
    setAddress('');
  };

  const handleViewTrace = () => {
    if (!tokenId) {
      alert('Please enter a token ID');
      return;
    }

    setLoading(true);

    try {
      const tokenData = blockchain.getToken(parseInt(tokenId));
      if (!tokenData) {
        alert('Token not found');
        setToken(null);
        setTrace([]);
        setCanBuy(false);
        return;
      }

      const traceData = blockchain.getTrace(parseInt(tokenId));
      
      setToken(tokenData);
      setTrace(traceData);
      
      // Check if consumer can buy this token
      const ownerRole = blockchain.getRole(tokenData.currentOwner);
      setCanBuy(connected && ownerRole === 'SELLER' && tokenData.currentOwner !== address);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyToken = async () => {
    if (!connected) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    setTxHash('');

    try {
      const result = await blockchain.consumerBuyHoney(parseInt(tokenId));
      setTxHash(result.txHash);
      alert(`Successfully purchased Token #${tokenId}!`);
      
      // Refresh trace to show new purchase event
      handleViewTrace();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      CREATED: '🏭',
      SELLER_BUY: '🏪',
      TRANSFER: '🚚',
      CONSUMER_BUY: '👤'
    };
    return icons[eventType] || '📝';
  };

  const getEventColor = (eventType) => {
    const colors = {
      CREATED: 'bg-blue-100 border-blue-300 text-blue-800',
      SELLER_BUY: 'bg-purple-100 border-purple-300 text-purple-800',
      TRANSFER: 'bg-orange-100 border-orange-300 text-orange-800',
      CONSUMER_BUY: 'bg-green-100 border-green-300 text-green-800'
    };
    return colors[eventType] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const formatEventType = (eventType) => {
    const names = {
      CREATED: 'Created by Factory',
      SELLER_BUY: 'Purchased by Seller',
      TRANSFER: 'Transferred Between Sellers',
      CONSUMER_BUY: 'Purchased by Consumer'
    };
    return names[eventType] || eventType;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍯 Consumer Trace Viewer
          </h1>
          <p className="text-gray-600">
            View the complete journey of your honey
          </p>
        </div>
        {!connected ? (
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        ) : (
          <button onClick={disconnectWallet} className="btn-secondary">
            Disconnect
          </button>
        )}
      </div>

      {connected && (
        <div className="mb-6 text-sm text-gray-600">
          Connected: <span className="font-mono">{address}</span>
        </div>
      )}

      {/* Search Form */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Enter Token ID</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID (e.g., 0, 1, 2...)"
            className="input-field flex-1"
            min="0"
          />
          <button 
            onClick={handleViewTrace}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Loading...' : 'View Trace'}
          </button>
        </div>
      </div>

      {/* Token Details */}
      {token && (
        <>
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold">Token Details</h2>
              {canBuy && (
                <button
                  onClick={handleBuyToken}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Buying...' : 'Buy This Honey'}
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token ID:</span>
                    <span className="font-medium">#{token.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch Number:</span>
                    <span className="font-medium">{token.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium">{token.originLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{new Date(token.creationTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Quality Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{token.weight} grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moisture:</span>
                    <span className="font-medium">{token.moisture}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Grade:</span>
                    <span className="font-medium">{token.qualityGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Owner:</span>
                    <span className="font-mono text-xs">{token.currentOwner.slice(0, 10)}...</span>
                  </div>
                </div>
              </div>
            </div>

            {txHash && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✅ Purchase successful!</p>
                <p className="text-xs text-green-600 mt-1 font-mono break-all">
                  TX: {txHash}
                </p>
              </div>
            )}
          </div>

          {/* Trace Timeline */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Provenance Timeline</h2>
            
            {trace.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No trace events found for this token.
              </p>
            ) : (
              <div className="space-y-6">
                {trace.map((event, index) => (
                  <div key={index} className="relative pl-8 pb-6 border-l-2 border-honey-300 last:border-l-0 last:pb-0">
                    <div className="absolute -left-3 top-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${getEventColor(event.eventType)}`}>
                        {getEventIcon(event.eventType)}
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-2 ${getEventColor(event.eventType)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">
                          {formatEventType(event.eventType)}
                        </h3>
                        <span className="text-xs opacity-75">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2">{event.locationInfo}</p>
                      
                      <div className="text-xs space-y-1 opacity-75">
                        <div>Actor: <span className="font-mono">{event.actor}</span></div>
                        {event.from && event.from !== '0x0000000000000000000000000000000000000000' && (
                          <div>From: <span className="font-mono">{event.from}</span></div>
                        )}
                        {event.to && (
                          <div>To: <span className="font-mono">{event.to}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain Verification */}
          <div className="mt-8 card bg-honey-50 border-honey-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold mb-1">Blockchain Verified</h3>
                <p className="text-sm text-gray-600">
                  All events in this timeline have been recorded on the blockchain and cannot be altered.
                  This provides complete transparency and authenticity verification for your honey.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Instructions */}
      {!token && (
        <div className="card bg-gray-50">
          <h3 className="font-semibold mb-3">How to use:</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Enter a token ID in the search box above</li>
            <li>Click "View Trace" to see the complete history</li>
            <li>If you have a wallet connected and the honey is for sale, you can purchase it directly</li>
            <li>After purchase, the new event will appear in the timeline</li>
          </ol>
        </div>
      )}
    </div>
  );
}
