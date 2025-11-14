# 🍯 HoneyTrace MVP v2 - Role-Based Token Tracking

A blockchain-backed honey provenance tracking system with three distinct roles: Factory, Seller, and Consumer. This MVP uses mock wallet and blockchain providers for testing without real crypto.

## 🎯 What's New in V2

### Three-Role System
- **Factory** 🏭: Creates and registers honey tokens
- **Seller** 🏪: Buys honey, transfers between stores/sellers
- **Consumer** 👤: Purchases honey and views complete trace history

### Token-Based Tracking
- Individual honey tokens (not batches)
- Each token has unique ID and metadata
- Complete trace from creation to consumer

### Mock Blockchain
- Fake wallet (simulates MetaMask)
- No real crypto needed
- Perfect for testing and demos

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Compile Smart Contract

```bash
npm run compile
```

### 3. Run Tests

```bash
npm test
```

Expected output: All 20+ tests should pass ✓

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**That's it!** No blockchain node needed - everything runs with mock providers.

## 📖 How to Use

### As a Factory 🏭

1. Navigate to `/factory`
2. Click "Connect Fake Wallet"
3. Fill in the honey token form:
   - Batch Number: `BATCH-2025-001`
   - Origin Location: `Napa Valley, CA`
   - Moisture: `17` (%)
   - Weight: `500` (grams)
   - Quality Grade: `Premium`
4. Click "Register Honey Token"
5. See your created tokens in the list below

### As a Seller 🏪

1. Navigate to `/seller`
2. Click "Connect Fake Wallet"
3. **Buy Honey Tab:**
   - View available tokens from factory
   - Click "Buy" to purchase
4. **Transfer Honey Tab:**
   - Select token from your inventory
   - Choose recipient seller
   - Enter location info
   - Transfer token
5. **Inventory Tab:**
   - View all your honey tokens

### As a Consumer 👤

1. Navigate to `/consumer`
2. (Optional) Click "Connect Wallet" if you want to purchase
3. Enter a token ID (e.g., `0`, `1`, `2`)
4. Click "View Trace"
5. See complete provenance timeline:
   - Factory creation
   - Seller purchases
   - Transfers between sellers
   - Consumer purchases
6. If token is available, click "Buy This Honey"

## 🎪 Demo Scenario

Follow this complete supply chain flow:

### Step 1: Factory Creates Token
```
1. Go to /factory
2. Connect wallet (role: factory)
3. Create token:
   - Batch: BATCH-DEMO-001
   - Location: Napa Valley, CA
   - Moisture: 17%
   - Weight: 500g
   - Grade: Premium
4. Note the Token ID (e.g., Token #0)
```

### Step 2: Seller 1 Buys
```
1. Go to /seller
2. Connect wallet (role: seller - automatically Seller 1)
3. Go to "Buy Honey" tab
4. Click "Buy" on Token #0
5. Token now in your inventory
```

### Step 3: Seller 1 Transfers to Seller 2
```
1. Still in /seller as Seller 1
2. Go to "Transfer Honey" tab
3. Select Token #0
4. Choose "Seller 2 (Store B)"
5. Location: "Transfer from Store A to Store B"
6. Click "Transfer Token"
```

### Step 4: Consumer Views Trace
```
1. Go to /consumer
2. Enter Token ID: 0
3. Click "View Trace"
4. See complete timeline:
   ✓ Created by Factory
   ✓ Purchased by Seller 1
   ✓ Transferred to Seller 2
```

### Step 5: Consumer Buys
```
1. Still in /consumer
2. Click "Connect Wallet" (role: consumer)
3. Click "Buy This Honey"
4. View trace updates with purchase event
```

## 🏗️ Architecture

```
Frontend (Next.js)
├── Mock Wallet Provider
│   ├── Fake address generation
│   ├── Role assignment
│   └── Connection simulation
│
├── Mock Blockchain Provider
│   ├── In-memory token storage
│   ├── Trace event tracking
│   ├── Role validation
│   └── Transaction simulation
│
└── Three Dashboards
    ├── Factory (/factory)
    ├── Seller (/seller)
    └── Consumer (/consumer)

Smart Contract (Solidity)
├── HoneyToken struct
├── TraceEvent struct
├── Role-based functions
└── Complete trace storage
```

## 📝 Smart Contract Functions

### createHoney()
```solidity
function createHoney(
    string memory batchNumber,
    string memory originLocation,
    uint256 moisture,
    uint256 weight,
    string memory qualityGrade
) external onlyFactory returns (uint256)
```

### sellerBuyHoney()
```solidity
function sellerBuyHoney(uint256 tokenId) 
    external onlySeller
```

### transferHoney()
```solidity
function transferHoney(
    uint256 tokenId,
    address to,
    string memory locationInfo
) external onlySeller
```

### consumerBuyHoney()
```solidity
function consumerBuyHoney(uint256 tokenId) 
    external onlyConsumer
```

### getTrace()
```solidity
function getTrace(uint256 tokenId) 
    external view 
    returns (TraceEvent[] memory)
```

## 🧪 Testing

Run the complete test suite:

```bash
npm test
```

Tests cover:
- ✅ Role management
- ✅ Token creation (factory only)
- ✅ Seller purchases
- ✅ Token transfers
- ✅ Consumer purchases
- ✅ Trace history
- ✅ Complex supply chains
- ✅ Access control

## 🎯 Key Features

### Mock Wallet
- **No MetaMask needed**: Fake wallet for testing
- **Role-based**: Each connection assigns a role
- **Simple**: One-click connect/disconnect

### Mock Blockchain
- **In-memory storage**: No real blockchain required
- **Instant transactions**: No waiting for confirmations
- **Simulated gas**: Shows transaction hashes
- **Reset on reload**: Fresh state each session

### Role-Based Access
- **Factory**: Can only create tokens
- **Seller**: Can buy and transfer
- **Consumer**: Can buy from sellers and view traces
- **Enforced**: Contract validates all operations

### Complete Traceability
- **Every operation recorded**: Create, buy, transfer
- **Immutable timeline**: Cannot be altered
- **Full transparency**: Anyone can view trace
- **Blockchain-verified**: In production, on-chain

## 🔄 Data Flow

```
Factory Creates Token
    ↓
TOKEN (ID: 0)
├── Metadata: batch, location, weight, moisture, grade
└── Trace: [CREATED event]
    ↓
Seller 1 Buys
    ↓
TOKEN (ID: 0) - Owner: Seller 1
└── Trace: [CREATED, SELLER_BUY]
    ↓
Seller 1 → Seller 2 Transfer
    ↓
TOKEN (ID: 0) - Owner: Seller 2
└── Trace: [CREATED, SELLER_BUY, TRANSFER]
    ↓
Consumer Buys
    ↓
TOKEN (ID: 0) - Owner: Consumer
└── Trace: [CREATED, SELLER_BUY, TRANSFER, CONSUMER_BUY]
```

## 📦 Project Structure

```
honeytrace-mvp/
├── contracts/
│   └── HoneyTracking.sol          # Updated smart contract
│
├── test/
│   └── HoneyTracking.test.js      # Comprehensive tests
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js            # Home page
│   │   │   ├── factory/page.js    # Factory dashboard
│   │   │   ├── seller/page.js     # Seller dashboard
│   │   │   └── consumer/page.js   # Consumer viewer
│   │   │
│   │   └── lib/
│   │       ├── mockWallet.js      # Fake wallet provider
│   │       └── mockBlockchain.js  # Mock blockchain
│   │
│   └── package.json
│
├── scripts/
│   └── deploy.js
│
├── hardhat.config.js
├── package.json
└── README.md (this file)
```

## 💡 MVP vs Production

### What's Mock in MVP:
- ✅ Wallet connection (fake MetaMask)
- ✅ Blockchain transactions (in-memory)
- ✅ Gas costs (simulated)
- ✅ Transaction hashes (random)

### For Production, Add:
- 🔐 Real MetaMask integration
- 🔐 Deploy to testnet/mainnet
- 🔐 Real transaction costs
- 🔐 IPFS for metadata storage
- 🔐 Backend API for indexing
- 🔐 Database for caching

## 🐛 Troubleshooting

### Tests Fail
```bash
# Clean and recompile
rm -rf cache artifacts
npm run compile
npm test
```

### Frontend Won't Start
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### "Unauthorized role" Error
- Make sure you're using the correct dashboard for your role
- Factory operations only work on /factory
- Seller operations only work on /seller
- Consumer operations only work on /consumer

### Token Not Found
- Token IDs start at 0
- Create tokens on /factory first
- Check console for actual token IDs created

## 🎓 Learning Resources

- **Solidity**: https://docs.soliditylang.org/
- **Hardhat**: https://hardhat.org/docs
- **Next.js**: https://nextjs.org/docs
- **Smart Contract Patterns**: https://fravoll.github.io/solidity-patterns/

## 📈 Next Steps

### For Full Deployment:
1. Deploy contract to testnet (Polygon Mumbai)
2. Replace mock providers with real ethers.js
3. Add IPFS for metadata storage
4. Implement proper authentication
5. Add database for performance
6. Security audit

### For More Features:
- QR code generation for tokens
- Batch operations
- Price/payment integration
- Email notifications
- Mobile app
- Admin dashboard

## 🤝 Contributing

This is an MVP for demonstration. For production use:
1. Conduct security audit
2. Add proper access control
3. Implement KYC for factories
4. Add rate limiting
5. Optimize gas costs
6. Add monitoring

## 📄 License

MIT License - See LICENSE file

---

Built with ❤️ for transparent supply chains

**MVP Status**: Complete & Ready for Demo ✅
**Production Ready**: Requires security hardening 🔐
