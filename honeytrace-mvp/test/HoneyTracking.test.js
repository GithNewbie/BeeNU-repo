const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyTracking", function () {
  let honeyTracking;
  let factory;
  let seller1;
  let seller2;
  let consumer;
  let other;

  const Role = {
    NONE: 0,
    FACTORY: 1,
    SELLER: 2,
    CONSUMER: 3
  };

  beforeEach(async function () {
    [factory, seller1, seller2, consumer, other] = await ethers.getSigners();
    
    const HoneyTracking = await ethers.getContractFactory("HoneyTracking");
    honeyTracking = await HoneyTracking.deploy();
    await honeyTracking.waitForDeployment();

    // Register roles
    await honeyTracking.registerRole(factory.address, Role.FACTORY);
    await honeyTracking.registerRole(seller1.address, Role.SELLER);
    await honeyTracking.registerRole(seller2.address, Role.SELLER);
    await honeyTracking.registerRole(consumer.address, Role.CONSUMER);
  });

  describe("Role Management", function () {
    it("Should register roles correctly", async function () {
      expect(await honeyTracking.getRole(factory.address)).to.equal(Role.FACTORY);
      expect(await honeyTracking.getRole(seller1.address)).to.equal(Role.SELLER);
      expect(await honeyTracking.getRole(consumer.address)).to.equal(Role.CONSUMER);
      expect(await honeyTracking.getRole(other.address)).to.equal(Role.NONE);
    });
  });

  describe("Factory Operations", function () {
    it("Should create honey token", async function () {
      const tx = await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );

      await expect(tx)
        .to.emit(honeyTracking, "HoneyCreated")
        .withArgs(0, factory.address, "BATCH-001", await getBlockTimestamp());

      const token = await honeyTracking.getToken(0);
      expect(token.batchNumber).to.equal("BATCH-001");
      expect(token.originLocation).to.equal("Napa Valley");
      expect(token.currentOwner).to.equal(factory.address);
      expect(token.moisture).to.equal(17);
      expect(token.weight).to.equal(500);
      expect(token.qualityGrade).to.equal("Premium");
    });

    it("Should fail if non-factory tries to create honey", async function () {
      await expect(
        honeyTracking.connect(seller1).createHoney(
          "BATCH-001",
          "Location",
          17,
          500,
          "Premium"
        )
      ).to.be.revertedWith("Unauthorized role");
    });

    it("Should create trace event on honey creation", async function () {
      await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );

      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(1);
      expect(trace[0].eventType).to.equal(0); // CREATED
      expect(trace[0].actor).to.equal(factory.address);
      expect(trace[0].locationInfo).to.equal("Napa Valley");
    });
  });

  describe("Seller Operations", function () {
    beforeEach(async function () {
      // Create a honey token first
      await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );
    });

    it("Should allow seller to buy honey", async function () {
      await expect(
        honeyTracking.connect(seller1).sellerBuyHoney(0)
      ).to.emit(honeyTracking, "SellerBought")
        .withArgs(0, seller1.address, await getBlockTimestamp());

      const token = await honeyTracking.getToken(0);
      expect(token.currentOwner).to.equal(seller1.address);
    });

    it("Should fail if non-seller tries to buy", async function () {
      await expect(
        honeyTracking.connect(consumer).sellerBuyHoney(0)
      ).to.be.revertedWith("Unauthorized role");
    });

    it("Should create trace event on seller buy", async function () {
      await honeyTracking.connect(seller1).sellerBuyHoney(0);

      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(2);
      expect(trace[1].eventType).to.equal(1); // SELLER_BUY
      expect(trace[1].actor).to.equal(seller1.address);
      expect(trace[1].from).to.equal(factory.address);
      expect(trace[1].to).to.equal(seller1.address);
    });

    it("Should allow seller to transfer honey to another seller", async function () {
      await honeyTracking.connect(seller1).sellerBuyHoney(0);
      
      await expect(
        honeyTracking.connect(seller1).transferHoney(0, seller2.address, "Store Transfer")
      ).to.emit(honeyTracking, "HoneyMoved");

      const token = await honeyTracking.getToken(0);
      expect(token.currentOwner).to.equal(seller2.address);
    });

    it("Should fail to transfer to non-seller", async function () {
      await honeyTracking.connect(seller1).sellerBuyHoney(0);
      
      await expect(
        honeyTracking.connect(seller1).transferHoney(0, consumer.address, "Invalid Transfer")
      ).to.be.revertedWith("Recipient must be seller");
    });

    it("Should fail to transfer if not owner", async function () {
      await honeyTracking.connect(seller1).sellerBuyHoney(0);
      
      await expect(
        honeyTracking.connect(seller2).transferHoney(0, seller1.address, "Invalid")
      ).to.be.revertedWith("Not token owner");
    });

    it("Should create trace event on transfer", async function () {
      await honeyTracking.connect(seller1).sellerBuyHoney(0);
      await honeyTracking.connect(seller1).transferHoney(0, seller2.address, "Store A to Store B");

      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(3);
      expect(trace[2].eventType).to.equal(2); // TRANSFER
      expect(trace[2].from).to.equal(seller1.address);
      expect(trace[2].to).to.equal(seller2.address);
      expect(trace[2].locationInfo).to.equal("Store A to Store B");
    });
  });

  describe("Consumer Operations", function () {
    beforeEach(async function () {
      // Create honey and transfer to seller
      await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );
      await honeyTracking.connect(seller1).sellerBuyHoney(0);
    });

    it("Should allow consumer to buy honey from seller", async function () {
      await expect(
        honeyTracking.connect(consumer).consumerBuyHoney(0)
      ).to.emit(honeyTracking, "ConsumerBought")
        .withArgs(0, consumer.address, await getBlockTimestamp());

      const token = await honeyTracking.getToken(0);
      expect(token.currentOwner).to.equal(consumer.address);
    });

    it("Should fail if non-consumer tries to buy", async function () {
      await expect(
        honeyTracking.connect(other).consumerBuyHoney(0)
      ).to.be.revertedWith("Unauthorized role");
    });

    it("Should fail to buy from non-seller", async function () {
      // Consumer tries to buy directly from factory
      await honeyTracking.connect(factory).createHoney(
        "BATCH-002",
        "Location",
        17,
        500,
        "Premium"
      );

      await expect(
        honeyTracking.connect(consumer).consumerBuyHoney(1)
      ).to.be.revertedWith("Can only buy from seller");
    });

    it("Should create trace event on consumer buy", async function () {
      await honeyTracking.connect(consumer).consumerBuyHoney(0);

      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(3);
      expect(trace[2].eventType).to.equal(3); // CONSUMER_BUY
      expect(trace[2].actor).to.equal(consumer.address);
      expect(trace[2].from).to.equal(seller1.address);
      expect(trace[2].to).to.equal(consumer.address);
    });
  });

  describe("Trace History", function () {
    it("Should return complete trace history", async function () {
      // Create honey
      await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );

      // Seller 1 buys
      await honeyTracking.connect(seller1).sellerBuyHoney(0);

      // Transfer to Seller 2
      await honeyTracking.connect(seller1).transferHoney(0, seller2.address, "Store Transfer");

      // Consumer buys
      await honeyTracking.connect(consumer).consumerBuyHoney(0);

      // Check trace
      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(4);
      
      expect(trace[0].eventType).to.equal(0); // CREATED
      expect(trace[1].eventType).to.equal(1); // SELLER_BUY
      expect(trace[2].eventType).to.equal(2); // TRANSFER
      expect(trace[3].eventType).to.equal(3); // CONSUMER_BUY
    });

    it("Should fail to get trace for non-existent token", async function () {
      await expect(
        honeyTracking.getTrace(999)
      ).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Complex Supply Chain", function () {
    it("Should handle multiple transfers correctly", async function () {
      // Create honey
      await honeyTracking.connect(factory).createHoney(
        "BATCH-001",
        "Napa Valley",
        17,
        500,
        "Premium"
      );

      // Seller 1 buys from factory
      await honeyTracking.connect(seller1).sellerBuyHoney(0);

      // Seller 1 transfers to Seller 2
      await honeyTracking.connect(seller1).transferHoney(0, seller2.address, "Warehouse A to B");

      // Seller 2 transfers back to Seller 1
      await honeyTracking.connect(seller2).transferHoney(0, seller1.address, "Warehouse B to A");

      // Consumer buys from Seller 1
      await honeyTracking.connect(consumer).consumerBuyHoney(0);

      // Verify trace
      const trace = await honeyTracking.getTrace(0);
      expect(trace.length).to.equal(5);

      // Verify final owner
      const token = await honeyTracking.getToken(0);
      expect(token.currentOwner).to.equal(consumer.address);
    });
  });
});

// Helper function to get current block timestamp
async function getBlockTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp + 1;
}
