export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        About HoneyTrace
      </h1>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">What is HoneyTrace?</h2>
          <p className="text-gray-700 leading-relaxed">
            HoneyTrace is a blockchain-backed provenance tracking system for honey products. 
            It enables beekeepers, distributors, and consumers to track the complete journey 
            of honey from hive to jar with immutable, verifiable records.
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-honey-700 mb-2">1. Batch Registration</h3>
              <p className="text-gray-700">
                Beekeepers register each batch of honey with harvest details, location, 
                and initial photos. This information is uploaded to IPFS and the content 
                hash is stored on the blockchain.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-honey-700 mb-2">2. Event Tracking</h3>
              <p className="text-gray-700">
                As the honey moves through the supply chain, each event (lab testing, 
                packaging, transfer) is recorded. Each event creates a new blockchain 
                transaction, ensuring complete traceability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-honey-700 mb-2">3. Consumer Verification</h3>
              <p className="text-gray-700">
                Consumers can scan a QR code on the product to view the complete provenance 
                timeline and verify authenticity by checking blockchain transactions.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Next.js & React</li>
                <li>• Tailwind CSS</li>
                <li>• Ethers.js for Web3 integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Blockchain</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ethereum-compatible smart contracts</li>
                <li>• Polygon Mumbai Testnet</li>
                <li>• Hardhat development framework</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Storage</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• IPFS for metadata & images</li>
                <li>• Content addressing for integrity</li>
                <li>• Minimal on-chain data storage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Smart Contract</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Solidity 0.8.19</li>
                <li>• Gas-optimized operations</li>
                <li>• Event-driven architecture</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold">Immutable Records</h3>
                <p className="text-sm text-gray-700">
                  All provenance data is permanently recorded on the blockchain and cannot be altered.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-semibold">Authenticity Verification</h3>
                <p className="text-sm text-gray-700">
                  Consumers can independently verify the origin and journey of their honey.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🌍</div>
              <div>
                <h3 className="font-semibold">Supply Chain Transparency</h3>
                <p className="text-sm text-gray-700">
                  Complete visibility from beekeeper to consumer builds trust and accountability.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-semibold">Cost Efficient</h3>
                <p className="text-sm text-gray-700">
                  Minimal on-chain storage keeps gas costs low while maintaining full traceability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-honey-50 border-honey-200">
          <h2 className="text-2xl font-semibold mb-4">MVP Status</h2>
          <p className="text-gray-700 mb-4">
            This is a Minimum Viable Product (MVP) demonstration. The current version uses:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 mb-4">
            <li>• Mock data for demonstration purposes</li>
            <li>• Polygon Mumbai testnet for blockchain operations</li>
            <li>• Simplified authentication (wallet connect only)</li>
          </ul>
          <p className="text-gray-700">
            For production deployment, additional features would include real IPFS integration, 
            enhanced security, role-based access control, and comprehensive testing.
          </p>
        </div>
      </div>
    </div>
  );
}
