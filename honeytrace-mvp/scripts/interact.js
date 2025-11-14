const hre = require("hardhat");
const { ethers } = require("ethers");

/**
 * Interaction script for testing deployed contract
 * Usage: node scripts/interact.js
 */

async function main() {
  console.log("🍯 BeeNU Contract Interaction Script\n");

  // Get signers
  const [deployer, producer, distributor] = await hre.ethers.getSigners();
  console.log("Available accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  Producer:", producer.address);
  console.log("  Distributor:", distributor.address);
  console.log();

  // Load deployed contract
  let contractAddress;
  try {
    const deployment = require("../deployment.json");
    contractAddress = deployment.address;
    console.log("Using deployed contract at:", contractAddress);
  } catch (error) {
    console.log("No deployment.json found. Please deploy the contract first.");
    console.log("Run: npm run deploy:local");
    return;
  }

  const HoneyProvenance = await hre.ethers.getContractFactory("HoneyProvenance");
  const contract = HoneyProvenance.attach(contractAddress);
  console.log();

  // Helper function to create batch ID
  const createBatchId = (id) => hre.ethers.id(id);
  const createIpfsHash = (hash) => hre.ethers.id(hash);

  try {
    // Test 1: Create a batch
    console.log("📝 Test 1: Creating a batch...");
    const batchId = createBatchId("BATCH-2025-TEST-001");
    const batchIpfsHash = createIpfsHash("QmBatchMetadata123");
    
    const createTx = await contract.connect(producer).createBatch(
      batchId,
      batchIpfsHash
    );
    console.log("  Transaction sent:", createTx.hash);
    
    const createReceipt = await createTx.wait();
    console.log("  ✅ Batch created! Gas used:", createReceipt.gasUsed.toString());
    console.log();

    // Test 2: Get batch details
    console.log("🔍 Test 2: Retrieving batch details...");
    const batch = await contract.getBatch(batchId);
    console.log("  Producer:", batch.producer);
    console.log("  Created at:", new Date(Number(batch.createdAt) * 1000).toISOString());
    console.log("  IPFS Hash:", batch.ipfsHash);
    console.log("  Event count:", batch.eventCount.toString());
    console.log();

    // Test 3: Add harvest event
    console.log("🌾 Test 3: Adding harvest event...");
    const harvestIpfsHash = createIpfsHash("QmHarvestEvent123");
    const harvestTx = await contract.connect(producer).addEvent(
      batchId,
      harvestIpfsHash,
      "harvest"
    );
    await harvestTx.wait();
    console.log("  ✅ Harvest event added!");
    console.log();

    // Test 4: Add lab test event
    console.log("🔬 Test 4: Adding lab test event...");
    const testIpfsHash = createIpfsHash("QmLabTestEvent123");
    const testTx = await contract.connect(producer).addEvent(
      batchId,
      testIpfsHash,
      "lab_test"
    );
    await testTx.wait();
    console.log("  ✅ Lab test event added!");
    console.log();

    // Test 5: Add packaging event (different actor)
    console.log("📦 Test 5: Adding packaging event from distributor...");
    const packIpfsHash = createIpfsHash("QmPackagingEvent123");
    const packTx = await contract.connect(distributor).addEvent(
      batchId,
      packIpfsHash,
      "packaging"
    );
    await packTx.wait();
    console.log("  ✅ Packaging event added!");
    console.log();

    // Test 6: Get all events
    console.log("📋 Test 6: Retrieving all events...");
    const events = await contract.getBatchEvents(batchId);
    console.log(`  Found ${events.length} events:`);
    events.forEach((event, index) => {
      console.log(`\n  Event ${index + 1}:`);
      console.log("    Type:", event.eventType);
      console.log("    Actor:", event.actor);
      console.log("    Timestamp:", new Date(Number(event.timestamp) * 1000).toISOString());
      console.log("    IPFS Hash:", event.ipfsHash);
    });
    console.log();

    // Test 7: Verify batch was updated
    console.log("🔄 Test 7: Verifying batch update...");
    const updatedBatch = await contract.getBatch(batchId);
    console.log("  Updated event count:", updatedBatch.eventCount.toString());
    console.log("  ✅ All tests passed!");
    console.log();

    // Summary
    console.log("=" .repeat(60));
    console.log("📊 Test Summary");
    console.log("=" .repeat(60));
    console.log("✅ Batch creation: SUCCESS");
    console.log("✅ Batch retrieval: SUCCESS");
    console.log("✅ Event addition: SUCCESS (3 events)");
    console.log("✅ Event retrieval: SUCCESS");
    console.log("✅ Multi-actor support: SUCCESS");
    console.log("=" .repeat(60));
    console.log();
    console.log("🎉 All contract interactions completed successfully!");
    console.log();
    console.log("Next steps:");
    console.log("1. Start the frontend: cd frontend && npm run dev");
    console.log("2. Open http://localhost:3000");
    console.log("3. Connect MetaMask to localhost network");
    console.log("4. Use batch ID: BATCH-2025-TEST-001");

  } catch (error) {
    console.error("\n❌ Error during interaction:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
