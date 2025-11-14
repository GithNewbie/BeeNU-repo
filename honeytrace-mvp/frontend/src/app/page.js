'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-honey-700 mb-4">
          🍯 BeeNU MVP
        </h1>
        <p className="text-xl text-gray-600">
          Token-based blockchain provenance tracking system
        </p>
        <p className="text-lg text-gray-500 mt-2">
          Factory → Seller → Consumer supply chain
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/factory" className="card hover:border-honey-300 transition-colors">
          <div className="text-center">
            <div className="text-5xl mb-3">🏭</div>
            <h3 className="text-xl font-semibold mb-2">Factory</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create and register honey tokens on the blockchain
            </p>
            <div className="text-xs text-gray-500 text-left space-y-1">
              <div>✓ Create honey tokens</div>
              <div>✓ Set quality metrics</div>
              <div>✓ Track created batches</div>
            </div>
          </div>
        </Link>

        <Link href="/seller" className="card hover:border-honey-300 transition-colors">
          <div className="text-center">
            <div className="text-5xl mb-3">🏪</div>
            <h3 className="text-xl font-semibold mb-2">Seller</h3>
            <p className="text-sm text-gray-600 mb-4">
              Buy, transfer, and manage honey inventory
            </p>
            <div className="text-xs text-gray-500 text-left space-y-1">
              <div>✓ Buy from factory</div>
              <div>✓ Transfer to other sellers</div>
              <div>✓ Manage inventory</div>
            </div>
          </div>
        </Link>

        <Link href="/consumer" className="card hover:border-honey-300 transition-colors">
          <div className="text-center">
            <div className="text-5xl mb-3">👤</div>
            <h3 className="text-xl font-semibold mb-2">Consumer</h3>
            <p className="text-sm text-gray-600 mb-4">
              View complete trace history and purchase honey
            </p>
            <div className="text-xs text-gray-500 text-left space-y-1">
              <div>✓ View full trace</div>
              <div>✓ Purchase from sellers</div>
              <div>✓ Verify authenticity</div>
            </div>
          </div>
        </Link>
      </div>

      {/* How It Works */}
      <div className="card mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-honey-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Factory Creates Honey Token</h3>
              <p className="text-sm text-gray-600">
                Factory registers a new honey token with batch details, quality metrics, and origin location. 
                The token is recorded on the blockchain with a unique ID.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-honey-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Seller Purchases Token</h3>
              <p className="text-sm text-gray-600">
                Sellers buy honey tokens from the marketplace (factory). Each purchase is recorded as 
                a trace event with timestamp and involved parties.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-honey-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sellers Transfer Between Stores</h3>
              <p className="text-sm text-gray-600">
                Sellers can transfer honey tokens to other sellers or between their own store locations. 
                All transfers are logged with location information.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-honey-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Consumer Purchases & Views Trace</h3>
              <p className="text-sm text-gray-600">
                Consumers can buy honey from sellers and view the complete journey - from factory creation 
                through all transfers to final purchase. Every step is blockchain-verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="font-semibold mb-2">Mock Wallet</h3>
          <p className="text-sm text-gray-600">
            Fake MetaMask integration for testing without real blockchain
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-semibold mb-2">Role-Based</h3>
          <p className="text-sm text-gray-600">
            Three distinct roles with specific permissions and operations
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Full Trace</h3>
          <p className="text-sm text-gray-600">
            Complete history of every token from creation to consumer
          </p>
        </div>
      </div>

      {/* MVP Notice */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold mb-1">MVP Demo Mode</h3>
            <p className="text-sm text-gray-700">
              This is a minimal viable product with mock blockchain interactions. All "transactions" 
              are simulated and stored in memory. In production, this would connect to a real blockchain 
              network like Ethereum or Polygon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
