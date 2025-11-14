# HoneyTrace MVP - Quick Start Guide

Get up and running in 10 minutes!

## Prerequisites
- Node.js 18+ installed
- MetaMask browser extension
- 5 minutes of your time

## Setup Steps

### 1. Install Dependencies (2 min)
```bash
cd honeytrace-mvp
npm install
cd frontend && npm install && cd ..
```

### 2. Configure Environment (1 min)
```bash
# Root directory
cp .env.example .env

# Frontend directory
cd frontend
cp .env.example .env.local
cd ..
```

For demo purposes, you can leave the default values.

### 3. Compile & Test (2 min)
```bash
npm run compile
npm test
```

You should see: ✓ All tests passing

### 4. Start Local Blockchain (1 min)
```bash
# Terminal 1
npm run node
```

Keep this running. You'll see 20 test accounts with addresses and private keys.

### 5. Deploy Contract (1 min)
```bash
# Terminal 2
npm run deploy:local
```

Copy the contract address from the output.

### 6. Update Frontend Config (1 min)
Edit `frontend/.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<paste_contract_address_here>
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Configure MetaMask (2 min)

Add localhost network to MetaMask:
- Network Name: Localhost 8545
- RPC URL: http://127.0.0.1:8545
- Chain ID: 1337
- Currency: ETH

Import a test account:
- Copy any private key from Terminal 1 (the node output)
- In MetaMask: Import Account → Paste private key

### 8. Start Frontend (1 min)
```bash
# Terminal 3
npm run dev
```

Open http://localhost:3000

### 9. Create Your First Batch!

1. Go to Producer Dashboard
2. Connect MetaMask (approve the connection)
3. Create Batch tab:
   - Batch ID: BATCH-DEMO-001
   - Fill other fields
   - Submit (approve MetaMask transaction)
4. Add Event tab:
   - Select your batch
   - Add a "harvest" event
   - Submit
5. My Batches tab:
   - View your batch
   - Generate QR code
6. Return to homepage:
   - Enter BATCH-DEMO-001
   - View complete provenance!

## Testing the Interaction Script

Want to see automated interaction with the contract?

```bash
node scripts/interact.js
```

This creates a test batch and adds several events automatically.

## Troubleshooting

**MetaMask not connecting?**
- Make sure you're on the Localhost 8545 network
- Try refreshing the page

**Transaction fails?**
- Ensure local node (Terminal 1) is running
- Check you have test ETH in MetaMask
- Reset MetaMask account (Settings → Advanced → Reset Account)

**Contract not found?**
- Verify contract address in frontend/.env.local
- Make sure you deployed (step 5)
- Check Terminal 2 for deployment output

## Next Steps

### Deploy to Testnet
1. Get Mumbai test MATIC: https://faucet.polygon.technology/
2. Add your private key to `.env`
3. Run: `npm run deploy:mumbai`
4. Update frontend config with new address

### Full Documentation
See [README.md](README.md) for complete documentation.

### Demo Script
See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a complete demo flow.

## Support

Having issues? Check:
1. Node and npm versions (`node -v` should be 18+)
2. All terminals are running
3. MetaMask is on correct network
4. Contract address is correctly configured

## What You Built

Congratulations! You now have:
- ✅ A working blockchain smart contract
- ✅ Deployed on local blockchain
- ✅ Full-featured web interface
- ✅ Producer dashboard for batch management
- ✅ Consumer verification interface
- ✅ QR code generation
- ✅ Blockchain-verified provenance tracking

Ready for production deployment? Check the README for Mumbai/Sepolia testnet deployment instructions!
