'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProducerDashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [batches, setBatches] = useState([]);
  const [showQR, setShowQR] = useState(null);

  // Form states
  const [batchForm, setBatchForm] = useState({
    batchId: '',
    harvestDate: '',
    weightKg: '',
    location: '',
    flowerType: '',
    organic: false,
    notes: ''
  });

  const [eventForm, setEventForm] = useState({
    batchId: '',
    eventType: 'harvest',
    description: '',
    file: null
  });

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          loadBatches(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        loadBatches(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  const loadBatches = async (address) => {
    // In production, this would load from the blockchain/backend
    const mockBatches = [
      {
        batchId: 'BATCH-2025-0001',
        harvestDate: '2025-10-01',
        weightKg: 200,
        status: 'Active',
        eventCount: 4
      },
      {
        batchId: 'BATCH-2025-0002',
        harvestDate: '2025-09-15',
        weightKg: 150,
        status: 'Completed',
        eventCount: 6
      }
    ];
    setBatches(mockBatches);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // In production:
      // 1. Upload metadata + images to IPFS
      // 2. Get IPFS hash
      // 3. Call smart contract createBatch function
      // 4. Wait for transaction confirmation
      
      console.log('Creating batch:', batchForm);
      
      // Simulate transaction
      alert('Batch created successfully! (Demo mode - would create on-chain transaction)');
      
      // Reset form
      setBatchForm({
        batchId: '',
        harvestDate: '',
        weightKg: '',
        location: '',
        flowerType: '',
        organic: false,
        notes: ''
      });
      
      // Reload batches
      loadBatches(walletAddress);
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Failed to create batch');
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // In production:
      // 1. Upload event metadata + files to IPFS
      // 2. Get IPFS hash
      // 3. Call smart contract addEvent function
      // 4. Wait for transaction confirmation
      
      console.log('Adding event:', eventForm);
      
      alert('Event added successfully! (Demo mode - would create on-chain transaction)');
      
      // Reset form
      setEventForm({
        batchId: '',
        eventType: 'harvest',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    }
  };

  const generateQR = (batchId) => {
    setShowQR(batchId);
  };

  if (!walletConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your Web3 wallet to access the producer dashboard
          </p>
          <button onClick={connectWallet} className="btn-primary">
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Producer Dashboard
        </h1>
        <p className="text-gray-600">
          Connected: <span className="font-mono text-sm">{walletAddress}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'create'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Batch
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'event'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Event
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-4 px-2 font-medium ${
              activeTab === 'batches'
                ? 'border-b-2 border-honey-500 text-honey-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Batches
          </button>
        </div>
      </div>

      {/* Create Batch Tab */}
      {activeTab === 'create' && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Create New Batch</h2>
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch ID
                </label>
                <input
                  type="text"
                  value={batchForm.batchId}
                  onChange={(e) => setBatchForm({...batchForm, batchId: e.target.value})}
                  placeholder="e.g., BATCH-2025-0003"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={batchForm.harvestDate}
                  onChange={(e) => setBatchForm({...batchForm, harvestDate: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={batchForm.weightKg}
                  onChange={(e) => setBatchForm({...batchForm, weightKg: e.target.value})}
                  placeholder="e.g., 200"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={batchForm.location}
                  onChange={(e) => setBatchForm({...batchForm, location: e.target.value})}
                  placeholder="e.g., Napa Valley, CA"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flower Type
                </label>
                <input
                  type="text"
                  value={batchForm.flowerType}
                  onChange={(e) => setBatchForm({...batchForm, flowerType: e.target.value})}
                  placeholder="e.g., Wildflower"
                  className="input-field"
                  required
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="organic"
                  checked={batchForm.organic}
                  onChange={(e) => setBatchForm({...batchForm, organic: e.target.checked})}
                  className="w-4 h-4 text-honey-600 rounded"
                />
                <label htmlFor="organic" className="ml-2 text-sm font-medium text-gray-700">
                  Organic Certified
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={batchForm.notes}
                onChange={(e) => setBatchForm({...batchForm, notes: e.target.value})}
                rows={3}
                placeholder="Additional information about this batch..."
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Create Batch & Upload to Blockchain
            </button>
          </form>
        </div>
      )}

      {/* Add Event Tab */}
      {activeTab === 'event' && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Add Event to Batch</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                value={eventForm.batchId}
                onChange={(e) => setEventForm({...eventForm, batchId: e.target.value})}
                className="input-field"
                required
              >
                <option value="">Select a batch...</option>
                {batches.map((batch) => (
                  <option key={batch.batchId} value={batch.batchId}>
                    {batch.batchId} - {batch.harvestDate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={eventForm.eventType}
                onChange={(e) => setEventForm({...eventForm, eventType: e.target.value})}
                className="input-field"
                required
              >
                <option value="harvest">Harvest</option>
                <option value="lab_test">Lab Test</option>
                <option value="processing">Processing</option>
                <option value="packaging">Packaging</option>
                <option value="transfer">Transfer</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                rows={3}
                placeholder="Describe this event..."
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image or Document (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setEventForm({...eventForm, file: e.target.files[0]})}
                className="input-field"
                accept="image/*,.pdf"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Add Event & Upload to Blockchain
            </button>
          </form>
        </div>
      )}

      {/* My Batches Tab */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          {batches.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-600">No batches created yet</p>
            </div>
          ) : (
            batches.map((batch) => (
              <div key={batch.batchId} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{batch.batchId}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Harvest Date: {batch.harvestDate}</p>
                      <p>Weight: {batch.weightKg} kg</p>
                      <p>Events: {batch.eventCount}</p>
                      <p>Status: <span className="font-medium text-green-600">{batch.status}</span></p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/batch/${batch.batchId}`}
                      className="btn-secondary text-sm"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => generateQR(batch.batchId)}
                      className="btn-primary text-sm"
                    >
                      QR Code
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">QR Code for {showQR}</h3>
            <div className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-4 text-center">
              <div className="text-6xl mb-2">📱</div>
              <p className="text-sm text-gray-600">
                QR Code would be generated here<br/>
                linking to: /batch/{showQR}
              </p>
            </div>
            <button 
              onClick={() => setShowQR(null)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
