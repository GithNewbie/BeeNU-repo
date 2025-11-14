'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BatchPage() {
  const params = useParams();
  const batchId = params?.id;
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (batchId) {
      fetchBatchData(batchId);
    }
  }, [batchId]);

  const fetchBatchData = async (id) => {
    try {
      setLoading(true);
      // In production, this would call your backend API
      // For now, using mock data
      const mockData = {
        batchId: id,
        producer: {
          name: "Golden Valley Apiary",
          address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          location: "Napa Valley, CA"
        },
        batch: {
          harvestDate: "2025-10-01",
          weightKg: 200,
          flowerType: "Wildflower",
          organic: true,
          geo: {
            lat: 38.2975,
            lon: -122.2869
          }
        },
        events: [
          {
            type: "harvest",
            timestamp: "2025-10-01T08:00:00Z",
            actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            actorName: "Golden Valley Apiary",
            description: "Initial harvest from wildflower meadow",
            txHash: "0x1234...5678",
            ipfsHash: "QmX1..."
          },
          {
            type: "lab_test",
            timestamp: "2025-10-03T14:30:00Z",
            actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            actorName: "Golden Valley Apiary",
            description: "Lab test completed - passed quality standards",
            txHash: "0x2345...6789",
            ipfsHash: "QmX2..."
          },
          {
            type: "packaging",
            timestamp: "2025-10-05T10:00:00Z",
            actor: "0x842d35Cc6634C0532925a3b844Bc9e7595f0cDe",
            actorName: "Pure Honey Packers",
            description: "Packaged in 500g jars, batch sealed",
            txHash: "0x3456...7890",
            ipfsHash: "QmX3..."
          },
          {
            type: "transfer",
            timestamp: "2025-10-06T09:00:00Z",
            actor: "0x842d35Cc6634C0532925a3b844Bc9e7595f0cDe",
            actorName: "Pure Honey Packers",
            description: "Shipped to retail distribution",
            txHash: "0x4567...8901",
            ipfsHash: "QmX4..."
          }
        ],
        blockchainNetwork: "Polygon Mumbai Testnet"
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setBatch(mockData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type) => {
    const icons = {
      harvest: '🌾',
      lab_test: '🔬',
      packaging: '📦',
      transfer: '🚚',
      retail: '🏪'
    };
    return icons[type] || '📝';
  };

  const getEventColor = (type) => {
    const colors = {
      harvest: 'bg-green-100 border-green-300 text-green-800',
      lab_test: 'bg-blue-100 border-blue-300 text-blue-800',
      packaging: 'bg-purple-100 border-purple-300 text-purple-800',
      transfer: 'bg-orange-100 border-orange-300 text-orange-800',
      retail: 'bg-pink-100 border-pink-300 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-honey-500"></div>
          <p className="mt-4 text-gray-600">Loading batch information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Link href="/" className="btn-primary inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Batch not found</p>
          <Link href="/" className="btn-primary inline-block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-honey-600 hover:text-honey-700 mb-4 inline-block">
          ← Back to Search
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Batch {batch.batchId}
        </h1>
        <p className="text-gray-600">
          Verified on {batch.blockchainNetwork}
        </p>
      </div>

      {/* Batch Overview */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-6">Batch Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Producer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Producer:</span>
                <span className="font-medium">{batch.producer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{batch.producer.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-mono text-xs">{batch.producer.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Batch Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Harvest Date:</span>
                <span className="font-medium">{batch.batch.harvestDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{batch.batch.weightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flower Type:</span>
                <span className="font-medium">{batch.batch.flowerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Organic:</span>
                <span className="font-medium">{batch.batch.organic ? '✓ Yes' : '✗ No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provenance Timeline */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Provenance Timeline</h2>
        <div className="space-y-6">
          {batch.events.map((event, index) => (
            <div key={index} className="relative pl-8 pb-6 border-l-2 border-honey-300 last:border-l-0 last:pb-0">
              <div className="absolute -left-3 top-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${getEventColor(event.type)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold capitalize">
                    {event.type.replace('_', ' ')}
                  </h3>
                  <span className="text-xs opacity-75">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm mb-2">{event.description}</p>
                <div className="text-xs space-y-1 opacity-75">
                  <div>Actor: {event.actorName}</div>
                  <div className="flex items-center space-x-2">
                    <span>Transaction:</span>
                    <a 
                      href={`https://mumbai.polygonscan.com/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:underline"
                    >
                      {event.txHash}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>IPFS:</span>
                    <a 
                      href={`https://ipfs.io/ipfs/${event.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono hover:underline"
                    >
                      {event.ipfsHash}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="mt-8 card bg-honey-50 border-honey-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🔒</div>
          <div>
            <h3 className="font-semibold mb-1">Blockchain Verified</h3>
            <p className="text-sm text-gray-600">
              All events in this timeline have been permanently recorded on the {batch.blockchainNetwork}.
              Click on transaction hashes above to view them on the blockchain explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
