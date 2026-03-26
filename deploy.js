const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SmartRewardDAO...");
  
  const SmartRewardDAO = await hre.ethers.getContractFactory("SmartRewardDAO");
  const contract = await SmartRewardDAO.deploy();
  
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log(`✅ SmartRewardDAO deployed to: ${address}`);
  
  // Get system info
  const info = await contract.getSystemInfo();
  console.log(`📊 System Info:`);
  console.log(`   Total Members: ${info[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(info[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(info[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(info[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(info[4])} BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
