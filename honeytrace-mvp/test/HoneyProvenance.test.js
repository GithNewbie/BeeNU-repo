const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyProvenance", function () {
  let honeyProvenance;
  let owner;
  let producer;
  let distributor;

  beforeEach(async function () {
    [owner, producer, distributor] = await ethers.getSigners();
    
    const HoneyProvenance = await ethers.getContractFactory("HoneyProvenance");
    honeyProvenance = await HoneyProvenance.deploy();
    await honeyProvenance.waitForDeployment();
  });

  describe("Batch Creation", function () {
    it("Should create a new batch successfully", async function () {
      const batchId = ethers.id("BATCH-2025-0001");
      const ipfsHash = ethers.id("QmTestHash123");

      await expect(honeyProvenance.connect(producer).createBatch(batchId, ipfsHash))
        .to.emit(honeyProvenance, "BatchCreated")
        .withArgs(batchId, producer.address, ipfsHash, await time.latest() + 1);

      const batch = await honeyProvenance.getBatch(batchId);
      expect(batch.producer).to.equal(producer.address);
      expect(batch.ipfsHash).to.equal(ipfsHash);
      expect(batch.eventCount).to.equal(0);
    });

    it("Should fail to create duplicate batch", async function () {
      const batchId = ethers.id("BATCH-2025-0001");
      const ipfsHash = ethers.id("QmTestHash123");

      await honeyProvenance.connect(producer).createBatch(batchId, ipfsHash);
      
      await expect(
        honeyProvenance.connect(producer).createBatch(batchId, ipfsHash)
      ).to.be.revertedWith("Batch already exists");
    });

    it("Should fail with invalid IPFS hash", async function () {
      const batchId = ethers.id("BATCH-2025-0001");
      const invalidHash = ethers.ZeroHash;

      await expect(
        honeyProvenance.connect(producer).createBatch(batchId, invalidHash)
      ).to.be.revertedWith("Invalid IPFS hash");
    });
  });

  describe("Event Management", function () {
    let batchId;
    let ipfsHash;

    beforeEach(async function () {
      batchId = ethers.id("BATCH-2025-0001");
      ipfsHash = ethers.id("QmBatchHash");
      await honeyProvenance.connect(producer).createBatch(batchId, ipfsHash);
    });

    it("Should add an event to existing batch", async function () {
      const eventHash = ethers.id("QmEventHash");
      const eventType = "harvest";

      await expect(
        honeyProvenance.connect(producer).addEvent(batchId, eventHash, eventType)
      ).to.emit(honeyProvenance, "EventAdded")
        .withArgs(batchId, producer.address, eventHash, eventType, await time.latest() + 1);

      const batch = await honeyProvenance.getBatch(batchId);
      expect(batch.eventCount).to.equal(1);
    });

    it("Should add multiple events", async function () {
      const events = [
        { hash: ethers.id("QmHarvest"), type: "harvest" },
        { hash: ethers.id("QmTest"), type: "lab_test" },
        { hash: ethers.id("QmPack"), type: "packaging" }
      ];

      for (const event of events) {
        await honeyProvenance.connect(producer).addEvent(batchId, event.hash, event.type);
      }

      const batch = await honeyProvenance.getBatch(batchId);
      expect(batch.eventCount).to.equal(3);

      const batchEvents = await honeyProvenance.getBatchEvents(batchId);
      expect(batchEvents.length).to.equal(3);
      expect(batchEvents[0].eventType).to.equal("harvest");
      expect(batchEvents[1].eventType).to.equal("lab_test");
      expect(batchEvents[2].eventType).to.equal("packaging");
    });

    it("Should fail to add event to non-existent batch", async function () {
      const invalidBatchId = ethers.id("BATCH-INVALID");
      const eventHash = ethers.id("QmEventHash");

      await expect(
        honeyProvenance.connect(producer).addEvent(invalidBatchId, eventHash, "harvest")
      ).to.be.revertedWith("Batch does not exist");
    });

    it("Should allow different actors to add events", async function () {
      const producerEventHash = ethers.id("QmProducerEvent");
      const distributorEventHash = ethers.id("QmDistributorEvent");

      await honeyProvenance.connect(producer).addEvent(batchId, producerEventHash, "harvest");
      await honeyProvenance.connect(distributor).addEvent(batchId, distributorEventHash, "transfer");

      const batchEvents = await honeyProvenance.getBatchEvents(batchId);
      expect(batchEvents.length).to.equal(2);
      expect(batchEvents[0].actor).to.equal(producer.address);
      expect(batchEvents[1].actor).to.equal(distributor.address);
    });
  });

  describe("Batch Queries", function () {
    it("Should retrieve batch events", async function () {
      const batchId = ethers.id("BATCH-2025-0001");
      const ipfsHash = ethers.id("QmBatchHash");
      
      await honeyProvenance.connect(producer).createBatch(batchId, ipfsHash);
      
      const eventHash = ethers.id("QmEventHash");
      await honeyProvenance.connect(producer).addEvent(batchId, eventHash, "harvest");

      const events = await honeyProvenance.getBatchEvents(batchId);
      expect(events.length).to.equal(1);
      expect(events[0].eventType).to.equal("harvest");
      expect(events[0].actor).to.equal(producer.address);
      expect(events[0].ipfsHash).to.equal(eventHash);
    });

    it("Should fail to query non-existent batch", async function () {
      const invalidBatchId = ethers.id("BATCH-INVALID");

      await expect(
        honeyProvenance.getBatch(invalidBatchId)
      ).to.be.revertedWith("Batch does not exist");
    });
  });
});

// Helper to get current block timestamp
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
};
