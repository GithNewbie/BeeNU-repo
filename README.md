# 🍯 HoneyTrace MVP

A blockchain-backed honey provenance tracking system that enables transparent, immutable tracking of honey products from hive to jar.

## Overview

HoneyTrace uses blockchain technology to create an immutable record of honey provenance. Beekeepers can register batches and record events throughout the supply chain, while consumers can verify the authenticity and journey of their honey by scanning a QR code.

## Features

- **Blockchain Verification**: All provenance data stored immutably on Ethereum-compatible chains
- **IPFS Storage**: Efficient off-chain storage for metadata and images
- **QR Code Tracking**: Easy consumer verification via QR codes on product labels
- **Producer Dashboard**: Simple interface for beekeepers to manage batches and events
- **Event Timeline**: Visual timeline showing complete product journey
- **Gas Optimized**: Minimal on-chain data storage to reduce costs

## Tech Stack

### Smart Contract
- Solidity 0.8.19
- Hardhat development framework
- OpenZeppelin contracts (optional)
- Deployed on Polygon Mumbai testnet

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Ethers.js v6
- QRCode.js

### Storage
- IPFS via Pinata
- Content-addressed storage for integrity

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MetaMask browser extension
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd honeytrace-mvp
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `PRIVATE_KEY`: Your wallet private key for deployment (testnet only!)
- `MUMBAI_RPC_URL`: Polygon Mumbai RPC endpoint
- `POLYGONSCAN_API_KEY`: For contract verification (optional)

Create `.env.local` in the frontend directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Contract address (after deployment)
- `NEXT_PUBLIC_PINATA_API_KEY`: Pinata API credentials (optional for demo)
- `NEXT_PUBLIC_PINATA_JWT`: Pinata JWT token

### 4. Compile Smart Contracts

```bash
npm run compile
```

### 5. Run Tests

```bash
npm test
```

Expected output: All tests should pass ✓

### 6. Deploy to Local Network

Terminal 1 - Start local blockchain:
```bash
npm run node
```

Terminal 2 - Deploy contract:
```bash
npm run deploy:local
```

Note the contract address from the deployment output and update `frontend/.env.local`.

### 7. Start Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Testnet

### Deploy to Polygon Mumbai

1. Get test MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)

2. Update your `.env` with:
   - Private key (ensure it has testnet MATIC)
   - Mumbai RPC URL

3. Deploy:
```bash
npm run deploy:mumbai
```

4. Update `frontend/.env.local` with the deployed contract address

5. Configure MetaMask to use Mumbai testnet:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com

### Deploy to Ethereum Sepolia

Similar to Mumbai, but use:
```bash
npm run deploy:sepolia
```

Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

## Usage Guide

### For Producers (Beekeepers)

1. **Connect Wallet**
   - Navigate to Producer Dashboard
   - Click "Connect MetaMask"
   - Approve the connection request

2. **Create a Batch**
   - Go to "Create Batch" tab
   - Fill in batch details:
     - Batch ID (e.g., BATCH-2025-0001)
     - Harvest date
     - Weight
     - Location
     - Flower type
     - Organic certification (if applicable)
   - Click "Create Batch & Upload to Blockchain"
   - Confirm the transaction in MetaMask
   - Wait for confirmation

3. **Add Events**
   - Go to "Add Event" tab
   - Select the batch
   - Choose event type (harvest, lab_test, packaging, transfer)
   - Add description
   - Upload supporting documents/images (optional)
   - Click "Add Event & Upload to Blockchain"
   - Confirm transaction

4. **Generate QR Codes**
   - Go to "My Batches" tab
   - Click "QR Code" on any batch
   - Download or print the QR code for your product labels

### For Consumers

1. **Scan or Enter Batch ID**
   - Open HoneyTrace homepage
   - Scan QR code with smartphone camera
   - Or manually enter batch ID

2. **View Provenance**
   - See complete timeline of events
   - View producer information
   - Check harvest location
   - Verify blockchain transactions
   - View lab test results (if available)

3. **Verify on Blockchain**
   - Click any transaction hash
   - View on block explorer
   - Confirm transaction details

## Project Structure

```
honeytrace-mvp/
├── contracts/              # Solidity smart contracts
│   └── HoneyProvenance.sol
├── test/                   # Contract tests
│   └── HoneyProvenance.test.js
├── scripts/                # Deployment scripts
│   └── deploy.js
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   │   ├── page.js           # Home/scan page
│   │   │   ├── producer/         # Producer dashboard
│   │   │   ├── batch/[id]/       # Batch detail page
│   │   │   └── about/            # About page
│   │   ├── lib/           # Utility functions
│   │   │   ├── web3.js           # Blockchain interaction
│   │   │   ├── ipfs.js           # IPFS functions
│   │   │   └── qrcode.js         # QR generation
│   │   └── components/    # React components (future)
├── hardhat.config.js      # Hardhat configuration
├── package.json
└── README.md
```

## Smart Contract Functions

### createBatch
```solidity
function createBatch(bytes32 batchId, bytes32 ipfsHash) external
```
Creates a new honey batch with metadata stored on IPFS.

### addEvent
```solidity
function addEvent(bytes32 batchId, bytes32 ipfsHash, string calldata eventType) external
```
Adds a provenance event to an existing batch.

### getBatch
```solidity
function getBatch(bytes32 batchId) external view returns (
    address producer,
    uint256 createdAt,
    bytes32 ipfsHash,
    uint256 eventCount
)
```
Retrieves batch information.

### getBatchEvents
```solidity
function getBatchEvents(bytes32 batchId) external view returns (Event[] memory)
```
Retrieves all events for a batch.

## Data Models

### Batch Metadata (IPFS)
```json
{
  "batchId": "BATCH-2025-0001",
  "producer": "Golden Valley Apiary",
  "geo": { "lat": 38.2975, "lon": -122.2869 },
  "harvestDate": "2025-10-01",
  "weightKg": 200,
  "flowerType": "Wildflower",
  "organic": true,
  "notes": "Harvested from organic meadow",
  "images": ["ipfs://Qm..."],
  "timestamp": "2025-10-01T08:00:00Z",
  "version": "1.0"
}
```

### Event Metadata (IPFS)
```json
{
  "batchId": "BATCH-2025-0001",
  "eventType": "lab_test",
  "actor": "0x742d35Cc...",
  "description": "Quality test passed",
  "images": ["ipfs://Qm..."],
  "timestamp": "2025-10-03T14:30:00Z",
  "location": "Test Lab, CA",
  "additionalData": {
    "testResults": "All parameters within range"
  },
  "version": "1.0"
}
```

## Gas Optimization

The smart contract is optimized for minimal gas usage:

- Only content hashes stored on-chain (32 bytes each)
- Bulk data stored off-chain on IPFS
- Efficient struct packing
- Minimal state modifications

Estimated gas costs (Mumbai testnet):
- Create batch: ~100,000 gas (~$0.01 at 30 gwei, $1 MATIC)
- Add event: ~80,000 gas (~$0.008)

## Security Considerations

### For MVP/Demo
- Uses public testnets (Mumbai/Sepolia)
- No real funds at risk
- Simple authentication (wallet only)
- No role-based access control

### For Production
Consider adding:
- Role-based access control (OpenZeppelin AccessControl)
- Multi-signature requirements for critical operations
- Rate limiting for event creation
- Formal security audit
- Privacy controls for sensitive data
- KYC/verification for producers

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check you're on the correct network
- Try refreshing the page

### Transaction Failures
- Ensure you have enough testnet tokens
- Check gas price settings
- Verify contract address is correct
- Check network connection

### IPFS Upload Failures
- Verify Pinata credentials in .env.local
- Check file size limits (Pinata free tier: 1GB)
- Try alternative IPFS gateways

### Contract Not Found
- Verify contract is deployed
- Check contract address in .env.local
- Ensure you're on the correct network

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with IoT sensors
- [ ] Batch transfer/ownership features
- [ ] NFT certificates for premium batches
- [ ] Supply chain finance integration
- [ ] Carbon footprint tracking
- [ ] Batch splitting/merging
- [ ] Retailer portal

## Testing Checklist

- [x] Smart contract unit tests
- [x] Contract deployment on local network
- [x] Contract deployment on Mumbai testnet
- [x] Frontend wallet connection
- [x] Batch creation flow
- [x] Event addition flow
- [x] Batch detail page display
- [x] QR code generation
- [x] Responsive design
- [ ] E2E testing with Cypress
- [ ] Load testing
- [ ] Security audit

## Demo Script

### End-to-End Demo Flow

1. **Setup** (5 minutes)
   - Deploy contract to Mumbai testnet
   - Start frontend application
   - Connect MetaMask

2. **Create Batch** (3 minutes)
   - Navigate to Producer Dashboard
   - Create new batch "BATCH-DEMO-001"
   - Confirm transaction on blockchain

3. **Add Events** (5 minutes)
   - Add "harvest" event
   - Add "lab_test" event with test results
   - Add "packaging" event
   - Confirm each on blockchain

4. **Generate QR** (2 minutes)
   - View batch in My Batches
   - Generate and download QR code

5. **Consumer Verification** (3 minutes)
   - Open homepage in new tab
   - Enter batch ID or scan QR
   - View complete provenance timeline
   - Click transaction hashes to view on Mumbai explorer

Total demo time: ~20 minutes

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Hardhat and Next.js docs

## Acknowledgments

- OpenZeppelin for smart contract standards
- Hardhat for development framework
- Pinata for IPFS infrastructure
- Polygon for scalable blockchain network

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
- [MetaMask Documentation](https://docs.metamask.io/)

---

Built with ❤️ for transparent and trustworthy honey supply chains
