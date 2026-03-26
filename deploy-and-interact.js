const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SmartRewardDAO...");
  
  const SmartRewardDAO = await hre.ethers.getContractFactory("SmartRewardDAO");
  const contract = await SmartRewardDAO.deploy();
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log(`✅ SmartRewardDAO deployed to: ${address}`);
  
  console.log("\n📊 System Info after deployment:");
  const info = await contract.getSystemInfo();
  console.log(`   Total Members: ${info[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(info[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(info[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(info[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(info[4])} BNB`);
  
  console.log("\n👤 Getting signers...");
  const [owner, user1, user2] = await hre.ethers.getSigners();
  console.log(`   Owner: ${owner.address}`);
  console.log(`   User1: ${user1.address}`);
  console.log(`   User2: ${user2.address}`);
  
  const joinFee = await contract.JOIN_FEE();
  console.log(`\n💰 Join fee: ${hre.ethers.formatEther(joinFee)} BNB`);
  
  console.log("\n💰 User1 joining the DAO...");
  const tx1 = await contract.connect(user1).join({ value: joinFee });
  await tx1.wait();
  console.log(`   ✅ User1 joined!`);
  
  console.log("\n💰 User2 joining the DAO...");
  const tx2 = await contract.connect(user2).join({ value: joinFee });
  await tx2.wait();
  console.log(`   ✅ User2 joined!`);
  
  console.log("\n📊 Updated System Info:");
  const newInfo = await contract.getSystemInfo();
  console.log(`   Total Members: ${newInfo[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(newInfo[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(newInfo[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(newInfo[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(newInfo[4])} BNB`);
  
  console.log("\n👑 Owner withdrawing from Owner Fund...");
  const ownerFund = await contract.ownerFund();
  console.log(`   Owner Fund balance: ${hre.ethers.formatEther(ownerFund)} BNB`);
  
  if (ownerFund > 0) {
    const tx3 = await contract.withdrawOwnerFund(ownerFund);
    await tx3.wait();
    console.log(`   ✅ Withdrawn ${hre.ethers.formatEther(ownerFund)} BNB`);
  }
  
  console.log("\n📊 Final System Info:");
  const finalInfo = await contract.getSystemInfo();
  console.log(`   Total Members: ${finalInfo[0]}`);
  console.log(`   Reward Pool: ${hre.ethers.formatEther(finalInfo[1])} BNB`);
  console.log(`   Owner Fund: ${hre.ethers.formatEther(finalInfo[2])} BNB`);
  console.log(`   Reserve Fund: ${hre.ethers.formatEther(finalInfo[3])} BNB`);
  console.log(`   Total Funds: ${hre.ethers.formatEther(finalInfo[4])} BNB`);
  
  console.log("\n✅ All interactions completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
