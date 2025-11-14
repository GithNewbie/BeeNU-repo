'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [batchId, setBatchId] = useState('');
  const router = useRouter();

  const handleScan = (e) => {
    e.preventDefault();
    if (batchId.trim()) {
      router.push(`/batch/${batchId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-honey-700 mb-4">
          🍯 BeeNU
        </h1>
        <p className="text-xl text-gray-600">
          Verify the authentic journey of your honey from hive to jar
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Track Your Honey
        </h2>
        
        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Batch ID or Scan QR Code
            </label>
            <input
              type="text"
              id="batchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="e.g., BATCH-2025-0001"
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            View Provenance
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">How it works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-honey-500 font-bold">1.</span>
              <p>Beekeepers register each batch of honey on the blockchain</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-honey-500 font-bold">2.</span>
              <p>Every step from harvest to packaging is recorded immutably</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-honey-500 font-bold">3.</span>
              <p>You can verify the complete journey and authenticity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-semibold mb-2">Blockchain Verified</h3>
          <p className="text-sm text-gray-600">
            Immutable records on Ethereum ensure authenticity
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="font-semibold mb-2">Full Traceability</h3>
          <p className="text-sm text-gray-600">
            Track from hive location to your table
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-semibold mb-2">Quality Assured</h3>
          <p className="text-sm text-gray-600">
            Lab tests and certifications included
          </p>
        </div>
      </div>
    </div>
  );
}
