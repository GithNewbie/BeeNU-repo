# HoneyTrace MVP - File Index

## 📚 Quick Navigation Guide

### 🚀 Start Here
1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 10 minutes
2. **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Understand the project
3. **[README.md](README.md)** - Complete documentation
4. **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - Step-by-step demo

## 📁 Project Structure

```
honeytrace-mvp/
│
├── 📄 Documentation
│   ├── README.md                 # Complete project documentation
│   ├── QUICKSTART.md            # 10-minute setup guide
│   ├── PROJECT_OVERVIEW.md      # Architecture and overview
│   ├── DEMO_SCRIPT.md           # Demo walkthrough
│   └── FILE_INDEX.md            # This file
│
├── 🔐 Smart Contracts
│   └── contracts/
│       └── HoneyProvenance.sol  # Main provenance contract
│
├── 🧪 Tests
│   └── test/
│       └── HoneyProvenance.test.js  # Contract test suite
│
├── 🛠️ Scripts
│   └── scripts/
│       ├── deploy.js            # Deployment script
│       └── interact.js          # Test interaction script
│
├── 🎨 Frontend Application
│   └── frontend/
│       ├── src/
│       │   ├── app/            # Next.js pages
│       │   │   ├── page.js               # Home/scan page
│       │   │   ├── layout.js             # App layout
│       │   │   ├── globals.css           # Global styles
│       │   │   ├── about/
│       │   │   │   └── page.js           # About page
│       │   │   ├── producer/
│       │   │   │   └── page.js           # Producer dashboard
│       │   │   └── batch/[id]/
│       │   │       └── page.js           # Batch detail page
│       │   │
│       │   └── lib/            # Utility libraries
│       │       ├── web3.js               # Blockchain utilities
│       │       ├── ipfs.js               # IPFS utilities
│       │       └── qrcode.js             # QR code utilities
│       │
│       ├── package.json                  # Frontend dependencies
│       ├── next.config.js                # Next.js config
│       ├── tailwind.config.js            # Tailwind config
│       └── postcss.config.js             # PostCSS config
│
├── ⚙️ Configuration
│   ├── package.json             # Root dependencies
│   ├── hardhat.config.js        # Hardhat configuration
│   ├── .env.example             # Environment template (root)
│   ├── frontend/.env.example    # Environment template (frontend)
│   └── .gitignore               # Git ignore rules
│
└── 📦 Generated (not in repo)
    ├── node_modules/            # Dependencies
    ├── artifacts/               # Compiled contracts
    ├── cache/                   # Build cache
    └── deployment.json          # Deployment info
```

## 📖 Documentation Files

### README.md
**Purpose**: Complete project documentation
**Contains**:
- Project overview and features
- Prerequisites and setup
- Deployment instructions (local/testnet/mainnet)
- Usage guide for producers and consumers
- Smart contract API reference
- Troubleshooting
- Future enhancements

**When to read**: After quick start, for comprehensive understanding

### QUICKSTART.md
**Purpose**: Get up and running in 10 minutes
**Contains**:
- Streamlined setup steps
- Minimum configuration
- First batch creation
- Troubleshooting basics

**When to read**: First! To get hands-on quickly

### PROJECT_OVERVIEW.md
**Purpose**: High-level architecture and design
**Contains**:
- Architecture diagram
- Data models (on-chain and off-chain)
- Security model
- Cost analysis
- Scaling considerations
- Learning outcomes

**When to read**: To understand the "why" behind decisions

### DEMO_SCRIPT.md
**Purpose**: Complete demo walkthrough
**Contains**:
- Step-by-step demo instructions
- Talking points for different audiences
- Common Q&A
- Demo variations (quick, technical, business)
- Success metrics

**When to read**: Before presenting to stakeholders

## 🔐 Smart Contract Files

### contracts/HoneyProvenance.sol
**Purpose**: Core blockchain logic
**Functions**:
- `createBatch()` - Register new batch
- `addEvent()` - Record event
- `getBatch()` - Query batch info
- `getBatchEvents()` - Get event history

**Gas Usage**:
- Create batch: ~100,000 gas
- Add event: ~80,000 gas

### test/HoneyProvenance.test.js
**Purpose**: Contract test suite
**Coverage**:
- Batch creation (success/failure cases)
- Event addition (single/multiple)
- Data retrieval
- Multi-actor scenarios
- Edge cases

**Run with**: `npm test`

## 🛠️ Script Files

### scripts/deploy.js
**Purpose**: Deploy contract to any network
**Usage**:
```bash
npm run deploy:local      # Local Hardhat network
npm run deploy:mumbai     # Polygon Mumbai testnet
npm run deploy:sepolia    # Ethereum Sepolia testnet
```
**Output**: Creates `deployment.json` with contract address

### scripts/interact.js
**Purpose**: Test contract interaction
**What it does**:
- Creates a test batch
- Adds 3 events (harvest, lab test, packaging)
- Retrieves and displays all data
- Shows gas usage

**Run with**: `node scripts/interact.js`

## 🎨 Frontend Files

### Core Pages

#### src/app/page.js (Home)
- **Route**: `/`
- **Purpose**: Landing page and batch lookup
- **Features**: QR scan, batch ID input, how it works

#### src/app/producer/page.js (Producer Dashboard)
- **Route**: `/producer`
- **Purpose**: Producer batch management
- **Features**: 
  - Wallet connection
  - Create batch form
  - Add event form
  - My batches list
  - QR code generation

#### src/app/batch/[id]/page.js (Batch Detail)
- **Route**: `/batch/[batchId]`
- **Purpose**: Display complete provenance
- **Features**:
  - Batch overview
  - Event timeline
  - Blockchain verification links
  - Map location

#### src/app/about/page.js (About)
- **Route**: `/about`
- **Purpose**: Project information
- **Features**: How it works, tech stack, benefits

### Utility Libraries

#### src/lib/web3.js
**Purpose**: Blockchain interaction helpers
**Functions**:
- `getProvider()` - Get Web3 provider
- `getSigner()` - Get user's wallet
- `getContract()` - Get contract instance
- `createBatch()` - Create batch on-chain
- `addEvent()` - Add event on-chain
- `getBatchDetails()` - Query batch data
- `connectWallet()` - Connect MetaMask

#### src/lib/ipfs.js
**Purpose**: IPFS storage operations
**Functions**:
- `uploadMetadataToIPFS()` - Upload JSON to IPFS
- `uploadFileToIPFS()` - Upload files to IPFS
- `fetchFromIPFS()` - Retrieve IPFS content
- `createBatchMetadata()` - Format batch metadata
- `createEventMetadata()` - Format event metadata

#### src/lib/qrcode.js
**Purpose**: QR code generation
**Functions**:
- `generateQRCode()` - Create QR as PNG
- `generateQRCodeSVG()` - Create QR as SVG
- `downloadQRCode()` - Download QR file
- `generatePrintableLabel()` - Create printable label
- `printLabel()` - Open print dialog

## ⚙️ Configuration Files

### hardhat.config.js
**Purpose**: Hardhat framework configuration
**Contains**:
- Solidity compiler settings
- Network configurations (local, Mumbai, Sepolia)
- Etherscan API keys for verification

### frontend/next.config.js
**Purpose**: Next.js configuration
**Contains**:
- Webpack configuration
- Image domain whitelist
- Build settings

### frontend/tailwind.config.js
**Purpose**: Tailwind CSS configuration
**Contains**:
- Content paths
- Custom honey-themed colors
- Theme extensions

### .env.example & frontend/.env.example
**Purpose**: Environment variable templates
**Contains**:
- Private keys (for deployment)
- RPC URLs
- API keys (Pinata, block explorers)
- Contract addresses

## 🎯 Common Workflows

### 1. First Time Setup
```
Read: QUICKSTART.md
Files: .env.example, frontend/.env.example
Run: npm install, npm run compile, npm test
```

### 2. Local Development
```
Terminal 1: npm run node
Terminal 2: npm run deploy:local
Terminal 3: npm run dev
Update: frontend/.env.local with contract address
Test: http://localhost:3000
```

### 3. Testnet Deployment
```
Read: README.md (Deployment to Testnet section)
Update: .env with private key
Run: npm run deploy:mumbai
Update: frontend/.env.local with contract address
Deploy: Frontend to Vercel/Netlify
```

### 4. Demo Preparation
```
Read: DEMO_SCRIPT.md
Deploy: To Mumbai testnet
Create: 2-3 sample batches with events
Test: Complete flow on mobile
Prepare: Talking points
```

### 5. Adding Features
```
Smart Contract: Edit contracts/HoneyProvenance.sol
Test: Add tests in test/HoneyProvenance.test.js
Frontend: Create/modify files in frontend/src/
Utilities: Extend lib/web3.js, lib/ipfs.js, etc.
```

## 📊 File Statistics

- **Total Files**: 23 source files
- **Smart Contracts**: 1 (.sol)
- **Tests**: 1 (.test.js)
- **Frontend Pages**: 4 (.js pages)
- **Utility Libraries**: 3 (.js)
- **Scripts**: 2 (.js)
- **Config Files**: 6
- **Documentation**: 4 (.md)
- **Total Lines**: ~3,000+ lines of code

## 🔍 Finding What You Need

**Want to...**
- **Get started quickly?** → QUICKSTART.md
- **Understand the architecture?** → PROJECT_OVERVIEW.md
- **Deploy to testnet?** → README.md (Deployment section)
- **Prepare a demo?** → DEMO_SCRIPT.md
- **Modify the smart contract?** → contracts/HoneyProvenance.sol
- **Change the UI?** → frontend/src/app/
- **Add blockchain features?** → frontend/src/lib/web3.js
- **Customize QR codes?** → frontend/src/lib/qrcode.js
- **Configure IPFS?** → frontend/src/lib/ipfs.js

## 🆘 Getting Help

1. **Stuck on setup?** → QUICKSTART.md troubleshooting section
2. **Contract errors?** → README.md troubleshooting section
3. **Need to understand a file?** → Check inline comments
4. **Architecture questions?** → PROJECT_OVERVIEW.md
5. **Demo prep?** → DEMO_SCRIPT.md

## ✅ Checklist for New Developers

- [ ] Read QUICKSTART.md
- [ ] Complete local setup
- [ ] Run tests successfully
- [ ] Create first batch locally
- [ ] Read PROJECT_OVERVIEW.md
- [ ] Review smart contract code
- [ ] Understand data flow
- [ ] Deploy to Mumbai testnet
- [ ] Complete demo flow
- [ ] Read full README.md

---

**Quick Reference**: All documentation starts from QUICKSTART.md → PROJECT_OVERVIEW.md → README.md → DEMO_SCRIPT.md

Happy coding! 🍯✨
