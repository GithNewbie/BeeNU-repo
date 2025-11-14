const hre = require("hardhat");

async function main() {
  console.log("Deploying HoneyProvenance contract...");

  const HoneyProvenance = await hre.ethers.getContractFactory("HoneyProvenance");
  const honeyProvenance = await HoneyProvenance.deploy();

  await honeyProvenance.waitForDeployment();

  const address = await honeyProvenance.getAddress();
  console.log(`HoneyProvenance deployed to: ${address}`);
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  
  // Wait for block confirmations on testnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await honeyProvenance.deploymentTransaction().wait(5);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
